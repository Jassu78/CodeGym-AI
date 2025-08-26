'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Play, 
  CheckSquare, 
  Target, 
  TrendingUp, 
  Star,
  LightbulbIcon
} from 'lucide-react';
import { SafeMarkdown } from '@/components/ui/safe-markdown';
import { cn } from '@/lib/utils';
import type { CheckCodeOutput } from '@/ai/flows/check-code';
import type { RunCodeOutput } from '@/ai/flows/run-code';
import { Skeleton } from '@/components/ui/skeleton';

interface FeedbackPanelProps {
  feedback: CheckCodeOutput | null;
  runResult: RunCodeOutput | null;
  isChecking: boolean;
  isRunning: boolean;
  className?: string;
}

const statusConfig = {
  correct: {
    label: 'Correct!',
    color: 'bg-green-500 hover:bg-green-600',
    icon: CheckCircle,
    message: 'Excellent work! Your solution is correct.',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  halfway: {
    label: 'Halfway There!',
    color: 'bg-blue-500 hover:bg-blue-600',
    icon: AlertCircle,
    message: 'Good progress! You\'re on the right track.',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  moderate: {
    label: 'Almost There!',
    color: 'bg-yellow-500 hover:bg-yellow-600',
    icon: AlertCircle,
    message: 'Good effort! Your solution is partially correct.',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  fail: {
    label: 'Keep Trying!',
    color: 'bg-red-500 hover:bg-red-600',
    icon: XCircle,
    message: 'Not quite right, but don\'t give up!',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

export function FeedbackPanel({
  feedback,
  runResult,
  isChecking,
  isRunning,
  className,
}: FeedbackPanelProps) {
  const [showDetailedFeedback, setShowDetailedFeedback] = React.useState(false);

  if (isChecking || isRunning) {
    return (
      <Card className={cn('flex flex-col flex-grow', className)}>
        <CardHeader>
          <CardTitle className="text-2xl font-headline tracking-tight">AI Feedback</CardTitle>
          <CardDescription>Analyzing your code...</CardDescription>
        </CardHeader>
        <CardContent className="min-h-32">
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('flex flex-col flex-grow', className)}>
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-2">
          <LightbulbIcon className="h-6 w-6 text-primary" />
          AI Feedback & Insights
        </CardTitle>
        <CardDescription>Get personalized feedback and learning suggestions</CardDescription>
      </CardHeader>
      <CardContent className="min-h-32 space-y-6">
        {/* Code Execution Results */}
        {runResult && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="h-4 w-4 text-green-600" />
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">Execution Result</span>
            </div>
            <div className="text-sm">
              <SafeMarkdown variant="prose">{runResult.output}</SafeMarkdown>
            </div>
          </div>
        )}

        {/* Code Quality Analysis */}
        {feedback && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Code Quality Analysis
              </h3>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
              >
                {showDetailedFeedback ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {feedback.feedback}
              </p>
            </div>

            {showDetailedFeedback && (
              <div className="space-y-4">
                <h4 className="font-semibold text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Improvement Suggestions
                </h4>
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {feedback.suggestions}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Learning Insights */}
        {(runResult || feedback) && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Learning Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Time to Solve</span>
                </div>
                <p className="text-2xl font-bold text-primary">--:--</p>
                <p className="text-xs text-muted-foreground">Track your solving speed</p>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Success Rate</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {runResult?.status === 'correct' ? '100%' : runResult?.status === 'halfway' ? '75%' : runResult?.status === 'moderate' ? '50%' : '0%'}
                </p>
                <p className="text-xs text-muted-foreground">This problem</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Tracking */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">0% Complete</span>
          </div>
          <Progress value={0} className="h-2" />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>0 problems solved</span>
            <span>0 streak days</span>
          </div>
        </div>

        {/* Next Steps */}
        {runResult && (
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <h4 className="font-medium text-primary mb-2">Next Steps</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {runResult.status === 'correct' ? (
                <>
                  <p>🎉 Great job! You've solved this problem correctly.</p>
                  <p>💡 Try the next challenge or explore different approaches.</p>
                </>
              ) : runResult.status === 'halfway' ? (
                <>
                  <p>🚀 Good progress! You're halfway there.</p>
                  <p>💡 Review the feedback and refine your approach.</p>
                </>
              ) : runResult.status === 'moderate' ? (
                <>
                  <p>📈 Almost there! You're on the right track.</p>
                  <p>💡 Make small adjustments to get it perfect.</p>
                </>
              ) : (
                <>
                  <p>🔍 Review the feedback and try a different approach.</p>
                  <p>💡 Use the chatbot for hints if you're stuck.</p>
                </>
              )}
            </div>
          </div>
        )}

        {!runResult && !feedback && (
          <div className="text-center text-muted-foreground py-8">
            <LightbulbIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Run your code or check its quality to get personalized feedback!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const StatusBadge = ({ status }: { status: keyof typeof statusConfig }) => {
  const { label, color, icon: Icon } = statusConfig[status];
  return (
    <Badge className={cn('text-white', color)}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </Badge>
  );
};
