/**
 * @fileOverview Auto-generates coding problems based on user preferences.
 *
 * - generateProblem - Generates a new coding problem.
 * - GenerateProblemInput - The input type for the generateProblem function.
 * - GenerateProblemOutput - The return type for the generateProblem function.
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
  problemStatement: z.string().describe('A well-structured, clear problem statement with proper formatting and examples.'),
  expectedOutput: z.string().describe('Clear examples of expected output with proper formatting.'),
  codeSkeleton: z.string().optional().describe('A well-formatted code skeleton or starting point for the user.'),
});
export type GenerateCodingProblemOutput = z.infer<typeof GenerateCodingProblemOutputSchema>;

export async function generateCodingProblem(input: GenerateCodingProblemInput): Promise<GenerateCodingProblemOutput> {
  return generateCodingProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodingProblemPrompt',
  input: {schema: GenerateCodingProblemInputSchema},
  output: {schema: GenerateCodingProblemOutputSchema},
  prompt: `You are an expert coding problem creator. Generate a professional coding problem with EXACT formatting.

TOPIC: {{topic}}
LANGUAGE: {{language}}
COMPLEXITY: {{complexity}}

CRITICAL REQUIREMENTS:
- Generate EXACTLY this format with NO variations
- Use **bold** for ALL section headers (must have ** on both sides)
- Use proper markdown syntax that will render correctly
- NO inline code blocks, NO "Code Block" text
- Keep content clean and professional

REQUIRED FORMAT - COPY EXACTLY:

**PROBLEM STATEMENT:**
[Clear, concise problem description in 2-3 sentences]

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
[Clear test cases with input/output pairs]

**Performance Requirements:**
[Time/space complexity if applicable]

**CODE SKELETON:**
\`\`\`{{language}}
[Language-specific starting code with proper structure]
\`\`\`

FORMATTING RULES:
- **MUST** use **bold** for ALL headers (Example: **PROBLEM STATEMENT:**)
- **MUST** use proper markdown syntax
- **MUST** separate sections with clear spacing
- **MUST** use bullet points for lists
- **MUST** use \`\`\`language\`\`\` for code blocks
- **NEVER** use inline code or "Code Block" text

Generate a problem following this EXACT format with proper markdown that will render correctly.`,
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
