'use server';

/**
 * @fileOverview Automatically generates coding problems based on a selected topic or path.
 *
 * - generateCodingProblem - A function that generates a coding problem.
 * - GenerateCodingProblemInput - The input type for the generateCodingProblem function.
 * - GenerateCodingProblemOutput - The return type for the generateCodingProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodingProblemInputSchema = z.object({
  topic: z.string().describe('The topic or path for which to generate a coding problem (e.g., "Fibonacci sequence", "prime number", "data structures", "algorithms").'),
  language: z.enum(['java', 'python', 'c']).describe('The programming language for the coding problem.'),
  complexity: z.enum(['easy', 'medium', 'hard']).optional().describe('The complexity level of the coding problem.').default('medium'),
  hints: z.string().optional().describe('Any hints or suggestions to include in the coding problem.'),
});
export type GenerateCodingProblemInput = z.infer<typeof GenerateCodingProblemInputSchema>;

const GenerateCodingProblemOutputSchema = z.object({
  problemStatement: z.string().describe('The detailed problem statement for the coding challenge.'),
  expectedOutput: z.string().describe('The expected output of the solution to the coding problem.'),
  codeSkeleton: z.string().optional().describe('A code skeleton or starting point for the user, if applicable.'),
});
export type GenerateCodingProblemOutput = z.infer<typeof GenerateCodingProblemOutputSchema>;

export async function generateCodingProblem(input: GenerateCodingProblemInput): Promise<GenerateCodingProblemOutput> {
  return generateCodingProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodingProblemPrompt',
  input: {schema: GenerateCodingProblemInputSchema},
  output: {schema: GenerateCodingProblemOutputSchema},
  prompt: `You are a coding problem generator. Generate a coding problem based on the provided topic, language, and complexity. Provide a clear problem statement, the expected output, and a code skeleton if appropriate.

Topic: {{{topic}}}
Language: {{{language}}}
Complexity: {{{complexity}}}
{{#if hints}}
Hints: {{{hints}}}
{{/if}}

Problem Statement: A detailed description of the coding problem.
Expected Output: The expected output of a correct solution to the coding problem.
Code Skeleton (Optional): A starting point for the user's code, if applicable.

Ensure the problem is well-defined and testable. If there are no hints, do not mention hints in the response.
`,
});

const generateCodingProblemFlow = ai.defineFlow(
  {
    name: 'generateCodingProblemFlow',
    inputSchema: GenerateCodingProblemInputSchema,
    outputSchema: GenerateCodingProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
