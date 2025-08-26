'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Trophy, Upload, ChevronUp, ChevronDown, BookOpen, Code, Eye, LightbulbIcon } from 'lucide-react';
import { SafeMarkdown } from '@/components/ui/safe-markdown';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { GenerateCodingProblemOutput } from '@/ai/flows/auto-generate-problems';

interface ProblemDisplayProps {
  problem: GenerateCodingProblemOutput | null;
  topic: string;
  language: 'java' | 'python' | 'c';
  complexity: 'easy' | 'medium' | 'hard';
  isGenerating: boolean;
  className?: string;
  onImportProblem?: (problemData: {
    problemStatement: string;
    expectedOutput: string;
    language: 'java' | 'python' | 'c';
    complexity: 'easy' | 'medium' | 'hard';
    topic: string;
  }) => void;
}

const complexityConfig = {
  easy: { color: 'bg-green-500', icon: Target, label: 'Beginner' },
  medium: { color: 'bg-yellow-500', icon: ChevronUp, label: 'Intermediate' },
  hard: { color: 'bg-red-500', icon: Trophy, label: 'Advanced' },
};

const languageConfig = {
  java: { color: 'bg-orange-500', label: 'Java' },
  python: { color: 'bg-blue-500', label: 'Python' },
  c: { color: 'bg-purple-500', label: 'C' },
};

export function ProblemDisplay({
  problem,
  topic,
  language,
  complexity,
  isGenerating,
  className,
  onImportProblem,
}: ProblemDisplayProps) {
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState({
    problemStatement: '',
    expectedOutput: '',
    language: 'java' as 'java' | 'python' | 'c',
    complexity: 'easy' as 'easy' | 'medium' | 'hard',
    topic: '',
  });

  const complexityInfo = complexityConfig[complexity];
  const languageInfo = languageConfig[language];

  const handleImport = () => {
    if (onImportProblem && importData.problemStatement.trim()) {
      onImportProblem(importData);
      setImportDialogOpen(false);
      setImportData({
        problemStatement: '',
        expectedOutput: '',
        language: 'java',
        complexity: 'easy',
        topic: '',
      });
    }
  };

  if (isGenerating) {
    return (
      <Card className={cn('flex flex-col flex-grow', className)}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline tracking-tight">Coding Challenge</CardTitle>
          <CardDescription>
            <Skeleton className="h-5 w-48 mt-1" />
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <br />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!problem) {
    return (
      <Card className={cn('flex flex-col flex-grow', className)}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline tracking-tight">Coding Challenge</CardTitle>
          <CardDescription>Select a problem from the sidebar to get started.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Choose a coding challenge to begin your learning journey!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col flex-grow', className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-headline tracking-tight">Coding Challenge</CardTitle>
            <CardDescription className="text-base">
              {topic} - {languageInfo.label} ({complexityInfo.label})
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 px-2" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-1" />
                        Import
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import Custom Problem</DialogTitle>
                    <DialogDescription>
                      Paste a coding problem from the internet and I'll automatically clean and enhance it for you to work on.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>💡 Tip:</strong> When copying from LeetCode or other sites, try to copy just the problem description, not the entire page. Focus on the main problem text, examples, and constraints.
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="topic">Topic/Category</Label>
                      <Input
                        id="topic"
                        placeholder="e.g., Arrays, Strings, Dynamic Programming"
                        value={importData.topic}
                        onChange={(e) => setImportData({...importData, topic: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={importData.language} onValueChange={(value: 'java' | 'python' | 'c') => setImportData({...importData, language: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="c">C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="complexity">Complexity</Label>
                        <Select value={importData.complexity} onValueChange={(value: 'easy' | 'medium' | 'hard') => setImportData({...importData, complexity: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="problemStatement">Problem Statement</Label>
                      <Textarea
                        id="problemStatement"
                        placeholder="Paste the problem statement here..."
                        value={importData.problemStatement}
                        onChange={(e) => setImportData({...importData, problemStatement: e.target.value})}
                        rows={6}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expectedOutput">Expected Output (Optional)</Label>
                      <Textarea
                        id="expectedOutput"
                        placeholder="Paste expected output or test cases..."
                        value={importData.expectedOutput}
                        onChange={(e) => setImportData({...importData, expectedOutput: e.target.value})}
                        rows={4}
                        className="font-mono text-sm"
                      />
                    </div>

                    {/* Preview Section */}
                    {(importData.problemStatement || importData.expectedOutput) && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Preview (Cleaned Content):</Label>
                        <div className="bg-muted p-3 rounded-lg border text-sm">
                          {importData.problemStatement && (
                            <div className="mb-3">
                              <strong>Problem Statement:</strong>
                              <div className="mt-1 text-muted-foreground">
                                {importData.problemStatement.length > 200 
                                  ? importData.problemStatement.substring(0, 200) + '...'
                                  : importData.problemStatement
                                }
                              </div>
                            </div>
                          )}
                          {importData.expectedOutput && (
                            <div>
                              <strong>Expected Output:</strong>
                              <div className="mt-1 text-muted-foreground">
                                {importData.expectedOutput.length > 200 
                                  ? importData.expectedOutput.substring(0, 200) + '...'
                                  : importData.expectedOutput
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleImport} disabled={!importData.problemStatement.trim()}>
                        Import Problem
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Badge className={cn('text-white', languageInfo.color)}>
              {languageInfo.label}
            </Badge>
            <Badge className={cn('text-white', complexityInfo.color)}>
              <complexityInfo.icon className="h-3 w-3 mr-1" />
              {complexityInfo.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        {/* Problem Statement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Problem Statement
            </h3>
          </div>
          <Tabs defaultValue="rendered" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rendered" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Rendered
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Raw Markdown
              </TabsTrigger>
            </TabsList>
            <TabsContent value="rendered" className="mt-0">
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-primary">
                <SafeMarkdown variant="prose">{problem.problemStatement}</SafeMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="raw" className="mt-0">
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-l-primary">
                <div className="bg-background border rounded p-3 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">{problem.problemStatement}</pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Expected Output */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Expected Output
          </h3>
          <Tabs defaultValue="rendered" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="rendered" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Rendered
              </TabsTrigger>
              <TabsTrigger value="raw" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Raw Markdown
              </TabsTrigger>
            </TabsList>
            <TabsContent value="rendered" className="mt-0">
              <div className="bg-muted p-4 rounded-lg border">
                <SafeMarkdown variant="prose">{problem.expectedOutput}</SafeMarkdown>
              </div>
            </TabsContent>
            <TabsContent value="raw" className="mt-0">
              <div className="bg-muted p-4 rounded-lg border">
                <div className="bg-background border rounded p-3 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">{problem.expectedOutput}</pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Learning Tips */}
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={() => setShowHints(!showHints)}
            className="p-0 h-auto font-semibold text-lg flex items-center gap-2 text-primary hover:text-primary/80"
          >
            <LightbulbIcon className="h-5 w-5" />
            Learning Tips
            {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          {showHints && (
            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">
                  💡 <strong>Tip:</strong> Start by understanding the problem requirements
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  • Break down the problem into smaller steps
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  • Test your solution with different inputs
                </p>
                <p className="text-blue-800 dark:text-blue-200">
                  • Consider edge cases and error handling
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Challenge Progress</span>
            <span>0% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '0%' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
