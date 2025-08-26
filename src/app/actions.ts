'use server';

import { generateCodingProblem } from '@/ai/flows/auto-generate-problems';
import type { GenerateCodingProblemInput, GenerateCodingProblemOutput } from '@/ai/flows/auto-generate-problems';
import { checkCode } from '@/ai/flows/check-code';
import type { CheckCodeInput, CheckCodeOutput } from '@/ai/flows/check-code';
import { z } from 'zod';

const generateProblemSchema = z.object({
  topic: z.string(),
  language: z.enum(['java', 'python', 'c']),
  complexity: z.enum(['easy', 'medium', 'hard']),
});

const checkCodeSchema = z.object({
  code: z.string(),
  language: z.enum(['java', 'python', 'c']),
});


export async function generateProblemAction(
  input: GenerateCodingProblemInput
): Promise<GenerateCodingProblemOutput> {
  const parsedInput = generateProblemSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for generating a problem.');
  }

  try {
    const result = await generateCodingProblem(parsedInput.data);
    return result;
  } catch (error) {
    console.error("Error in generateProblemAction:", error);
    throw new Error('Failed to generate a new coding problem via AI.');
  }
}

export async function checkCodeAction(
  input: CheckCodeInput
): Promise<CheckCodeOutput> {
  const parsedInput = checkCodeSchema.safeParse(input);
  if (!parsedInput.success) {
    throw new Error('Invalid input for checking code.');
  }

  try {
    const result = await checkCode(parsedInput.data);
    return result;
  } catch (error) {
    console.error("Error in checkCodeAction:", error);
    throw new Error('Failed to check code via AI.');
  }
}
