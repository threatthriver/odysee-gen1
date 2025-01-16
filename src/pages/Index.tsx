import { Link } from "react-router-dom";
import { Bot, MessageSquare, Code, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <Bot className="w-20 h-20 text-primary animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Meet Odysee Gen 1
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your intelligent AI companion, powered by IntellijMind Group. Experience the future of conversation.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/chat">
              <Button size="lg" className="animate-scale-in">
                <MessageSquare className="mr-2" />
                Start Chatting
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <MessageSquare className="w-8 h-8 text-primary" />,
              title: "Natural Conversations",
              description: "Engage in fluid, context-aware conversations with advanced language understanding."
            },
            {
              icon: <Code className="w-8 h-8 text-primary" />,
              title: "Code Support",
              description: "Get help with coding questions with syntax highlighting and markdown support."
            },
            {
              icon: <Sparkles className="w-8 h-8 text-primary" />,
              title: "Smart Responses",
              description: "Powered by state-of-the-art AI to provide accurate and helpful information."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 hover:border-primary transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                {feature.icon}
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>© 2024 IntellijMind Group. All rights reserved.</p>
            <p className="mt-2">Created by Aniket Kumar</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;