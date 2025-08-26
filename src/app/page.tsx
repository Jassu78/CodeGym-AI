'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Menu, 
  X, 
  Target, 
  Trophy, 
  Upload, 
  ChevronUp, 
  ChevronDown, 
  BookOpen, 
  Code, 
  Eye,
  MessageCircle,
  Maximize2,
  Minimize2,
  Plus
} from 'lucide-react';
import { SafeMarkdown } from '@/components/ui/safe-markdown';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AppSidebar } from '@/components/app-sidebar';
import { ProblemDisplay } from '@/components/problem-display';
import { CodeEditor } from '@/components/code-editor';
import { FeedbackPanel } from '@/components/feedback-panel';
import { Chatbot } from '@/components/chatbot';
import type { ChatMessage } from '@/components/chatbot';
import type { 
  GenerateCodingProblemOutput,
  CheckCodeOutput,
  RunCodeOutput
} from '@/lib/types';
import { 
  generateProblemAction, 
  checkCodeAction, 
  runCodeAction, 
  askChatbotAction,
  enhanceImportedProblemAction
} from '@/app/actions';

type Language = 'java' | 'python' | 'c';
type Complexity = 'easy' | 'medium' | 'hard';

export default function Home() {
  const [language, setLanguage] = useState<Language>('java');
  const [complexity, setComplexity] = useState<Complexity>('easy');
  const [topic, setTopic] = useState('Fibonacci Sequence');
  const [problem, setProblem] = useState<GenerateCodingProblemOutput | null>(null);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<CheckCodeOutput | null>(null);
  const [runResult, setRunResult] = useState<RunCodeOutput | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isChecking, startCheckingTransition] = useTransition();
  const [isRunning, startRunningTransition] = useTransition();

  const { toast } = useToast();

  // Debug: Log problem state changes
  useEffect(() => {
    console.log('🔍 Problem state changed:', {
      problem: problem,
      problemStatement: problem?.problemStatement,
      hasProblem: !!problem
    });
  }, [problem]);

  // Ensure there's always a problem available
  useEffect(() => {
    if (!problem && !isGenerating) {
      console.log('🚀 No problem available, generating default...');
      // Use a more specific topic for better testing
      handleGenerateProblem('Array Manipulation', 'java', 'easy');
    }
  }, [problem, isGenerating]);

  const handleGenerateProblem = useCallback(async (newTopic: string, newLanguage: Language, newComplexity: Complexity) => {
    setTopic(newTopic);
    setLanguage(newLanguage);
    setComplexity(newComplexity);
    setProblem(null);
    setFeedback(null);
    setRunResult(null);
    setChatHistory([]);
    setStartTime(new Date());

    startGeneratingTransition(async () => {
      try {
        const result = await generateProblemAction({
          topic: newTopic,
          language: newLanguage,
          complexity: newComplexity,
        });
        setProblem(result);
        setCode(result.codeSkeleton || '');
      } catch (error) {
        console.error('Failed to generate problem:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not generate a new coding problem. Please try again.',
        });
      }
    });
  }, [toast]);

  const handleCheckCode = async () => {
    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Code',
        description: 'Please write some code before checking.',
      });
      return;
    }

    if (!problem?.problemStatement) {
      toast({
        variant: 'destructive',
        title: 'No Problem',
        description: 'Please generate a problem first before checking code.',
      });
      return;
    }

    setFeedback(null);
    startCheckingTransition(async () => {
      try {
        const result = await checkCodeAction({ code, language, problem: problem.problemStatement });
        setFeedback(result);
      } catch (error) {
        console.error('Failed to check code:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not check your code. Please try again.',
        });
      }
    });
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Code',
        description: 'Please write some code before running.',
      });
      return;
    }

    if (!problem) {
      toast({
        variant: 'destructive',
        title: 'No Problem',
        description: 'Please select a problem first.',
      });
      return;
    }

    setRunResult(null);
    startRunningTransition(async () => {
      try {
        const result = await runCodeAction({
          code,
          language,
          problem: problem.problemStatement,
        });
        setRunResult(result);
      } catch (error) {
        console.error('Failed to run code:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to run code via AI.',
        });
      }
    });
  };

  const handleChatSubmit = async (message: string, responseLength: 'short' | 'medium' | 'full') => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: message,
      timestamp: new Date(),
      responseLength,
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsChatbotTyping(true);

    try {
      // Check if we have a problem context
      if (!problem?.problemStatement) {
        const noProblemMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'I need a coding problem to work with! Please wait for the problem to load, or generate a new one using the "Generate Problem" button. Once you have a problem, I can help you with specific questions about it.',
          timestamp: new Date(),
          responseLength,
        };
        setChatHistory(prev => [...prev, noProblemMessage]);
        setIsChatbotTyping(false);
        return;
      }

      // Check if problem is still loading
      if (isGenerating) {
        const loadingMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: 'Please wait, I\'m still loading the problem. Once it\'s ready, I can help you with it!',
          timestamp: new Date(),
          responseLength,
        };
        setChatHistory(prev => [...prev, loadingMessage]);
        setIsChatbotTyping(false);
        return;
      }

      console.log('🔄 Sending to chatbot:', {
        question: message,
        problemStatement: problem.problemStatement,
        code: code,
        language: language,
        responseLength
      });

      console.log('🔍 Full problem object:', problem);
      console.log('🔍 Current code:', code);
      console.log('🔍 Current language:', language);

      const response = await askChatbotAction({
        question: message,
        problemStatement: problem.problemStatement,
        code: code,
        language: language,
        history: chatHistory,
        responseLength,
      });

      // Handle different response structures
      let answer = '';
      if (typeof response === 'string') {
        answer = response;
      } else if (response && typeof response === 'object' && 'answer' in response) {
        answer = response.answer;
      } else if (response && typeof response === 'object' && 'response' in response) {
        answer = (response as any).response;
      } else {
        console.error('Unexpected response structure:', response);
        answer = 'Sorry, I received an unexpected response format. Please try again.';
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: answer,
        timestamp: new Date(),
        responseLength,
      };

      setChatHistory(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        responseLength,
      };

      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatbotTyping(false);
    }
  };

  const handleBotResponse = (message: ChatMessage) => {
    // This function will be called by the chatbot component to sync responses
    if (message.sender === 'bot' && !chatHistory.some(msg => msg.id === message.id)) {
      setChatHistory(prev => [...prev, message]);
    }
  };

  const handleImportProblem = async (problemData: {
    problemStatement: string;
    expectedOutput: string;
    language: 'java' | 'python' | 'c';
    complexity: 'easy' | 'medium' | 'hard';
    topic: string;
  }) => {
    // Process the imported problem with AI to enhance it
    startGeneratingTransition(async () => {
      try {
        const enhancedProblem = await enhanceImportedProblemAction({
          topic: problemData.topic,
          language: problemData.language,
          complexity: problemData.complexity,
          problemStatement: problemData.problemStatement,
          expectedOutput: problemData.expectedOutput,
        });
        
        // Create a custom problem object with enhanced content
        const customProblem = {
          problemStatement: enhancedProblem.problemStatement,
          expectedOutput: enhancedProblem.expectedOutput,
          codeSkeleton: enhancedProblem.codeSkeleton || '',
          _importedData: {
            topic: problemData.topic,
            language: problemData.language,
            complexity: problemData.complexity,
          }
        };
        
        // Update the problem state
        setProblem(customProblem);
        setLanguage(problemData.language);
        setComplexity(problemData.complexity);
        setTopic(problemData.topic);
        
        // Reset code and feedback
        setCode('');
        setFeedback(null);
        setRunResult(null);
        
        // Clear chat history for new problem
        setChatHistory([]);
        
        // Show success message
        toast({
          title: 'Problem Imported Successfully!',
          description: `Enhanced "${problemData.topic}" problem is now ready to work on.`,
        });
        
      } catch (error) {
        console.error('Error processing imported problem:', error);
        // Fallback to original problem if AI processing fails
        const fallbackProblem = {
          problemStatement: problemData.problemStatement,
          expectedOutput: problemData.expectedOutput,
          codeSkeleton: '',
          _importedData: {
            topic: problemData.topic,
            language: problemData.language,
            complexity: problemData.complexity,
          }
        };
        
        setProblem(fallbackProblem);
        setLanguage(problemData.language);
        setComplexity(problemData.complexity);
        setTopic(problemData.topic);
        setCode('');
        setFeedback(null);
        setRunResult(null);
        setChatHistory([]);
      }
    });
  };

  const handleNewChat = () => {
    setChatHistory([]);
  };

  useEffect(() => {
    handleGenerateProblem(topic, language, complexity);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Sidebar */}
      {isSidebarOpen && (
        <AppSidebar
          currentLanguage={language}
          currentComplexity={complexity}
          onTopicSelect={handleGenerateProblem}
          onLanguageChange={setLanguage}
          onComplexityChange={setComplexity}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content with proper margin and mobile responsiveness */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-0 lg:ml-80' : 'ml-0'}`}>
        <header className="flex items-center gap-4 border-b bg-card p-3 sm:p-4 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-8 w-8 p-0"
          >
            <div className="w-4 h-4 border-2 border-current rounded-sm"></div>
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold font-headline truncate">CodeGym AI</h1>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Your AI-Powered Coding Practice Arena</p>
            </div>
          </div>
        </header>
        
        <main className="p-3 sm:p-4 lg:p-6 xl:p-8 flex-1 overflow-auto bg-gradient-to-br from-background to-muted/20">
          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-10 gap-4 sm:gap-6 h-full">
            {/* Left Side - Problem Display */}
            <div className="xl:col-span-4">
              <div className="bg-card border rounded-lg shadow-sm overflow-hidden h-full">
                <div className="bg-muted/50 px-3 sm:px-4 py-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm font-medium">Problem Display</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 h-full overflow-y-auto custom-scrollbar">
                  <ProblemDisplay
                    problem={problem}
                    topic={topic}
                    language={language}
                    complexity={complexity}
                    isGenerating={isGenerating}
                    onImportProblem={handleImportProblem}
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Code Editor + Feedback */}
            <div className="xl:col-span-6">
              <div className="bg-card border rounded-lg shadow-sm overflow-hidden h-full">
                <div className="bg-muted/50 px-3 sm:px-4 py-2 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Code Editor & AI Feedback</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 h-full overflow-auto">
                  <div className="space-y-4 sm:space-y-6">
                    <CodeEditor
                      code={code}
                      language={language}
                      onChange={setCode}
                      onRun={handleRunCode}
                      onCheck={handleCheckCode}
                      isRunning={isRunning}
                      isChecking={isChecking}
                      isGenerating={isGenerating}
                    />
                    
                    {/* Feedback Panel */}
                    <div className="xl:col-span-6">
                      <FeedbackPanel
                        feedback={feedback}
                        runResult={runResult}
                        isChecking={isChecking}
                        isRunning={isRunning}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Chatbot */}
        <div className="xl:col-span-6">
          <Chatbot
            onSendMessage={handleChatSubmit}
            messages={chatHistory}
            isTyping={isChatbotTyping}
            onNewChat={handleNewChat}
            onBotResponse={handleBotResponse}
          />
        </div>
      </div>
    </div>
  );
}
