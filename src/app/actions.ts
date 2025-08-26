'use server';

import { 
  askChatbotInput, 
  enhanceImportedProblemInput, 
  generateProblemInput, 
  checkCodeInput, 
  runCodeInput 
} from '@/lib/types';

// Import the Genkit functions directly
import { askChatbot } from '@/ai/flows/chatbot';
import { enhanceImportedProblem } from '@/ai/flows/enhance-problem';
import { generateCodingProblem } from '@/ai/flows/auto-generate-problems';
import { checkCode } from '@/ai/flows/check-code';
import { runCode } from '@/ai/flows/run-code';

export async function askChatbotAction(input: askChatbotInput) {
  try {
    console.log('🔄 askChatbotAction called with input:', input);
    
    const result = await askChatbot(input);
    console.log('✅ askChatbot result:', result);
    
    return result;
  } catch (error) {
    console.error("❌ Error in askChatbotAction:", error);
    
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    throw new Error(`Failed to get response from chatbot: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function enhanceImportedProblemAction(input: enhanceImportedProblemInput) {
  try {
    const result = await enhanceImportedProblem(input);
    return result;
  } catch (error) {
    console.error("Error in enhanceImportedProblemAction:", error);
    throw new Error('Failed to enhance imported problem.');
  }
}

export async function generateProblemAction(input: generateProblemInput) {
  try {
    const result = await generateCodingProblem(input);
    return result;
  } catch (error) {
    console.error("Error in generateProblemAction:", error);
    throw new Error('Failed to generate problem.');
  }
}

export async function checkCodeAction(input: checkCodeInput) {
  try {
    const result = await checkCode(input);
    return result;
  } catch (error) {
    console.error("Error in checkCodeAction:", error);
    throw new Error('Failed to check code.');
  }
}

export async function runCodeAction(input: runCodeInput) {
  try {
    const result = await runCode(input);
    return result;
  } catch (error) {
    console.error("Error in runCodeAction:", error);
    throw new Error('Failed to run code.');
  }
}
