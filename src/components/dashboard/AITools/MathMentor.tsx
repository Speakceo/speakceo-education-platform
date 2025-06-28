import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Calculator, 
  ArrowLeft, 
  Send, 
  RefreshCw, 
  Sparkles, 
  Lightbulb, 
  Award, 
  Zap, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  X, 
  BarChart2, 
  DollarSign, 
  ShoppingCart, 
  PieChart, 
  Percent, 
  Clock,
  Mic,
  ChevronLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../../../lib/store';
import { solveMathProblem } from '../../../lib/api/ai-tools';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import confetti from 'canvas-confetti';

interface MathProblem {
  id: string;
  question: string;
  category: 'profit-loss' | 'unit-pricing' | 'budgeting' | 'percentages' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

interface MathSolution {
  steps: string[];
  answer: string;
  explanation: string;
  latex?: string;
  visualType?: 'bar' | 'pie' | 'line' | 'none';
  visualData?: any;
}

interface ProblemHistory {
  id: string;
  question: string;
  answer: string;
  date: string;
  category: string;
  xpEarned: number;
}

export default function MathMentor() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  const [inputMethod, setInputMethod] = useState<'text' | 'voice'>('text');
  const [mathInput, setMathInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<MathProblem | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [problemHistory, setProblemHistory] = useState<ProblemHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Sample business math problems
  const businessMathProblems: Record<string, MathProblem[]> = {
    'profit-loss': [
      {
        id: 'pl-1',
        question: 'You bought 50 items at ₹80 each and sold them at ₹110 each. What is your profit percentage?',
        category: 'profit-loss',
        difficulty: 'easy',
        xpReward: 20
      },
      {
        id: 'pl-2',
        question: 'Your business spent ₹25,000 on production and earned ₹32,000 in sales. What is your profit margin as a percentage?',
        category: 'profit-loss',
        difficulty: 'medium',
        xpReward: 30
      },
      {
        id: 'pl-3',
        question: 'You invested ₹50,000 in your business. After one year, you made a profit of ₹12,500. What is your return on investment (ROI) as a percentage?',
        category: 'profit-loss',
        difficulty: 'hard',
        xpReward: 40
      }
    ],
    'unit-pricing': [
      {
        id: 'up-1',
        question: 'A 500g package of cookies costs ₹75. A 750g package costs ₹105. Which package offers better value for money?',
        category: 'unit-pricing',
        difficulty: 'easy',
        xpReward: 20
      },
      {
        id: 'up-2',
        question: 'You can buy raw materials in bulk at ₹2,500 for 100 units or ₹1,350 for 50 units. How much would you save per unit by buying in bulk?',
        category: 'unit-pricing',
        difficulty: 'medium',
        xpReward: 30
      },
      {
        id: 'up-3',
        question: 'Your product costs ₹120 to make and you sell it for ₹200. If you increase production volume, your cost per unit drops by 15%. What would be your new profit margin percentage?',
        category: 'unit-pricing',
        difficulty: 'hard',
        xpReward: 40
      }
    ],
    'budgeting': [
      {
        id: 'bg-1',
        question: 'You have a monthly budget of ₹5,000. If you spend 40% on supplies, 25% on marketing, and 15% on software subscriptions, how much is left for other expenses?',
        category: 'budgeting',
        difficulty: 'easy',
        xpReward: 20
      },
      {
        id: 'bg-2',
        question: 'Your business has a quarterly budget of ₹90,000. If you allocate 30% to salaries, 25% to rent, 20% to inventory, and 15% to marketing, how much remains for unexpected expenses?',
        category: 'budgeting',
        difficulty: 'medium',
        xpReward: 30
      },
      {
        id: 'bg-3',
        question: 'Your startup has ₹200,000 in funding. You plan to spend 35% on product development, 25% on marketing, 20% on operations, and save 10% for emergencies. If your monthly burn rate is ₹15,000, how many months can you operate before needing more funding?',
        category: 'budgeting',
        difficulty: 'hard',
        xpReward: 40
      }
    ],
    'percentages': [
      {
        id: 'pc-1',
        question: 'If you offer a 15% discount on a product priced at ₹800, what is the final price?',
        category: 'percentages',
        difficulty: 'easy',
        xpReward: 20
      },
      {
        id: 'pc-2',
        question: 'Your business grew from 50 customers to 80 customers in one month. What is the percentage increase?',
        category: 'percentages',
        difficulty: 'medium',
        xpReward: 30
      },
      {
        id: 'pc-3',
        question: 'Your product costs ₹250 to make. You want a 40% profit margin on the selling price. What should be your selling price?',
        category: 'percentages',
        difficulty: 'hard',
        xpReward: 40
      }
    ]
  };
  
  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('mathMentorHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setProblemHistory(history);
      
      // Calculate total XP
      const totalXp = history.reduce((sum: number, problem: ProblemHistory) => sum + problem.xpEarned, 0);
      setTotalXpEarned(totalXp);
    }
  }, []);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    if (problemHistory.length > 0) {
      localStorage.setItem('mathMentorHistory', JSON.stringify(problemHistory));
    }
  }, [problemHistory]);
  
  const handleSolve = async () => {
    if (!mathInput.trim() && !selectedProblem) {
      setError('Please enter a math problem or select a quiz problem');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setCurrentStep(0);
    
    try {
      const problem = selectedProblem ? selectedProblem.question : mathInput;
      const category = selectedProblem?.category || 'general';
      
      const solution = await solveMathProblem(problem, category);
      setSolution(solution);
      
      // Calculate XP earned
      const baseXP = selectedProblem?.xpReward || 10;
      setXpEarned(baseXP);
      
      // Add to history
      const newHistoryItem: ProblemHistory = {
        id: Date.now().toString(),
        question: problem,
        answer: solution.answer,
        date: new Date().toISOString(),
        category: category,
        xpEarned: baseXP
      };
      
      setProblemHistory(prev => [newHistoryItem, ...prev]);
      setTotalXpEarned(prev => prev + baseXP);
      
      // Show confetti for quiz problems
      if (selectedProblem) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
    } catch (err) {
      console.error('Error solving math problem:', err);
      setError('Failed to solve the problem. Please try again or rephrase your question.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedProblem(null);
  };
  
  const handleProblemSelect = (problem: MathProblem) => {
    setSelectedProblem(problem);
    setMathInput('');
    setSolution(null);
    setShowQuizzes(false);
  };
  
  const resetProblem = () => {
    setMathInput('');
    setSelectedProblem(null);
    setSolution(null);
    setXpEarned(0);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profit-loss':
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'unit-pricing':
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case 'budgeting':
        return <BarChart2 className="h-5 w-5 text-purple-600" />;
      case 'percentages':
        return <Percent className="h-5 w-5 text-amber-600" />;
      default:
        return <Calculator className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'hard':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/dashboard/ai-tools')}
            className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Brain className="h-6 w-6 text-green-600 mr-2" />
              MathMentor
            </h1>
            <p className="text-gray-500 mt-1">
              Smart math solver and business concept trainer
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-green-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <Award className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-600 font-medium">XP Earned</p>
                <p className="text-sm font-bold text-green-700">{totalXpEarned} XP</p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                <Calculator className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-green-600 font-medium">Problems Solved</p>
                <p className="text-sm font-bold text-green-700">{problemHistory.length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowQuizzes(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Business Math Quizzes
            </button>
            
            <button
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              History
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Problem Input */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProblem ? 'Business Math Quiz' : 'Enter Your Math Problem'}
              </h2>
              
              {selectedProblem && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedProblem.difficulty)}`}>
                  {selectedProblem.difficulty.charAt(0).toUpperCase() + selectedProblem.difficulty.slice(1)}
                </span>
              )}
            </div>
            
            {error && (
              <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {selectedProblem ? (
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <div className="flex items-start">
                  {getCategoryIcon(selectedProblem.category)}
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-900">{selectedProblem.question}</h3>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Zap className="h-3 w-3 mr-1" />
                      <span>Reward: {selectedProblem.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex space-x-2 mb-2">
                    <button
                      onClick={() => setInputMethod('text')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        inputMethod === 'text' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Type
                    </button>
                    <button
                      onClick={() => setInputMethod('voice')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        inputMethod === 'voice' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Voice
                    </button>
                  </div>
                  
                  {inputMethod === 'text' ? (
                    <textarea
                      ref={inputRef}
                      value={mathInput}
                      onChange={(e) => setMathInput(e.target.value)}
                      placeholder="Type your math problem or business calculation here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-6 text-center">
                      <button
                        className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3"
                      >
                        <Mic className="h-8 w-8 text-green-600" />
                      </button>
                      <p className="text-gray-500">Voice input coming soon!</p>
                      <p className="text-xs text-gray-400 mt-1">Please use text input for now</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <p className="text-sm text-gray-500 mr-1">Try asking:</p>
                  {[
                    "What is 15% of 800?",
                    "Calculate profit margin if cost is ₹250 and selling price is ₹400",
                    "If I buy 100 units at ₹20 each and sell at ₹32 each, what's my profit?"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMathInput(example);
                        setSelectedProblem(null);
                        setSolution(null);
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </>
            )}
            
            <button
              onClick={handleSolve}
              disabled={isProcessing || (!mathInput.trim() && !selectedProblem)}
              className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Solving...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Solve & Explain
                </>
              )}
            </button>
          </div>
          
          {/* Solution */}
          {solution && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Solution</h2>
              
              {/* Step-by-step solution */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-medium text-gray-900">Step-by-Step Solution</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="text-sm text-gray-500">
                      Step {currentStep + 1} of {solution.steps.length}
                    </span>
                    <button
                      onClick={() => setCurrentStep(Math.min(solution.steps.length - 1, currentStep + 1))}
                      disabled={currentStep === solution.steps.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <p className="text-green-800">{solution.steps[currentStep]}</p>
                </div>
                
                {/* Step progress */}
                <div className="flex space-x-1">
                  {solution.steps.map((_, index) => (
                    <div 
                      key={index}
                      className={`h-1 flex-1 rounded-full ${
                        index <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Final Answer */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Final Answer</h3>
                <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-4 text-white">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Answer:</p>
                      <p className="text-xl font-bold">{solution.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Explanation */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Explanation</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start">
                    <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-gray-700">{solution.explanation}</p>
                  </div>
                </div>
              </div>
              
              {/* XP Earned */}
              {xpEarned > 0 && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Great job! You earned:</h3>
                        <p className="text-xl font-bold">{xpEarned} XP</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={resetProblem}
                      className="px-4 py-2 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                    >
                      New Problem
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Business Math Categories */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Math Categories</h2>
            <div className="space-y-3">
              {Object.entries(businessMathProblems).map(([category, problems]) => (
                <button
                  key={category}
                  onClick={() => {
                    handleCategorySelect(category);
                    setShowQuizzes(true);
                  }}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center">
                    {getCategoryIcon(category)}
                    <span className="ml-3 font-medium text-gray-900 capitalize">
                      {category.replace('-', ' ')}
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
          
          {/* Recent Problems */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Problems</h2>
            {problemHistory.length > 0 ? (
              <div className="space-y-3">
                {problemHistory.slice(0, 3).map((problem) => (
                  <div key={problem.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{problem.question}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(problem.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-medium text-green-600 flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        {problem.xpEarned} XP
                      </span>
                    </div>
                  </div>
                ))}
                
                {problemHistory.length > 3 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    View All History
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No problems solved yet. Start solving to build your history!
              </p>
            )}
          </div>
          
          {/* Math Tips */}
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Business Math Tips</h2>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-3">
                <h3 className="font-medium mb-1 flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Profit Margin
                </h3>
                <p className="text-sm text-green-100">
                  Profit Margin = (Revenue - Cost) / Revenue × 100%
                </p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3">
                <h3 className="font-medium mb-1 flex items-center">
                  <Percent className="h-4 w-4 mr-1" />
                  Percentage Change
                </h3>
                <p className="text-sm text-green-100">
                  % Change = (New Value - Old Value) / Old Value × 100%
                </p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3">
                <h3 className="font-medium mb-1 flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Unit Economics
                </h3>
                <p className="text-sm text-green-100">
                  Price per unit = Total Price / Number of Units
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quizzes Modal */}
      {showQuizzes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  {selectedCategory && getCategoryIcon(selectedCategory)}
                  <span className="ml-2 capitalize">
                    {selectedCategory ? selectedCategory.replace('-', ' ') : 'Business Math'} Quizzes
                  </span>
                </h2>
                <button
                  onClick={() => setShowQuizzes(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {selectedCategory ? (
                  businessMathProblems[selectedCategory].map((problem) => (
                    <div
                      key={problem.id}
                      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer"
                      onClick={() => handleProblemSelect(problem)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-1">{problem.question}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          {getCategoryIcon(problem.category)}
                          <span className="ml-1 capitalize">{problem.category.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          <span>{problem.xpReward} XP reward</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(businessMathProblems).map(([category, _]) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySelect(category)}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors"
                      >
                        <div className="flex items-center">
                          {getCategoryIcon(category)}
                          <span className="ml-3 font-medium text-gray-900 capitalize">
                            {category.replace('-', ' ')}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {selectedCategory && (
                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Categories
                  </button>
                  
                  <button
                    onClick={() => setShowQuizzes(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Problem History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {problemHistory.length > 0 ? (
                <div className="space-y-4">
                  {problemHistory.map((problem) => (
                    <div key={problem.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          {getCategoryIcon(problem.category)}
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="font-medium text-gray-900">{problem.question}</h3>
                          <p className="text-sm text-gray-600 mt-1">Answer: {problem.answer}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              {new Date(problem.date).toLocaleString()}
                            </span>
                            <span className="text-xs font-medium text-green-600 flex items-center">
                              <Zap className="h-3 w-3 mr-1" />
                              {problem.xpEarned} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No problem history yet. Start solving to build your history!
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