import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  Award, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Zap, 
  Brain, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Users, 
  BarChart2, 
  ChevronRight, 
  X, 
  Calendar, 
  Star 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../../../lib/store';
import { analyzeBizDecision } from '../../../lib/api/ai-tools';
import confetti from 'canvas-confetti';

interface Scenario {
  id: string;
  title: string;
  category: 'pricing' | 'marketing' | 'operations' | 'finance' | 'team';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  situation: string;
  options: {
    id: string;
    text: string;
  }[];
  xpReward: number;
}

interface Decision {
  scenarioId: string;
  optionId: string;
  optionText: string;
}

interface DecisionImpact {
  revenue: number;
  customerSatisfaction: number;
  teamMorale: number;
  cashflow: number;
  reasoning: string;
  consequences: string[];
  advice: string;
  score: number;
}

interface GameHistory {
  id: string;
  scenario: string;
  decision: string;
  score: number;
  date: string;
  xpEarned: number;
}

export default function MindMaze() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  const [step, setStep] = useState<'scenarios' | 'decision' | 'results'>('scenarios');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decisionImpact, setDecisionImpact] = useState<DecisionImpact | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Sample scenarios
  const scenarios: Scenario[] = [
    {
      id: 'pricing-1',
      title: 'Product Pricing Strategy',
      category: 'pricing',
      difficulty: 'beginner',
      situation: "You've created a new eco-friendly water bottle. Your production cost is ₹150 per bottle. Your competitors sell similar products for ₹250-350. How should you price your product for launch?",
      options: [
        { id: 'p1-a', text: 'Price low at ₹200 to attract customers' },
        { id: 'p1-b', text: 'Price at ₹300 to match competitors' },
        { id: 'p1-c', text: 'Price high at ₹400 as a premium product' },
        { id: 'p1-d', text: 'Offer two versions: basic (₹200) and premium (₹350)' }
      ],
      xpReward: 25
    },
    {
      id: 'marketing-1',
      title: 'Marketing Channel Decision',
      category: 'marketing',
      difficulty: 'intermediate',
      situation: 'You have ₹10,000 to spend on marketing your new app for students. Where should you invest this budget for the best results?',
      options: [
        { id: 'm1-a', text: 'Social media ads targeting students' },
        { id: 'm1-b', text: 'Influencer partnerships with education content creators' },
        { id: 'm1-c', text: 'School visits and direct marketing' },
        { id: 'm1-d', text: 'Split the budget across multiple channels' }
      ],
      xpReward: 35
    },
    {
      id: 'operations-1',
      title: 'Production Dilemma',
      category: 'operations',
      difficulty: 'advanced',
      situation: 'Your product is selling faster than you can make it. You have a 2-week backlog of orders. What should you do?',
      options: [
        { id: 'o1-a', text: 'Hire more staff to increase production' },
        { id: 'o1-b', text: 'Invest in automation to speed up production' },
        { id: 'o1-c', text: 'Raise prices to slow down demand' },
        { id: 'o1-d', text: 'Partner with another company to help with production' }
      ],
      xpReward: 45
    },
    {
      id: 'finance-1',
      title: 'Unexpected Expense',
      category: 'finance',
      difficulty: 'intermediate',
      situation: 'Your main supplier just raised prices by 20%, which will reduce your profit margin. How do you respond?',
      options: [
        { id: 'f1-a', text: 'Raise your prices to maintain your margin' },
        { id: 'f1-b', text: 'Find a new, cheaper supplier' },
        { id: 'f1-c', text: 'Absorb the cost temporarily while looking for alternatives' },
        { id: 'f1-d', text: 'Redesign your product to use less expensive materials' }
      ],
      xpReward: 30
    },
    {
      id: 'team-1',
      title: 'Team Conflict',
      category: 'team',
      difficulty: 'beginner',
      situation: 'Two of your team members disagree on the direction of your project and have stopped collaborating. How do you handle this?',
      options: [
        { id: 't1-a', text: 'Have a team meeting to discuss and vote on the direction' },
        { id: 't1-b', text: 'Meet with each person individually, then make the decision yourself' },
        { id: 't1-c', text: 'Bring in a neutral third party to mediate' },
        { id: 't1-d', text: 'Assign them to different parts of the project to avoid conflict' }
      ],
      xpReward: 20
    }
  ];
  
  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('mindMazeHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setGameHistory(history);
      
      // Calculate total XP
      const totalXp = history.reduce((sum: number, game: GameHistory) => sum + game.xpEarned, 0);
      setTotalXpEarned(totalXp);
    }
  }, []);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    if (gameHistory.length > 0) {
      localStorage.setItem('mindMazeHistory', JSON.stringify(gameHistory));
    }
  }, [gameHistory]);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };
  
  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setStep('decision');
    setSelectedOption(null);
    setDecisionImpact(null);
  };
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleSubmitDecision = async () => {
    if (!selectedScenario || !selectedOption) {
      setError('Please select an option');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const selectedOptionObj = selectedScenario.options.find(opt => opt.id === selectedOption);
      if (!selectedOptionObj) throw new Error('Option not found');
      
      // In a real implementation, this would call the OpenAI API
      // For now, we'll simulate a response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock impact
      const mockImpact: DecisionImpact = {
        revenue: Math.floor(Math.random() * 100) - 50,
        customerSatisfaction: Math.floor(Math.random() * 100) - 50,
        teamMorale: Math.floor(Math.random() * 100) - 50,
        cashflow: Math.floor(Math.random() * 100) - 50,
        reasoning: `You chose to ${selectedOptionObj.text.toLowerCase()}. This decision impacts various aspects of your business in different ways.`,
        consequences: [
          'Your decision will affect customer perception of your brand.',
          'This approach may impact your cash flow in the short term.',
          'Your team will need to adjust to this new direction.'
        ],
        advice: 'Consider monitoring the results closely and be prepared to adjust your strategy if needed.',
        score: Math.floor(Math.random() * 40) + 60 // 60-100
      };
      
      setDecisionImpact(mockImpact);
      setStep('results');
      
      // Calculate XP earned
      const baseXP = selectedScenario.xpReward;
      const bonusXP = Math.floor(mockImpact.score / 10); // 0-10 bonus XP based on score
      const totalXP = baseXP + bonusXP;
      
      setXpEarned(totalXP);
      
      // Add to history
      const newHistoryItem: GameHistory = {
        id: Date.now().toString(),
        scenario: selectedScenario.title,
        decision: selectedOptionObj.text,
        score: mockImpact.score,
        date: new Date().toISOString(),
        xpEarned: totalXP
      };
      
      setGameHistory(prev => [newHistoryItem, ...prev]);
      setTotalXpEarned(prev => prev + totalXP);
      
      // Show confetti for good scores
      if (mockImpact.score >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
    } catch (err) {
      console.error('Error analyzing decision:', err);
      setError('Failed to analyze your decision. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetGame = () => {
    setStep('scenarios');
    setSelectedScenario(null);
    setSelectedOption(null);
    setDecisionImpact(null);
    setXpEarned(0);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pricing':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'marketing':
        return <Target className="h-5 w-5 text-purple-600" />;
      case 'operations':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'finance':
        return <BarChart2 className="h-5 w-5 text-amber-600" />;
      case 'team':
        return <Users className="h-5 w-5 text-red-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getImpactColor = (value: number) => {
    if (value >= 30) return 'text-green-600';
    if (value >= 10) return 'text-green-500';
    if (value >= -10) return 'text-gray-500';
    if (value >= -30) return 'text-red-500';
    return 'text-red-600';
  };
  
  const getImpactIcon = (value: number) => {
    if (value >= 10) return <TrendingUp className="h-4 w-4" />;
    if (value <= -10) return <TrendingUp className="h-4 w-4 transform rotate-180" />;
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => {
              if (step === 'scenarios') {
                navigate('/dashboard/ai-tools');
              } else {
                resetGame();
              }
            }}
            className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Gamepad2 className="h-6 w-6 text-amber-600 mr-2" />
              MindMaze
            </h1>
            <p className="text-gray-500 mt-1">
              Entrepreneurial thinking & strategy game
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                <Award className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">XP Earned</p>
                <p className="text-sm font-bold text-amber-700">{totalXpEarned} XP</p>
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                <Brain className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-amber-600 font-medium">Decisions</p>
                <p className="text-sm font-bold text-amber-700">{gameHistory.length}</p>
              </div>
            </div>
          </div>
          
          {step === 'scenarios' && (
            <button
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Decision History
            </button>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {step === 'scenarios' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Scenarios</h2>
            
            {selectedCategory ? (
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back to Categories
                  </button>
                </div>
                
                {scenarios
                  .filter(scenario => scenario.category === selectedCategory)
                  .map((scenario) => (
                    <div
                      key={scenario.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors cursor-pointer"
                      onClick={() => handleScenarioSelect(scenario)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                          {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{scenario.situation}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          {getCategoryIcon(scenario.category)}
                          <span className="ml-1 capitalize">{scenario.category}</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>{scenario.xpReward} XP reward</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['pricing', 'marketing', 'operations', 'finance', 'team'].map((category) => (
                  <div
                    key={category}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-colors cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-amber-100 mb-4">
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 capitalize">{category}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {category === 'pricing' && 'Set the right price for your products'}
                      {category === 'marketing' && 'Promote your business effectively'}
                      {category === 'operations' && 'Run your business efficiently'}
                      {category === 'finance' && 'Make smart money decisions'}
                      {category === 'team' && 'Build and manage your team'}
                    </p>
                    <div className="mt-4 flex items-center text-amber-600">
                      <span className="text-sm font-medium">Explore</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {step === 'decision' && selectedScenario && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{selectedScenario.title}</h2>
            
            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <div className="flex items-start">
                {getCategoryIcon(selectedScenario.category)}
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900 mb-2">Scenario:</h3>
                  <p className="text-gray-700">{selectedScenario.situation}</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-md font-medium text-gray-900 mb-4">What would you do?</h3>
            
            <div className="space-y-3 mb-6">
              {selectedScenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedOption === option.id
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`h-5 w-5 rounded-full border ${
                      selectedOption === option.id
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-gray-300'
                    } mr-3 flex-shrink-0`}>
                      {selectedOption === option.id && (
                        <CheckCircle className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={resetGame}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDecision}
                disabled={isAnalyzing || !selectedOption}
                className="flex items-center px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Submit Decision
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {step === 'results' && selectedScenario && decisionImpact && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{selectedScenario.title}</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                decisionImpact.score >= 80 ? 'bg-green-100 text-green-800' :
                decisionImpact.score >= 60 ? 'bg-blue-100 text-blue-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                Score: {decisionImpact.score}/100
              </span>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-6 mb-6">
              <div className="flex items-start">
                {getCategoryIcon(selectedScenario.category)}
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900 mb-2">Your Decision:</h3>
                  <p className="text-gray-700">
                    {selectedScenario.options.find(opt => opt.id === selectedOption)?.text}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Impact Analysis */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Business Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Revenue</h4>
                    <div className={`flex items-center ${getImpactColor(decisionImpact.revenue)}`}>
                      {getImpactIcon(decisionImpact.revenue)}
                      <span className="ml-1">{decisionImpact.revenue > 0 ? '+' : ''}{decisionImpact.revenue}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        decisionImpact.revenue >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(decisionImpact.revenue), 50) * 2}%`,
                        marginLeft: decisionImpact.revenue < 0 ? 'auto' : undefined,
                        marginRight: decisionImpact.revenue >= 0 ? 'auto' : undefined
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Customer Satisfaction</h4>
                    <div className={`flex items-center ${getImpactColor(decisionImpact.customerSatisfaction)}`}>
                      {getImpactIcon(decisionImpact.customerSatisfaction)}
                      <span className="ml-1">{decisionImpact.customerSatisfaction > 0 ? '+' : ''}{decisionImpact.customerSatisfaction}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        decisionImpact.customerSatisfaction >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(decisionImpact.customerSatisfaction), 50) * 2}%`,
                        marginLeft: decisionImpact.customerSatisfaction < 0 ? 'auto' : undefined,
                        marginRight: decisionImpact.customerSatisfaction >= 0 ? 'auto' : undefined
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Team Morale</h4>
                    <div className={`flex items-center ${getImpactColor(decisionImpact.teamMorale)}`}>
                      {getImpactIcon(decisionImpact.teamMorale)}
                      <span className="ml-1">{decisionImpact.teamMorale > 0 ? '+' : ''}{decisionImpact.teamMorale}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        decisionImpact.teamMorale >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(decisionImpact.teamMorale), 50) * 2}%`,
                        marginLeft: decisionImpact.teamMorale < 0 ? 'auto' : undefined,
                        marginRight: decisionImpact.teamMorale >= 0 ? 'auto' : undefined
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Cash Flow</h4>
                    <div className={`flex items-center ${getImpactColor(decisionImpact.cashflow)}`}>
                      {getImpactIcon(decisionImpact.cashflow)}
                      <span className="ml-1">{decisionImpact.cashflow > 0 ? '+' : ''}{decisionImpact.cashflow}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        decisionImpact.cashflow >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(decisionImpact.cashflow), 50) * 2}%`,
                        marginLeft: decisionImpact.cashflow < 0 ? 'auto' : undefined,
                        marginRight: decisionImpact.cashflow >= 0 ? 'auto' : undefined
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Analysis */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Analysis</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-gray-700 mb-4">{decisionImpact.reasoning}</p>
                
                <h4 className="font-medium text-gray-900 mb-2">Consequences:</h4>
                <ul className="space-y-2 mb-4">
                  {decisionImpact.consequences.map((consequence, index) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{consequence}</span>
                    </li>
                  ))}
                </ul>
                
                <h4 className="font-medium text-gray-900 mb-2">Expert Advice:</h4>
                <div className="bg-amber-50 rounded-lg p-4">
                  <p className="text-gray-700">{decisionImpact.advice}</p>
                </div>
              </div>
            </div>
            
            {/* XP Earned */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Decision made! You earned:</h3>
                    <p className="text-xl font-bold">{xpEarned} XP</p>
                  </div>
                </div>
                
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  New Scenario
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Decision History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {gameHistory.length > 0 ? (
                <div className="space-y-4">
                  {gameHistory.map((game) => (
                    <div key={game.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{game.scenario}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          game.score >= 80 ? 'bg-green-100 text-green-800' :
                          game.score >= 60 ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          Score: {game.score}/100
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">Decision: {game.decision}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{new Date(game.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-amber-600 font-medium">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>{game.xpEarned} XP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No decisions yet. Start playing to build your history!
                </p>
              )}
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHistory(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}