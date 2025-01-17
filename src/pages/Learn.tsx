import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bot, Code, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Learn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Learn About Our AI Models</h1>

          <div className="grid gap-8">
            <div className="bg-gray-800/50 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Bot className="w-8 h-8 text-blue-400" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Qwen 2.5 Coder</h2>
                  <p className="text-gray-300 mb-4">
                    Qwen 2.5 Coder is our primary model, specifically trained for software development and technical discussions. It excels at:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Understanding and generating code across multiple programming languages</li>
                    <li>Debugging and problem-solving</li>
                    <li>Explaining technical concepts clearly</li>
                    <li>Following best practices and patterns</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 text-purple-400" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Claude 3 (Experimental)</h2>
                  <p className="text-gray-300 mb-4">
                    Claude 3 is our experimental model, pushing the boundaries of AI capabilities. Features include:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Enhanced creative problem-solving</li>
                    <li>Advanced natural language understanding</li>
                    <li>Improved context retention</li>
                    <li>Better handling of complex queries</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-green-400" />
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-4">Safety & Limitations</h2>
                  <p className="text-gray-300 mb-4">
                    Important information about our AI models:
                  </p>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    <li>Models may occasionally produce incorrect information</li>
                    <li>Response quality can vary based on input clarity</li>
                    <li>Models follow strict ethical guidelines</li>
                    <li>Regular updates improve accuracy and capabilities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/chat">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Code className="w-5 h-5 mr-2" />
                Start Coding with AI
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;