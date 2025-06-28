import React, { useState, useRef, useEffect } from 'react';
import { 
  FileEdit, 
  ArrowLeft, 
  Send, 
  RefreshCw, 
  Sparkles, 
  Award, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Download, 
  Save, 
  X, 
  Lightbulb, 
  MessageSquare, 
  Clock, 
  Calendar, 
  Layout, 
  Mail, 
  FileText, 
  Megaphone 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../../../lib/store';
import { generateWriting, improveWriting } from '../../../lib/api/ai-tools';
import confetti from 'canvas-confetti';

interface Template {
  id: string;
  title: string;
  description: string;
  category: 'business' | 'marketing' | 'communication' | 'creative';
  structure: string[];
  placeholders: Record<string, string>;
  xpReward: number;
}

interface WritingHistory {
  id: string;
  title: string;
  content: string;
  template: string;
  date: string;
  xpEarned: number;
}

export default function WriteRight() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [tone, setTone] = useState<'professional' | 'friendly' | 'persuasive' | 'enthusiastic'>('professional');
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [writingHistory, setWritingHistory] = useState<WritingHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  // Sample templates
  const templates: Template[] = [
    {
      id: 'business-idea',
      title: 'Business Idea Pitch',
      description: 'Outline your business concept in a clear, compelling way',
      category: 'business',
      structure: [
        'Introduction: Briefly describe your business idea',
        'Problem: What problem does it solve?',
        'Solution: How does your idea solve this problem?',
        'Market: Who will use or buy your product/service?',
        'Unique Selling Point: What makes your idea special?',
        'Call to Action: What do you want the reader to do?'
      ],
      placeholders: {
        business_type: 'Type of business',
        business_name: 'Name of your business',
        problem: 'Problem your business solves',
        target_audience: 'Who your customers will be'
      },
      xpReward: 25
    },
    {
      id: 'marketing-ad',
      title: 'Marketing Advertisement',
      description: 'Create a compelling ad for your product or service',
      category: 'marketing',
      structure: [
        'Headline: Attention-grabbing title',
        'Problem: Identify the customer\'s pain point',
        'Solution: How your product solves their problem',
        'Benefits: What they\'ll gain from your product',
        'Social Proof: Testimonial or statistic',
        'Call to Action: Clear next step for the customer'
      ],
      placeholders: {
        product_name: 'Name of your product',
        main_benefit: 'Main benefit of your product',
        target_audience: 'Who your ad is for',
        call_to_action: 'What you want people to do'
      },
      xpReward: 20
    },
    {
      id: 'investor-email',
      title: 'Investor Email',
      description: 'Craft a professional email to potential investors',
      category: 'communication',
      structure: [
        'Greeting: Professional salutation',
        'Introduction: Who you are and your business',
        'Opportunity: Market potential and your solution',
        'Traction: Progress and achievements so far',
        `Ask: What you're asking for (e.g., meeting, funding)`,
        'Closing: Professional sign-off'
      ],
      placeholders: {
        business_type: 'Type of business',
        business_name: 'Name of your business',
        ask: "What you're asking for (e.g., $50,000 investment)",
        traction: 'Current progress or traction'
      },
      xpReward: 35
    }
  ];
  
  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('writeRightHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setWritingHistory(history);
      
      // Calculate total XP
      const totalXp = history.reduce((sum: number, item: WritingHistory) => sum + item.xpEarned, 0);
      setTotalXpEarned(totalXp);
    }
  }, []);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    if (writingHistory.length > 0) {
      localStorage.setItem('writeRightHistory', JSON.stringify(writingHistory));
    }
  }, [writingHistory]);
  
  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
    setContent('');
    setGeneratedContent(null);
    
    // Initialize placeholder values
    const initialValues: Record<string, string> = {};
    Object.keys(template.placeholders).forEach(key => {
      initialValues[key] = '';
    });
    setPlaceholderValues(initialValues);
  };
  
  const handlePlaceholderChange = (key: string, value: string) => {
    setPlaceholderValues(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleGenerateContent = async () => {
    if (selectedTemplate) {
      // Check if all placeholders are filled
      const missingPlaceholders = Object.keys(selectedTemplate.placeholders).filter(
        key => !placeholderValues[key]
      );
      
      if (missingPlaceholders.length > 0) {
        setError(`Please fill in all placeholders: ${missingPlaceholders.map(key => selectedTemplate.placeholders[key]).join(', ')}`);
        return;
      }
    } else if (!content.trim()) {
      setError('Please enter some content or select a template');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      let result;
      
      if (selectedTemplate) {
        // Generate from template
        const prompt = `
          Create a ${selectedTemplate.title} with a ${tone} tone.
          
          Structure:
          ${selectedTemplate.structure.join('\n')}
          
          Details:
          ${Object.entries(placeholderValues).map(([key, value]) => `${selectedTemplate.placeholders[key]}: ${value}`).join('\n')}
        `;
        
        result = await generateWriting(prompt);
      } else {
        // Improve existing content
        result = await improveWriting(content, tone);
      }
      
      setGeneratedContent(result);
      
      // Calculate XP earned
      const baseXP = selectedTemplate?.xpReward || 15;
      setXpEarned(baseXP);
      
      // Add to history
      const newHistoryItem: WritingHistory = {
        id: Date.now().toString(),
        title: selectedTemplate?.title || 'Custom Writing',
        content: result,
        template: selectedTemplate?.id || 'custom',
        date: new Date().toISOString(),
        xpEarned: baseXP
      };
      
      setWritingHistory(prev => [newHistoryItem, ...prev]);
      setTotalXpEarned(prev => prev + baseXP);
      
      // Show confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleImproveContent = async () => {
    if (!content.trim()) {
      setError('Please enter some content to improve');
      return;
    }
    
    setIsImproving(true);
    setError(null);
    
    try {
      const improved = await improveWriting(content, tone);
      setGeneratedContent(improved);
      
      // Calculate XP earned - 10 XP for improving content
      const improveXP = 10;
      setXpEarned(improveXP);
      
      // Add to history
      const newHistoryItem: WritingHistory = {
        id: Date.now().toString(),
        title: 'Improved Writing',
        content: improved,
        template: 'improved',
        date: new Date().toISOString(),
        xpEarned: improveXP
      };
      
      setWritingHistory(prev => [newHistoryItem, ...prev]);
      setTotalXpEarned(prev => prev + improveXP);
      
    } catch (err) {
      console.error('Error improving content:', err);
      setError('Failed to improve content. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };
  
  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleDownload = () => {
    if (generatedContent) {
      const element = document.createElement('a');
      const file = new Blob([generatedContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${selectedTemplate?.title || 'WriteRight'}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };
  
  const resetEditor = () => {
    setContent('');
    setGeneratedContent(null);
    setSelectedTemplate(null);
    setPlaceholderValues({});
    setXpEarned(0);
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'business':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'marketing':
        return <Megaphone className="h-5 w-5 text-purple-600" />;
      case 'communication':
        return <Mail className="h-5 w-5 text-green-600" />;
      case 'creative':
        return <Lightbulb className="h-5 w-5 text-amber-600" />;
      default:
        return <FileEdit className="h-5 w-5 text-gray-600" />;
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
              <FileEdit className="h-6 w-6 text-purple-600 mr-2" />
              WriteRight
            </h1>
            <p className="text-gray-500 mt-1">
              Business writing & creativity assistant
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-purple-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-600 font-medium">XP Earned</p>
                <p className="text-sm font-bold text-purple-700">{totalXpEarned} XP</p>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-purple-600 font-medium">Documents</p>
                <p className="text-sm font-bold text-purple-700">{writingHistory.length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowTemplates(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Writing Templates
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
          {/* Editor */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedTemplate ? selectedTemplate.title : 'Write or Paste Your Content'}
              </h2>
              
              <div className="flex items-center space-x-2">
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {selectedTemplate ? (
              <div className="mb-6">
                <div className="bg-purple-50 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    {getCategoryIcon(selectedTemplate.category)}
                    <div className="ml-3">
                      <h3 className="font-medium text-gray-900">{selectedTemplate.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{selectedTemplate.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Zap className="h-3 w-3 mr-1" />
                        <span>Reward: {selectedTemplate.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {Object.entries(selectedTemplate.placeholders).map(([key, label]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                      </label>
                      <input
                        type="text"
                        value={placeholderValues[key] || ''}
                        onChange={(e) => handlePlaceholderChange(key, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Structure</h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <ul className="space-y-1">
                      {selectedTemplate.structure.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write or paste your content here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={10}
                />
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0">
              <button
                onClick={resetEditor}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Reset</span>
              </button>
              
              <div className="flex space-x-3">
                {!selectedTemplate && content.trim() && (
                  <button
                    onClick={handleImproveContent}
                    disabled={isImproving}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                  >
                    {isImproving ? (
                      <>
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Improving...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5" />
                        <span>Improve Writing</span>
                      </>
                    )}
                  </button>
                )}
                
                <button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || (selectedTemplate ? Object.values(placeholderValues).some(v => !v) : !content.trim())}
                  className="flex items-center justify-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>{selectedTemplate ? 'Generate' : 'Enhance'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {/* Generated Content */}
          {generatedContent && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Download as text file"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 mb-6">
                <div className="prose max-w-none text-gray-700">
                  {generatedContent.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {/* XP Earned */}
              {xpEarned > 0 && (
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 text-white">
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
                      onClick={resetEditor}
                      className="px-4 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                    >
                      New Document
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Writing Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Writing Tips</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Know your audience</h3>
                  <p className="text-sm text-gray-500 mt-1">Adjust your language and tone to match who will read your writing.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Start with structure</h3>
                  <p className="text-sm text-gray-500 mt-1">Outline your main points before filling in the details.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Be clear and concise</h3>
                  <p className="text-sm text-gray-500 mt-1">Use simple language and avoid unnecessary words.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-purple-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Edit and revise</h3>
                  <p className="text-sm text-gray-500 mt-1">Always review your writing to catch errors and improve clarity.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Documents */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h2>
            {writingHistory.length > 0 ? (
              <div className="space-y-3">
                {writingHistory.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{doc.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(doc.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs font-medium text-purple-600 flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        {doc.xpEarned} XP
                      </span>
                    </div>
                  </div>
                ))}
                
                {writingHistory.length > 3 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="w-full text-center text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    View All History
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No documents yet. Start writing to build your history!
              </p>
            )}
          </div>
          
          {/* Writing Prompts */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Writing Prompts</h2>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors">
                <h3 className="font-medium mb-1">Elevator Pitch</h3>
                <p className="text-sm text-purple-100">Describe your business idea in 30 seconds or less</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors">
                <h3 className="font-medium mb-1">Value Proposition</h3>
                <p className="text-sm text-purple-100">Explain why customers should buy your product</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20 transition-colors">
                <h3 className="font-medium mb-1">Customer Testimonial</h3>
                <p className="text-sm text-purple-100">Write a realistic review from a happy customer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Writing Templates</h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {getCategoryIcon(template.category)}
                        <h3 className="font-medium text-gray-900 ml-2">{template.title}</h3>
                      </div>
                      <span className="text-xs font-medium text-purple-600 flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        {template.xpReward} XP
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Structure:</span> {template.structure.length} sections
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
              </div>
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
                <h2 className="text-xl font-bold text-gray-900">Document History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {writingHistory.length > 0 ? (
                <div className="space-y-4">
                  {writingHistory.map((doc) => (
                    <div key={doc.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{doc.content}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(doc.date).toLocaleDateString()}</span>
                          <span className="capitalize">{doc.template.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-purple-600 flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            {doc.xpEarned} XP
                          </span>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy content"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(doc.content);
                              alert('Content copied to clipboard!');
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No documents yet. Start writing to build your history!
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