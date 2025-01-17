import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ModelSelector } from '@/components/chat/ModelSelector';
import { SidebarProvider } from '@/components/ui/sidebar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('qwen');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  const abortController = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!chatId) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('timestamp', { ascending: true });

        if (error) {
          toast({
            title: 'Error loading chat history',
            description: error.message,
            variant: 'destructive',
          });
          return;
        }
        
        if (data) setMessages(data);
      } catch (error) {
        toast({
          title: 'Error loading chat history',
          description: 'Failed to load chat history. Please try again.',
          variant: 'destructive',
        });
      }
    };

    loadChatHistory();
  }, [chatId, supabase, toast]);

  const stopGeneration = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setIsLoading(false);
      toast({
        title: 'Generation stopped',
        description: 'The response generation was stopped.',
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      setIsLoading(true);
      abortController.current = new AbortController();

      if (chatId) {
        await supabase.from('messages').insert({
          chat_id: chatId,
          ...newMessage
        });
      }

      const response = await fetch(`/api/chat/${selectedModel}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input.trim() }),
        signal: abortController.current.signal
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (chatId) {
        await supabase.from('messages').insert({
          chat_id: chatId,
          ...assistantMessage
        });
      }

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          toast({
            title: 'Generation stopped',
            description: 'The response generation was stopped.',
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to get response from AI.',
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsLoading(false);
      abortController.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen overflow-hidden bg-gray-900">
        <ChatSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="border-b border-gray-800 p-4 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 sticky top-0 z-10">
            <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
              <h1 className="text-xl font-bold text-white">Chat</h1>
              <ModelSelector value={selectedModel} onChange={setSelectedModel} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-16">
                  <h2 className="text-2xl font-bold mb-2">Welcome to Chat</h2>
                  <p className="text-lg mb-4">Start a conversation with AI</p>
                  <p className="text-sm">Select a model and type your message below</p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <ChatMessage key={index} {...message} />
                ))
              )}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </main>

          <footer className="border-t border-gray-800 p-4 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75 sticky bottom-0">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
                className="resize-none bg-gray-800/90 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary min-h-[60px] transition-colors"
                rows={1}
                disabled={isLoading}
              />
              {isLoading ? (
                <Button
                  type="button"
                  onClick={stopGeneration}
                  variant="destructive"
                  size="icon"
                  className="shrink-0 h-[60px] hover:bg-red-600/90 transition-colors"
                >
                  <StopCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  variant="default"
                  size="icon"
                  className="shrink-0 bg-primary hover:bg-primary/90 h-[60px] transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </form>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Chat;