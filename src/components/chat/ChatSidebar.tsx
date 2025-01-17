import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Plus, Settings, History, Search, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { cn } from '@/lib/utils';

interface ChatHistory {
  id: string;
  title: string;
  created_at: string;
}

export const ChatSidebar = () => {
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { state: sidebarState } = useSidebar();

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

  const filteredHistory = chatHistory.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-4 space-y-4">
        <Button 
          onClick={() => navigate('/chat')} 
          className="w-full gap-2 bg-primary hover:bg-primary/90 text-white"
          size="default"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <div className={cn(
          "space-y-2 transition-opacity duration-200",
          sidebarState === "collapsed" ? "opacity-0" : "opacity-100"
        )}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i}
                className="h-10 bg-gray-800 rounded animate-pulse"
              />
            ))
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="w-full justify-start gap-2 text-left hover:bg-gray-800/50"
                onClick={() => navigate(`/chat/${chat.id}`)}
              >
                <MessageSquare className="w-4 h-4" />
                <span className="truncate">{chat.title}</span>
              </Button>
            ))
          ) : searchQuery ? (
            <div className="text-center text-gray-500 py-4">
              No chats found
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No chat history
            </div>
          )}
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between gap-2">
          <Button variant="ghost" size="icon" className="hover:bg-gray-800/50">
            <History className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-800/50">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-gray-800/50">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};