import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Check if API key is available
if (!process.env.GOOGLE_AI_API_KEY) {
  console.error('❌ GOOGLE_AI_API_KEY is not set in environment variables');
  console.error('Please add GOOGLE_AI_API_KEY to your .env.local file');
  throw new Error('GOOGLE_AI_API_KEY environment variable is required');
}

console.log('✅ GOOGLE_AI_API_KEY is configured');
console.log('🔧 Initializing Genkit with Google Gemini...');

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});

console.log('✅ Genkit initialized successfully');
