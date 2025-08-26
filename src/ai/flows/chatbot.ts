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
  prompt: `You are a programming tutor helping with a SPECIFIC coding problem. You MUST use the exact problem statement and code provided.

CRITICAL: You are working on THIS specific problem:
PROBLEM STATEMENT: {{problemStatement}}

CURRENT CODE: {{code}}

PROGRAMMING LANGUAGE: {{language}}

USER'S QUESTION: {{question}}

STRICT RULES:
1. ALWAYS reference the EXACT problem statement above
2. If they ask for code → Provide ONLY code that solves THEIR specific problem
3. If they ask about the problem → Explain THEIR specific problem, not general concepts
4. If they ask about their code → Analyze THEIR code in relation to THEIR problem
5. Response length: SHORT (1-2 sentences), MEDIUM (2-3 sentences), FULL (3-4 sentences)
6. Use THEIR specified programming language
7. NEVER give generic programming explanations - always tie to THEIR problem
8. If they ask "give logic" or "give code" → Provide solution for THEIR specific problem

EXAMPLE: If they ask "explain the problem", you say "Your problem is: [exact problem statement]"

Focus on THEIR specific problem, not general programming topics.`,
});

const askChatbotFlow = ai.defineFlow(
  {
    name: 'askChatbotFlow',
    inputSchema: AskChatbotInputSchema,
    outputSchema: AskChatbotOutputSchema,
  },
  async input => {
    try {
      console.log('🤖 Chatbot flow input received:', input);
      console.log('📋 Problem Statement:', input.problemStatement);
      console.log('💻 Current Code:', input.code);
      console.log('🌐 Language:', input.language);
      console.log('❓ Question:', input.question);
      
      const result = await prompt(input);
      console.log('🤖 Chatbot prompt result:', result);
      
      if (!result || !result.output) {
        console.error('❌ No output from prompt:', result);
        return {
          answer: 'Sorry, I received an empty response. Please try again.'
        };
      }
      
      return result.output;
    } catch (error) {
      console.error('❌ Error in askChatbotFlow:', error);
      
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
