/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

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
            content: `You are a helpful assistant for SmartStudy AI. 
            SmartStudy AI is an AI-powered learning platform that helps students master any subject.
            
            About the Project:
            SmartStudy AI transforms study materials into interactive quizzes, tracks progress with smart analytics, and helps students learn 2x faster.
            
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
