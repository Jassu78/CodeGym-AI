import { NextRequest, NextResponse } from 'next/server';
import { runCode } from '@/ai/flows/run-code';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language, problem } = body;

    if (!code || !language || !problem) {
      return NextResponse.json(
        { error: 'Code, language, and problem are required' },
        { status: 400 }
      );
    }

    const result = await runCode({
      code,
      language,
      problemStatement: problem,
      expectedOutput: ''
    });

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error('Error in run-code API:', error);
    return NextResponse.json(
      { error: 'Failed to run code' },
      { status: 500 }
    );
  }
}
