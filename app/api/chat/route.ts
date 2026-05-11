import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * Robust PDF text extraction with multiple fallback strategies.
 * 
 * PRIMARY: pdf-parse (most compatible with Next.js)
 * Install: npm install pdf-parse
 * Install types: npm install --save-dev @types/pdf-parse
 */
async function extractPdfText(buffer: Buffer): Promise<string | null> {
  // Strategy 1: pdf-parse with correct import (avoid the test-file auto-run bug)
  try {
    // Important: require directly, NOT dynamic import, to avoid Next.js ESM issues
    // Also import from the lib path to avoid pdf-parse running its own test on import
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    const data = await pdfParse(buffer, {
      // Limit pages to avoid timeout on huge PDFs
      max: 100,
    });

    if (data && data.text && data.text.trim().length > 0) {
      console.log(`[PDF] Strategy 1 (pdf-parse) succeeded: ${data.text.length} chars, ${data.numpages} pages`);
      return data.text;
    }
    console.warn('[PDF] Strategy 1 returned empty text, trying strategy 2...');
  } catch (err) {
    console.error('[PDF] Strategy 1 (pdf-parse) failed:', err);
  }

  // Strategy 2: pdfjs-dist legacy (CommonJS compatible path)
  try {
    // Use the legacy CJS build, not the ESM .mjs
    const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
    pdfjs.GlobalWorkerOptions.workerSrc = '';

    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    const textParts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
        .trim();
      if (pageText) {
        textParts.push(`[Page ${i}]\n${pageText}`);
      }
    }

    const result = textParts.join('\n\n');
    if (result.trim().length > 0) {
      console.log(`[PDF] Strategy 2 (pdfjs-dist) succeeded: ${result.length} chars`);
      return result;
    }
    console.warn('[PDF] Strategy 2 returned empty text.');
  } catch (err) {
    console.error('[PDF] Strategy 2 (pdfjs-dist) failed:', err);
  }

  // Both strategies failed
  return null;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key is not configured on the server.' },
        { status: 500 }
      );
    }

    let messages: any[] = [];
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const messagesStr = formData.get('messages') as string;
      if (messagesStr) {
        messages = JSON.parse(messagesStr);
      }

      const files = formData.getAll('files') as File[];
      let additionalText = '';
      const imageContents: any[] = [];

      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const nameLower = file.name.toLowerCase();

        const isPdf = file.type === 'application/pdf' || nameLower.endsWith('.pdf');
        const isDocx =
          file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          nameLower.endsWith('.docx');
        const isDoc = file.type === 'application/msword' || nameLower.endsWith('.doc');

        if (isPdf) {
          console.log(`[PDF] Processing: "${file.name}", size: ${buffer.length} bytes`);
          const pdfText = await extractPdfText(buffer);

          if (pdfText && pdfText.trim().length > 0) {
            console.log(`[PDF] ✅ Extracted ${pdfText.length} characters from "${file.name}"`);
            additionalText += `\n\n=== START OF PDF: ${file.name} ===\n${pdfText}\n=== END OF PDF: ${file.name} ===\n`;
          } else {
            // This PDF truly has no text layer (scanned/image-based)
            console.warn(`[PDF] ⚠️ No text extracted from "${file.name}" — likely a scanned PDF`);
            additionalText += `\n\n[The PDF "${file.name}" contains no extractable text. It appears to be a scanned or image-based PDF. The user should be told to copy-paste the text content manually, or use an OCR tool first.]\n`;
          }

        } else if (isDocx || isDoc) {
          try {
            const mammoth = require('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            if (result.value && result.value.trim().length > 0) {
              additionalText += `\n\n=== START OF DOCUMENT: ${file.name} ===\n${result.value}\n=== END OF DOCUMENT: ${file.name} ===\n`;
            } else {
              additionalText += `\n\n[Word document "${file.name}" appears empty or unreadable.]\n`;
            }
          } catch (e) {
            console.error('Mammoth error:', e);
            additionalText += `\n\n[Failed to parse Word document "${file.name}".]\n`;
          }

        } else if (
          file.type.startsWith('text/') ||
          nameLower.endsWith('.txt') ||
          nameLower.endsWith('.md') ||
          nameLower.endsWith('.csv') ||
          nameLower.endsWith('.json')
        ) {
          const text = new TextDecoder().decode(buffer);
          additionalText += `\n\n=== START OF FILE: ${file.name} ===\n${text}\n=== END OF FILE: ${file.name} ===\n`;

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
          additionalText += `\n\n[Unsupported file type: "${file.name}" (${file.type})]\n`;
        }
      }

      // Inject extracted content into the last user message
      if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
        const lastMessage = messages[messages.length - 1];
        let originalContent = lastMessage.content;

        if (typeof originalContent === 'string') {
          originalContent = [{ type: 'text', text: originalContent + additionalText }];
        } else if (Array.isArray(originalContent)) {
          const textItem = originalContent.find((item: any) => item.type === 'text');
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

    // Debug: log the final message structure (remove in production)
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && Array.isArray(lastMsg.content)) {
      const textBlock = lastMsg.content.find((b: any) => b.type === 'text');
      if (textBlock) {
        console.log('[OPENAI] Sending text (first 500 chars):', textBlock.text.slice(0, 500));
      }
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
- Instant Quiz Generation: Upload PDF, documents, or text and the AI generates relevant quizzes in seconds.
- Adaptive Learning: The AI identifies weak spots and creates personalized study paths.
- Advanced Analytics: Detailed insights and beautiful visualizations of performance.
- Smart Dashboard: A clean, intuitive interface for focused learning.
- Privacy Focused: Study materials and results are secure and private.
- Collaborative Study: Share quizzes with classmates and track progress together.

Pricing Plans:
- Basic: Free forever, 5 quizzes/month, basic analytics.
- Pro: $19/month, unlimited quizzes, advanced analytics, priority support.
- Team: $49/month, for schools/groups, collaborative tools, admin dashboard.

CRITICAL INSTRUCTION FOR FILE HANDLING:
- When the user's message contains text between === START OF PDF === and === END OF PDF === markers, that IS the full extracted text of the PDF file. You MUST read, analyze, and respond based on that content.
- NEVER say you cannot read a file. NEVER say a file is scanned or unreadable unless explicitly noted in the message.
- NEVER ask the user to copy-paste content that is already in the message.
- Treat the extracted text as if the user typed it directly.

Behavior:
- Be friendly, encouraging, and professional.
- Respond using Markdown format for better readability.
- If you don't know something specific about the project, be honest but helpful.`,
          },
          ...messages,
        ],
        stream: true,
      }),
    });

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

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}