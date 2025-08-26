'use server';

import { 
  askChatbotInput, 
  enhanceImportedProblemInput, 
  generateProblemInput, 
  checkCodeInput, 
  runCodeInput 
} from '@/lib/types';

export async function askChatbotAction(input: askChatbotInput) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/genkit/flows/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in askChatbotAction:", error);
    throw new Error('Failed to get response from chatbot.');
  }
}

export async function enhanceImportedProblemAction(input: enhanceImportedProblemInput) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/genkit/flows/enhance-problem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in enhanceImportedProblemAction:", error);
    throw new Error('Failed to enhance imported problem.');
  }
}

export async function generateProblemAction(input: generateProblemInput) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/genkit/flows/generate-problem`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in generateProblemAction:", error);
    throw new Error('Failed to generate problem.');
  }
}

export async function checkCodeAction(input: checkCodeInput) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/genkit/flows/check-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in checkCodeAction:", error);
    throw new Error('Failed to check code.');
  }
}

export async function runCodeAction(input: runCodeInput) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/genkit/flows/run-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("Error in runCodeAction:", error);
    throw new Error('Failed to run code.');
  }
}
