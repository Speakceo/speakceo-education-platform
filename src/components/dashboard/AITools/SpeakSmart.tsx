import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  StopCircle, 
  Play, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  Award, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Volume2, 
  VolumeX, 
  Save, 
  Download, 
  Zap, 
  MessageSquare, 
  Target, 
  BarChart2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore, useAIToolsStore, useUnifiedProgressStore } from '../../../lib/store';
import confetti from 'canvas-confetti';

interface Scenario {
  id: string;
  title: string;
  description: string;
  prompt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  xpReward: number;
}

interface SpeechFeedback {
  clarity: number;
  tone: number;
  fillerWords: {
    count: number;
    words: string[];
  };
  pacing: {
    wordsPerMinute: number;
    rating: number;
  };
  overallScore: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}

interface PracticeHistory {
  id: string;
  scenario: string;
  duration: number;
  score: number;
  date: string;
  xpEarned: number;
}

export default function SpeakSmart() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { recordToolUsage } = useAIToolsStore();
  const { recordActivity } = useUnifiedProgressStore();
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<SpeechFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showScenarios, setShowScenarios] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [practiceHistory, setPracticeHistory] = useState<PracticeHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Sample scenarios
  const scenarios: Scenario[] = [
    {
      id: 'elevator-pitch',
      title: 'Elevator Pitch',
      description: 'Present your business idea in 30 seconds',
      prompt: 'Imagine you just stepped into an elevator with a potential investor. You have only 30 seconds to explain your business idea before they reach their floor. Make it compelling!',
      difficulty: 'beginner',
      duration: 30,
      xpReward: 20
    },
    {
      id: 'product-demo',
      title: 'Product Demo',
      description: 'Present your product\'s features and benefits in 1 minute',
      prompt: 'You\'re demonstrating your product to potential customers. Explain what it does, how it works, and why they should buy it. Focus on benefits, not just features.',
      difficulty: 'intermediate',
      duration: 60,
      xpReward: 30
    },
    {
      id: 'investor-pitch',
      title: 'Investor Pitch',
      description: 'Convince investors to fund your startup in 2 minutes',
      prompt: 'You\'re presenting to a room full of investors. Cover your business model, market opportunity, competitive advantage, and what you\'re asking for. Make them excited about your vision!',
      difficulty: 'advanced',
      duration: 120,
      xpReward: 50
    }
  ];
  
  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('speakSmartHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setPracticeHistory(history);
      
      // Calculate total XP
      const totalXp = history.reduce((sum: number, practice: PracticeHistory) => sum + practice.xpEarned, 0);
      setTotalXpEarned(totalXp);
    }
  }, []);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    if (practiceHistory.length > 0) {
      localStorage.setItem('speakSmartHistory', JSON.stringify(practiceHistory));
    }
  }, [practiceHistory]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);
  
  const handleStartRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          // Auto-stop if we reach the scenario duration
          if (selectedScenario && prev + 1 >= selectedScenario.duration) {
            handleStopRecording();
            return selectedScenario.duration;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Record activity in unified progress
      recordActivity({
        type: 'ai-tool',
        title: 'Started Speech Practice',
        xpEarned: 5
      });
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please check your browser permissions.');
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const handlePlayAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
        
        // Set up event listener for when audio ends
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
    }
  };
  
  const handleAnalyzeSpeech = async () => {
    if (!audioBlob) {
      setError('No recording to analyze');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // In a real implementation, this would send the audio to the OpenAI API
      // For now, we'll simulate a response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock feedback
      const mockFeedback: SpeechFeedback = {
        clarity: Math.floor(Math.random() * 30) + 70, // 70-100
        tone: Math.floor(Math.random() * 30) + 70, // 70-100
        fillerWords: {
          count: Math.floor(Math.random() * 10),
          words: ['um', 'like', 'you know', 'actually']
        },
        pacing: {
          wordsPerMinute: Math.floor(Math.random() * 50) + 120, // 120-170
          rating: Math.floor(Math.random() * 30) + 70 // 70-100
        },
        overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
        strengths: [
          'Clear articulation of main points',
          'Good energy and enthusiasm',
          'Effective use of pauses for emphasis'
        ],
        improvements: [
          'Reduce filler words like "um" and "like"',
          'Vary your tone more to emphasize key points',
          'Speak slightly slower to improve clarity'
        ],
        summary: 'Overall, you delivered a strong presentation with clear points and good energy. With a few small adjustments to pacing and reducing filler words, your delivery will be even more impactful.'
      };
      
      setFeedback(mockFeedback);
      
      // Calculate XP earned
      const baseXP = selectedScenario?.xpReward || 10;
      const bonusXP = Math.floor(mockFeedback.overallScore / 10); // 0-10 bonus XP based on score
      const totalXP = baseXP + bonusXP;
      
      setXpEarned(totalXP);
      
      // Add to history
      const newHistoryItem: PracticeHistory = {
        id: Date.now().toString(),
        scenario: selectedScenario?.title || 'Free Practice',
        duration: recordingTime,
        score: mockFeedback.overallScore,
        date: new Date().toISOString(),
        xpEarned: totalXP
      };
      
      setPracticeHistory(prev => [newHistoryItem, ...prev]);
      setTotalXpEarned(prev => prev + totalXP);
      
      // Record tool usage in the AI tools store
      recordToolUsage('speak-smart', 'SpeakSmart', totalXP);
      
      // Record activity in unified progress
      recordActivity({
        type: 'ai-tool',
        title: `Completed ${selectedScenario?.title || 'Speech Practice'}`,
        xpEarned: totalXP
      });
      
      // Show confetti for good scores
      if (mockFeedback.overallScore >= 80) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
    } catch (err) {
      console.error('Error analyzing speech:', err);
      setError('Failed to analyze your speech. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleScenarioSelect = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setShowScenarios(false);
    setFeedback(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    
    // Record activity
    recordActivity({
      type: 'ai-tool',
      title: `Selected ${scenario.title} Scenario`,
      xpEarned: 5
    });
  };
  
  const resetPractice = () => {
    setSelectedScenario(null);
    setFeedback(null);
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecordingTime(0);
    setXpEarned(0);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
              <Mic className="h-6 w-6 text-blue-600 mr-2" />
              SpeakSmart
            </h1>
            <p className="text-gray-500 mt-1">
              AI public speaking & communication coach
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <Award className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">XP Earned</p>
                <p className="text-sm font-bold text-blue-700">{totalXpEarned} XP</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-3 flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-blue-600 font-medium">Practices</p>
                <p className="text-sm font-bold text-blue-700">{practiceHistory.length}</p>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowScenarios(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              Practice Scenarios
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
          {/* Recording Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedScenario ? selectedScenario.title : 'Free Practice Mode'}
              </h2>
              
              {selectedScenario && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedScenario.difficulty)}`}>
                  {selectedScenario.difficulty.charAt(0).toUpperCase() + selectedScenario.difficulty.slice(1)}
                </span>
              )}
            </div>
            
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {selectedScenario && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <div className="flex items-start">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Scenario:</h3>
                    <p className="text-gray-700">{selectedScenario.prompt}</p>
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Target duration: {formatTime(selectedScenario.duration)}</span>
                      <span className="mx-2">•</span>
                      <Zap className="h-4 w-4 mr-1" />
                      <span>Reward: {selectedScenario.xpReward} XP</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col items-center justify-center py-8">
              {isRecording ? (
                <div className="text-center">
                  <div 
                    className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-4 cursor-pointer hover:bg-red-200 transition-colors"
                    onClick={handleStopRecording}
                  >
                    <StopCircle className="h-12 w-12 text-red-600" />
                  </div>
                  <div className="text-red-600 animate-pulse flex items-center justify-center text-lg font-medium">
                    <span className="mr-2">●</span> Recording... {formatTime(recordingTime)}
                  </div>
                  {selectedScenario && (
                    <div className="mt-2 text-sm text-gray-500">
                      {recordingTime < selectedScenario.duration 
                        ? `${selectedScenario.duration - recordingTime} seconds remaining` 
                        : 'Time\'s up! Recording will stop automatically.'}
                    </div>
                  )}
                </div>
              ) : audioUrl ? (
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <button 
                      className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 hover:bg-blue-200 transition-colors"
                      onClick={handlePlayAudio}
                    >
                      {isPlaying ? (
                        <StopCircle className="h-8 w-8 text-blue-600" />
                      ) : (
                        <Play className="h-8 w-8 text-blue-600" />
                      )}
                    </button>
                    <div className="text-center">
                      <div className="text-gray-700 font-medium">Recording saved</div>
                      <div className="text-sm text-gray-500">{formatTime(recordingTime)}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleAnalyzeSpeech}
                      disabled={isProcessing}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Analyze Speech
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={resetPractice}
                      className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <RefreshCw className="h-5 w-5 mr-2" />
                      New Recording
                    </button>
                  </div>
                  
                  {/* Hidden audio element for playback */}
                  <audio ref={audioRef} src={audioUrl} />
                </div>
              ) : (
                <div className="text-center">
                  <div 
                    className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mb-4 cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={handleStartRecording}
                  >
                    <Mic className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="text-gray-700 font-medium">Tap to start recording</div>
                  <div className="mt-1 text-sm text-gray-500">
                    {selectedScenario 
                      ? `Target duration: ${formatTime(selectedScenario.duration)}` 
                      : 'Free practice mode - record as long as you want'}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Feedback Section */}
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Speech Analysis</h2>
              
              {/* Overall Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-md font-medium text-gray-900">Overall Score</h3>
                  <div className="flex items-center">
                    <span className={`text-lg font-bold ${
                      feedback.overallScore >= 80 ? 'text-green-600' :
                      feedback.overallScore >= 60 ? 'text-blue-600' :
                      'text-amber-600'
                    }`}>
                      {feedback.overallScore}/100
                    </span>
                  </div>
                </div>
                <div className="h-4 w-full bg-gray-200 rounded-full">
                  <div 
                    className={`h-4 rounded-full ${
                      feedback.overallScore >= 80 ? 'bg-green-500' :
                      feedback.overallScore >= 60 ? 'bg-blue-500' :
                      'bg-amber-500'
                    }`}
                    style={{ width: `${feedback.overallScore}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Detailed Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Speech Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Clarity</span>
                        <span className="text-sm font-medium text-gray-900">{feedback.clarity}/100</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${feedback.clarity}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Tone</span>
                        <span className="text-sm font-medium text-gray-900">{feedback.tone}/100</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-purple-500 rounded-full"
                          style={{ width: `${feedback.tone}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">Pacing</span>
                        <span className="text-sm font-medium text-gray-900">{feedback.pacing.rating}/100</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${feedback.pacing.rating}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {feedback.pacing.wordsPerMinute} words per minute
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Filler Words</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">Total Count</span>
                      <span className={`text-sm font-medium ${
                        feedback.fillerWords.count <= 3 ? 'text-green-600' :
                        feedback.fillerWords.count <= 8 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {feedback.fillerWords.count}
                      </span>
                    </div>
                    
                    {feedback.fillerWords.words.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {feedback.fillerWords.words.map((word, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                          >
                            "{word}"
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No filler words detected. Great job!</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Strengths and Improvements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                    <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start">
                        <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Summary */}
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Summary</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">{feedback.summary}</p>
                </div>
              </div>
              
              {/* XP Earned */}
              {xpEarned > 0 && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 text-white">
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
                      onClick={resetPractice}
                      className="px-4 py-2 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
                    >
                      Practice Again
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Practice Tips */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Speaking Tips</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Start with a hook</h3>
                  <p className="text-sm text-gray-500 mt-1">Begin with a surprising fact, question, or story to grab attention.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Use the 3-part structure</h3>
                  <p className="text-sm text-gray-500 mt-1">Introduction, main points, and conclusion. Keep it simple and clear.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Speak slowly and clearly</h3>
                  <p className="text-sm text-gray-500 mt-1">Take your time and emphasize important words. Pause between ideas.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">End with a call to action</h3>
                  <p className="text-sm text-gray-500 mt-1">Tell your audience exactly what you want them to do next.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Practices */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Practices</h2>
            {practiceHistory.length > 0 ? (
              <div className="space-y-3">
                {practiceHistory.slice(0, 3).map((practice) => (
                  <div key={practice.id} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-900">{practice.scenario}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTime(practice.duration)}</span>
                        <span className="mx-1">•</span>
                        <span>{new Date(practice.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium ${
                          practice.score >= 80 ? 'text-green-600' :
                          practice.score >= 60 ? 'text-blue-600' :
                          'text-amber-600'
                        }`}>
                          {practice.score}/100
                        </span>
                        <span className="mx-1">•</span>
                        <span className="text-xs font-medium text-blue-600 flex items-center">
                          <Zap className="h-3 w-3 mr-1" />
                          {practice.xpEarned} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {practiceHistory.length > 3 && (
                  <button
                    onClick={() => setShowHistory(true)}
                    className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All History
                  </button>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                No practice sessions yet. Start recording to build your history!
              </p>
            )}
          </div>
          
          {/* Progress Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Speaking Confidence</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Presentation Skills</span>
                  <span className="text-sm font-medium">60%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Pitch Mastery</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="h-2 w-full bg-white/20 rounded-full">
                  <div className="h-2 bg-white rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scenarios Modal */}
      {showScenarios && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Practice Scenarios</h2>
                <button
                  onClick={() => setShowScenarios(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                    onClick={() => handleScenarioSelect(scenario)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                        {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatTime(scenario.duration)}</span>
                      </div>
                      <div className="flex items-center">
                        <Zap className="h-3 w-3 mr-1" />
                        <span>{scenario.xpReward} XP reward</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowScenarios(false)}
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
                <h2 className="text-xl font-bold text-gray-900">Practice History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {practiceHistory.length > 0 ? (
                <div className="space-y-4">
                  {practiceHistory.map((practice) => (
                    <div key={practice.id} className="bg-white rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{practice.scenario}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          practice.score >= 80 ? 'bg-green-100 text-green-800' :
                          practice.score >= 60 ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          Score: {practice.score}/100
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatTime(practice.duration)}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{new Date(practice.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-blue-600 font-medium">
                          <Zap className="h-4 w-4 mr-1" />
                          <span>{practice.xpEarned} XP</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No practice history yet. Start recording to build your history!
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