import { Link } from "react-router-dom";
import { 
  Bot, 
  MessageSquare, 
  Code, 
  Sparkles, 
  ArrowRight, 
  Users, 
  Zap,
  Brain,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Index = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Odysee has transformed how I work. The responses are incredibly precise and helpful.",
      author: "Sarah Johnson",
      role: "Software Developer"
    },
    {
      text: "The code support feature is outstanding. It's like having a senior developer by your side.",
      author: "Michael Chen",
      role: "Full Stack Engineer"
    },
    {
      text: "Natural conversations and smart responses make complex problems simple to solve.",
      author: "Emma Davis",
      role: "Product Manager"
    }
  ];

  const stats = [
    { value: "95%", label: "Response Rate" },
    { value: "24/7", label: "Availability" },
    { value: "20+", label: "Languages" },
    { value: "10k+", label: "Users" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex justify-center">
            <Bot className="w-20 h-20 text-gray-300 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Meet Odysee Gen 1
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Your intelligent AI companion, powered by IntellijMind Group. Experience the future of conversation.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/chat">
              <Button size="lg" className="bg-gray-700 hover:bg-gray-600 text-white">
                <MessageSquare className="mr-2" />
                Start Chatting
              </Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-800">
                Learn More
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-gray-800/30 rounded-lg backdrop-blur-sm"
            >
              <div className="text-3xl font-bold text-gray-200 mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <MessageSquare className="w-8 h-8 text-gray-300" />,
              title: "Natural Conversations",
              description: "Engage in fluid, context-aware conversations with advanced language understanding."
            },
            {
              icon: <Code className="w-8 h-8 text-gray-300" />,
              title: "Code Support",
              description: "Get help with coding questions with syntax highlighting and markdown support."
            },
            {
              icon: <Sparkles className="w-8 h-8 text-gray-300" />,
              title: "Smart Responses",
              description: "Powered by state-of-the-art AI to provide accurate and helpful information."
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 hover:border-gray-500 transition-colors animate-fade-in"
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

      {/* How it Works Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-12 h-12 text-gray-300" />,
              title: "1. Start a Conversation",
              description: "Begin chatting with Odysee about any topic or problem you need help with."
            },
            {
              icon: <Brain className="w-12 h-12 text-gray-300" />,
              title: "2. AI Processing",
              description: "Our advanced AI analyzes your input and generates relevant, contextual responses."
            },
            {
              icon: <Zap className="w-12 h-12 text-gray-300" />,
              title: "3. Get Smart Solutions",
              description: "Receive accurate, helpful answers and solutions tailored to your needs."
            }
          ].map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              {step.icon}
              <h3 className="text-xl font-semibold text-white">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              {index < 2 && <ChevronRight className="hidden md:block text-gray-500 transform rotate-90 md:rotate-0 mt-4" />}
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What Users Say</h2>
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/50 rounded-lg p-8 backdrop-blur-sm border border-gray-700">
            <p className="text-lg text-gray-300 italic mb-6">
              "{testimonials[activeTestimonial].text}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">
                  {testimonials[activeTestimonial].author}
                </p>
                <p className="text-gray-400">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeTestimonial ? 'bg-gray-300' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience the Future?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our growing community of users who are already transforming their work with Odysee Gen 1.
          </p>
          <Link to="/chat">
            <Button size="lg" className="bg-gray-700 hover:bg-gray-600 text-white">
              Get Started Now
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-semibold mb-4">About</h3>
              <p className="text-gray-400">
                Odysee is an AI-powered platform by IntellijMind Group, designed to make conversations smarter and more productive.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/features" className="block text-gray-400 hover:text-gray-300">Features</Link>
                <Link to="/pricing" className="block text-gray-400 hover:text-gray-300">Pricing</Link>
                <Link to="/docs" className="block text-gray-400 hover:text-gray-300">Documentation</Link>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-gray-300">Twitter</a>
                <a href="#" className="block text-gray-400 hover:text-gray-300">LinkedIn</a>
                <a href="#" className="block text-gray-400 hover:text-gray-300">GitHub</a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 pt-8 border-t border-gray-800">
            <p>© 2024 IntellijMind Group. All rights reserved.</p>
            <p className="mt-2">Created by Aniket Kumar</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;