import { NextRequest, NextResponse } from 'next/server';
import { enhanceImportedProblem } from '@/ai/flows/enhance-problem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rawProblem } = body;

    if (!rawProblem) {
      return NextResponse.json(
        { error: 'Raw problem is required' },
        { status: 400 }
      );
    }

    const result = await enhanceImportedProblem({
      topic: '',
      language: 'java',
      complexity: 'medium',
      problemStatement: rawProblem,
      expectedOutput: ''
    });

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error('Error in enhance-problem API:', error);
    return NextResponse.json(
      { error: 'Failed to enhance problem' },
      { status: 500 }
    );
  }
}
