'use client';

import { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Code, Download, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  code: string;
  language: 'java' | 'python' | 'c';
  onChange: (value: string) => void;
  onRun: () => void;
  onCheck: () => void;
  isRunning: boolean;
  isChecking: boolean;
  isGenerating: boolean;
  className?: string;
}

const languageConfig = {
  java: {
    name: 'Java',
    extension: '.java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, World!");
    }
}`,
  },
  python: {
    name: 'Python',
    extension: '.py',
    defaultCode: `# Write your code here
print("Hello, World!")`,
  },
  c: {
    name: 'C',
    extension: '.c',
    defaultCode: `#include <stdio.h>

int main() {
    // Write your code here
    printf("Hello, World!\\n");
    return 0;
}`,
  },
};

export function CodeEditor({
  code,
  language,
  onChange,
  onRun,
  onCheck,
  isRunning,
  isChecking,
  isGenerating,
  className,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const config = languageConfig[language];
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution${config.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResetCode = () => {
    const config = languageConfig[language];
    onChange(config.defaultCode);
  };

  return (
    <Card className={cn('flex flex-col h-[80vh]', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-headline tracking-tight flex items-center gap-2">
            <Code className="h-5 w-5" />
            {languageConfig[language].name} Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="h-8 px-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="h-8 px-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetCode}
              className="h-8 px-2"
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={code}
          onChange={(value) => onChange(value || '')}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Source Code Pro, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            theme: 'vs-light',
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            folding: true,
            showFoldingControls: 'always',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            parameterHints: { enabled: true },
            hover: { enabled: true },
            contextmenu: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            // Additional options for better line visibility
            lineHeight: 20,
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
            },
            overviewRulerBorder: false,
            renderLineHighlight: 'all',
            selectionHighlight: true,
            highlightActiveIndentGuide: true,
          }}
          theme="vs-light"
        />
      </CardContent>
      <div className="p-4 border-t bg-muted/30">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <Button
            onClick={onRun}
            disabled={isRunning || isGenerating}
            className="flex-1 sm:flex-none"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
          <Button
            onClick={onCheck}
            disabled={isChecking || isGenerating}
            variant="secondary"
            className="flex-1 sm:flex-none"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isChecking ? 'Checking...' : 'Check Quality'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
