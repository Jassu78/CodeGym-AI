'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar, 
  Star, 
  Zap,
  Award,
  Clock,
  CheckCircle,
  Flame,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressData {
  totalProblems: number;
  solvedProblems: number;
  currentStreak: number;
  longestStreak: number;
  totalTime: number;
  averageTime: number;
  languages: {
    java: { solved: number; total: number };
    python: { solved: number; total: number };
    c: { solved: number; total: number };
  };
  complexity: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-problem',
    name: 'First Steps',
    description: 'Solve your first coding problem',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak-3',
    name: 'On Fire!',
    description: 'Maintain a 3-day solving streak',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day solving streak',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'language-master',
    name: 'Polyglot',
    description: 'Solve problems in all three languages',
    icon: '🌍',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'complexity-climber',
    name: 'Difficulty Climber',
    description: 'Solve problems of all complexity levels',
    icon: '🏔️',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Solve a problem in under 5 minutes',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

export function ProgressTracker({ className }: { className?: string }) {
  const [progressData, setProgressData] = useState<ProgressData>({
    totalProblems: 0,
    solvedProblems: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalTime: 0,
    averageTime: 0,
    languages: {
      java: { solved: 0, total: 0 },
      python: { solved: 0, total: 0 },
      c: { solved: 0, total: 0 },
    },
    complexity: {
      easy: { solved: 0, total: 0 },
      medium: { solved: 0, total: 0 },
      hard: { solved: 0, total: 0 },
    },
    achievements: defaultAchievements,
  });

  const [showAchievements, setShowAchievements] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('codegym-progress');
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgressData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to parse saved progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('codegym-progress', JSON.stringify(progressData));
  }, [progressData]);

  const overallProgress = progressData.totalProblems > 0 
    ? Math.round((progressData.solvedProblems / progressData.totalProblems) * 100)
    : 0;

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getLanguageProgress = (language: keyof typeof progressData.languages) => {
    const lang = progressData.languages[language];
    return lang.total > 0 ? Math.round((lang.solved / lang.total) * 100) : 0;
  };

  const getComplexityProgress = (complexity: keyof typeof progressData.complexity) => {
    const comp = progressData.complexity[complexity];
    return comp.total > 0 ? Math.round((comp.solved / comp.total) * 100) : 0;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {progressData.solvedProblems} / {progressData.totalProblems} problems
              </span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <div className="text-center">
              <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-primary">{progressData.solvedProblems}</div>
              <div className="text-xs text-muted-foreground">Problems Solved</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">{progressData.currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{progressData.longestStreak}</div>
              <div className="text-xs text-muted-foreground">Longest Streak</div>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">
                {formatTime(progressData.averageTime)}
              </div>
              <div className="text-xs text-muted-foreground">Avg. Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Language Mastery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(progressData.languages).map(([lang, data]) => (
            <div key={lang} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{lang}</span>
                <span className="text-sm text-muted-foreground">
                  {data.solved} / {data.total}
                </span>
              </div>
              <Progress 
                value={getLanguageProgress(lang as keyof typeof progressData.languages)} 
                className="h-2" 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Complexity Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Difficulty Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(progressData.complexity).map(([comp, data]) => (
            <div key={comp} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{comp}</span>
                <span className="text-sm text-muted-foreground">
                  {data.solved} / {data.total}
                </span>
              </div>
              <Progress 
                value={getComplexityProgress(comp as keyof typeof progressData.complexity)} 
                className="h-2" 
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Achievements
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              {showAchievements ? 'Hide' : 'Show'} All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {progressData.achievements
              .filter(achievement => showAchievements || achievement.unlocked)
              .map(achievement => (
                <div
                  key={achievement.id}
                  className={cn(
                    'p-4 rounded-lg border transition-all',
                    achievement.unlocked
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-muted/30 border-muted'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className={cn(
                          'font-medium',
                          achievement.unlocked ? 'text-yellow-800' : 'text-muted-foreground'
                        )}>
                          {achievement.name}
                        </h4>
                        {achievement.unlocked && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className={cn(
                        'text-sm',
                        achievement.unlocked ? 'text-yellow-700' : 'text-muted-foreground'
                      )}>
                        {achievement.description}
                      </p>
                      {!achievement.unlocked && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span>{achievement.progress} / {achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-1" 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


