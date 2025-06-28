import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Smile, 
  Save,
  Brain,
  Clock,
  VolumeX,
  Volume2,
  RefreshCw,
  ChevronRight,
  X
} from 'lucide-react';
import { generateAIResponse, generateSpeech } from '../../lib/openai';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  category?: string;
  audioUrl?: string;
}

const categories = [
  {
    name: 'Entrepreneurship',
    icon: Brain,
    color: 'bg-blue-500',
    examples: [
      'How do I validate my business idea?',
      'What makes a good startup pitch?',
      'How to create a business plan?'
    ]
  },
  {
    name: 'Public Speaking',
    icon: MessageSquare,
    color: 'bg-purple-500',
    examples: [
      'Tips for confident presentations',
      'How to structure a pitch?',
      'Dealing with stage fright'
    ]
  },
  {
    name: 'Financial Literacy',
    icon: Clock,
    color: 'bg-green-500',
    examples: [
      'How to calculate profit margins?',
      'Creating a startup budget',
      'Understanding revenue models'
    ]
  }
];

export default function AILearningCoach({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'ai',
    content: "Hi! I'm your AI Learning Coach. I can help you with business, public speaking, and entrepreneurship. What would you like to learn about?"
  }]);
  const [input, setInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState<{ [key: string]: boolean }>({});
  const [audioElements, setAudioElements] = useState<{ [key: string]: HTMLAudioElement }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      category: selectedCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Generate AI response
      const aiResponse = await generateAIResponse(input, selectedCategory || 'General');
      
      // Generate speech for the response
      const audioUrl = await generateSpeech(aiResponse);

      const newMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        category: selectedCategory,
        audioUrl
      };

      setMessages(prev => [...prev, newMessage]);

      // Create audio element
      const audio = new Audio(audioUrl);
      setAudioElements(prev => ({ ...prev, [newMessage.id]: audio }));

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I apologize, but I encountered an error. Please try asking your question again.",
        category: selectedCategory
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleAudio = (messageId: string) => {
    const audio = audioElements[messageId];
    if (!audio) return;

    if (isPlaying[messageId]) {
      audio.pause();
      setIsPlaying(prev => ({ ...prev, [messageId]: false }));
    } else {
      // Stop any currently playing audio
      Object.entries(audioElements).forEach(([id, element]) => {
        if (id !== messageId) {
          element.pause();
          setIsPlaying(prev => ({ ...prev, [id]: false }));
        }
      });

      audio.play();
      setIsPlaying(prev => ({ ...prev, [messageId]: true }));

      // Handle audio completion
      audio.onended = () => {
        setIsPlaying(prev => ({ ...prev, [messageId]: false }));
      };
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Learning Coach</h2>
                <p className="text-sm text-gray-500">Ask me anything about business & entrepreneurship</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="prose max-w-none">
                  {message.content.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
                {message.type === 'ai' && message.audioUrl && (
                  <button
                    onClick={() => toggleAudio(message.id)}
                    className="mt-2 flex items-center text-indigo-600 hover:text-indigo-700"
                  >
                    {isPlaying[message.id] ? (
                      <VolumeX className="h-5 w-5 mr-1" />
                    ) : (
                      <Volume2 className="h-5 w-5 mr-1" />
                    )}
                    {isPlaying[message.id] ? 'Stop' : 'Listen'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-gray-500">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span className="text-sm">AI is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Example Questions */}
        {selectedCategory && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-sm font-medium text-gray-700 mb-2">Example questions:</p>
            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.find(c => c.name === selectedCategory)?.examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="flex items-center space-x-1 px-3 py-1 bg-white rounded-full text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors whitespace-nowrap border border-gray-200"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span>{example}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              maxLength={200}
            />
            <button
              onClick={handleSend}
              disabled={isTyping || !input.trim()}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {200 - input.length} characters remaining
          </p>
        </div>
      </div>
    </div>
  );
}