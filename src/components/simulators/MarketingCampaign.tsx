import React, { useState } from 'react';
import { 
  Megaphone, 
  Target, 
  DollarSign, 
  Users,
  TrendingUp,
  Save,
  Download,
  Share2,
  RefreshCw,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';
import Chart from 'react-apexcharts';

interface Campaign {
  name: string;
  goal: 'awareness' | 'conversions' | 'retention';
  budget: number;
  audience: {
    age: string;
    location: string;
    interests: string[];
  };
  channels: {
    id: string;
    name: string;
    budget: number;
    reach: number;
    engagement: number;
    conversion: number;
  }[];
  metrics: {
    totalReach: number;
    engagement: number;
    conversion: number;
    roi: number;
  };
  brandLogo?: string;
}

const initialCampaign: Campaign = {
  name: '',
  goal: 'awareness',
  budget: 0,
  audience: {
    age: '',
    location: '',
    interests: []
  },
  channels: [],
  metrics: {
    totalReach: 0,
    engagement: 0,
    conversion: 0,
    roi: 0
  }
};

const marketingChannels = [
  { name: 'Social Media', minBudget: 5000 },
  { name: 'Search Ads', minBudget: 10000 },
  { name: 'Display Ads', minBudget: 7500 },
  { name: 'Email Marketing', minBudget: 3000 },
  { name: 'Content Marketing', minBudget: 5000 },
  { name: 'Influencer Marketing', minBudget: 15000 }
];

export default function MarketingCampaign() {
  const [campaign, setCampaign] = useState<Campaign>(initialCampaign);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const addChannel = () => {
    const newChannel = {
      id: Date.now().toString(),
      name: marketingChannels[0].name,
      budget: marketingChannels[0].minBudget,
      reach: 0,
      engagement: 0,
      conversion: 0
    };

    setCampaign(prev => ({
      ...prev,
      channels: [...prev.channels, newChannel]
    }));
  };

  const removeChannel = (id: string) => {
    setCampaign(prev => ({
      ...prev,
      channels: prev.channels.filter(channel => channel.id !== id)
    }));
  };

  const calculateMetrics = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const totalBudget = campaign.channels.reduce((sum, channel) => sum + channel.budget, 0);
      
      // Calculate metrics based on budget allocation and campaign goal
      const metrics = {
        totalReach: Math.floor(totalBudget * 10), // Assume 10 people reached per rupee spent
        engagement: campaign.goal === 'awareness' ? 0.05 : campaign.goal === 'conversions' ? 0.03 : 0.08,
        conversion: campaign.goal === 'conversions' ? 0.02 : 0.01,
        roi: ((totalBudget * 1.5) - totalBudget) / totalBudget * 100 // Assume 50% return
      };

      // Update channel-specific metrics
      const updatedChannels = campaign.channels.map(channel => ({
        ...channel,
        reach: Math.floor(channel.budget * 10),
        engagement: metrics.engagement * 100,
        conversion: metrics.conversion * 100
      }));

      setCampaign(prev => ({
        ...prev,
        channels: updatedChannels,
        metrics
      }));

      setIsCalculating(false);
      setShowMetrics(true);
    }, 1500);
  };

  const chartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    colors: ['#4F46E5', '#7C3AED', '#EC4899'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      }
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ['transparent'] },
    xaxis: {
      categories: campaign.channels.map(channel => channel.name)
    },
    yaxis: {
      title: { text: 'Percentage (%)' }
    },
    fill: { opacity: 1 },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`
      }
    }
  };

  const series = [
    {
      name: 'Reach',
      data: campaign.channels.map(channel => (channel.reach / campaign.metrics.totalReach * 100).toFixed(1))
    },
    {
      name: 'Engagement',
      data: campaign.channels.map(channel => channel.engagement)
    },
    {
      name: 'Conversion',
      data: campaign.channels.map(channel => channel.conversion)
    }
  ];

  // Function to import logo from Brand Creator
  const importBrandLogo = () => {
    // In a real implementation, this would fetch the logo from the brand creator
    // For now, we'll simulate it with a placeholder
    setCampaign(prev => ({
      ...prev,
      brandLogo: 'https://via.placeholder.com/150'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Campaign Details */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Campaign Details</h3>
          {campaign.brandLogo ? (
            <div className="flex items-center">
              <img src={campaign.brandLogo} alt="Brand Logo" className="h-8 w-8 mr-2" />
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
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter campaign name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Goal
            </label>
            <select
              value={campaign.goal}
              onChange={(e) => setCampaign({ ...campaign, goal: e.target.value as Campaign['goal'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="awareness">Brand Awareness</option>
              <option value="conversions">Conversions</option>
              <option value="retention">Customer Retention</option>
            </select>
          </div>
        </div>
      </div>

      {/* Target Audience */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Target Audience</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Group
            </label>
            <input
              type="text"
              value={campaign.audience.age}
              onChange={(e) => setCampaign({
                ...campaign,
                audience: { ...campaign.audience, age: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 18-35"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={campaign.audience.location}
              onChange={(e) => setCampaign({
                ...campaign,
                audience: { ...campaign.audience, location: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Mumbai, Delhi"
            />
          </div>
        </div>
      </div>

      {/* Marketing Channels */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Marketing Channels</h3>
          <button
            onClick={addChannel}
            className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Add Channel</span>
          </button>
        </div>
        <div className="space-y-4">
          {campaign.channels.map((channel) => (
            <div
              key={channel.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-indigo-200 transition-colors"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel
                  </label>
                  <select
                    value={channel.name}
                    onChange={(e) => {
                      const selectedChannel = marketingChannels.find(c => c.name === e.target.value);
                      setCampaign({
                        ...campaign,
                        channels: campaign.channels.map(c => 
                          c.id === channel.id
                            ? { ...c, name: e.target.value, budget: selectedChannel?.minBudget || c.budget }
                            : c
                        )
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {marketingChannels.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={channel.budget}
                    onChange={(e) => setCampaign({
                      ...campaign,
                      channels: campaign.channels.map(c =>
                        c.id === channel.id
                          ? { ...c, budget: Number(e.target.value) }
                          : c
                      )
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    min={marketingChannels.find(c => c.name === channel.name)?.minBudget}
                    step="1000"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <button
                    onClick={() => removeChannel(channel.id)}
                    className="p-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {campaign.channels.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No channels added yet. Click "Add Channel" to get started.
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={calculateMetrics}
          disabled={isCalculating || campaign.channels.length === 0}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isCalculating ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Calculating...</span>
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5" />
              <span>Calculate Performance</span>
            </>
          )}
        </button>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Campaign Metrics */}
      {showMetrics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Total Reach</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {campaign.metrics.totalReach.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Engagement Rate</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {(campaign.metrics.engagement * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-pink-100 rounded-lg">
                  <Megaphone className="h-6 w-6 text-pink-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">Conversion Rate</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {(campaign.metrics.conversion * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">ROI</span>
              </div>
              <p className="mt-4 text-2xl font-semibold text-gray-900">
                {campaign.metrics.roi.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Channel Performance</h3>
              <button
                onClick={() => setShowMetrics(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <ChevronUp className="h-5 w-5" />
              </button>
            </div>
            <Chart
              options={chartOptions}
              series={series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      )}
    </div>
  );
}