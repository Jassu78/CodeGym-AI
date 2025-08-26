'use server';

/**
 * @fileOverview Runs the user's code and evaluates it for correctness against the problem statement.
 *
 * - runCode - A function that executes code and returns correctness and output.
 * - RunCodeInput - The input type for the runCode function.
 * - RunCodeOutput - The return type for the runCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RunCodeInputSchema = z.object({
  code: z.string().describe('The code to be executed.'),
  language: z.enum(['java', 'python', 'c']).describe('The programming language of the code.'),
  problemStatement: z.string().describe('The problem statement the code is trying to solve.'),
  expectedOutput: z.string().describe('The expected output for a correct solution.'),
});
export type RunCodeInput = z.infer<typeof RunCodeInputSchema>;

const RunCodeOutputSchema = z.object({
  status: z.enum(['correct', 'moderate', 'wrong']).describe('The correctness of the code based on the output. "moderate" means the code is partially correct or has minor issues.'),
  output: z.string().describe('The actual output of the code execution, or an explanation of the error if it fails.'),
});
export type RunCodeOutput = z.infer<typeof RunCodeOutputSchema>;

export async function runCode(input: RunCodeInput): Promise<RunCodeOutput> {
  return runCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'runCodePrompt',
  input: {schema: RunCodeInputSchema},
  output: {schema: RunCodeOutputSchema},
  prompt: `You are a code execution engine. You will be given a code snippet, the programming language, the problem statement, and the expected output.
Your task is to "run" the code and determine if it correctly solves the problem.

Language: {{{language}}}
Problem Statement: {{{problemStatement}}}
Expected Output: {{{expectedOutput}}}

Code to evaluate:
\`\`\`{{{language}}}
{{{code}}}
\`\`\`

Evaluate the code and determine its correctness. The status should be:
- "correct" if the code runs and produces the exact expected output.
- "moderate" if the code runs but the output is not exactly correct but close, or if the code is conceptually correct but has minor syntax errors that can be easily fixed.
- "wrong" if the code has significant errors, does not compile/run, or produces output that is completely different from the expected output.

Provide the actual output of the code, or a summary of the error if the code fails to run.`,
});

const runCodeFlow = ai.defineFlow(
  {
    name: 'runCodeFlow',
    inputSchema: RunCodeInputSchema,
    outputSchema: RunCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
