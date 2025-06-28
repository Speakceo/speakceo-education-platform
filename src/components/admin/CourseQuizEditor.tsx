import React, { useState } from 'react';
import { Trash2, Plus, Check, X } from 'lucide-react';

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

interface CourseQuizEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export default function CourseQuizEditor({ questions, onChange }: CourseQuizEditorProps) {
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  
  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      question: 'New question',
      options: [
        { id: `o_${Date.now()}_1`, text: 'Option 1', isCorrect: true },
        { id: `o_${Date.now()}_2`, text: 'Option 2', isCorrect: false },
      ],
      explanation: '',
      points: 10
    };
    
    onChange([...questions, newQuestion]);
    setActiveQuestion(newQuestion.id);
  };
  
  const handleDeleteQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
    if (activeQuestion === id) {
      setActiveQuestion(null);
    }
  };
  
  const handleQuestionChange = (id: string, field: keyof QuizQuestion, value: any) => {
    onChange(
      questions.map(q => 
        q.id === id 
          ? { ...q, [field]: value } 
          : q
      )
    );
  };
  
  const handleAddOption = (questionId: string) => {
    onChange(
      questions.map(q => 
        q.id === questionId
          ? { 
              ...q, 
              options: [
                ...q.options, 
                { 
                  id: `o_${Date.now()}`, 
                  text: `Option ${q.options.length + 1}`, 
                  isCorrect: false 
                }
              ] 
            }
          : q
      )
    );
  };
  
  const handleDeleteOption = (questionId: string, optionId: string) => {
    onChange(
      questions.map(q => 
        q.id === questionId
          ? { 
              ...q, 
              options: q.options.filter(o => o.id !== optionId)
            }
          : q
      )
    );
  };
  
  const handleOptionChange = (questionId: string, optionId: string, field: keyof QuizOption, value: any) => {
    onChange(
      questions.map(q => 
        q.id === questionId
          ? { 
              ...q, 
              options: q.options.map(o =>
                o.id === optionId
                  ? { ...o, [field]: value }
                  : field === 'isCorrect' && value === true
                    ? { ...o, isCorrect: false } // Ensure only one correct answer
                    : o
              )
            }
          : q
      )
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Quiz Questions</h3>
        <button
          onClick={handleAddQuestion}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </button>
      </div>
      
      {questions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No questions added yet</p>
          <button
            onClick={handleAddQuestion}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Your First Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Question List */}
          <div className="grid grid-cols-1 gap-2">
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`p-4 border rounded-lg ${activeQuestion === question.id ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setActiveQuestion(activeQuestion === question.id ? null : question.id)}
                  >
                    <div className="flex items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded-full text-sm mr-2">
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-gray-900 truncate">{question.question}</h4>
                    </div>
                    {activeQuestion !== question.id && (
                      <div className="mt-2 text-sm text-gray-500">
                        {question.options.length} options • {question.points} points
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Question Editor */}
                {activeQuestion === question.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={e => handleQuestionChange(question.id, 'question', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Points
                        </label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={e => handleQuestionChange(question.id, 'points', parseInt(e.target.value) || 0)}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          min="1"
                          max="100"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Options
                          </label>
                          <button
                            onClick={() => handleAddOption(question.id)}
                            className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Option
                          </button>
                        </div>
                        <div className="space-y-2">
                          {question.options.map(option => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <button
                                onClick={() => handleOptionChange(question.id, option.id, 'isCorrect', true)}
                                className={`w-6 h-6 flex items-center justify-center rounded-full ${
                                  option.isCorrect 
                                    ? 'bg-green-500 text-white' 
                                    : 'border border-gray-300 text-gray-400'
                                }`}
                              >
                                {option.isCorrect && <Check className="h-4 w-4" />}
                              </button>
                              <input
                                type="text"
                                value={option.text}
                                onChange={e => handleOptionChange(question.id, option.id, 'text', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Option text"
                              />
                              <button
                                onClick={() => handleDeleteOption(question.id, option.id)}
                                className="text-red-500 hover:text-red-600"
                                disabled={question.options.length <= 2}
                              >
                                <Trash2 className={`h-4 w-4 ${question.options.length <= 2 ? 'opacity-50 cursor-not-allowed' : ''}`} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Click the circle to set the correct answer
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Explanation (Optional)
                        </label>
                        <textarea
                          value={question.explanation || ''}
                          onChange={e => handleQuestionChange(question.id, 'explanation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          rows={3}
                          placeholder="Explain why the correct answer is right (shown after submission)"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 