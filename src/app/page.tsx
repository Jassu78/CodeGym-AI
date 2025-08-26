'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { checkCodeAction, generateProblemAction, runCodeAction, askChatbotAction } from './actions';
import { AppSidebar } from '@/components/app-sidebar';
import type { GenerateCodingProblemOutput } from '@/ai/flows/auto-generate-problems';
import type { CheckCodeOutput } from '@/ai/flows/check-code';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, AlertCircle, MessageCircle, Send, Bot } from 'lucide-react';
import type { RunCodeOutput } from '@/ai/flows/run-code';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


type Language = 'java' | 'python' | 'c';
type Complexity = 'easy' | 'medium' | 'hard';
type Status = 'correct' | 'moderate' | 'wrong';

const statusConfig = {
    correct: {
      label: 'Correct',
      color: 'bg-green-500 hover:bg-green-600',
      icon: CheckCircle,
    },
    moderate: {
      label: 'Moderate',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      icon: AlertCircle,
    },
    wrong: {
      label: 'Wrong',
      color: 'bg-red-500 hover:bg-red-600',
      icon: XCircle,
    },
  };

const StatusBadge = ({ status }: { status: Status }) => {
    const { label, color, icon: Icon } = statusConfig[status];
    return (
      <Badge className={cn('text-white', color)}>
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </Badge>
    );
  };

interface ChatMessage {
    sender: 'user' | 'bot';
    text: string;
}

