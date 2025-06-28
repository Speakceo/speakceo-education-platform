import React, { useState } from 'react';
import { 
  Layout, 
  TrendingUp, 
  PenTool, 
  Megaphone, 
  Mic, 
  ChevronRight,
  Target,
  DollarSign,
  Users,
  Sparkles,
  ArrowRight,
  X,
  Save,
  Download,
  Share2
} from 'lucide-react';
import { useSimulatorStore } from '../../lib/store';
import SimulatorProvider from '../simulators/SimulatorProvider';
import { 
  BusinessModelCanvas,
  FinancialProjections,
  BrandCreator,
  MarketingCampaign,
  PitchSimulator
} from '../simulators';
import BusinessInsights from './BusinessInsights';

const simulators = [
  {
    id: 'business-model',
    title: 'Business Model Canvas',
    description: 'Create and visualize your business model with AI-powered suggestions',
    icon: Layout,
    color: 'from-blue-500 to-indigo-500',
    features: [
      'Interactive drag-and-drop canvas',
      'AI-driven improvement suggestions',
      'Export to PDF/PNG',
      'Auto-save functionality'
    ]
  },
  {
    id: 'financial',
    title: 'Financial Projections & P&L',
    description: 'Simulate financial scenarios and generate reports',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500',
    features: [
      'Dynamic P&L statements',
      'Breakeven analysis',
      'Cash flow forecasting',
      'AI financial health rating'
    ]
  },
  {
    id: 'branding',
    title: 'Brand & Logo Creator',
    description: 'Design your brand identity with AI assistance',
    icon: PenTool,
    color: 'from-purple-500 to-pink-500',
    features: [
      'AI logo generation',
      'Color palette suggestions',
      'Typography recommendations',
      'Brand guidelines export'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing Campaign Simulator',
    description: 'Plan and test marketing strategies',
    icon: Megaphone,
    color: 'from-orange-500 to-red-500',
    features: [
      'Campaign performance prediction',
      'Budget optimization',
      'Target audience analysis',
      'ROI calculator'
    ]
  },
  {
    id: 'pitch',
    title: 'Business Pitch Simulator',
    description: 'Practice and perfect your pitch with AI feedback',
    icon: Mic,
    color: 'from-yellow-500 to-amber-500',
    features: [
      'Real-time speech analysis',
      'Presentation scoring',
      'Investor Q&A practice',
      'Video recording & playback'
    ]
  }
];

interface SimulatorModalProps {
  simulator: typeof simulators[0];
  isOpen: boolean;
  onClose: () => void;
}

function SimulatorModal({ simulator, isOpen, onClose }: SimulatorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${simulator.color} flex items-center justify-center`}>
              <simulator.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{simulator.title}</h3>
              <p className="text-sm text-gray-500">{simulator.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <SimulatorProvider>
            {simulator.id === 'business-model' && <BusinessModelCanvas />}
            {simulator.id === 'financial' && <FinancialProjections />}
            {simulator.id === 'branding' && <BrandCreator />}
            {simulator.id === 'marketing' && <MarketingCampaign />}
            {simulator.id === 'pitch' && <PitchSimulator />}
          </SimulatorProvider>
        </div>
      </div>
    </div>
  );
}

export default function BusinessSimulation() {
  const [activeTab, setActiveTab] = useState('simulators');
  const [activeSimulator, setActiveSimulator] = useState<typeof simulators[0] | null>(null);

  const handleLaunchSimulator = (simulator: typeof simulators[0]) => {
    setActiveSimulator(simulator);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Lab</h2>
          <p className="text-gray-500 mt-1">
            Practice real business scenarios with AI-powered simulators
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('simulators')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'simulators'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Simulators
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Business Insights
          </button>
        </div>
      </div>

      {activeTab === 'simulators' ? (
        <>
          {/* AI Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Market Validation</h3>
              <p className="text-sm text-gray-500 mt-1">Your business idea has 85% market viability score</p>
            </div>
            <div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Financial Health</h3>
              <p className="text-sm text-gray-500 mt-1">Projected break-even in 8 months</p>
            </div>
            <div
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Target Audience</h3>
              <p className="text-sm text-gray-500 mt-1">Identified 3 key customer segments</p>
            </div>
          </div>

          {/* Simulators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {simulators.map((simulator) => (
              <div
                key={simulator.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${simulator.color} flex items-center justify-center mb-4`}>
                  <simulator.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {simulator.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {simulator.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {simulator.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => handleLaunchSimulator(simulator)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  Launch Simulator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : activeTab === 'insights' ? (
        <BusinessInsights />
      ) : null}

      {/* Simulator Modal */}
      {activeSimulator && (
        <SimulatorModal
          simulator={activeSimulator}
          isOpen={true}
          onClose={() => setActiveSimulator(null)}
        />
      )}
    </div>
  );
}