'use server';

/**
 * @fileOverview AI flow to enhance and format imported coding problems.
 *
 * - enhanceImportedProblem - A function that takes raw imported problem content and returns a clean, well-formatted problem.
 * - EnhanceImportedProblemInput - The input type for the enhanceImportedProblem function.
 * - EnhanceImportedProblemOutput - The return type for the enhanceImportedProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceImportedProblemInputSchema = z.object({
  problemStatement: z.string().describe('The raw problem statement copied from a website (like LeetCode).'),
  expectedOutput: z.string().describe('The raw expected output copied from a website.'),
  language: z.enum(['java', 'python', 'c']).describe('The programming language for the problem.'),
  complexity: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the problem.'),
  topic: z.string().describe('The topic or category of the problem.'),
});

export type EnhanceImportedProblemInput = z.infer<typeof EnhanceImportedProblemInputSchema>;

const EnhanceImportedProblemOutputSchema = z.object({
  problemStatement: z.string().describe('A clean, well-formatted problem statement with examples and constraints.'),
  expectedOutput: z.string().describe('Clean, well-formatted expected output with test cases.'),
  codeSkeleton: z.string().describe('A basic code skeleton for the specified programming language.'),
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