export default function Home() {
  const [language, setLanguage] = useState<Language>('java');
  const [complexity, setComplexity] = useState<Complexity>('easy');
  const [topic, setTopic] = useState('Fibonacci Sequence');
  const [problem, setProblem] = useState<GenerateCodingProblemOutput | null>(null);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<CheckCodeOutput | null>(null);
  const [runResult, setRunResult] = useState<RunCodeOutput | null>(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);


  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isChecking, startCheckingTransition] = useTransition();
  const [isRunning, startRunningTransition] = useTransition();

  const { toast } = useToast();

  const handleGenerateProblem = useCallback(async (newTopic: string, newLanguage: Language, newComplexity: Complexity) => {
    setTopic(newTopic);
    setLanguage(newLanguage);
    setComplexity(newComplexity);
    setProblem(null);
    setFeedback(null);
    setRunResult(null);
    setShowDetailedFeedback(false);
    setChatHistory([]);

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

    setFeedback(null);
    setShowDetailedFeedback(false);
    startCheckingTransition(async () => {
      try {
        const result = await checkCodeAction({ code, language });
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
    setRunResult(null);
    setShowDetailedFeedback(false);
    startRunningTransition(async () => {
      try {
        if (!problem) return;
        const result = await runCodeAction({
          code,
          language,
          problemStatement: problem.problemStatement,
          expectedOutput: problem.expectedOutput,
        });
        setRunResult(result);
      } catch (error) {
        console.error('Failed to run code:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not run your code. Please try again.',
        });
      }
    });
  }

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !problem) return;

    const newHistory: ChatMessage[] = [...chatHistory, { sender: 'user', text: chatInput }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsChatbotTyping(true);

    try {
        const result = await askChatbotAction({
            question: chatInput,
            problemStatement: problem.problemStatement,
            code: code,
            language: language,
        });
        setChatHistory([...newHistory, { sender: 'bot', text: result.answer }]);
    } catch (error) {
        console.error('Chatbot error:', error);
        setChatHistory([...newHistory, { sender: 'bot', text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
        setIsChatbotTyping(false);
    }
  };


  useEffect(() => {
    handleGenerateProblem(topic, language, complexity);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar
        currentLanguage={language}
        currentComplexity={complexity}
        onTopicSelect={handleGenerateProblem}
        onLanguageChange={setLanguage}
        onComplexityChange={setComplexity}
      />
      <SidebarInset>
        <header className="flex items-center gap-4 border-b bg-card p-4 lg:hidden">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">CodeGym AI</h1>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-auto">
          <div className="grid lg:grid-cols-2 gap-8 h-full max-w-screen-2xl mx-auto">
            {/* Left Column: Problem */}
            <Card className="flex flex-col flex-grow">
              <CardHeader>
                <CardTitle className="text-2xl font-headline tracking-tight">Coding Challenge</CardTitle>
                <CardDescription>
                  {isGenerating ? <Skeleton className="h-5 w-48 mt-1" /> : `${topic} - ${language} (${complexity})`}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {isGenerating ? (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <br/>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : problem ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Problem Statement</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">{problem.problemStatement}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Expected Output</h3>
                      <pre className="bg-muted p-4 rounded-md text-sm font-code text-muted-foreground">{problem.expectedOutput}</pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Select a problem from the sidebar to get started.</p>
                )}
              </CardContent>
            </Card>

            {/* Right Column: Editor & Feedback */}
            <div className="flex flex-col gap-8">
                <Card className="flex flex-col h-[60vh]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-headline tracking-tight">Code Editor</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <Textarea
                      placeholder="Write your code here..."
                      className="font-code text-sm flex-1 w-full bg-muted/50 dark:bg-card resize-none"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={isGenerating}
                    />
                  </CardContent>
                  <CardFooter className="flex-col sm:flex-row gap-2 items-start sm:items-center">
                    <Button onClick={handleRunCode} disabled={isRunning || isGenerating}>
                        {isRunning ? 'Running...' : 'Run Code'}
                    </Button>
                    <Button onClick={handleCheckCode} disabled={isChecking || isGenerating} variant="secondary">
                      {isChecking ? 'Checking...' : 'Check Code Quality'}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="flex flex-col flex-grow">
                    <CardHeader>
                    <CardTitle className="text-2xl font-headline tracking-tight">AI Feedback</CardTitle>
                    <CardDescription>Suggestions and feedback from our AI assistant.</CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-32">
                    {isChecking || isRunning ? (
                        <div className="space-y-4">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-4">
                        {runResult && (
                            <div className="flex items-center gap-4">
                                <StatusBadge status={runResult.status as Status} />
                                <p className="text-muted-foreground">{runResult.output}</p>
                            </div>
                        )}
                        {feedback && (
                            <>
                                <div className="flex items-center gap-4">
                                    <h3 className="font-semibold text-lg">Code Quality Analysis</h3>
                                    <Button variant="link" onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}>
                                        {showDetailedFeedback ? 'Hide Details' : 'Dive Deeper'}
                                    </Button>
                                </div>
                                <p className="text-muted-foreground whitespace-pre-wrap">{feedback.feedback}</p>
                                {showDetailedFeedback && (
                                     <div>
                                        <h3 className="font-semibold text-lg mb-2 mt-4">Suggestions</h3>
                                        <p className="text-muted-foreground whitespace-pre-wrap">{feedback.suggestions}</p>
                                    </div>
                                )}
                            </>
                        )}
                        {!runResult && !feedback && (
                            <p className="text-muted-foreground">Run your code or check its quality to get feedback.</p>
                        )}
                        </div>
                    )}
                    </CardContent>
                </Card>
            </div>
          </div>
        </main>

        <Popover>
            <PopoverTrigger asChild>
                <Button className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-lg" size="icon">
                    <MessageCircle className="h-8 w-8" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 mr-8 mb-2" side="top" align="end">
                <div className="flex flex-col h-[400px]">
                    <ScrollArea className="flex-1 mb-4 pr-4">
                        <div className="space-y-4">
                            {chatHistory.length === 0 && (
                                <div className='flex items-center justify-center h-full text-muted-foreground'>
                                    <p>Ask me anything about the problem!</p>
                                </div>
                            )}
                            {chatHistory.map((msg, index) => (
                                <div key={index} className={cn("flex items-start gap-3", msg.sender === 'user' ? 'justify-end' : '')}>
                                    {msg.sender === 'bot' && <Avatar><AvatarFallback><Bot className='h-5 w-5' /></AvatarFallback></Avatar>}
                                    <div className={cn("rounded-lg px-3 py-2 max-w-xs", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isChatbotTyping && (
                                <div className="flex items-start gap-3">
                                     <Avatar><AvatarFallback><Bot className='h-5 w-5' /></AvatarFallback></Avatar>
                                     <div className="rounded-lg px-3 py-2 bg-muted">
                                        <p className="text-sm">Typing...</p>
                                     </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleChatSubmit} className="flex items-center gap-2 pt-4 border-t">
                        <Input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask a question..."
                            disabled={isChatbotTyping || !problem}
                        />
                        <Button type="submit" size="icon" disabled={isChatbotTyping || !problem || !chatInput.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>

      </SidebarInset>
    </SidebarProvider>
  );
}
