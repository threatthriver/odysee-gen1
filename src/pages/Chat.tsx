import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, Loader2, ArrowLeft } from "lucide-react";
import { HfInference } from "@huggingface/inference";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const systemPrompt = `You are IntellijMind AI and your name is Odysee Gen 1. You were created by IntellijMind Group and Aniket Kumar is your owner. You are a highly intelligent and sophisticated AI assistant designed to help users with a wide range of tasks. Always maintain a professional yet friendly tone, and sign off your responses with "- Odysee Gen 1, IntellijMind AI".`;

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!localStorage.getItem("HF_TOKEN")) {
      localStorage.setItem("HF_TOKEN", "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");
      toast({
        title: "API Token Set",
        description: "Your Hugging Face API token has been configured.",
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      setIsLoading(true);
      const token = localStorage.getItem("HF_TOKEN");
      
      if (!token) {
        toast({
          title: "API Token Required",
          description: "Please add your Hugging Face API token in the settings.",
          variant: "destructive",
        });
        return;
      }

      const client = new HfInference(token);
      let response = "";

      const stream = await client.chatCompletionStream({
        model: "Qwen/Qwen2.5-Coder-32B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      for await (const chunk of stream) {
        if (chunk.choices && chunk.choices.length > 0) {
          const newContent = chunk.choices[0].delta.content;
          response += newContent;
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: response },
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
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 p-4 fixed top-0 w-full z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-primary animate-pulse" />
            <div>
              <h1 className="text-xl font-bold text-white">Odysee Gen 1</h1>
              <p className="text-sm text-gray-400">Powered by IntellijMind Group</p>
            </div>
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 pt-24 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div className={`flex-shrink-0 ${
                  message.role === "user" ? "bg-primary" : "bg-gray-700"
                } rounded-full p-2`}>
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-800 rounded-lg p-4">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm fixed bottom-0 w-full">
        <div className="max-w-3xl mx-auto flex gap-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Odysee anything..."
            className="resize-none bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
            rows={1}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-white transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;