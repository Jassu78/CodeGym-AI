/**
 * @fileOverview A function to run and analyze user code execution.
 *
 * - runCode - A function that executes user code and provides analysis.
 * - RunCodeInput - The input type for the runCode function.
 * - RunCodeOutput - The return type for the runCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RunCodeInputSchema = z.object({
  code: z.string(),
  language: z.enum(['java', 'python', 'c']),
  problem: z.string(),
});
export type RunCodeInput = z.infer<typeof RunCodeInputSchema>;

const RunCodeOutputSchema = z.object({
  status: z.enum(['correct', 'halfway', 'moderate', 'fail']),
  output: z.string(),
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
{{{problem}}}

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
