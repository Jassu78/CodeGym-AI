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
  feedback: z.string().describe('Well-formatted feedback on the code quality with clear structure.'),
  suggestions: z.string().describe('Structured improvement suggestions with actionable steps.'),
});
export type CheckCodeOutput = z.infer<typeof CheckCodeOutputSchema>;

export async function checkCode(input: CheckCodeInput): Promise<CheckCodeOutput> {
  return checkCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkCodePrompt',
  input: {schema: CheckCodeInputSchema},
  output: {schema: CheckCodeOutputSchema},
  prompt: `You are an expert code reviewer and programming tutor. Provide comprehensive, detailed feedback using EXACT formatting.

CODE TO REVIEW:
\`\`\`{{language}}
{{{code}}}
\`\`\`

CRITICAL REQUIREMENTS:
- Generate EXACTLY this format with NO variations
- Use **bold** for ALL section headers (must have ** on both sides)
- Use proper markdown syntax that will render correctly
- Provide detailed analysis with multiple sections
- Include specific examples and actionable feedback

REQUIRED FORMAT - COPY EXACTLY:

**Overall Assessment:**
[Comprehensive evaluation of the code quality in 2-3 sentences]

**Code Structure Analysis:**
- [Structure strength/weakness 1]
- [Structure strength/weakness 2]
- [Structure strength/weakness 3]

**Logic & Algorithm Review:**
- [Logic assessment 1]
- [Logic assessment 2]
- [Algorithm efficiency note]

**Code Style & Readability:**
- [Style point 1]
- [Style point 2]
- [Readability improvement]

**Performance Considerations:**
- [Performance note 1]
- [Performance note 2]
- [Optimization opportunity]

**Security & Best Practices:**
- [Security consideration 1]
- [Security consideration 2]
- [Best practice recommendation]

**Specific Issues Found:**
- [Issue 1 with detailed explanation]
- [Issue 2 with detailed explanation]
- [Issue 3 with detailed explanation]

**Recommended Improvements:**
\`\`\`{{language}}
[Detailed improved code example with comments]
\`\`\`

**Learning Resources:**
- [Resource 1 for further study]
- [Resource 2 for specific concepts]
- [Practice exercise suggestion]

**Action Plan:**
1. [Immediate action item 1]
2. [Immediate action item 2]
3. [Long-term improvement goal]

FORMATTING RULES:
- **MUST** use **bold** for ALL headers (Example: **Overall Assessment:**)
- **MUST** use proper markdown syntax
- **MUST** separate sections with clear spacing
- **MUST** use bullet points for lists
- **MUST** use \`\`\`language\`\`\` for code blocks
- **MUST** provide comprehensive, detailed feedback
- **NEVER** use inline code or "Code Block" text

Provide detailed analysis following this EXACT format with proper markdown that will render correctly.`,
});

const checkCodeFlow = ai.defineFlow(
  {
    name: 'checkCodeFlow',
    inputSchema: CheckCodeInputSchema,
    outputSchema: CheckCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
