import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';

interface SafeMarkdownProps {
  children: string;
  className?: string;
  variant?: 'default' | 'compact' | 'prose';
}

export function SafeMarkdown({ children, className, variant = 'default' }: SafeMarkdownProps) {
  const baseClasses = cn(
    'text-sm leading-relaxed',
    variant === 'prose' && 'prose prose-sm max-w-none dark:prose-invert',
    variant === 'compact' && 'text-xs leading-tight',
    className
  );

  return (
    <div className={baseClasses}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Completely override paragraph to prevent any nesting issues
          p: ({ children, ...props }) => {
            // Always render as div to prevent nesting issues
            return <div className="mb-4 text-gray-700 dark:text-gray-300" {...props}>{children}</div>;
          },

          // Enhanced code blocks with better styling
          code: ({ inline, className, children, ...props }) => {
            if (inline) {
              return (
                <code 
                  className={cn(
                    "px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700",
                    className
                  )} 
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code Block</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                    <code className={cn("font-mono", className)} {...props}>
                      {children}
                    </code>
                  </pre>
                </div>
              </div>
            );
          },

          // Enhanced pre blocks
          pre: ({ children, ...props }) => {
            return (
              <div className="my-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Code Block</span>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto" {...props}>
                    {children}
                  </pre>
                </div>
              </div>
            );
          },

          // Enhanced headings with better hierarchy and spacing
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-semibold mb-4 mt-6 text-gray-800 dark:text-gray-100 border-b border-gray-300 dark:border-gray-600 pb-1" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-semibold mb-3 mt-5 text-gray-800 dark:text-gray-100" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-lg font-semibold mb-2 mt-4 text-gray-700 dark:text-gray-200" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="text-base font-semibold mb-2 mt-3 text-gray-700 dark:text-gray-200" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-sm font-semibold mb-1 mt-2 text-gray-600 dark:text-gray-300" {...props}>
              {children}
            </h6>
          ),

          // Enhanced lists with better styling
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="mb-1 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </li>
          ),

          // Enhanced blockquote with better styling
          blockquote: ({ children, ...props }) => (
            <blockquote 
              className="border-l-4 border-blue-500 pl-6 italic text-gray-600 dark:text-gray-400 mb-4 bg-blue-50 dark:bg-blue-900/20 py-3 rounded-r-lg" 
              {...props}
            >
              {children}
            </blockquote>
          ),

          // Enhanced strong and em
          strong: ({ children, ...props }) => (
            <strong className="font-bold text-gray-900 dark:text-white" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-gray-800 dark:text-gray-200" {...props}>
              {children}
            </em>
          ),

          // Enhanced links
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-blue-400 hover:decoration-blue-600 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),

          // Enhanced tables with better styling
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto mb-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
              {children}
            </tbody>
          ),
          tr: ({ children, ...props }) => (
            <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" {...props}>
              {children}
            </tr>
          ),
          th: ({ children, ...props }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </td>
          ),

          // Enhanced hr
          hr: ({ ...props }) => (
            <hr className="my-8 border-gray-300 dark:border-gray-600" {...props} />
          ),

          // Enhanced div to prevent nesting issues
          div: ({ children, ...props }) => {
            return <div {...props}>{children}</div>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
