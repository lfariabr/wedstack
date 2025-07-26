// frontend/src/components/chat/MarkdownMessage.tsx
'use client';

import React, { Children, isValidElement } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import type { Components } from 'react-markdown';

type CodeProps = React.HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  node?: any;
  className?: string;
  children?: React.ReactNode;
};

interface MarkdownMessageProps {
  content: string;
  className?: string;
  variant?: 'default' | 'project' | 'article';
}

export function MarkdownMessage({ 
  content, 
  className = '', 
  variant = 'default' 
}: MarkdownMessageProps) {
  const baseStyles = 'prose prose-invert max-w-none';
  const variantStyles = {
    default: '',
    project: 'prose-lg',
    article: 'prose-lg leading-relaxed'
  };

  // Custom component to handle paragraphs and their children
  const Paragraph = ({ node, children, ...props }: any) => {
    // Check if this paragraph contains only an image
    const hasOnlyImage = node?.children?.length === 1 && node?.children?.[0]?.tagName === 'img';
    
    // Check if any direct child is a block-level element or an image
    const hasBlockChild = Children.toArray(children).some(child => {
      if (!isValidElement(child)) return false;
      
      // List of block-level elements that can't be inside <p>
      const blockElements = [
        'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'blockquote', 'pre', 'hr', 'figure', 'figcaption', 'video', 'iframe', 'form', 'fieldset', 'address'
      ];
      
      // Check if it's a block element
      const isBlockElement = blockElements.includes(child.type as string) || 
                            (child.props?.node?.tagName && blockElements.includes(child.props.node.tagName));
      
      // Check if it's an image (which we render as figure)
      const isImage = child.type === 'img' || 
                     (child.props?.node?.tagName === 'img') ||
                     (typeof child.type === 'function' && child.props?.node?.tagName === 'img');
      
      return isBlockElement || isImage;
    });

    // If this paragraph contains only an image or has block children, render as div
    if (hasOnlyImage || hasBlockChild) {
      return <div className="my-4">{children}</div>;
    }

    // Otherwise, render a regular paragraph
    return <p className="my-4 leading-relaxed" {...props}>{children}</p>;
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Use our custom paragraph component
          p: Paragraph,
          
          // Headers
          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mt-8 mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-2xl font-medium mt-6 mb-3" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-xl font-medium mt-4 mb-2" {...props} />,
          
          // Images - Render as figure to avoid nesting issues
          img: ({ node, alt, src, ...props }) => (
            <figure className="my-6">
              <img 
                src={src} 
                alt={alt || 'Image'} 
                className="rounded-lg border shadow-sm mx-auto max-h-[500px] w-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.alt = 'Failed to load image';
                  target.classList.add('bg-gray-100', 'p-4');
                }}
                {...props}
              />
              {alt && (
                <figcaption className="text-center text-sm text-muted-foreground mt-2">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
          
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 space-y-2 my-4" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 space-y-2 my-4" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="my-1 pl-1" {...props} />
          ),
          
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote 
              className="border-l-4 border-primary/40 pl-4 my-6 text-muted-foreground italic" 
              {...props} 
            />
          ),
          
          // Code blocks
          code: ({ inline, className, children, ...props }: CodeProps) => {
            const hasLang = className?.startsWith('language-');
            const language = hasLang ? className?.replace('language-', '') : '';
          
            if (inline || !hasLang) {
              return (
                <code
                  className="bg-gray-800/70 text-gray-100 font-mono text-sm px-1.5 py-0.5 rounded"
                  {...props}
                >
                  {String(children).trim()}
                </code>
              );
            }
          
            return (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  background: '#1e1e1e',
                  fontSize: '0.875rem',
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}
                {...props}
              >
                {String(children).trim()}
              </SyntaxHighlighter>
            );
          },
          
          // Links
          a: ({ node, ...props }) => (
            <a 
              className="text-primary hover:underline underline-offset-4" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            />
          ),
          
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-t border-border" {...props} />
          ),
          
          // Tables
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full divide-y divide-gray-700" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-gray-800" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="divide-y divide-gray-700" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="hover:bg-gray-800/50" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}