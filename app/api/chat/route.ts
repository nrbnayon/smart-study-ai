import { NextRequest, NextResponse } from 'next/server';
// @ts-ignore
const pdf = require('pdf-parse');
// @ts-ignore
const mammoth = require('mammoth');

export async function POST(req: NextRequest) {
  try {
    let messages = [];
    
    // Check if the request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const messagesStr = formData.get('messages') as string;
      if (messagesStr) {
        messages = JSON.parse(messagesStr);
      }
      
      const files = formData.getAll('files') as File[];
      
      let additionalText = "";
      const imageContents: any[] = [];
      
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        
        if (file.type === 'application/pdf') {
          try {
            const pdfData = await pdf(buffer);
            additionalText += `\n\n--- Content from PDF (${file.name}) ---\n${pdfData.text}\n`;
          } catch (e) {
            console.error("PDF parse error", e);
          }
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/msword') {
          try {
            const result = await mammoth.extractRawText({ buffer });
            additionalText += `\n\n--- Content from Word Document (${file.name}) ---\n${result.value}\n`;
          } catch (e) {
            console.error("Mammoth docx parse error", e);
          }
        } else if (file.type.startsWith('text/')) {
          const text = new TextDecoder().decode(buffer);
          additionalText += `\n\n--- Content from Text File (${file.name}) ---\n${text}\n`;
        } else if (file.type.startsWith('image/')) {
          // Convert to base64 for image processing
          const base64 = buffer.toString('base64');
          const dataUrl = `data:${file.type};base64,${base64}`;
          imageContents.push({
            type: 'image_url',
            image_url: { url: dataUrl }
          });
        }
      }
      
      // Modify the last user message
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        const lastMessage = messages[messages.length - 1];
        let originalContent = lastMessage.content;
        
        if (typeof originalContent === 'string') {
          originalContent = [
            { type: 'text', text: originalContent + additionalText }
          ];
        } else if (Array.isArray(originalContent)) {
          // Find text content and append
          const textItem = originalContent.find(item => item.type === 'text');
          if (textItem) {
            textItem.text += additionalText;
          } else {
            originalContent.push({ type: 'text', text: additionalText });
          }
        }
        
        if (imageContents.length > 0) {
          if (typeof originalContent === 'string') {
             originalContent = [{ type: 'text', text: originalContent }];
          }
          originalContent.push(...imageContents);
        }
        
        lastMessage.content = originalContent;
      }
      
    } else {
      const body = await req.json();
      messages = body.messages || [];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant for Quiz Question AI. 
            Quiz Question AI is an AI-powered learning platform that helps students master any subject.
            
            About the Project:
            Quiz Question AI transforms study materials into interactive quizzes, tracks progress with smart analytics, and helps students learn 2x faster.
            
            Key Features:
            - Instant Quiz Generation: Users can upload PDF, documents, or text, and the AI generates relevant quizzes in seconds.
            - Adaptive Learning: The AI identifies weak spots and creates personalized study paths.
            - Advanced Analytics: Detailed insights and beautiful visualizations of performance.
            - Smart Dashboard: A clean, intuitive interface for focused learning.
            - Privacy Focused: Ensures study materials and results are secure and private.
            - Collaborative Study: Allows sharing quizzes with classmates to track progress together.
            
            Pricing Plans:
            - Basic: Free forever, 5 quizzes/month, basic analytics.
            - Pro: $19/month, unlimited quizzes, advanced analytics, priority support.
            - Team: $49/month, for schools/groups, collaborative tools, admin dashboard.
            
            Behavior:
            - Be friendly, encouraging, and professional.
            - Always support the user and answer questions about everything, but pivot back to the project when relevant.
            - Respond using Markdown format for better readability (bold, lists, etc.).
            - If you don't know something specific about the project, be honest but helpful.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
