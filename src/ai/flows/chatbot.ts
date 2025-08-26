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
  return askChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askChatbotPrompt',
  input: {schema: AskChatbotInputSchema},
  output: {schema: AskChatbotOutputSchema},
  prompt: `You are a programming tutor helping with a specific coding problem. Answer the user's question based on the context provided.

IMPORTANT RULES:
1. Answer the user's specific question about their problem or code
2. If they ask for code → Provide ONLY code, no explanation text
3. If they ask about the problem → Explain in relation to their specific problem
4. If they ask about their code → Analyze their actual code
5. Response length: SHORT (1-2 sentences), MEDIUM (2-3 sentences), FULL (3-4 sentences)
6. Use the programming language they specified
7. Reference their problem statement when relevant
8. NEVER give generic programming explanations unless specifically asked

Focus on helping with their specific coding problem, not general programming topics.`,
});

const askChatbotFlow = ai.defineFlow(
  {
    name: 'askChatbotFlow',
    inputSchema: AskChatbotInputSchema,
    outputSchema: AskChatbotOutputSchema,
  },
  async input => {
    try {
      console.log('Chatbot flow input received:', input);
      
      const result = await prompt(input);
      console.log('Chatbot prompt result:', result);
      
      if (!result || !result.output) {
        console.error('No output from prompt:', result);
        return {
          answer: 'Sorry, I received an empty response. Please try again.'
        };
      }
      
      return result.output;
    } catch (error) {
      console.error('Error in askChatbotFlow:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API')) {
          return {
            answer: 'Sorry, there was an issue with the AI service. Please check your API key and try again.'
          };
        } else if (error.message.includes('timeout')) {
          return {
            answer: 'Sorry, the request timed out. Please try again.'
          };
        }
      }
      
      return {
        answer: 'Sorry, I encountered an error. Please try again.'
      };
    }
  }
);
