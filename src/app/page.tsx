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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { checkCodeAction, generateProblemAction } from './actions';
import { AppSidebar } from '@/components/app-sidebar';
import type { GenerateCodingProblemOutput } from '@/ai/flows/auto-generate-problems';
import type { CheckCodeOutput } from '@/ai/flows/check-code';

type Language = 'java' | 'python' | 'c';
type Complexity = 'easy' | 'medium' | 'hard';

export default function Home() {
  const [language, setLanguage] = useState<Language>('java');
  const [complexity, setComplexity] = useState<Complexity>('easy');
  const [topic, setTopic] = useState('Fibonacci Sequence');
  const [problem, setProblem] = useState<GenerateCodingProblemOutput | null>(null);
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState<CheckCodeOutput | null>(null);

  const [isGenerating, startGeneratingTransition] = useTransition();
  const [isChecking, startCheckingTransition] = useTransition();

  const { toast } = useToast();

  const handleGenerateProblem = useCallback(async (newTopic: string, newLanguage: Language, newComplexity: Complexity) => {
    setTopic(newTopic);
    setLanguage(newLanguage);
    setComplexity(newComplexity);
    setProblem(null);
    setFeedback(null);
    
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
          <div className="grid xl:grid-cols-2 gap-8 h-full max-w-screen-2xl mx-auto">
            {/* Left Column: Problem Statement */}
            <Card className="flex flex-col">
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

            {/* Right Column: Code Editor & Feedback */}
            <div className="flex flex-col gap-8">
              <Card className="flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline tracking-tight">Code Editor</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <Textarea
                    placeholder="Write your code here..."
                    className="font-code text-sm flex-1 w-full h-96 bg-muted/50 dark:bg-card resize-none"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={isGenerating}
                  />
                </CardContent>
                <CardFooter>
                  <Button onClick={handleCheckCode} disabled={isChecking || isGenerating}>
                    {isChecking ? 'Checking...' : 'Check Code'}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-headline tracking-tight">AI Feedback</CardTitle>
                  <CardDescription>Suggestions and feedback from our AI assistant.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-48">
                  {isChecking ? (
                    <div className="space-y-4">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                       <br/>
                      <Skeleton className="h-6 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : feedback ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Feedback</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{feedback.feedback}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Suggestions</h3>
                        <p className="text-muted-foreground whitespace-pre-wrap">{feedback.suggestions}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Submit your code to get feedback.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
