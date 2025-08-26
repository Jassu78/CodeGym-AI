'use server';

import { generateCodingProblem } from '@/ai/flows/auto-generate-problems';
import type { GenerateCodingProblemInput, GenerateCodingProblemOutput } from '@/ai/flows/auto-generate-problems';
import { checkCode } from '@/ai/flows/check-code';
import type { CheckCodeInput, CheckCodeOutput } from '@/ai/flows/check-code';
import { runCode } from '@/ai/flows/run-code';
import type { RunCodeInput, RunCodeOutput } from '@/ai/flows/run-code';
import { askChatbot } from '@/ai/flows/chatbot';
import type { AskChatbotInput, AskChatbotOutput } from '@/ai/flows/chatbot';
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

const runCodeSchema = z.object({
    code: z.string(),
    language: z.enum(['java', 'python', 'c']),
    problemStatement: z.string(),
    expectedOutput: z.string(),
});

const chatMessageSchema = z.object({
    sender: z.enum(['user', 'bot']),
    text: z.string(),
});

const askChatbotSchema = z.object({
    question: z.string(),
    problemStatement: z.string(),
    code: z.string().optional(),
    language: z.enum(['java', 'python', 'c']),
    history: z.array(chatMessageSchema).optional(),
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

export async function runCodeAction(
    input: RunCodeInput
  ): Promise<RunCodeOutput> {
    const parsedInput = runCodeSchema.safeParse(input);
    if (!parsedInput.success) {
      throw new Error('Invalid input for running code.');
    }
  
    try {
      const result = await runCode(parsedInput.data);
      return result;
    } catch (error) {
      console.error("Error in runCodeAction:", error);
      throw new Error('Failed to run code via AI.');
    }
}

export async function askChatbotAction(
    input: AskChatbotInput
): Promise<AskChatbotOutput> {
    const parsedInput = askChatbotSchema.safeParse(input);
    if (!parsedInput.success) {
        throw new Error('Invalid input for chatbot.');
    }

    try {
        const result = await askChatbot(parsedInput.data);
        return result;
    } catch (error) {
        console.error("Error in askChatbotAction:", error);
        throw new Error('Failed to get response from chatbot.');
    }
}
