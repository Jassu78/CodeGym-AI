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
  responseLength: z.enum(['short', 'medium', 'full']).describe('The desired response length: short (concise), medium (balanced), or full (detailed).'),
});
export type AskChatbotInput = z.infer<typeof AskChatbotInputSchema>;

const AskChatbotOutputSchema = z.object({
  answer: z.string().describe('A well-formatted, structured answer that matches the requested response length.'),
});
export type AskChatbotOutput = z.infer<typeof AskChatbotOutputSchema>;

export async function askChatbot(input: AskChatbotInput): Promise<AskChatbotOutput> {
  try {
    const result = await prompt(input);
    return {
      answer: result.output?.answer || 'Sorry, I could not generate a response at this time.'
    };
  } catch (error) {
    console.error('Error in askChatbot:', error);
    return {
      answer: 'Sorry, I encountered an error. Please try again.'
    };
  }
}

const prompt = ai.definePrompt({
  name: 'askChatbotPrompt',
  input: {schema: AskChatbotInputSchema},
  output: {schema: AskChatbotOutputSchema},
  prompt: `SYSTEM: You are a programming tutor helping with a specific coding problem. You MUST use the context provided and answer the user's actual question.

CONTEXT:
- Problem Statement: {{problemStatement}}
- Current Code: {{code}}
- Programming Language: {{language}}
- Conversation History: {{history}}

USER'S QUESTION: {{question}}

STRICT BEHAVIOR RULES:
1. ALWAYS answer the user's specific question about the problem or code
2. If user asks for code → Output ONLY code, no text
3. If user asks about the problem → Explain in relation to the current problem
4. If user asks about their code → Analyze their specific code
5. Response length: SHORT (1-2 sentences), MEDIUM (2-3 sentences), FULL (3-4 sentences)
6. Use the specified programming language ({{language}})
7. Reference the problem statement when relevant
8. NEVER give generic programming explanations unless specifically asked

EXAMPLE BEHAVIOR:
User asks: "help me with the problem" → You explain how to approach the specific problem in {{problemStatement}}
User asks: "what's wrong with my code?" → You analyze their {{code}} and point out issues
User asks: "give me code" → You provide code that solves {{problemStatement}} in {{language}}

FOLLOW THESE RULES EXACTLY. Answer the user's question, not random programming topics.`,
});
