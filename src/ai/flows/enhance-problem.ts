/**
 * @fileOverview Enhances imported problems with additional context and structure.
 *
 * - enhanceImportedProblem - Enhances a raw problem statement.
 * - EnhanceImportedProblemInput - The input type for the enhanceImportedProblem function.
 * - EnhanceImportedProblemOutput - The return type for the enhanceImportedProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceImportedProblemInputSchema = z.object({
  topic: z.string(),
  language: z.enum(['java', 'python', 'c']),
  complexity: z.enum(['easy', 'medium', 'hard']),
  problemStatement: z.string(),
  expectedOutput: z.string(),
});
export type EnhanceImportedProblemInput = z.infer<typeof EnhanceImportedProblemInputSchema>;

const EnhanceImportedProblemOutputSchema = z.object({
  problemStatement: z.string(),
  expectedOutput: z.string(),
  codeSkeleton: z.string(),
});
export type EnhanceImportedProblemOutput = z.infer<typeof EnhanceImportedProblemOutputSchema>;

export async function enhanceImportedProblem(input: EnhanceImportedProblemInput): Promise<EnhanceImportedProblemOutput> {
  return enhanceImportedProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceImportedProblemPrompt',
  input: {schema: EnhanceImportedProblemInputSchema},
  output: {schema: EnhanceImportedProblemOutputSchema},
  prompt: `You are an expert coding problem formatter. Transform raw content into a professional coding problem with EXACT formatting.

RAW PROBLEM CONTENT:
{{{problemStatement}}}

RAW EXPECTED OUTPUT:
{{{expectedOutput}}}

LANGUAGE: {{language}}
COMPLEXITY: {{complexity}}
TOPIC: {{topic}}

CRITICAL REQUIREMENTS:
- Generate EXACTLY this format with NO variations
- Use **bold** for ALL section headers (must have ** on both sides)
- Use proper markdown syntax that will render correctly
- NO inline code blocks, NO "Code Block" text
- Keep content clean and professional

REQUIRED FORMAT - COPY EXACTLY:

**PROBLEM STATEMENT:**
[Clean problem description in 2-3 sentences]

**Examples:**
**Example 1:**
Input: [input format]
Output: [output format]

**Example 2:**
Input: [input format]
Output: [output format]

**Constraints:**
- [constraint 1]
- [constraint 2]
- [constraint 3]

**EXPECTED OUTPUT:**
**Test Cases:**
[Clean test cases with input/output pairs]

**Performance Requirements:**
[Time/space complexity if mentioned]

**CODE SKELETON:**
\`\`\`{{language}}
[Language-specific starting code]
\`\`\`

FORMATTING RULES:
- **MUST** use **bold** for ALL headers (Example: **PROBLEM STATEMENT:**)
- **MUST** use proper markdown syntax
- **MUST** separate sections with clear spacing
- **MUST** use bullet points for lists
- **MUST** use \`\`\`language\`\`\` for code blocks
- **NEVER** use inline code or "Code Block" text

Generate the problem following this EXACT format with proper markdown that will render correctly.`,
});

const enhanceImportedProblemFlow = ai.defineFlow(
  {
    name: 'enhanceImportedProblemFlow',
    inputSchema: EnhanceImportedProblemInputSchema,
    outputSchema: EnhanceImportedProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
