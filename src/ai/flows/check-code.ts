'use server';

/**
 * @fileOverview Provides functionality to check code quality and provide feedback using AI.
 *
 * - checkCode - Analyzes code and returns feedback and improvement suggestions.
 * - CheckCodeInput - The input type for the checkCode function, including the code and language.
 * - CheckCodeOutput - The return type for the checkCode function, containing feedback and suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckCodeInputSchema = z.object({
  code: z.string().describe('The code to be checked.'),
  language: z.enum(['java', 'python', 'c']).describe('The programming language of the code.'),
});
export type CheckCodeInput = z.infer<typeof CheckCodeInputSchema>;

const CheckCodeOutputSchema = z.object({
  feedback: z.string().describe('Feedback on the code, including potential issues.'),
  suggestions: z.string().describe('Suggestions for improving the code, such as refactoring or optimization.'),
});
export type CheckCodeOutput = z.infer<typeof CheckCodeOutputSchema>;

export async function checkCode(input: CheckCodeInput): Promise<CheckCodeOutput> {
  return checkCodeFlow(input);
}

const checkCodePrompt = ai.definePrompt({
  name: 'checkCodePrompt',
  input: {schema: CheckCodeInputSchema},
  output: {schema: CheckCodeOutputSchema},
  prompt: `You are an AI code checker that provides feedback and suggestions for improving code.
  Analyze the following code and provide feedback on potential issues and suggestions for improvement.

  Language: {{{language}}}
  Code:
  {{{
    code
  }}}

  Provide specific feedback related to aspects like the single responsibility principle, commenting, and code readability.
  Include suggestions for refactoring or optimization where applicable.
  Do not check for correctness, only code quality.`,
});

const checkCodeFlow = ai.defineFlow(
  {
    name: 'checkCodeFlow',
    inputSchema: CheckCodeInputSchema,
    outputSchema: CheckCodeOutputSchema,
  },
  async input => {
    const {output} = await checkCodePrompt(input);
    return output!;
  }
);
