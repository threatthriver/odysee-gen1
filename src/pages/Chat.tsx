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
      if (chatId) {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('timestamp', { ascending: true });

        if (!error && data) {
          setMessages(data);
        }
      }
    };

    loadChatHistory();
  }, [chatId, supabase]);

  const stopGeneration = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
      setIsLoading(false);
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

      // Save message to Supabase
      await supabase.from('messages').insert({
        chat_id: chatId || 'new',
        ...newMessage
      });

      // API call based on selected model
      const response = selectedModel === 'qwen' 
        ? await fetch('/api/chat/qwen', {
            method: 'POST',
            body: JSON.stringify({ message: input.trim() }),
            signal: abortController.current.signal
          })
        : await fetch('/api/chat/claude', {
            method: 'POST',
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

      // Save assistant message to Supabase
      await supabase.from('messages').insert({
        chat_id: chatId || 'new',
        ...assistantMessage
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
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
          <header className="border-b border-gray-800 p-4 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
            <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
              <h1 className="text-xl font-bold text-white">Chat</h1>
              <ModelSelector value={selectedModel} onChange={setSelectedModel} />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} {...message} />
              ))}
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

          <footer className="border-t border-gray-800 p-4 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/75">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
                className="resize-none bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
                rows={1}
                disabled={isLoading}
              />
              {isLoading ? (
                <Button
                  type="button"
                  onClick={stopGeneration}
                  variant="destructive"
                  size="icon"
                  className="shrink-0"
                >
                  <StopCircle className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  variant="default"
                  size="icon"
                  className="shrink-0 bg-primary hover:bg-primary/90"
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