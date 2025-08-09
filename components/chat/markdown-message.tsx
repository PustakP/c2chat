"use client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

type Props = {
  content: string;
  className?: string;
};

// ui: md renderer for ai msgs
export function MarkdownMessage({ content, className }: Props) {
  return (
    <div className={cn("prose prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // style: code blocks
        code: ({ node, className, children, ...props }) => {
          const isInline = node?.tagName !== 'pre';
          return isInline ? (
            <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props}>
              {children}
            </code>
          ) : (
            <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
              <code className="text-xs font-mono" {...props}>
                {children}
              </code>
            </pre>
          );
        },
        // style: blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        // style: headings
        h1: ({ children }) => <h1 className="text-lg font-semibold mt-4 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>,
        // style: lists
        ul: ({ children }) => <ul className="list-disc pl-6 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 space-y-1">{children}</ol>,
        // style: links
        a: ({ href, children }) => (
          <a 
            href={href} 
            className="text-primary underline hover:no-underline" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        // style: tables
        table: ({ children }) => (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border rounded-md">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-border px-3 py-2">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
    </div>
  );
}
