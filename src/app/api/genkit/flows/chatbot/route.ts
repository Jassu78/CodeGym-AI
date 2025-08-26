import { NextRequest, NextResponse } from 'next/server';
import { askChatbot } from '@/ai/flows/chatbot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, responseLength = 'medium' } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    const result = await askChatbot({
      question,
      responseLength,
      problemStatement: body.problemStatement || '',
      code: body.code || '',
      language: body.language || 'java',
      history: body.history || []
    });

    return NextResponse.json({ answer: result.answer });
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      { error: 'Failed to get response from chatbot' },
      { status: 500 }
    );
  }
}
