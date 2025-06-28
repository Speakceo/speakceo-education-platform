import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  StopCircle, 
  Play, 
  Save, 
  RefreshCw, 
  Download, 
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  BarChart2,
  MessageSquare,
  Presentation,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { analyzePitch } from '../../lib/openai';
import { useSimulatorStore, useBrandStore } from '../../lib/store';
import Chart from 'react-apexcharts';
import confetti from 'canvas-confetti';

interface PitchData {
  content: string;
  duration: number;
  recording?: string;
  brandLogo?: string;
  feedback?: {
    strengths: string[];
    weaknesses: string[];
    clarity: number;
    innovation: number;
    businessModel: number;
    audienceRelevance: number;
    delivery: number;
  };
  score?: number;
  improvements?: string[];
  enhancedPitch?: string;
  oneLiner?: string;
  motivationalNote?: string;
}

export default function PitchSimulator() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [pitch, setPitch] = useState<PitchData>({
    content: '',
    duration: 0
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { businessModel, financial, updatePitch } = useSimulatorStore();
  const { brand, getBrandLogo } = useBrandStore();

  // Initialize audio context and recorder
  useEffect(() => {
    return () => {
      // Clean up on unmount
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // Update the simulator store when pitch changes
  useEffect(() => {
    updatePitch(pitch);
  }, [pitch, updatePitch]);

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
        
        // In a real implementation, this would transcribe the audio to text
        // For now, we'll just use the existing pitch content
        setPitch(prev => ({
          ...prev,
          duration: recordingTime,
          recording: url
        }));
        
        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
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

  const handlePlayRecording = () => {
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

  const handleAnalyzePitch = async () => {
    if (!pitch.content) {
      setError('Please enter your pitch content before analyzing');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Get context from other simulators
      const businessModelContext = businessModel.components.map(comp => 
        `${comp.type.replace(/_/g, ' ')}: ${comp.content}`
      ).join('\n');
      
      const financialContext = {
        revenues: financial.revenues.map(rev => `${rev.name}: ${rev.amount} (${rev.frequency})`).join(', '),
        expenses: financial.expenses.map(exp => `${exp.name}: ${exp.amount} (${exp.frequency})`).join(', '),
        metrics: `Profit Margin: ${financial.metrics.profitMargin}%, Cash Flow: ${financial.metrics.cashFlow}`
      };
      
      // Analyze the pitch
      const result = await analyzePitch({
        content: pitch.content,
        duration: pitch.duration || 60,
        context: {
          businessModel: businessModelContext,
          financial: JSON.stringify(financialContext),
          branding: `Brand Name: ${brand.name}, Tagline: ${brand.tagline}`
        }
      });
      
      // Update pitch with analysis results
      setPitch(prev => ({
        ...prev,
        feedback: result.feedback,
        score: result.score,
        improvements: result.improvements,
        enhancedPitch: result.enhancedPitch,
        oneLiner: result.oneLiner,
        motivationalNote: result.motivationalNote
      }));
      
      // Show confetti for good scores
      if (result.score >= 70) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      setShowResults(true);
    } catch (error) {
      console.error('Error analyzing pitch:', error);
      setError('Failed to analyze your pitch. Please try again later.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Function to import logo from Brand Creator
  const importBrandLogo = () => {
    // Get logo from brand store
    const logoUrl = getBrandLogo();
    
    if (logoUrl) {
      setPitch(prev => ({
        ...prev,
        brandLogo: logoUrl
      }));
    } else {
      // Fallback to localStorage if not in store
      const brandData = localStorage.getItem('brandCreator');
      if (brandData) {
        try {
          const brandInfo = JSON.parse(brandData);
          if (brandInfo.logo?.preview) {
            setPitch(prev => ({
              ...prev,
              brandLogo: brandInfo.logo.preview
            }));
          } else {
            setError('No logo found in brand data. Please create a logo first.');
          }
        } catch (e) {
          console.error('Error parsing brand data:', e);
          setError('Error loading brand data. Please try again.');
        }
      } else {
        setError('No brand data found. Please create a brand first.');
      }
    }
  };

  // Generate chart data for score breakdown
  const generateScoreChartData = () => {
    if (!pitch.feedback) return null;
    
    return {
      series: [pitch.feedback.clarity, pitch.feedback.innovation, pitch.feedback.businessModel, pitch.feedback.audienceRelevance, pitch.feedback.delivery],
      options: {
        chart: {
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '30%',
              background: 'transparent',
              image: undefined,
            },
            dataLabels: {
              name: {
                show: true,
              },
              value: {
                show: true,
              }
            }
          }
        },
        colors: ['#4F46E5', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
        labels: ['Clarity', 'Innovation', 'Business Model', 'Audience', 'Delivery'],
        legend: {
          show: true,
          floating: true,
          fontSize: '14px',
          position: 'right',
          offsetX: 0,
          offsetY: 0,
          labels: {
            useSeriesColors: true,
          },
          formatter: function(seriesName: string, opts: any) {
            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "/20";
          },
          itemMargin: {
            vertical: 3
          }
        }
      }
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Pitch Content */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Your Pitch Script</h3>
            {pitch.brandLogo ? (
              <div className="flex items-center">
                <img src={pitch.brandLogo} alt="Brand Logo" className="h-8 w-8 mr-2" />
                <span className="text-sm text-gray-600">Brand logo imported</span>
              </div>
            ) : (
              <button
                onClick={importBrandLogo}
                className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <ImageIcon className="h-4 w-4" />
                <span>Import Brand Logo</span>
              </button>
            )}
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          <textarea
            value={pitch.content}
            onChange={(e) => setPitch({ ...pitch, content: e.target.value })}
            placeholder="Write your pitch script here... Start with a hook, explain your value proposition, and end with a clear call to action. Include details about your target market, business model, and competitive advantage."
            className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          />
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>{pitch.content.length} characters</span>
            <span>{pitch.content.split(/\s+/).filter(Boolean).length} words</span>
          </div>
          
          {/* Tips for a good pitch */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-medium text-indigo-700 mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Pitch Structure Tips
            </h4>
            <ul className="space-y-2 text-sm text-indigo-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Start with a compelling hook that grabs attention</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Clearly state the problem your business solves</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Explain your solution and what makes it unique</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>Describe your target market and business model</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 mr-2 flex-shrink-0" />
                <span>End with a clear call to action</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Record Your Pitch</h3>
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="h-32 w-32 rounded-full bg-indigo-50 flex items-center justify-center">
              {isRecording ? (
                <StopCircle
                  className="h-16 w-16 text-red-600 cursor-pointer"
                  onClick={handleStopRecording}
                />
              ) : (
                <Mic
                  className="h-16 w-16 text-indigo-600 cursor-pointer"
                  onClick={handleStartRecording}
                />
              )}
            </div>
            <div className="text-center">
              {isRecording ? (
                <div className="text-red-600 animate-pulse flex items-center">
                  <span className="mr-2">●</span> Recording... {formatTime(recordingTime)}
                </div>
              ) : pitch.recording ? (
                <div className="space-y-4">
                  <div className="text-gray-700">
                    <span className="font-medium">Recording saved</span> ({formatTime(pitch.duration)})
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={handlePlayRecording}
                      className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {isPlaying ? (
                        <StopCircle className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span>{isPlaying ? 'Stop' : 'Play'}</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                  </div>
                  
                  {/* Hidden audio element for playback */}
                  <audio ref={audioRef} src={audioUrl || undefined} />
                </div>
              ) : (
                <div className="text-gray-500">
                  Click the microphone to start recording
                </div>
              )}
            </div>
          </div>
          
          {/* Context from other simulators */}
          <div className="mt-8">
            <h4 className="font-medium text-gray-900 mb-4">Pitch Context</h4>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Target className="h-4 w-4 text-indigo-600 mr-2" />
                  Business Model
                </div>
                <p className="text-xs text-gray-500">
                  {businessModel.components.length > 0 
                    ? `${businessModel.components.length} components defined` 
                    : 'No business model defined yet'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <BarChart2 className="h-4 w-4 text-purple-600 mr-2" />
                  Financial Projections
                </div>
                <p className="text-xs text-gray-500">
                  {financial.revenues.length > 0 || financial.expenses.length > 0
                    ? `${financial.revenues.length} revenue streams, ${financial.expenses.length} expenses defined`
                    : 'No financial projections defined yet'}
                </p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <ImageIcon className="h-4 w-4 text-green-600 mr-2" />
                  Brand Identity
                </div>
                <p className="text-xs text-gray-500">
                  {brand.name
                    ? `${brand.name} - ${brand.tagline}`
                    : 'No brand identity defined yet'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAnalyzePitch}
          disabled={isAnalyzing || !pitch.content}
          className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Analyzing Your Pitch...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>Analyze My Pitch</span>
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {showResults && pitch.feedback && (
        <div className="space-y-6">
          {/* Score */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pitch Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white text-center">
                <h4 className="text-lg font-medium mb-2">Overall Score</h4>
                <div className="text-5xl font-bold">{pitch.score}/100</div>
                <p className="mt-2 text-sm text-indigo-100">
                  {pitch.score && pitch.score >= 80 ? 'Excellent!' : 
                   pitch.score && pitch.score >= 60 ? 'Good work!' : 
                   'Needs improvement'}
                </p>
              </div>
              
              <div className="md:col-span-3">
                {pitch.feedback && (
                  <div className="h-64">
                    <Chart
                      options={generateScoreChartData()?.options || {}}
                      series={generateScoreChartData()?.series || []}
                      type="radialBar"
                      height="100%"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Strengths
              </h4>
              <div className="space-y-3">
                {pitch.feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-green-800">{strength}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Weaknesses */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <XCircle className="h-5 w-5 text-amber-500 mr-2" />
                Areas for Improvement
              </h4>
              <div className="space-y-3">
                {pitch.feedback.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start p-3 bg-amber-50 rounded-lg">
                    <XCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-amber-800">{weakness}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Improvement Suggestions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 text-indigo-600 mr-2" />
              Improvement Suggestions
            </h4>
            <div className="space-y-3">
              {pitch.improvements?.map((improvement, index) => (
                <div key={index} className="flex items-start p-4 bg-indigo-50 rounded-lg">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                  </div>
                  <p className="text-indigo-700">{improvement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Pitch */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
              Enhanced Pitch (AI-Rewritten)
            </h4>
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{pitch.enhancedPitch}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                <Save className="h-4 w-4" />
                <span>Save Enhanced Version</span>
              </button>
            </div>
          </div>

          {/* One-Liner and Motivational Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* One-Liner */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-amber-600 mr-2" />
                Investor One-Liner
              </h4>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-amber-800 font-medium">{pitch.oneLiner}</p>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                This concise summary helps investors quickly understand your business concept.
              </p>
            </div>
            
            {/* Motivational Note */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Personal Note
              </h4>
              <p className="italic">{pitch.motivationalNote}</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <Presentation className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="font-medium text-indigo-700">Practice Again</span>
                <span className="text-xs text-indigo-500 mt-1">Refine your delivery</span>
              </button>
              
              <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                <span className="font-medium text-purple-700">Get Mentor Feedback</span>
                <span className="text-xs text-purple-500 mt-1">Expert guidance</span>
              </button>
              
              <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <ArrowRight className="h-8 w-8 text-green-600 mb-2" />
                <span className="font-medium text-green-700">Prepare Pitch Deck</span>
                <span className="text-xs text-green-500 mt-1">Visual presentation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}