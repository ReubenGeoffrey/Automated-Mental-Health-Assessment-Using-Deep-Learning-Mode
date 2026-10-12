import React from 'react';
import ReactMarkdown from 'react-markdown';

export interface MessageType {
  text: string;
  isBot: boolean;
  isMarkdown?: boolean;
  options?: string[];
  question?: any;
}

export const MessageContent = ({ message }: { message: MessageType }) => {
  if (message.isMarkdown) {
    return (
      <div className="markdown-content space-y-2 text-sm md:text-base leading-relaxed">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-2">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-semibold mb-1 mt-2">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc ml-5 mb-2 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal ml-5 mb-2 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="mb-0.5">{children}</li>,
            code: ({ children, className }) => (
              <code className={`bg-black/10 px-1.5 py-0.5 rounded text-xs font-mono ${className || ''}`}>
                {children}
              </code>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-blue-400 pl-3 italic my-2 opacity-90">
                {children}
              </blockquote>
            ),
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>
    );
  }
  return <div className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</div>;
};