import React, { useState, useEffect } from 'react';
import { 
  Target, 
  DollarSign, 
  Users, 
  RefreshCw, 
  Edit, 
  Save, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Zap,
  Sparkles,
  Loader
} from 'lucide-react';
import { useSimulatorStore } from '../../lib/store';
import Chart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';
import { ApexOptions } from 'apexcharts';

interface InsightProps {
  title: string;
  score: number;
  description: string;
  improvement: string;
  icon: React.ReactNode;
  color: string;
  isLoading?: boolean;
}

const Insight: React.FC<InsightProps> = ({ title, score, description, improvement, icon, color, isLoading = false }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-${color}-200 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`h-10 w-10 rounded-lg bg-${color}-100 flex items-center justify-center mr-3`}>
            {isLoading ? <Loader className="h-5 w-5 text-gray-400 animate-spin" /> : icon}
          </div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isLoading ? 'bg-gray-100 text-gray-500' : `bg-${color}-100 text-${color}-800`}`}>
          {isLoading ? 'Analyzing...' : `${score}%`}
        </div>
      </div>
      {isLoading ? (
        <div className="h-20 flex items-center justify-center">
          <p className="text-gray-500">Analyzing your business data...</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="mt-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${color}-500 rounded-full transition-all duration-1000 ease-out`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 flex items-start">
              <Sparkles className={`h-4 w-4 text-${color}-500 mr-2 mt-0.5 flex-shrink-0`} />
              <span>{improvement}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default function BusinessInsights() {
  const navigate = useNavigate();
  const { businessModel, financial } = useSimulatorStore();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEditingFeedback, setIsEditingFeedback] = useState(false);
  const [aiFeedback, setAIFeedback] = useState<string>("");
  const [editedFeedback, setEditedFeedback] = useState<string>("");
  const [marketScore, setMarketScore] = useState<number>(0);
  const [financialScore, setFinancialScore] = useState<number>(0);
  const [audienceScore, setAudienceScore] = useState<number>(0);
  const [breakEvenMonths, setBreakEvenMonths] = useState<number>(0);
  const [customerSegments, setCustomerSegments] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have enough data to analyze
  useEffect(() => {
    try {
      const hasBusinessModelData = businessModel.components.length > 0;
      const hasFinancialData = financial.revenues.length > 0 || financial.expenses.length > 0;
      
      setHasData(hasBusinessModelData || hasFinancialData);
      
      // If we have data, start analysis
      if (hasBusinessModelData || hasFinancialData) {
        analyzeData();
      } else {
        setIsAnalyzing(false);
      }
    } catch (err) {
      console.error('Error checking data:', err);
      setError('Failed to check business data. Please try again.');
      setIsAnalyzing(false);
    }
  }, [businessModel.components, financial.revenues, financial.expenses]);

  // Analyze data when business model or financials change
  useEffect(() => {
    // Only run if we have data and when components or financials change
    if (hasData && !isRefreshing) {
      analyzeData();
    }
  }, [businessModel.components, financial.revenues, financial.expenses, financial.metrics]);

  const analyzeData = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Calculate all metrics
      const newMarketScore = calculateMarketScore();
      const newFinancialScore = calculateFinancialScore();
      const newAudienceScore = calculateAudienceScore();
      const newBreakEvenMonths = calculateBreakEvenTime();
      const newCustomerSegments = identifyCustomerSegments();
      
      // Generate AI feedback based on the analysis
      const newFeedback = generateAIFeedback(
        newMarketScore, 
        newFinancialScore, 
        newAudienceScore, 
        newBreakEvenMonths
      );
      
      // Update state with new values
      setMarketScore(newMarketScore);
      setFinancialScore(newFinancialScore);
      setAudienceScore(newAudienceScore);
      setBreakEvenMonths(newBreakEvenMonths);
      setCustomerSegments(newCustomerSegments);
      setAIFeedback(newFeedback);
      setEditedFeedback(newFeedback);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error analyzing data:', err);
      setError('Failed to analyze business data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate market validation score based on business model components
  const calculateMarketScore = () => {
    // Check if key components exist and have content
    const hasValueProp = businessModel.components.some(c => 
      c.type === 'value_propositions' && c.content.trim().length > 20
    );
    
    const hasCustomerSegments = businessModel.components.some(c => 
      c.type === 'customer_segments' && c.content.trim().length > 10
    );
    
    const hasRevenue = businessModel.components.some(c => 
      c.type === 'revenue_streams' && c.content.trim().length > 10
    );
    
    // Calculate base score
    let score = 50; // Start at 50%
    
    if (hasValueProp) score += 20;
    if (hasCustomerSegments) score += 15;
    if (hasRevenue) score += 15;
    
    // Adjust based on component count and quality
    const filledComponents = businessModel.components.filter(c => c.content.trim().length > 10).length;
    const totalPossibleComponents = 9; // Total number of business model canvas components
    
    // Add up to 10% based on completeness
    score += Math.min(10, Math.round((filledComponents / totalPossibleComponents) * 10));
    
    // Cap at 100%
    return Math.min(100, score);
  };

  // Calculate financial health score
  const calculateFinancialScore = () => {
    if (financial.revenues.length === 0 || financial.expenses.length === 0) {
      return 40; // Base score if no data
    }
    
    // Calculate total annual revenue
    const annualRevenue = financial.revenues.reduce((total, rev) => {
      const multiplier = 
        rev.frequency === 'monthly' ? 12 :
        rev.frequency === 'quarterly' ? 4 :
        rev.frequency === 'yearly' ? 1 : 1;
      return total + (rev.amount * multiplier);
    }, 0);
    
    // Calculate total annual expenses
    const annualExpenses = financial.expenses.reduce((total, exp) => {
      const multiplier = 
        exp.frequency === 'monthly' ? 12 :
        exp.frequency === 'quarterly' ? 4 :
        exp.frequency === 'yearly' ? 1 : 1;
      return total + (exp.amount * multiplier);
    }, 0);
    
    // Calculate profit margin
    const profitMargin = annualRevenue > 0 
      ? ((annualRevenue - annualExpenses) / annualRevenue) * 100
      : -100;
    
    // Calculate break-even time in months
    const monthlyRevenue = annualRevenue / 12;
    const monthlyExpenses = annualExpenses / 12;
    const breakEvenMonths = monthlyExpenses > 0 && monthlyRevenue > monthlyExpenses
      ? Math.ceil(annualExpenses / (monthlyRevenue - monthlyExpenses))
      : 24; // Default to 24 months if calculation isn't possible
    
    // Score based on profit margin and break-even time
    let score = 50; // Base score
    
    // Adjust for profit margin (up to +/- 30 points)
    if (profitMargin > 30) score += 30;
    else if (profitMargin > 20) score += 25;
    else if (profitMargin > 10) score += 15;
    else if (profitMargin > 0) score += 5;
    else if (profitMargin > -10) score -= 5;
    else if (profitMargin > -20) score -= 15;
    else score -= 30;
    
    // Adjust for break-even time (up to +/- 20 points)
    if (breakEvenMonths <= 6) score += 20;
    else if (breakEvenMonths <= 12) score += 15;
    else if (breakEvenMonths <= 18) score += 5;
    else if (breakEvenMonths > 24) score -= 10;
    else if (breakEvenMonths > 36) score -= 20;
    
    // Cap between 0 and 100
    return Math.max(0, Math.min(100, score));
  };

  // Calculate target audience score
  const calculateAudienceScore = () => {
    // Check if customer segments component exists and has content
    const customerSegments = businessModel.components.find(c => c.type === 'customer_segments');
    
    if (!customerSegments || customerSegments.content.trim().length < 10) {
      return 30; // Base score if no data
    }
    
    // Calculate score based on content length and quality
    const content = customerSegments.content;
    let score = 50; // Base score
    
    // Length-based scoring
    if (content.length > 200) score += 15;
    else if (content.length > 100) score += 10;
    else if (content.length > 50) score += 5;
    
    // Check for specific audience details
    if (content.toLowerCase().includes('age') || 
        content.toLowerCase().includes('demographic')) score += 10;
    
    if (content.toLowerCase().includes('income') || 
        content.toLowerCase().includes('spending')) score += 10;
    
    if (content.toLowerCase().includes('need') || 
        content.toLowerCase().includes('problem') ||
        content.toLowerCase().includes('pain point')) score += 15;
    
    // Cap at 100%
    return Math.min(100, score);
  };

  // Calculate break-even time
  const calculateBreakEvenTime = () => {
    if (financial.revenues.length === 0 || financial.expenses.length === 0) {
      return 18; // Default if no data
    }
    
    // Calculate monthly revenue
    const monthlyRevenue = financial.revenues.reduce((total, rev) => {
      if (rev.frequency === 'monthly') return total + rev.amount;
      if (rev.frequency === 'quarterly') return total + (rev.amount / 3);
      if (rev.frequency === 'yearly') return total + (rev.amount / 12);
      return total + (rev.amount / 12); // Assume one-time revenues spread over a year
    }, 0);
    
    // Calculate monthly expenses
    const monthlyExpenses = financial.expenses.reduce((total, exp) => {
      if (exp.frequency === 'monthly') return total + exp.amount;
      if (exp.frequency === 'quarterly') return total + (exp.amount / 3);
      if (exp.frequency === 'yearly') return total + (exp.amount / 12);
      return total + (exp.amount / 12); // Assume one-time expenses spread over a year
    }, 0);
    
    // Calculate break-even time in months
    if (monthlyRevenue <= monthlyExpenses) {
      return 24; // Default if not profitable monthly
    }
    
    // Calculate total initial expenses to recover
    const initialExpenses = financial.expenses
      .filter(exp => exp.frequency === 'one-time')
      .reduce((total, exp) => total + exp.amount, 0);
    
    // Monthly profit
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    
    // Months to break even
    const breakEvenMonths = Math.ceil(initialExpenses / monthlyProfit);
    
    return breakEvenMonths > 0 ? breakEvenMonths : 1;
  };

  // Generate AI feedback based on analysis
  const generateAIFeedback = (marketScore: number, financialScore: number, audienceScore: number, breakEvenMonths: number) => {
    let feedback = "";
    
    // Market validation feedback
    if (marketScore >= 80) {
      feedback += "Your business model shows strong market validation. The value proposition is clear and addresses a specific customer need. ";
    } else if (marketScore >= 60) {
      feedback += "Your business model has good market potential, but consider refining your value proposition to more clearly address customer pain points. ";
    } else {
      feedback += "Your business model needs significant work on market validation. Focus on clearly defining the problem you're solving and how your solution is unique. ";
    }
    
    // Financial health feedback
    if (financialScore >= 80) {
      feedback += "Your financial projections look solid with a reasonable break-even timeline. ";
    } else if (financialScore >= 60) {
      feedback += "Your financial projections appear somewhat optimistic - consider a more conservative growth rate for the first year. ";
    } else {
      feedback += "Your financial model shows significant risks. Review your revenue assumptions and look for ways to reduce expenses to achieve a faster break-even point. ";
    }
    
    // Target audience feedback
    if (audienceScore >= 80) {
      feedback += "Your target audience definition is excellent, with clear demographic and behavioral details. ";
    } else if (audienceScore >= 60) {
      feedback += "Your target audience definition is good, but could benefit from more specific demographic details. ";
    } else {
      feedback += "Your target audience definition needs significant improvement. Be more specific about who your customers are and what motivates them. ";
    }
    
    // Break-even feedback
    if (breakEvenMonths <= 12) {
      feedback += "With a projected break-even point of " + breakEvenMonths + " months, your business shows strong potential for early profitability.";
    } else if (breakEvenMonths <= 24) {
      feedback += "Your projected break-even point of " + breakEvenMonths + " months is reasonable, but look for opportunities to accelerate revenue growth.";
    } else {
      feedback += "A break-even point of " + breakEvenMonths + " months is concerning. Consider revising your pricing strategy or finding ways to reduce operational costs.";
    }
    
    return feedback;
  };

  // Identify customer segments
  const identifyCustomerSegments = () => {
    const customerSegments = businessModel.components.find(c => c.type === 'customer_segments');
    
    if (!customerSegments || customerSegments.content.trim().length < 10) {
      return [
        { name: 'Young Professionals', description: 'Age 25-35, tech-savvy, urban dwellers', reachStrategy: 'Social media and professional networking events' },
        { name: 'Small Business Owners', description: 'Local businesses with 5-20 employees', reachStrategy: 'Industry-specific forums and local business associations' }
      ];
    }
    
    // Simple parsing of customer segments (in a real app, this would use NLP)
    const content = customerSegments.content.toLowerCase();
    const segments = [];
    
    if (content.includes('student') || content.includes('young') || content.includes('teen')) {
      segments.push({ 
        name: 'Students & Young Adults', 
        description: 'Age 16-24, tech-native, budget-conscious',
        reachStrategy: 'Social media campaigns on Instagram and TikTok with student discounts'
      });
    }
    
    if (content.includes('professional') || content.includes('career') || content.includes('working')) {
      segments.push({ 
        name: 'Working Professionals', 
        description: 'Age 25-45, career-focused, time-constrained',
        reachStrategy: 'LinkedIn advertising and professional networking events'
      });
    }
    
    if (content.includes('parent') || content.includes('family')) {
      segments.push({ 
        name: 'Parents & Families', 
        description: 'Parents with children under 18, family-oriented',
        reachStrategy: 'Partnerships with family-oriented services and parenting blogs'
      });
    }
    
    if (content.includes('senior') || content.includes('elder') || content.includes('retire')) {
      segments.push({ 
        name: 'Seniors & Retirees', 
        description: 'Age 60+, increasing tech adoption, value-focused',
        reachStrategy: 'Traditional media and community center workshops'
      });
    }
    
    if (content.includes('business') || content.includes('enterprise') || content.includes('company')) {
      segments.push({ 
        name: 'Business Clients', 
        description: 'SMBs and enterprises seeking solutions',
        reachStrategy: 'Direct B2B outreach and industry conference sponsorships'
      });
    }
    
    // Return at least 2 segments
    if (segments.length < 2) {
      segments.push({ 
        name: 'Urban Millennials', 
        description: 'Age 25-35, tech-savvy, urban dwellers',
        reachStrategy: 'Targeted social media campaigns and urban event sponsorships'
      });
    }
    
    // Limit to 3 segments
    return segments.slice(0, 3);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await analyzeData();
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh business data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveFeedback = async () => {
    try {
      // Save the edited feedback
      setAIFeedback(editedFeedback);
      setIsEditingFeedback(false);
    } catch (err) {
      console.error('Error saving feedback:', err);
      setError('Failed to save feedback. Please try again.');
    }
  };

  const handleGoToSimulators = () => {
    navigate('/simulators');
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Business Insights</h2>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
        <div className="text-red-600 mb-4">{error}</div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Business Insights</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No business data available yet.</p>
          <button
            onClick={handleGoToSimulators}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Simulators
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Business Insights</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg transition-colors ${
              isRefreshing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            }`}
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Insight
          title="Market Validation"
          score={marketScore}
          description="How well your business model addresses market needs"
          improvement="Focus on defining clear value propositions and customer segments"
          icon={<Target className="h-5 w-5 text-indigo-600" />}
          color="indigo"
          isLoading={isAnalyzing}
        />
        <Insight
          title="Financial Health"
          score={financialScore}
          description="Overall financial sustainability and growth potential"
          improvement="Work on diversifying revenue streams and optimizing costs"
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
          color="green"
          isLoading={isAnalyzing}
        />
        <Insight
          title="Audience Growth"
          score={audienceScore}
          description="Potential for customer acquisition and retention"
          improvement="Develop targeted marketing strategies for each segment"
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="blue"
          isLoading={isAnalyzing}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Break-Even Analysis</h3>
          {isAnalyzing ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">Calculating break-even point...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Estimated break-even in</span>
                <span className="text-lg font-semibold text-indigo-600">
                  {breakEvenMonths} months
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(100, (breakEvenMonths / 24) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500">
                Based on current revenue and expense projections
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">AI Feedback</h3>
            {!isEditingFeedback ? (
              <button
                onClick={() => setIsEditingFeedback(true)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSaveFeedback}
                className="p-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <Save className="h-5 w-5" />
              </button>
            )}
          </div>
          {isAnalyzing ? (
            <div className="h-40 flex items-center justify-center">
              <p className="text-gray-500">Generating insights...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {isEditingFeedback ? (
                <textarea
                  value={editedFeedback}
                  onChange={(e) => setEditedFeedback(e.target.value)}
                  className="w-full h-40 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Edit AI feedback..."
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">{aiFeedback}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}