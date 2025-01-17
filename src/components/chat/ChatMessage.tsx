import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  return (
    <div
      className={`flex items-start gap-3 ${
        role === "user" ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`flex gap-3 max-w-[80%] ${
          role === "user" ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div
          className={`flex-shrink-0 ${
            role === "user" ? "bg-primary" : "bg-gray-700"
          } rounded-full p-2`}
        >
          {role === "user" ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        <div
          className={`rounded-lg p-4 ${
            role === "user"
              ? "bg-primary text-white"
              : "bg-gray-800 text-gray-100"
          } shadow-lg`}
        >
          <ReactMarkdown
            components={{
              code({ className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !className ? (
                  <code {...props} className="bg-gray-700 rounded px-1">
                    {children}
                  </code>
                ) : (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match?.[1] || "text"}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};