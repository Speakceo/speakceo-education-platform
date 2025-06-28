import React, { useState, useEffect, useRef } from 'react';
import { 
  Presentation, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Share2, 
  RefreshCw, 
  Sparkles, 
  Mic, 
  Award, 
  Zap, 
  FileEdit, 
  Image as ImageIcon, 
  Layout, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Save, 
  Copy, 
  Lightbulb 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../../lib/store';
import { generatePitchDeck, generateSlideContent } from '../../../lib/api/ai-tools';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

interface Slide {
  id: string;
  title: string;
  content: string[];
  imagePrompt?: string;
  imageUrl?: string;
  notes?: string;
}

interface PitchDeckInfo {
  id: string;
  title: string;
  companyName: string;
  industry: string;
  targetAudience: string;
  problem: string;
  solution: string;
  slides: Slide[];
  createdAt: string;
  lastEdited: string;
}

interface PitchDeckHistory {
  id: string;
  title: string;
  companyName: string;
  slideCount: number;
  createdAt: string;
  lastEdited: string;
  xpEarned: number;
}

export default function PitchDeckCreator() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  const [step, setStep] = useState<'info' | 'edit' | 'present'>('info');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingSlide, setIsGeneratingSlide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [deckHistory, setDeckHistory] = useState<PitchDeckHistory[]>([]);
  const [copied, setCopied] = useState(false);
  
  const [deckInfo, setDeckInfo] = useState<PitchDeckInfo>({
    id: Date.now().toString(),
    title: '',
    companyName: '',
    industry: '',
    targetAudience: '',
    problem: '',
    solution: '',
    slides: [],
    createdAt: new Date().toISOString(),
    lastEdited: new Date().toISOString()
  });
  
  const deckRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Default slide templates
  const defaultSlides: Omit<Slide, 'id'>[] = [
    { title: 'Title Slide', content: ['Company Name', 'Tagline'] },
    { title: 'Problem', content: ['What problem are you solving?'] },
    { title: 'Solution', content: ['How does your product/service solve the problem?'] },
    { title: 'Market Opportunity', content: ['Market size', 'Growth potential'] },
    { title: 'Business Model', content: ['How will you make money?'] },
    { title: 'Competition', content: ['Who are your competitors?', 'Your competitive advantage'] },
    { title: 'Traction', content: ['Current progress', 'Milestones achieved'] },
    { title: 'Team', content: ['Key team members', 'Relevant experience'] },
    { title: 'Financials', content: ['Revenue projections', 'Funding needs'] },
    { title: 'Call to Action', content: ['What are you asking for?', 'Next steps'] }
  ];
  
  // Load history from localStorage
  useEffect(() => {
    const loadHistory = () => {
      const history = localStorage.getItem('pitchDeckHistory');
      if (history) {
        setDeckHistory(JSON.parse(history));
      }
      
      // Calculate total XP
      const totalXp = JSON.parse(history || '[]').reduce(
        (sum: number, item: PitchDeckHistory) => sum + item.xpEarned, 
        0
      );
      setTotalXpEarned(totalXp);
    };
    
    loadHistory();
  }, []);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    if (deckHistory.length > 0) {
      localStorage.setItem('pitchDeckHistory', JSON.stringify(deckHistory));
    }
  }, [deckHistory]);
  
  const handleGenerateDeck = async () => {
    // Validate inputs
    if (!deckInfo.companyName || !deckInfo.industry || !deckInfo.problem || !deckInfo.solution) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // Generate pitch deck content
      const generatedDeck = await generatePitchDeck({
        companyName: deckInfo.companyName,
        industry: deckInfo.industry,
        targetAudience: deckInfo.targetAudience,
        problem: deckInfo.problem,
        solution: deckInfo.solution
      });
      
      // Create slides with IDs
      const slides = generatedDeck.slides.map((slide, index) => ({
        ...slide,
        id: `slide-${Date.now()}-${index}`
      }));
      
      // Update deck info
      setDeckInfo(prev => ({
        ...prev,
        title: generatedDeck.title || `${deckInfo.companyName} Pitch Deck`,
        slides,
        lastEdited: new Date().toISOString()
      }));
      
      // Move to edit step
      setStep('edit');
      
      // Calculate XP earned - base 50 XP for generating a deck
      const baseXp = 50;
      setXpEarned(baseXp);
      
      // Add to history
      const newHistoryItem: PitchDeckHistory = {
        id: deckInfo.id,
        title: generatedDeck.title || `${deckInfo.companyName} Pitch Deck`,
        companyName: deckInfo.companyName,
        slideCount: slides.length,
        createdAt: deckInfo.createdAt,
        lastEdited: new Date().toISOString(),
        xpEarned: baseXp
      };
      
      setDeckHistory(prev => [newHistoryItem, ...prev]);
      setTotalXpEarned(prev => prev + baseXp);
      
      // Show confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
    } catch (err) {
      console.error('Error generating pitch deck:', err);
      setError('Failed to generate pitch deck. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      title: 'New Slide',
      content: ['Add your content here']
    };
    
    setDeckInfo(prev => ({
      ...prev,
      slides: [...prev.slides, newSlide],
      lastEdited: new Date().toISOString()
    }));
    
    // Navigate to the new slide
    setCurrentSlide(deckInfo.slides.length);
  };
  
  const handleDeleteSlide = (index: number) => {
    if (deckInfo.slides.length <= 1) {
      setError('You must have at least one slide');
      return;
    }
    
    setDeckInfo(prev => {
      const newSlides = [...prev.slides];
      newSlides.splice(index, 1);
      
      return {
        ...prev,
        slides: newSlides,
        lastEdited: new Date().toISOString()
      };
    });
    
    // Adjust current slide if needed
    if (currentSlide >= index && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  const handleUpdateSlide = (index: number, field: keyof Slide, value: any) => {
    setDeckInfo(prev => {
      const newSlides = [...prev.slides];
      newSlides[index] = {
        ...newSlides[index],
        [field]: value
      };
      
      return {
        ...prev,
        slides: newSlides,
        lastEdited: new Date().toISOString()
      };
    });
  };
  
  const handleUpdateContent = (slideIndex: number, contentIndex: number, value: string) => {
    setDeckInfo(prev => {
      const newSlides = [...prev.slides];
      const newContent = [...newSlides[slideIndex].content];
      newContent[contentIndex] = value;
      
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        content: newContent
      };
      
      return {
        ...prev,
        slides: newSlides,
        lastEdited: new Date().toISOString()
      };
    });
  };
  
  const handleAddContentItem = (slideIndex: number) => {
    setDeckInfo(prev => {
      const newSlides = [...prev.slides];
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        content: [...newSlides[slideIndex].content, 'New point']
      };
      
      return {
        ...prev,
        slides: newSlides,
        lastEdited: new Date().toISOString()
      };
    });
  };
  
  const handleRemoveContentItem = (slideIndex: number, contentIndex: number) => {
    if (deckInfo.slides[slideIndex].content.length <= 1) {
      setError('Slide must have at least one content item');
      return;
    }
    
    setDeckInfo(prev => {
      const newSlides = [...prev.slides];
      const newContent = [...newSlides[slideIndex].content];
      newContent.splice(contentIndex, 1);
      
      newSlides[slideIndex] = {
        ...newSlides[slideIndex],
        content: newContent
      };
      
      return {
        ...prev,
        slides: newSlides,
        lastEdited: new Date().toISOString()
      };
    });
  };
  
  const handleGenerateSlideContent = async (index: number) => {
    setIsGeneratingSlide(true);
    setError(null);
    
    try {
      const slide = deckInfo.slides[index];
      
      const generatedContent = await generateSlideContent({
        companyName: deckInfo.companyName,
        industry: deckInfo.industry,
        slideTitle: slide.title,
        deckContext: {
          problem: deckInfo.problem,
          solution: deckInfo.solution,
          targetAudience: deckInfo.targetAudience
        }
      });
      
      // Update slide content
      handleUpdateSlide(index, 'content', generatedContent.content);
      
      // If image prompt was generated, save it
      if (generatedContent.imagePrompt) {
        handleUpdateSlide(index, 'imagePrompt', generatedContent.imagePrompt);
      }
      
    } catch (err) {
      console.error('Error generating slide content:', err);
      setError('Failed to generate slide content. Please try again.');
    } finally {
      setIsGeneratingSlide(false);
    }
  };
  
  const handleExportPDF = async () => {
    if (!deckRef.current || deckInfo.slides.length === 0) return;
    
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      // Capture each slide
      for (let i = 0; i < deckInfo.slides.length; i++) {
        const slideElement = slideRefs.current[i];
        if (!slideElement) continue;
        
        const canvas = await html2canvas(slideElement, {
          scale: 2,
          logging: false,
          useCORS: true
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        
        // Add page for all slides except the first one
        if (i > 0) {
          pdf.addPage();
        }
        
        // Add image to PDF
        pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210); // A4 landscape dimensions in mm
      }
      
      // Save PDF
      pdf.save(`${deckInfo.title.replace(/\s+/g, '_')}.pdf`);
      
      // Add XP for exporting
      const exportXp = 10;
      setXpEarned(prev => prev + exportXp);
      setTotalXpEarned(prev => prev + exportXp);
      
      // Update history
      setDeckHistory(prev => {
        const updatedHistory = prev.map(deck => 
          deck.id === deckInfo.id 
            ? { ...deck, xpEarned: deck.xpEarned + exportXp, lastEdited: new Date().toISOString() }
            : deck
        );
        return updatedHistory;
      });
      
    } catch (err) {
      console.error('Error exporting PDF:', err);
      setError('Failed to export PDF. Please try again.');
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const resetDeck = () => {
    setDeckInfo({
      id: Date.now().toString(),
      title: '',
      companyName: '',
      industry: '',
      targetAudience: '',
      problem: '',
      solution: '',
      slides: [],
      createdAt: new Date().toISOString(),
      lastEdited: new Date().toISOString()
    });
    setStep('info');
    setCurrentSlide(0);
    setXpEarned(0);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => {
              if (step === 'info') {
                navigate('/dashboard/ai-tools');
              } else {
                setStep('info');
              }
            }}
            className="mr-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Presentation className="h-6 w-6 text-red-600 mr-2" />
              PitchDeck Creator
            </h1>
            <p className="text-gray-500 mt-1">
              AI business presentation builder
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-red-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <Award className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-red-600 font-medium">XP Earned</p>
                <p className="text-sm font-bold text-red-700">{totalXpEarned} XP</p>
              </div>
            </div>
            
            <div className="bg-red-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                <Presentation className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-red-600 font-medium">Decks Created</p>
                <p className="text-sm font-bold text-red-700">{deckHistory.length}</p>
              </div>
            </div>
          </div>
          
          {step !== 'info' && (
            <div className="flex space-x-3">
              {step === 'edit' && (
                <button
                  onClick={() => setStep('present')}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Present Mode
                </button>
              )}
              
              {step === 'present' && (
                <button
                  onClick={() => setStep('edit')}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Edit Mode
                </button>
              )}
              
              <button
                onClick={() => setShowHistory(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                History
              </button>
            </div>
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
        
        {step === 'info' ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Pitch Deck Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name*
                </label>
                <input
                  type="text"
                  value={deckInfo.companyName}
                  onChange={(e) => setDeckInfo({ ...deckInfo, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., EcoTech Solutions"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry*
                </label>
                <input
                  type="text"
                  value={deckInfo.industry}
                  onChange={(e) => setDeckInfo({ ...deckInfo, industry: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Sustainable Technology"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={deckInfo.targetAudience}
                  onChange={(e) => setDeckInfo({ ...deckInfo, targetAudience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., Small businesses and startups"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deck Title
                </label>
                <input
                  type="text"
                  value={deckInfo.title}
                  onChange={(e) => setDeckInfo({ ...deckInfo, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="e.g., EcoTech Solutions Investor Pitch"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank to auto-generate
                </p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Statement*
                </label>
                <textarea
                  value={deckInfo.problem}
                  onChange={(e) => setDeckInfo({ ...deckInfo, problem: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={3}
                  placeholder="Describe the problem your business solves..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Solution*
                </label>
                <textarea
                  value={deckInfo.solution}
                  onChange={(e) => setDeckInfo({ ...deckInfo, solution: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows={3}
                  placeholder="Describe your solution to the problem..."
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerateDeck}
                disabled={isGenerating || !deckInfo.companyName || !deckInfo.industry || !deckInfo.problem || !deckInfo.solution}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Pitch Deck
                  </>
                )}
              </button>
            </div>
          </div>
        ) : step === 'edit' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{deckInfo.title || `${deckInfo.companyName} Pitch Deck`}</h2>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleAddSlide}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Slide</span>
                </button>
                
                <button
                  onClick={handleExportPDF}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Slide Thumbnails */}
              <div className="md:col-span-1 bg-gray-50 rounded-xl p-4 h-[600px] overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Slides</h3>
                <div className="space-y-2">
                  {deckInfo.slides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        currentSlide === index
                          ? 'bg-red-100 border border-red-300'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{index + 1}. {slide.title}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSlide(index);
                          }}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="bg-white rounded border border-gray-200 p-2 h-16 text-xs text-gray-500 overflow-hidden">
                        {slide.content.slice(0, 2).map((item, i) => (
                          <div key={i} className="truncate">{item}</div>
                        ))}
                        {slide.content.length > 2 && <div>...</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Slide Editor */}
              <div className="md:col-span-3">
                {deckInfo.slides.length > 0 ? (
                  <div>
                    <div className="bg-gray-50 rounded-xl p-6 mb-4 h-[400px] overflow-y-auto">
                      <div 
                        ref={el => slideRefs.current[currentSlide] = el}
                        className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col"
                      >
                        <input
                          type="text"
                          value={deckInfo.slides[currentSlide].title}
                          onChange={(e) => handleUpdateSlide(currentSlide, 'title', e.target.value)}
                          className="text-2xl font-bold text-gray-900 mb-6 w-full border-none focus:ring-0 focus:outline-none"
                        />
                        
                        <div className="flex-1">
                          {deckInfo.slides[currentSlide].content.map((item, index) => (
                            <div key={index} className="mb-4 flex items-start">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleUpdateContent(currentSlide, index, e.target.value)}
                                  className="w-full text-lg text-gray-700 border-none focus:ring-0 focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => handleRemoveContentItem(currentSlide, index)}
                                className="ml-2 text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                          disabled={currentSlide === 0}
                          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span className="text-sm text-gray-600">
                          Slide {currentSlide + 1} of {deckInfo.slides.length}
                        </span>
                        <button
                          onClick={() => setCurrentSlide(Math.min(deckInfo.slides.length - 1, currentSlide + 1))}
                          disabled={currentSlide === deckInfo.slides.length - 1}
                          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAddContentItem(currentSlide)}
                          className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Point</span>
                        </button>
                        
                        <button
                          onClick={() => handleGenerateSlideContent(currentSlide)}
                          disabled={isGeneratingSlide}
                          className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                        >
                          {isGeneratingSlide ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              <span>Generate Content</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Speaker Notes</h3>
                      <textarea
                        value={deckInfo.slides[currentSlide].notes || ''}
                        onChange={(e) => handleUpdateSlide(currentSlide, 'notes', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                        rows={3}
                        placeholder="Add notes for this slide..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <Presentation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Slides Yet</h3>
                      <p className="text-gray-500 mb-4">Generate your pitch deck to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Presentation Mode</h2>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Slide {currentSlide + 1} of {deckInfo.slides.length}
                </span>
                <button
                  onClick={() => setCurrentSlide(Math.min(deckInfo.slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === deckInfo.slides.length - 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div ref={deckRef} className="flex flex-col items-center">
              <div 
                ref={el => slideRefs.current[currentSlide] = el}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-3xl aspect-[16/9] flex flex-col"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {deckInfo.slides[currentSlide]?.title}
                </h2>
                
                <div className="flex-1 flex flex-col justify-center">
                  {deckInfo.slides[currentSlide]?.content.map((item, index) => (
                    <div key={index} className="mb-6 text-xl text-gray-700 flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-4"></div>
                      <div>{item}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto flex justify-between items-center">
                  <div className="text-sm text-gray-500">{deckInfo.companyName}</div>
                  <div className="text-sm text-gray-500">Slide {currentSlide + 1}</div>
                </div>
              </div>
              
              {deckInfo.slides[currentSlide]?.notes && (
                <div className="mt-6 bg-gray-50 rounded-xl p-4 w-full max-w-3xl">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mic className="h-4 w-4 text-red-600 mr-2" />
                    Speaker Notes
                  </h3>
                  <p className="text-gray-600">{deckInfo.slides[currentSlide].notes}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Pitch Deck History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {deckHistory.length > 0 ? (
                <div className="space-y-4">
                  {deckHistory.map((deck) => (
                    <div key={deck.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <h3 className="font-medium text-gray-900">{deck.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{deck.companyName}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{deck.slideCount} slides</span>
                          <span>Created: {new Date(deck.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-medium text-red-600 flex items-center">
                            <Zap className="h-3 w-3 mr-1" />
                            {deck.xpEarned} XP
                          </span>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            title="Load deck"
                          >
                            <FileEdit className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No pitch decks yet. Create your first one!
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