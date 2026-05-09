import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Extracts text from a PDF buffer using pdfjs-dist (no native deps, works in Node.js).
 * Install: npm install pdfjs-dist
 */
async function extractPdfText(buffer) {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

    // Disable the worker — we're in Node.js, not a browser
    pdfjsLib.GlobalWorkerOptions.workerSrc = '';

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    const textParts = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      textParts.push(`[Page ${pageNum}]\n${pageText}`);
    }

    return textParts.join('\n\n');
  } catch (err) {
    console.error('pdfjs extraction failed:', err);
    return null;
  }
}

export async function POST(req) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key is not configured on the server.' },
        { status: 500 }
      );
    }

    let messages = [];

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const messagesStr = formData.get('messages');
      if (messagesStr) {
        messages = JSON.parse(messagesStr);
      }

      const files = formData.getAll('files');

      let additionalText = '';
      const imageContents = [];

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const nameLower = file.name.toLowerCase();

        const isPdf =
          file.type === 'application/pdf' || nameLower.endsWith('.pdf');
        const isDocx =
          file.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          nameLower.endsWith('.docx');
        const isDoc =
          file.type === 'application/msword' || nameLower.endsWith('.doc');

        if (isPdf) {
          console.log(`Processing PDF: ${file.name}, size: ${buffer.length} bytes`);
          const pdfText = await extractPdfText(buffer);

          if (pdfText && pdfText.trim().length > 0) {
            console.log(`Successfully extracted ${pdfText.length} chars from PDF`);
            additionalText += `\n\n--- Content from PDF (${file.name}) ---\n${pdfText}\n--- End of PDF ---\n`;
          } else {
            console.error(`PDF text extraction returned empty for: ${file.name}`);
            additionalText += `\n\n--- Note: The PDF "${file.name}" appears to be a scanned image-only PDF with no extractable text. Please inform the user and ask them to copy-paste the text manually. ---\n`;
          }
        } else if (isDocx || isDoc) {
          try {
            const mammoth = require('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            if (result.value && result.value.trim().length > 0) {
              additionalText += `\n\n--- Content from Word Document (${file.name}) ---\n${result.value}\n--- End of Document ---\n`;
            } else {
              additionalText += `\n\n--- Word document "${file.name}" appears to be empty or unreadable. ---\n`;
            }
          } catch (e) {
            console.error('Mammoth docx parse error', e);
            additionalText += `\n\n--- Failed to parse Word document "${file.name}". ---\n`;
          }
        } else if (
          file.type.startsWith('text/') ||
          nameLower.endsWith('.txt') ||
          nameLower.endsWith('.md') ||
          nameLower.endsWith('.csv') ||
          nameLower.endsWith('.json')
        ) {
          const text = new TextDecoder().decode(buffer);
          additionalText += `\n\n--- Content from Text File (${file.name}) ---\n${text}\n--- End of File ---\n`;
        } else if (file.type.startsWith('image/')) {
          const base64 = buffer.toString('base64');
          imageContents.push({
            type: 'image_url',
            image_url: {
              url: `data:${file.type};base64,${base64}`,
              detail: 'high',
            },
          });
        } else {
          additionalText += `\n\n--- Unsupported file type for "${file.name}" (${file.type}). ---\n`;
        }
      }

      // Attach everything to the last user message
      if (
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user'
      ) {
        const lastMessage = messages[messages.length - 1];
        let originalContent = lastMessage.content;

        if (typeof originalContent === 'string') {
          originalContent = [
            { type: 'text', text: originalContent + additionalText },
          ];
        } else if (Array.isArray(originalContent)) {
          const textItem = originalContent.find((item) => item.type === 'text');
          if (textItem) {
            textItem.text += additionalText;
          } else if (additionalText) {
            originalContent.push({ type: 'text', text: additionalText });
          }
        }

        if (imageContents.length > 0) {
          originalContent.push(...imageContents);
        }

        lastMessage.content = originalContent;
      }
    } else {
      const body = await req.json();
      messages = body.messages || [];
    }

    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
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
              - If you don't know something specific about the project, be honest but helpful.
              - IMPORTANT: When document content is included in the user message (between --- markers), you MUST read and use it. Never claim you cannot read a file if its content is already in the message.`,
            },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const text = await response.text();
        errorData = { error: text || 'Unknown error from OpenAI' };
      }
      return NextResponse.json(errorData, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}