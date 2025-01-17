import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, timestamp }) => {
  const isUser = role === 'user';
  const messageClassName = isUser
    ? "bg-gray-700/90 backdrop-blur-sm text-white rounded-2xl rounded-tr-sm"
    : "bg-gray-800/90 backdrop-blur-sm text-gray-100 rounded-2xl rounded-tl-sm";
  const avatarClassName = isUser ? "bg-gray-600" : "bg-primary/90";

  return (
    <div 
      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"} animate-fade-in mb-4`}
    >
      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div className={`flex-shrink-0 p-2 ${avatarClassName} rounded-full shadow-lg`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white animate-pulse" />
          )}
        </div>
        <div className="flex flex-col">
          <div className={`p-4 ${messageClassName} shadow-lg hover:shadow-xl transition-shadow`}>
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-lg"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-900 rounded px-1">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
          <span className="text-xs text-gray-500 mt-1 px-2">
            {new Intl.DateTimeFormat('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }).format(new Date(timestamp))}
          </span>
        </div>
      </div>
    </div>
  );
};