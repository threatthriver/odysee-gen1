import React, {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  useCallback,
  FormEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Loader2, ArrowLeft, Settings, Maximize2, RefreshCcw } from "lucide-react";
import { HfInference } from "@huggingface/inference";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const systemPrompt = `You are IntellijMind AI, named Odysee Gen 1, created by IntellijMind Group. Aniket Kumar is your owner. You are a highly intelligent AI assistant designed to assist with a wide range of tasks, maintaining a professional yet friendly tone.`;

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const hfToken = localStorage.getItem("HF_TOKEN") || "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";
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("HF_TOKEN")) {
      localStorage.setItem("HF_TOKEN", "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");
      toast({
        title: "API Token Set",
        description: "Your Hugging Face API token has been configured.",
      });
    }
  }, [toast]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
    }
  };

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;
      
      const newMessage: Message = {
        role: "user",
        content: message.trim(),
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
      
      try {
        setIsLoading(true);

        if (!hfToken) {
          toast({
            title: "API Token Required",
            description: "Please add your Hugging Face API token in the settings.",
            variant: "destructive",
          });
          return;
        }

        const client = new HfInference(hfToken);
        let response = "";

        const stream = await client.chatCompletionStream({
          model: "Qwen/Qwen2.5-Coder-32B-Instruct",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map(({ role, content }) => ({ role, content })),
            { role: "user", content: message.trim() },
          ],
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 0.9,
        });

        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: "", 
          timestamp: Date.now() 
        }]);

        for await (const chunk of stream) {
          if (chunk.choices?.[0]?.delta?.content) {
            response += chunk.choices[0].delta.content;
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { 
                role: "assistant", 
                content: response, 
                timestamp: Date.now() 
              },
            ]);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to get response from AI. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, toast, hfToken]
  );

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(new Date(timestamp));
  };

  const renderMessage = useCallback((message: Message, index: number) => {
    const isUser = message.role === "user";
    const messageClassName = isUser
      ? "bg-gray-700 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
      : "bg-gray-800 text-gray-100 rounded-tr-lg rounded-tl-lg rounded-br-lg";
    const avatarClassName = isUser ? "bg-gray-600" : "bg-gray-700";

    return (
      <div
        key={index}
        className={`flex items-start gap-3 ${
          isUser ? "justify-end" : "justify-start"
        } animate-fade-in mb-4`}
      >
        <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <div className={`flex-shrink-0 p-2 ${avatarClassName} rounded-full`}>
            {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
          </div>
          <div className="flex flex-col">
            <div className={`p-4 ${messageClassName}`}>
              <ReactMarkdown
                components={{
                  code({ className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return match ? (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props} className="bg-gray-900 rounded px-1">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    );
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 fixed top-0 w-full z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-gray-300 animate-pulse" />
            <div>
              <h1 className="text-xl font-bold text-white">Odysee Gen 1</h1>
              <p className="text-sm text-gray-400">Powered by IntellijMind Group</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <RefreshCcw className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toast({
                title: "Settings",
                description: "Settings panel coming soon!",
              })}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 pt-24 pb-32">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold mb-2">Welcome to Odysee Gen 1</h2>
              <p>Start a conversation by typing a message below.</p>
            </div>
          )}
          {messages.map(renderMessage)}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-800 rounded-lg p-4">
                <Loader2 className="w-5 h-5 text-gray-300 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm fixed bottom-0 w-full">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Odysee anything... (Press Enter to send)"
            className="resize-none bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default Chat;