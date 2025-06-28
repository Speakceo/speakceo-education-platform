import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Edit, 
  Download, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  Lock, 
  Sparkles,
  Layout,
  PenTool,
  TrendingUp,
  Megaphone,
  Mic,
  Share2,
  Users,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, useSimulatorStore, useBrandStore } from '../../lib/store';
import ProgressBar from '../ui/ProgressBar';
import { Tooltip } from 'react-tooltip';
import { getUserBrandData } from '../../lib/supabase';

interface SimulatorStatus {
  id: string;
  name: string;
  icon: React.ElementType;
  progress: number;
  status: 'completed' | 'in-progress' | 'locked';
  color: string;
}

export default function MyStartup() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { getStartupData } = useSimulatorStore();
  const { brand } = useBrandStore();
  
  const [startupName, setStartupName] = useState('My Awesome Startup');
  const [isEditing, setIsEditing] = useState(false);
  const [startupTagline, setStartupTagline] = useState('Revolutionizing the future');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Get startup data from simulators
  const startupData = getStartupData();
  
  // Get simulator statuses
  const simulators: SimulatorStatus[] = [
    {
      id: 'business-model',
      name: 'Business Model',
      icon: Layout,
      progress: startupData.businessModel.progress,
      status: startupData.businessModel.status,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'brand-identity',
      name: 'Brand Identity',
      icon: PenTool,
      progress: startupData.branding.progress,
      status: startupData.branding.status,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'financial-plan',
      name: 'Financial Plan',
      icon: TrendingUp,
      progress: startupData.financial.progress,
      status: startupData.financial.status,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: Megaphone,
      progress: startupData.marketing.progress,
      status: startupData.marketing.status,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'pitch-deck',
      name: 'Pitch Deck',
      icon: Mic,
      progress: startupData.pitch.progress,
      status: startupData.pitch.status,
      color: 'from-yellow-500 to-amber-500'
    }
  ];
  
  // Check if all simulators are completed
  const allCompleted = simulators.every(sim => sim.status === 'completed');
  
  // Load startup data from brand store on mount
  useEffect(() => {
    const loadUserBrandData = async () => {
      if (!user?.id) return;
      
      try {
        // First try to load from database
        const userBrandData = await getUserBrandData(user.id);
        if (userBrandData?.brandData) {
          setStartupName(userBrandData.brandData.name);
          setStartupTagline(userBrandData.brandData.tagline);
          setLogoUrl(userBrandData.logoUrl);
          return;
        }
      } catch (error) {
        console.error('Error loading user brand data:', error);
      }
      
      // Fallback to brand store
      if (brand.name) {
        setStartupName(brand.name);
        setStartupTagline(brand.tagline);
        setLogoUrl(brand.logoUrl);
        return;
      }
      
      // Fallback to localStorage
      const savedStartup = localStorage.getItem('myStartup');
      if (savedStartup) {
        const data = JSON.parse(savedStartup);
        setStartupName(data.name || 'My Awesome Startup');
        setStartupTagline(data.tagline || 'Revolutionizing the future');
        setLogoUrl(data.logoUrl || '');
      }
      
      // Check if we have a logo from the brand creator
      const brandData = localStorage.getItem('brandCreator');
      if (brandData) {
        try {
          const brandInfo = JSON.parse(brandData);
          if (brandInfo.logo?.preview) {
            setLogoUrl(brandInfo.logo.preview);
          }
          if (brandInfo.name) {
            setStartupName(brandInfo.name);
          }
          if (brandInfo.tagline) {
            setStartupTagline(brandInfo.tagline);
          }
        } catch (e) {
          console.error('Error parsing brand data:', e);
        }
      }
    };
    
    loadUserBrandData();
  }, [brand, user?.id]);
  
  // Save startup data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('myStartup', JSON.stringify({
      name: startupName,
      tagline: startupTagline,
      logoUrl
    }));
  }, [startupName, startupTagline, logoUrl]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSaveClick = () => {
    setIsEditing(false);
    
    // Update brand store
    useBrandStore.getState().setBrand({
      name: startupName,
      tagline: startupTagline
    });
  };
  
  const handleResumeJourney = () => {
    // Find the first incomplete simulator
    const nextSimulator = simulators.find(sim => sim.status === 'in-progress');
    if (nextSimulator) {
      navigate(`/dashboard/business-lab?simulator=${nextSimulator.id}`);
    } else {
      navigate('/dashboard/business-lab');
    }
  };
  
  const handleDownloadPitch = () => {
    // In a real implementation, this would generate and download the pitch deck
    alert('Generating and downloading your pitch deck...');
  };
  
  return (
    <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">My Startup</h3>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <button
              onClick={handleSaveClick}
              className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Save</span>
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo and Basic Info */}
        <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Startup Logo" 
              className="w-32 h-32 object-contain mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
              <Rocket className="h-16 w-16 text-white" />
            </div>
          )}
          
          {isEditing ? (
            <div className="space-y-3 w-full">
              <input
                type="text"
                value={startupName}
                onChange={(e) => setStartupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center"
                placeholder="Startup Name"
              />
              <input
                type="text"
                value={startupTagline}
                onChange={(e) => setStartupTagline(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-sm"
                placeholder="Tagline"
              />
            </div>
          ) : (
            <>
              <h4 className="text-xl font-bold text-gray-900 text-center">{startupName}</h4>
              <p className="text-sm text-gray-600 text-center mt-1">{startupTagline}</p>
            </>
          )}
        </div>
        
        {/* Progress and Simulators */}
        <div className="md:col-span-2 space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Completion</span>
              <span className="text-sm font-medium text-indigo-600">{startupData.overallProgress}%</span>
            </div>
            <ProgressBar 
              progress={startupData.overallProgress} 
              size="md" 
              showLabel={false}
            />
          </div>
          
          {/* Simulator Progress */}
          <div className="space-y-3">
            {simulators.map((simulator) => (
              <div key={simulator.id} className="flex items-center space-x-3">
                <div className={`h-8 w-8 rounded-lg bg-gradient-to-r ${simulator.color} flex items-center justify-center flex-shrink-0`}>
                  <simulator.icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 mr-2">{simulator.name}</span>
                      {simulator.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" data-tooltip-id="simulator-status" data-tooltip-content="Completed" />
                      ) : simulator.status === 'in-progress' ? (
                        <Clock className="h-4 w-4 text-blue-500" data-tooltip-id="simulator-status" data-tooltip-content="In Progress" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" data-tooltip-id="simulator-status" data-tooltip-content="Locked" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{simulator.progress}%</span>
                  </div>
                  <ProgressBar 
                    progress={simulator.progress} 
                    size="sm" 
                    showLabel={false}
                    color={simulator.status === 'completed' ? 'green' : 'indigo'}
                  />
                </div>
              </div>
            ))}
            <Tooltip id="simulator-status" />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              onClick={handleResumeJourney}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-colors"
            >
              <Rocket className="h-5 w-5" />
              <span>Resume Journey</span>
            </button>
            <button
              onClick={handleEditClick}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Edit className="h-5 w-5" />
              <span>Edit Startup</span>
            </button>
            <button
              onClick={handleDownloadPitch}
              disabled={!allCompleted}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-tooltip-id="pitch-tooltip"
              data-tooltip-content={allCompleted ? "Download your complete pitch deck" : "Complete all simulators to unlock your pitch deck"}
            >
              <Download className="h-5 w-5" />
              <span>Download Pitch</span>
            </button>
            <Tooltip id="pitch-tooltip" />
          </div>
        </div>
      </div>
      
      {/* AI Suggestions */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-indigo-700">AI Suggestion</h4>
            <p className="text-sm text-indigo-600 mt-1">
              {startupData.overallProgress < 30 
                ? "Start by defining your business model canvas to clarify your value proposition."
                : startupData.overallProgress < 60
                ? "Your business model looks good! Now focus on creating a strong brand identity."
                : "You're making great progress! Complete your financial projections to prepare for your pitch."}
            </p>
            <button className="mt-2 flex items-center text-xs font-medium text-indigo-700 hover:text-indigo-800">
              <span>Take action</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}