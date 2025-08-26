import { z } from 'zod';

// Schema for asking the chatbot
export const askChatbotSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  problemStatement: z.string(),
  code: z.string().optional(),
  language: z.enum(['java', 'python', 'c']),
  history: z.array(z.object({
    sender: z.enum(['user', 'bot']),
    text: z.string(),
  })).optional(),
  responseLength: z.enum(['short', 'medium', 'full']).default('medium'),
});

export type askChatbotInput = z.infer<typeof askChatbotSchema>;

// Schema for enhancing imported problems
export const enhanceImportedProblemSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  language: z.enum(['java', 'python', 'c']),
  complexity: z.enum(['easy', 'medium', 'hard']),
  problemStatement: z.string().min(1, 'Problem statement is required'),
  expectedOutput: z.string(),
});

export type enhanceImportedProblemInput = z.infer<typeof enhanceImportedProblemSchema>;

// Schema for generating coding problems
export const generateProblemSchema = z.object({
  language: z.string().min(1, 'Language is required'),
  complexity: z.enum(['easy', 'medium', 'hard']),
  topic: z.string().min(1, 'Topic is required'),
});

export type generateProblemInput = z.infer<typeof generateProblemSchema>;

// Schema for checking code
export const checkCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  problem: z.string().min(1, 'Problem is required'),
});

export type checkCodeInput = z.infer<typeof checkCodeSchema>;

// Schema for running code
export const runCodeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  problem: z.string().min(1, 'Problem is required'),
});

export type runCodeInput = z.infer<typeof runCodeSchema>;

// Output types for AI flows
export type GenerateCodingProblemOutput = {
  problemStatement: string;
  expectedOutput: string;
  codeSkeleton?: string;
};

export type CheckCodeOutput = {
  feedback: string;
  suggestions: string;
};

export type RunCodeOutput = {
  status: 'correct' | 'halfway' | 'moderate' | 'fail';
  output: string;
};
