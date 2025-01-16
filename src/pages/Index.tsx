import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Experience the Power of AI Chat
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Engage in natural conversations with our advanced AI assistant powered by
            state-of-the-art language models.
          </p>
          <Button
            onClick={() => navigate("/chat")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full"
          >
            Start Chatting Now
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            title="Natural Conversations"
            description="Engage in fluid, context-aware discussions that feel natural and intuitive."
            icon="💬"
          />
          <FeatureCard
            title="Code Understanding"
            description="Get help with coding questions and technical discussions with ease."
            icon="💻"
          />
          <FeatureCard
            title="24/7 Availability"
            description="Access your AI assistant whenever you need it, day or night."
            icon="⚡"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Index;