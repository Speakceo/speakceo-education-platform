import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  Brain, 
  FileEdit, 
  Gamepad2, 
  Presentation, 
  Sparkles, 
  Trophy, 
  Clock, 
  ArrowRight, 
  Star, 
  Zap, 
  Rocket 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserStore, useProgressStore, useAIToolsStore, useUnifiedProgressStore } from '../../../lib/store';
import confetti from 'canvas-confetti';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
  xpPerUse: number;
  usageCount: number;
  lastUsed?: string;
}

export default function AIToolsHome() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { getOverallProgress } = useProgressStore();
  const { tools, getTotalXPEarned, getMostUsedTools } = useAIToolsStore();
  const { recordActivity } = useUnifiedProgressStore();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [recentlyUnlocked, setRecentlyUnlocked] = useState<string | null>(null);
  
  const overallProgress = getOverallProgress();
  const totalXpEarned = getTotalXPEarned();
  
  const toolsConfig: AITool[] = [
    {
      id: 'speak-smart',
      name: 'SpeakSmart',
      description: 'AI Public Speaking & Communication Coach',
      icon: Mic,
      path: '/dashboard/ai-tools/speak-smart',
      color: 'from-blue-500 to-indigo-600',
      xpPerUse: 25,
      usageCount: tools['speak-smart']?.usageCount || 0,
      lastUsed: tools['speak-smart']?.lastUsed || undefined
    },
    {
      id: 'math-mentor',
      name: 'MathMentor',
      description: 'Smart Math Solver & Business Concept Trainer',
      icon: Brain,
      path: '/dashboard/ai-tools/math-mentor',
      color: 'from-green-500 to-teal-600',
      xpPerUse: 20,
      usageCount: tools['math-mentor']?.usageCount || 0,
      lastUsed: tools['math-mentor']?.lastUsed || undefined
    },
    {
      id: 'write-right',
      name: 'WriteRight',
      description: 'Business Writing & Creativity Assistant',
      icon: FileEdit,
      path: '/dashboard/ai-tools/write-right',
      color: 'from-purple-500 to-pink-600',
      xpPerUse: 15,
      usageCount: tools['write-right']?.usageCount || 0,
      lastUsed: tools['write-right']?.lastUsed || undefined
    },
    {
      id: 'mind-maze',
      name: 'MindMaze',
      description: 'Entrepreneurial Thinking & Strategy Game',
      icon: Gamepad2,
      path: '/dashboard/ai-tools/mind-maze',
      color: 'from-amber-500 to-orange-600',
      xpPerUse: 30,
      usageCount: tools['mind-maze']?.usageCount || 0,
      lastUsed: tools['mind-maze']?.lastUsed || undefined
    },
    {
      id: 'pitch-deck',
      name: 'PitchDeck Creator',
      description: 'AI Business Presentation Builder',
      icon: Presentation,
      path: '/dashboard/ai-tools/pitch-deck',
      color: 'from-red-500 to-rose-600',
      xpPerUse: 35,
      usageCount: tools['pitch-deck']?.usageCount || 0,
      lastUsed: tools['pitch-deck']?.lastUsed || undefined
    }
  ];
  
  // Check for newly unlocked tools
  useEffect(() => {
    const checkNewlyUnlocked = () => {
      const lastProgress = parseInt(localStorage.getItem('lastAIToolsProgress') || '0');
      
      if (lastProgress < overallProgress) {
        // Find tools that were locked but are now unlocked
        const newlyUnlocked = toolsConfig.find(tool => 
          tool.id === 'pitch-deck' && lastProgress < 40 && overallProgress >= 40
        );
        
        if (newlyUnlocked) {
          setRecentlyUnlocked(newlyUnlocked.id);
          setShowConfetti(true);
          
          // Trigger confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          
          // Record activity
          recordActivity({
            type: 'ai-tool',
            title: `Unlocked ${newlyUnlocked.name}`,
            xpEarned: 50 // Bonus XP for unlocking a new tool
          });
          
          // Clear after 5 seconds
          setTimeout(() => {
            setRecentlyUnlocked(null);
            setShowConfetti(false);
          }, 5000);
        }
      }
      
      // Save current progress
      localStorage.setItem('lastAIToolsProgress', overallProgress.toString());
    };
    
    checkNewlyUnlocked();
  }, [overallProgress, toolsConfig, recordActivity]);
  
  const handleToolClick = (tool: AITool) => {
    // Record tool usage in unified progress
    recordActivity({
      type: 'ai-tool',
      title: `Used ${tool.name}`,
      xpEarned: 5 // Small XP for just opening the tool
    });
    
    navigate(tool.path);
  };
  
  // Get tools sorted by usage
  const mostUsedTools = getMostUsedTools().slice(0, 3);
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-6 w-6 text-indigo-600 mr-2" />
            AI Tools
          </h1>
          <p className="text-gray-500 mt-1">
            Supercharge your learning with AI-powered tools designed for young entrepreneurs
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 rounded-xl p-3 flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Trophy className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-medium">AI Tools XP</p>
                <p className="text-lg font-bold text-indigo-700">{totalXpEarned} XP</p>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-3 flex items-center">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-medium">AI Tools Streak</p>
                <p className="text-lg font-bold text-indigo-700">3 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newly Unlocked Tool Alert */}
      {recentlyUnlocked && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">New AI Tool Unlocked!</h2>
              <p className="text-indigo-100">
                You've unlocked {toolsConfig.find(t => t.id === recentlyUnlocked)?.name}! Try it out now to boost your entrepreneurial skills.
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => navigate(toolsConfig.find(t => t.id === recentlyUnlocked)?.path || '')}
              className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Try It Now
            </button>
          </div>
        </motion.div>
      )}
      
      {/* AI Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {toolsConfig.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.03 }}
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-md ${recentlyUnlocked === tool.id ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={() => handleToolClick(tool)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                <tool.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center px-3 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">
                <Zap className="h-3 w-3 mr-1" />
                +{tool.xpPerUse} XP per use
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
            <p className="text-gray-500 mb-4">{tool.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 text-amber-400 mr-1" />
                Used {tool.usageCount} times
              </div>
              
              <button 
                className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Launch Tool
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Most Used Tools */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Most Used Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mostUsedTools.length > 0 ? (
            mostUsedTools.map((tool, index) => {
              const toolConfig = toolsConfig.find(t => t.id === tool.id);
              if (!toolConfig) return null;
              
              return (
                <div 
                  key={tool.id}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(toolConfig.path)}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-lg font-bold text-indigo-600">#{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-500">Used {tool.usageCount} times</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              You haven't used any AI tools yet. Try them out to boost your learning!
            </div>
          )}
        </div>
      </div>
      
      {/* AI Tools Benefits */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold mb-6">How AI Tools Boost Your Learning</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-medium mb-2">Accelerated Learning</h3>
            <p className="text-sm text-indigo-100">Get personalized feedback and guidance to learn faster</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-medium mb-2">Practical Skills</h3>
            <p className="text-sm text-indigo-100">Apply concepts in real-world scenarios with AI assistance</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-medium mb-2">Earn XP & Rewards</h3>
            <p className="text-sm text-indigo-100">Gain experience points and unlock achievements</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-medium mb-2">Creative Exploration</h3>
            <p className="text-sm text-indigo-100">Experiment with ideas in a safe, AI-guided environment</p>
          </div>
        </div>
      </div>
    </div>
  );
}