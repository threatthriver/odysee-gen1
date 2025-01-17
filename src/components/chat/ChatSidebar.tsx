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
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  React.useEffect(() => {
    const fetchChatHistory = async () => {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setChatHistory(data);
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
          {chatHistory.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start gap-2 text-left"
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="truncate">{chat.title}</span>
            </Button>
          ))}
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