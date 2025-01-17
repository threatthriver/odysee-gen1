import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Settings, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface ChatHistory {
  id: string;
  title: string;
  created_at: string;
}

export const ChatSidebar = () => {
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  React.useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('chat_history')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching chat history:', error);
          return;
        }

        setChatHistory(data || []);
      } catch (error) {
        console.error('Error in fetchChatHistory:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [supabase]);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Button 
          onClick={() => navigate('/chat')} 
          className="w-full gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <div className="space-y-2">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className="h-10 bg-gray-800 rounded animate-pulse"
              />
            ))
          ) : chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start gap-2 text-left"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No chat history
            </div>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <History className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};