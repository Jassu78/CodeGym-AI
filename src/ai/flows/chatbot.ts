'use server';

/**
 * @fileOverview A chatbot to help users with their coding problems.
 *
 * - askChatbot - A function that answers user questions about the coding problem.
 * - AskChatbotInput - The input type for the askChatbot function.
 * - AskChatbotOutput - The return type for the askChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
    sender: z.enum(['user', 'bot']),
    text: z.string(),
});

const AskChatbotInputSchema = z.object({
  question: z.string().describe('The user\'s question about the coding problem or their code.'),
  problemStatement: z.string().describe('The problem statement the user is trying to solve.'),
  code: z.string().optional().describe('The user\'s current code.'),
  language: z.enum(['java', 'python', 'c']).describe('The programming language of the code.'),
  history: z.array(ChatMessageSchema).optional().describe('The conversation history.'),
});
export type AskChatbotInput = z.infer<typeof AskChatbotInputSchema>;

const AskChatbotOutputSchema = z.object({
  answer: z.string().describe('A helpful and concise answer to the user\'s question. The answer should be formatted as clean text, without any markdown like **.'),
});
export type AskChatbotOutput = z.infer<typeof AskChatbotOutputSchema>;

export async function askChatbot(input: AskChatbotInput): Promise<AskChatbotOutput> {
  return askChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askChatbotPrompt',
  input: {schema: AskChatbotInputSchema},
  output: {schema: AskChatbotOutputSchema},
  prompt: `You are a friendly and helpful coding assistant bot. Your goal is to help a user solve a coding problem by answering their questions.
The user is working on the following problem in {{language}}:
Problem Statement: {{{problemStatement}}}

{{#if code}}
Their current code is:
\`\`\`{{language}}
{{{code}}}
\`\`\`
{{/if}}

This is the conversation history so far:
{{#each history}}
**{{sender}}**: {{{text}}}
{{/each}}

The user's new question is: "{{{question}}}"

Please provide a clear, concise, and helpful answer to their question.
Do not give away the full solution unless they explicitly ask for it. Guide them towards the answer.
Format your response as clean text, without any markdown formatting such as asterisks for bolding.
`,
});

const askChatbotFlow = ai.defineFlow(
  {
    name: 'askChatbotFlow',
    inputSchema: AskChatbotInputSchema,
    outputSchema: AskChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
