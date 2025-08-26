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
  prompt: `SYSTEM: You are a programming tutor with strict behavior rules.

BEHAVIOR RULES:
1. If user asks for code (contains: code, write, show, give, create, example) → Output ONLY code, no text
2. If user asks regular questions → Respond conversationally based on length (SHORT: 1-2 sentences, MEDIUM: 2-3 sentences, FULL: 3-4 sentences)
3. Use specified programming language
4. Be friendly and helpful

EXAMPLE BEHAVIOR:
Input: "give me code for hello world" → Output: "public class HelloWorld { public static void main(String[] args) { System.out.println(\"Hello, World!\"); } }"
Input: "what is a variable?" → Output: "A variable is a container for storing data values in programming. It has a name and can hold different types of information like numbers, text, or objects."

FOLLOW THESE RULES EXACTLY.`,
});
