import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  FileText, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Clock,
  BookOpen,
  MessageCircle,
  Star,
  RotateCcw
} from 'lucide-react';
import { Lesson, Week } from '../../types';

interface CourseLessonViewerProps {
  lesson: Lesson;
  week: Week;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onBack: () => void;
}

export default function CourseLessonViewer({
  lesson,
  week,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  onBack
}: CourseLessonViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(lesson.isCompleted);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  // Track video progress for completion
  useEffect(() => {
    if (videoRef) {
      const handleTimeUpdate = () => {
        setCurrentTime(videoRef.currentTime);
        
        // Mark as completed when 80% watched
        if (videoRef.currentTime / videoRef.duration >= 0.8 && !isCompleted) {
          setIsCompleted(true);
          onComplete();
        }
      };

      const handleDurationChange = () => {
        setDuration(videoRef.duration);
      };

      videoRef.addEventListener('timeupdate', handleTimeUpdate);
      videoRef.addEventListener('durationchange', handleDurationChange);

      return () => {
        videoRef.removeEventListener('timeupdate', handleTimeUpdate);
        videoRef.removeEventListener('durationchange', handleDurationChange);
      };
    }
  }, [videoRef, isCompleted, onComplete]);

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef) {
      const time = (parseFloat(e.target.value) / 100) * duration;
      videoRef.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadResource = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <p className="text-sm font-medium text-gray-500">Week {week.weekNumber}: {week.title}</p>
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
          </div>
        </div>
        
        {isCompleted && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden mb-6 relative group">
            <video
              ref={setVideoRef}
              src={lesson.videoUrl}
              className="w-full aspect-video"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              poster="/api/placeholder/800/450"
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>
                
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={duration ? (currentTime / duration) * 100 : 0}
                    onChange={handleSeek}
                    className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
                
                <Volume2 className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Play Button Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={togglePlay}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-4 hover:bg-white/30 transition-colors"
                >
                  <Play className="h-12 w-12 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Lesson Description */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About This Lesson</h2>
            <p className="text-gray-600 mb-4">{lesson.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{lesson.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Week {week.weekNumber}</span>
              </div>
            </div>
          </div>

          {/* Downloadable Resources */}
          {(lesson.pdfUrl || lesson.pptUrl) && (
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-indigo-600" />
                Downloadable Resources
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lesson.pdfUrl && (
                  <button
                    onClick={() => downloadResource(lesson.pdfUrl!, `${lesson.title}.pdf`)}
                    className="flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">PDF Notes</p>
                      <p className="text-sm text-gray-500">Download lesson materials</p>
                    </div>
                    <Download className="h-5 w-5 text-red-500 group-hover:text-red-600" />
                  </button>
                )}
                
                {lesson.pptUrl && (
                  <button
                    onClick={() => downloadResource(lesson.pptUrl!, `${lesson.title}.pptx`)}
                    className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Presentation</p>
                      <p className="text-sm text-gray-500">Download slides</p>
                    </div>
                    <Download className="h-5 w-5 text-orange-500 group-hover:text-orange-600" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Previous Lesson
            </button>
            
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Lesson
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Progress Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Lesson Progress</span>
                  <span className="text-sm font-bold text-gray-700">
                    {Math.round((currentTime / duration) * 100) || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-t">
                <span className="text-sm font-medium text-gray-600">Completion Status</span>
                {isCompleted ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Complete</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">In Progress</span>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">My Notes</h3>
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {showNotes ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showNotes && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes while you learn..."
                rows={6}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-3">
              <MessageCircle className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Need Help?</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Ask our AI assistant questions about this lesson or any concepts you don't understand.
            </p>
            <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Ask Question
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (videoRef) {
                    videoRef.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <RotateCcw className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Restart Video</span>
              </button>
              
              <button
                onClick={() => setNotes('')}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileText className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Clear Notes</span>
              </button>
              
              <button className="w-full flex items-center gap-3 p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <Star className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">Rate Lesson</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 