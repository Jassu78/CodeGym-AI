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
  status: z.enum(['correct', 'halfway', 'moderate', 'fail']).describe('The correctness of the code: correct (perfect), halfway (good progress), moderate (almost there), or fail (needs work).'),
  output: z.string().describe('A concise analysis of the code execution with colored status tags and 4-5 lines of key information.'),
});
export type RunCodeOutput = z.infer<typeof RunCodeOutputSchema>;

export async function runCode(input: RunCodeInput): Promise<RunCodeOutput> {
  return runCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'runCodePrompt',
  input: {schema: RunCodeInputSchema},
  output: {schema: RunCodeOutputSchema},
  prompt: `You are an expert code execution analyzer. Provide concise, actionable feedback using EXACT formatting.

CODE EXECUTED:
\`\`\`{{language}}
{{{code}}}
\`\`\`

PROBLEM STATEMENT:
{{{problemStatement}}}

CRITICAL REQUIREMENTS:
- Generate EXACTLY this format with NO variations
- Use colored status tags: 🟢 CORRECT, 🟡 HALFWAY, 🟠 MODERATE, 🔴 FAIL
- Keep output concise: 4-5 lines maximum
- Use proper markdown syntax that will render correctly
- Focus on key insights and next steps

REQUIRED FORMAT - COPY EXACTLY:

**Status:** [🟢 CORRECT / 🟡 HALFWAY / 🟠 MODERATE / 🔴 FAIL]

**Key Result:** [One sentence summary of what the code achieved]

**Main Issue:** [Primary problem or area for improvement - 1 line]

**Quick Fix:** [Specific actionable suggestion - 1 line]

**Next Step:** [What to do next - 1 line]

FORMATTING RULES:
- **MUST** use **bold** for ALL headers
- **MUST** use colored emoji tags for status
- **MUST** keep each section to 1 line maximum
- **MUST** use proper markdown syntax
- **NEVER** exceed 5 lines total

Provide concise analysis following this EXACT format.`,
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
