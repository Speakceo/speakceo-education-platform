import React, { useState, useEffect } from 'react';
import { 
  Brain,
  Trophy,
  Star,
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
  Target,
  DollarSign,
  MessageSquare,
  Rocket,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useUserStore } from '../../lib/store';

interface Question {
  id: string;
  type: 'mcq' | 'drag-drop' | 'scenario' | 'true-false' | 'fill-blank';
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'business' | 'finance' | 'leadership' | 'marketing';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  hint?: string;
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    type: 'mcq',
    level: 'beginner',
    category: 'business',
    question: 'What do businesses need to make money?',
    options: [
      'Customers who buy their products or services',
      'A big office building',
      'Lots of employees',
      'A website'
    ],
    correctAnswer: 'Customers who buy their products or services',
    explanation: 'Every business needs customers who are willing to pay for what they offer. Without customers, a business cannot make money!',
    points: 50,
    hint: 'Think about who gives money to a business'
  },
  {
    id: '2',
    type: 'true-false',
    level: 'beginner',
    category: 'finance',
    question: 'Profit is what you have left after paying all your business costs.',
    correctAnswer: 'true',
    explanation: 'Profit is the money left over after you subtract all your expenses (costs) from your revenue (money earned).',
    points: 30,
    hint: 'Remember: Revenue - Costs = Profit'
  },
  {
    id: '3',
    type: 'scenario',
    level: 'intermediate',
    category: 'marketing',
    question: 'You have ₹1,000 to start a lemonade stand. What should you buy first?',
    options: [
      'Lemons and sugar to make the product',
      'A fancy sign for advertising',
      'New clothes to wear',
      'A smartphone to take pictures'
    ],
    correctAnswer: 'Lemons and sugar to make the product',
    explanation: 'Always start by getting what you need to make your product. Without a product, you have nothing to sell!',
    points: 100,
    hint: 'What do you need to actually make lemonade?'
  }
];

const categories = [
  { id: 'business', name: 'Business Basics', icon: Rocket, color: 'from-blue-500 to-indigo-500' },
  { id: 'finance', name: 'Money Smart', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
  { id: 'leadership', name: 'Leadership', icon: Target, color: 'from-purple-500 to-pink-500' },
  { id: 'marketing', name: 'Marketing', icon: MessageSquare, color: 'from-amber-500 to-orange-500' }
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (currentQuestion && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestion, showResult]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsLoading(true);
    // Simulate loading next question
    setTimeout(() => {
      const categoryQuestions = sampleQuestions.filter(q => q.category === categoryId);
      setCurrentQuestion(categoryQuestions[0]);
      setTimeLeft(30);
      setIsLoading(false);
    }, 1000);
  };

  const handleAnswerSubmit = () => {
    const correct = selectedAnswer === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer('');
    setShowResult(false);
    setShowHint(false);
    setTimeLeft(30);
    
    // Simulate loading next question
    setIsLoading(true);
    setTimeout(() => {
      const nextQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      setCurrentQuestion(nextQuestion);
      setIsLoading(false);
    }, 1000);
  };

  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Knowledge Quiz</h2>
              <p className="text-gray-500 mt-1">Test your business knowledge and earn rewards!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">{user?.points || 0}</p>
                <p className="text-sm text-gray-500">Total Points</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">15</p>
                <p className="text-sm text-gray-500">Quizzes Completed</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className={`rounded-xl bg-gradient-to-r ${category.color} p-3`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Test your knowledge</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                <Trophy className="h-8 w-8 text-indigo-600" />
              </div>
              <p className="font-medium text-gray-900">Quiz Master</p>
              <p className="text-sm text-gray-500">Complete 10 quizzes</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">Perfect Score</p>
              <p className="text-sm text-gray-500">100% on any quiz</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <p className="font-medium text-gray-900">Quick Thinker</p>
              <p className="text-sm text-gray-500">Answer in under 10s</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-8 w-8 text-amber-600" />
              </div>
              <p className="font-medium text-gray-900">Streak Master</p>
              <p className="text-sm text-gray-500">5 correct in a row</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      {/* Timer and Progress */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Categories
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="h-5 w-5" />
            <span>{timeLeft}s</span>
          </div>
          {currentQuestion?.hint && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-indigo-600 hover:text-indigo-700"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {currentQuestion?.question}
        </h3>
        {showHint && (
          <div className="bg-indigo-50 rounded-lg p-4 mb-4">
            <p className="text-indigo-700 text-sm">{currentQuestion?.hint}</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        {currentQuestion?.options?.map((option) => (
          <button
            key={option}
            onClick={() => !showResult && setSelectedAnswer(option)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              showResult
                ? option === currentQuestion.correctAnswer
                  ? 'bg-green-50 border-green-200'
                  : option === selectedAnswer
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
                : selectedAnswer === option
                ? 'bg-indigo-50 border-indigo-200'
                : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`${
                showResult && option === currentQuestion.correctAnswer
                  ? 'text-green-700'
                  : showResult && option === selectedAnswer
                  ? 'text-red-700'
                  : 'text-gray-700'
              }`}>
                {option}
              </span>
              {showResult && (
                option === currentQuestion.correctAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : option === selectedAnswer ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : null
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Result and Next Button */}
      {showResult ? (
        <div className="mt-8 space-y-4">
          <div className={`p-4 rounded-lg ${
            isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            <p className="font-medium">
              {isCorrect ? 'Correct! 🎉' : 'Not quite right 😅'}
            </p>
            <p className="mt-2 text-sm">
              {currentQuestion?.explanation}
            </p>
          </div>
          <button
            onClick={handleNextQuestion}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-300"
          >
            Next Question
          </button>
        </div>
      ) : (
        <button
          onClick={handleAnswerSubmit}
          disabled={!selectedAnswer}
          className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}