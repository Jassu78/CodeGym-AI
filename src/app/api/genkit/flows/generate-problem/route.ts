import { NextRequest, NextResponse } from 'next/server';
import { generateCodingProblem } from '@/ai/flows/auto-generate-problems';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { language, complexity, topic } = body;

    if (!language || !complexity || !topic) {
      return NextResponse.json(
        { error: 'Language, complexity, and topic are required' },
        { status: 400 }
      );
    }

    const result = await generateCodingProblem({
      language,
      complexity,
      topic,
    });

    return NextResponse.json({ response: result });
  } catch (error) {
    console.error('Error in generate-problem API:', error);
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    );
  }
}
