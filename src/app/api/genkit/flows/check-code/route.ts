import { NextRequest, NextResponse } from 'next/server';
import { checkCode } from '@/ai/flows/check-code';

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

    const result = await checkCode({
      code,
      language,
    });

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error('Error in check-code API:', error);
    return NextResponse.json(
      { error: 'Failed to check code' },
      { status: 500 }
    );
  }
}
