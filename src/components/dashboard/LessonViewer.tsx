import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Download, 
  FileText, 
  Video, 
  Link as LinkIcon,
  CheckCircle,
  Clock,
  Star,
  Presentation,
  Brain,
  AlertCircle,
  X
} from 'lucide-react';
import { useUserStore, useUnifiedProgressStore } from '../../lib/store';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation?: string;
  points: number;
}

interface LessonContent {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'ppt' | 'link' | 'text' | 'quiz';
  url?: string;
  content?: string;
  order: number;
  quiz_questions?: QuizQuestion[];
}

interface LessonViewerProps {
  lessonTitle: string;
  content: LessonContent[];
  onClose: () => void;
  onComplete?: () => void;
}

export default function LessonViewer({ lessonTitle, content, onClose, onComplete }: LessonViewerProps) {
  const [activeContentIndex, setActiveContentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Quiz state
  const [quizResponses, setQuizResponses] = useState<{[questionId: string]: string}>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    totalPoints: number;
    correctAnswers: number;
    totalQuestions: number;
    answers: {
      questionId: string;
      selectedOptionId: string;
      isCorrect: boolean;
      points: number;
    }[];
  } | null>(null);
  
  const { user } = useUserStore();
  const { recordActivity } = useUnifiedProgressStore();
  
  const activeContent = content[activeContentIndex];
  
  // Track time spent on lesson
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Reset quiz state when changing content
  useEffect(() => {
    setQuizResponses({});
    setQuizSubmitted(false);
    setQuizResults(null);
  }, [activeContentIndex]);
  
  // Mark as completed after 60 seconds or when all content is viewed
  useEffect(() => {
    if (timeSpent >= 60 || (activeContentIndex === content.length - 1 && !isQuizIncomplete())) {
      setIsCompleted(true);
    }
  }, [timeSpent, activeContentIndex, content.length, quizSubmitted]);
  
  const isQuizIncomplete = () => {
    if (activeContent?.type !== 'quiz' || !activeContent.quiz_questions) return false;
    
    // If it's a quiz, ensure it's been submitted
    return !quizSubmitted;
  };
  
  const handleNext = () => {
    // If current content is a quiz and it hasn't been submitted, don't proceed
    if (isQuizIncomplete()) {
      return;
    }
    
    if (activeContentIndex < content.length - 1) {
      setActiveContentIndex(activeContentIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (activeContentIndex > 0) {
      setActiveContentIndex(activeContentIndex - 1);
    }
  };
  
  const handleComplete = () => {
    // If we have a quiz that hasn't been submitted, don't complete
    if (isQuizIncomplete()) {
      return;
    }
    
    // Record XP earned
    let xpEarned = 15; // Base XP for completing a lesson
    
    // Add quiz points if any
    if (quizResults) {
      xpEarned += quizResults.score;
    }
    
    // Record the activity
    recordActivity({
      type: 'course',
      title: `Completed: ${lessonTitle}`,
      xpEarned
    });
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const getContentTypeIcon = (type: LessonContent['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'ppt':
        return <Presentation className="h-5 w-5 text-purple-500" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-500" />;
      case 'text':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'quiz':
        return <Brain className="h-5 w-5 text-indigo-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleQuizOptionSelect = (questionId: string, optionId: string) => {
    if (quizSubmitted) return; // Don't allow changes after submission
    
    setQuizResponses(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  const handleQuizSubmit = () => {
    if (!activeContent.quiz_questions) return;
    
    // Calculate results
    let correctAnswers = 0;
    let totalPoints = 0;
    let earnedPoints = 0;
    const answers = [];
    
    for (const question of activeContent.quiz_questions) {
      const selectedOptionId = quizResponses[question.id];
      if (!selectedOptionId) continue;
      
      const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
      if (!selectedOption) continue;
      
      totalPoints += question.points;
      
      const isCorrect = selectedOption.isCorrect;
      if (isCorrect) {
        correctAnswers++;
        earnedPoints += question.points;
      }
      
      answers.push({
        questionId: question.id,
        selectedOptionId,
        isCorrect,
        points: isCorrect ? question.points : 0
      });
    }
    
    const results = {
      score: earnedPoints,
      totalPoints,
      correctAnswers,
      totalQuestions: activeContent.quiz_questions.length,
      answers
    };
    
    setQuizResults(results);
    setQuizSubmitted(true);
    
    // If all questions have been answered, mark content as completed
    if (answers.length === activeContent.quiz_questions.length) {
      setIsCompleted(true);
    }
  };
  
  const renderQuiz = () => {
    if (!activeContent.quiz_questions) {
      return <div className="w-full p-8 text-center">No quiz questions available</div>;
    }
    
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{activeContent.title}</h3>
          <p className="text-gray-600">
            Complete this quiz to test your knowledge and earn XP.
          </p>
        </div>
        
        <div className="space-y-8">
          {activeContent.quiz_questions.map((question, index) => (
            <div key={question.id} className="p-6 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                <span className="bg-indigo-600 text-white w-7 h-7 inline-flex items-center justify-center rounded-full mr-2">
                  {index + 1}
                </span>
                {question.question}
              </h4>
              
              <div className="mt-4 space-y-2">
                {question.options.map(option => {
                  const isSelected = quizResponses[question.id] === option.id;
                  const showCorrectAnswer = quizSubmitted;
                  const isCorrectAnswer = option.isCorrect;
                  const isIncorrectSelection = quizSubmitted && isSelected && !isCorrectAnswer;
                  
                  return (
                    <div 
                      key={option.id} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? showCorrectAnswer
                            ? isCorrectAnswer 
                              ? 'bg-green-50 border-green-300'
                              : 'bg-red-50 border-red-300'
                            : 'bg-indigo-50 border-indigo-300'
                          : showCorrectAnswer && isCorrectAnswer
                            ? 'bg-green-50 border-green-300'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleQuizOptionSelect(question.id, option.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 mr-3 rounded-full flex items-center justify-center ${
                          isSelected 
                            ? showCorrectAnswer
                              ? isCorrectAnswer 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                              : 'bg-indigo-500'
                            : showCorrectAnswer && isCorrectAnswer
                              ? 'bg-green-500'
                              : 'border border-gray-300'
                        }`}>
                          {isSelected && (
                            showCorrectAnswer 
                              ? isCorrectAnswer 
                                ? <CheckCircle className="w-3 h-3 text-white" /> 
                                : <X className="w-3 h-3 text-white" />
                              : <div className="w-3 h-3 rounded-full bg-white" />
                          )}
                          {showCorrectAnswer && isCorrectAnswer && !isSelected && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className={`${
                          showCorrectAnswer && isCorrectAnswer ? 'font-medium' : ''
                        }`}>
                          {option.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {quizSubmitted && question.explanation && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Explanation</p>
                      <p className="text-sm text-blue-700 mt-1">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {!quizSubmitted ? (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizResponses).length !== activeContent.quiz_questions.length}
              className={`px-6 py-3 rounded-lg font-medium ${
                Object.keys(quizResponses).length === activeContent.quiz_questions.length
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Answers
            </button>
          </div>
        ) : quizResults && (
          <div className="mt-8 p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h3 className="text-xl font-bold text-indigo-900 mb-3">Quiz Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-1">Score</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {quizResults.score}/{quizResults.totalPoints}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-1">Correct Answers</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {quizResults.correctAnswers}/{quizResults.totalQuestions}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm text-center">
                <p className="text-sm text-gray-500 mb-1">XP Earned</p>
                <p className="text-2xl font-bold text-indigo-600">
                  +{quizResults.score} XP
                </p>
              </div>
            </div>
            <p className="text-center text-gray-600">
              {quizResults.correctAnswers === quizResults.totalQuestions
                ? '🎉 Perfect score! Great job!'
                : quizResults.correctAnswers > quizResults.totalQuestions / 2
                ? '👍 Good job! Keep learning to improve further.'
                : 'Keep practicing! Review the material and try again.'}
            </p>
          </div>
        )}
      </div>
    );
  };
  
  const renderContent = () => {
    if (!activeContent) return null;
    
    switch (activeContent.type) {
      case 'video':
        return (
          <div className="w-full aspect-video bg-black">
            <iframe 
              src={activeContent.url} 
              className="w-full h-full" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            />
          </div>
        );
      
      case 'pdf':
        return (
          <div className="w-full h-[70vh] bg-gray-100 flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">{activeContent.title}</h3>
            <div className="flex space-x-4">
              <a 
                href={activeContent.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                <span>Open PDF</span>
              </a>
              <a 
                href={activeContent.url} 
                download
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                <span>Download</span>
              </a>
            </div>
          </div>
        );
      
      case 'ppt':
        return (
          <div className="w-full h-[70vh]">
            <iframe 
              src={activeContent.url} 
              className="w-full h-full" 
              frameBorder="0"
            />
          </div>
        );
      
      case 'link':
        return (
          <div className="w-full h-[70vh] bg-gray-100 flex flex-col items-center justify-center">
            <LinkIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">{activeContent.title}</h3>
            <a 
              href={activeContent.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              <span>Open Link</span>
            </a>
          </div>
        );
      
      case 'text':
        return (
          <div className="w-full h-[70vh] bg-white p-6 overflow-auto">
            <div className="prose max-w-none">
              {activeContent.content?.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="w-full h-[70vh] bg-white overflow-auto">
            {renderQuiz()}
          </div>
        );
      
      default:
        return (
          <div className="w-full h-[70vh] bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Content not available</p>
          </div>
        );
    }
  };
  
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : 'p-4'}`}>
      <div className={`bg-white rounded-xl overflow-hidden flex flex-col ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl max-h-[90vh]'}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={onClose}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div>
              <h2 className="font-semibold text-gray-900">{lessonTitle}</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>{activeContentIndex + 1} of {content.length}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>Completed</span>
              </div>
            )}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isFullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0l5 0m-5 0v5M9 15l-5 5m0 0l5 0m-5 0v-5M15 9l5-5m0 0h-5m5 0v5M15 15l5 5m0 0v-5m0 5h-5" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 0h-4m4 0l-5-5" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-yellow-500">
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 fill-current" />
              <Star className="h-5 w-5 text-gray-300" />
            </div>
            <span className="text-sm text-gray-500">Rate this lesson</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevious}
              disabled={activeContentIndex === 0}
              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span>Previous</span>
            </button>
            
            {activeContentIndex < content.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={activeContent.type === 'quiz' && !quizSubmitted}
                className={`flex items-center px-4 py-2 ${
                  activeContent.type === 'quiz' && !quizSubmitted
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                } rounded-lg transition-colors`}
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={activeContent.type === 'quiz' && !quizSubmitted}
                className={`flex items-center px-4 py-2 ${
                  activeContent.type === 'quiz' && !quizSubmitted
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } rounded-lg transition-colors`}
              >
                <CheckCircle className="h-5 w-5 mr-1" />
                <span>Complete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}