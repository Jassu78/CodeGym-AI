'use client';

import { useState } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '@/components/icons';
import { Coffee, FileCode, Binary, ChevronDown, type LucideIcon } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Label } from './ui/label';

type Language = 'java' | 'python' | 'c';
type Complexity = 'easy' | 'medium' | 'hard';

interface AppSidebarProps {
  currentLanguage: Language;
  currentComplexity: Complexity;
  onTopicSelect: (topic: string, language: Language, complexity: Complexity) => void;
  onLanguageChange: (language: Language) => void;
  onComplexityChange: (complexity: Complexity) => void;
}

const codingPaths = [
  {
    language: 'java',
    name: 'Java Path',
    icon: Coffee,
    topics: [
      { name: 'Basics', problems: ['Hello World', 'Data Types', 'Operators'] },
      { name: 'Control Flow', problems: ['If-Else Statement', 'Switch Statement', 'For Loop', 'While Loop'] },
      { name: 'Arrays & Strings', problems: ['Array Manipulation', 'String Reversal', 'Palindrome Check'] },
      { name: 'Algorithms', problems: ['Fibonacci Sequence', 'Prime Number Check', 'Factorial Calculation'] },
    ],
  },
  {
    language: 'python',
    name: 'Python Path',
    icon: FileCode,
    topics: [
      { name: 'Basics', problems: ['Hello World', 'Variables', 'Data Types'] },
      { name: 'Data Structures', problems: ['Lists', 'Tuples', 'Dictionaries'] },
      { name: 'Functions', problems: ['Function Definition', 'Lambda Functions', 'Recursion'] },
      { name: 'Algorithms', problems: ['Linear Search', 'Binary Search', 'Sorting a List'] },
    ],
  },
  {
    language: 'c',
    name: 'C Path',
    icon: Binary,
    topics: [
      { name: 'Basics', problems: ['Hello World', 'Variables and Types', 'Input/Output'] },
      { name: 'Pointers', problems: ['Pointer Declaration', 'Pointer Arithmetic', 'Pointers and Arrays'] },
      { name: 'Structs', problems: ['Struct Definition', 'Accessing Members', 'Structs and Functions'] },
      { name: 'File I/O', problems: ['Reading from a file', 'Writing to a file', 'File Modes'] },
    ],
  },
];

const PathCollapsible = ({
  path,
  onTopicSelect,
  currentLanguage,
  currentComplexity,
  onLanguageChange,
}: {
  path: (typeof codingPaths)[0];
  onTopicSelect: AppSidebarProps['onTopicSelect'];
  currentLanguage: Language;
  currentComplexity: Complexity;
  onLanguageChange: AppSidebarProps['onLanguageChange'];
}) => {
  const [isOpen, setIsOpen] = useState(path.language === currentLanguage);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between px-2">
          <div className="flex items-center gap-2">
            <path.icon className="h-4 w-4" />
            <span>{path.name}</span>
          </div>
          <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {path.topics.map((topic) => (
            <SidebarMenuSubItem key={topic.name}>
              <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{topic.name}</p>
              <SidebarMenu>
                {topic.problems.map((problem) => (
                  <SidebarMenuItem key={problem}>
                    <SidebarMenuSubButton
                      onClick={() => {
                        onLanguageChange(path.language as Language);
                        onTopicSelect(problem, path.language as Language, currentComplexity);
                      }}
                      className="w-full text-left justify-start"
                      size="sm"
                      asChild
                    >
                      <button>{problem}</button>
                    </SidebarMenuSubButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

export function AppSidebar({
  currentLanguage,
  currentComplexity,
  onTopicSelect,
  onLanguageChange,
  onComplexityChange,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-primary" />
          <span className="font-bold text-lg font-headline">CodeGym AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Options</SidebarGroupLabel>
            <div className='px-2 space-y-2'>
            <div className="space-y-1">
              <Label htmlFor="language-select">Language</Label>
              <Select
                value={currentLanguage}
                onValueChange={(value) => onLanguageChange(value as Language)}
              >
                <SelectTrigger id="language-select" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="complexity-select">Complexity</Label>
              <Select
                value={currentComplexity}
                onValueChange={(value) => onComplexityChange(value as Complexity)}
              >
                <SelectTrigger id="complexity-select" className="w-full">
                  <SelectValue placeholder="Select complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Coding Paths</SidebarGroupLabel>
          <SidebarMenu>
            {codingPaths.map((path) => (
              <SidebarMenuItem key={path.language}>
                <PathCollapsible
                  path={path}
                  onTopicSelect={onTopicSelect}
                  currentLanguage={currentLanguage}
                  currentComplexity={currentComplexity}
                  onLanguageChange={onLanguageChange}
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
