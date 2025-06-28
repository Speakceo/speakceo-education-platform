import React, { useState, useEffect, useRef } from 'react';
import { Download, Share2, Mail, Rocket, Target, Brain, Sparkles, CheckCircle, ArrowRight, Award, Zap, Lightbulb, BarChart2, PieChart, TrendingUp, Compass, Briefcase, GraduationCap, BookOpen, Layers, Smile, Heart, Star, Clock, Mic } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import Chart from 'react-apexcharts';
import { usePDF } from 'react-to-pdf';
import confetti from 'canvas-confetti';

interface CareerGuideResultProps {
  result: {
    studentName: string;
    age: string;
    overview: string;
    personalityInsights: string;
    learningStyle: string;
    topCareers: string[];
    skillsToDevelop: string[];
    motivationalMessage: string;
    iqScore?: number;
    entrepreneurialScore?: number;
  };
  onClose: () => void;
}

export default function CareerGuideResult({ result, onClose }: CareerGuideResultProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'careers'>('overview');
  const reportRef = useRef<HTMLDivElement>(null);
  
  const { toPDF, targetRef } = usePDF({
    filename: `${result.studentName.replace(/\s+/g, '_')}_Career_Guide.pdf`,
    page: { margin: 20 }
  });
  
  // Animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      if (animationStep < 7) {
        setAnimationStep(animationStep + 1);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [animationStep]);
  
  // Trigger confetti on load
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);
  
  const handleShare = () => {
    setIsSharing(true);
    
    // Simulate sharing functionality
    setTimeout(() => {
      setIsSharing(false);
      alert('Share link copied to clipboard!');
    }, 1000);
  };
  
  const handleEmailReport = () => {
    // Simulate email sending
    setTimeout(() => {
      setIsEmailSent(true);
    }, 1000);
  };
  
  const handleDownloadPDF = async () => {
    try {
      await toPDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };
  
  // Function to get score description
  const getScoreDescription = (score: number | undefined, type: 'iq' | 'entrepreneurial') => {
    if (score === undefined) return '';
    
    if (type === 'iq') {
      if (score >= 90) return 'Excellent';
      if (score >= 75) return 'Very Good';
      if (score >= 60) return 'Good';
      if (score >= 40) return 'Average';
      return 'Developing';
    } else {
      if (score >= 90) return 'Born Entrepreneur';
      if (score >= 75) return 'Strong Potential';
      if (score >= 60) return 'Good Potential';
      if (score >= 40) return 'Developing';
      return 'Early Stage';
    }
  };
  
  // Generate random data for charts
  const generateSkillsData = () => {
    return {
      series: [
        {
          name: 'Current Level',
          data: [65, 80, 55, 70, 60, 75, 50]
        },
        {
          name: 'Potential Growth',
          data: [90, 95, 85, 90, 85, 90, 80]
        }
      ],
      options: {
        chart: {
          type: 'radar',
          toolbar: {
            show: false
          }
        },
        colors: ['#4F46E5', '#EC4899'],
        stroke: {
          width: 2
        },
        fill: {
          opacity: 0.1
        },
        markers: {
          size: 4
        },
        xaxis: {
          categories: ['Creativity', 'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Curiosity']
        },
        yaxis: {
          show: false
        }
      }
    };
  };
  
  const generateCareerCompatibilityData = () => {
    // Generate random compatibility scores for the top careers
    const scores = result.topCareers.map(() => Math.floor(Math.random() * 30) + 70);
    
    return {
      series: scores,
      options: {
        chart: {
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '16px',
                fontFamily: 'inherit',
                fontWeight: 600,
                color: '#111827'
              },
              value: {
                fontSize: '14px',
                fontFamily: 'inherit',
                fontWeight: 400,
                color: '#6B7280'
              },
              total: {
                show: true,
                label: 'Avg. Match',
                formatter: function (w: any) {
                  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) + '%';
                }
              }
            },
            track: {
              background: '#E5E7EB',
              strokeWidth: '97%',
              margin: 5
            },
            hollow: {
              margin: 15,
              size: '30%'
            }
          }
        },
        colors: ['#4F46E5', '#8B5CF6', '#EC4899'],
        labels: result.topCareers,
        stroke: {
          lineCap: 'round'
        }
      }
    };
  };
  
  const generateLearningStyleData = () => {
    // Map learning style to chart data
    const learningStyles = {
      visual: 70,
      auditory: 40,
      kinesthetic: 90
    };
    
    // Default to balanced if no specific style is detected
    let visual = 33;
    let auditory = 33;
    let kinesthetic = 34;
    
    // Try to detect the learning style from the text
    const lowerCaseStyle = result.learningStyle.toLowerCase();
    if (lowerCaseStyle.includes('visual') || lowerCaseStyle.includes('see')) {
      visual = 70;
      auditory = 15;
      kinesthetic = 15;
    } else if (lowerCaseStyle.includes('auditory') || lowerCaseStyle.includes('hear') || lowerCaseStyle.includes('listen')) {
      visual = 15;
      auditory = 70;
      kinesthetic = 15;
    } else if (lowerCaseStyle.includes('kinesthetic') || lowerCaseStyle.includes('hands') || lowerCaseStyle.includes('doing')) {
      visual = 15;
      auditory = 15;
      kinesthetic = 70;
    }
    
    return {
      series: [visual, auditory, kinesthetic],
      options: {
        chart: {
          type: 'pie',
        },
        labels: ['Visual', 'Auditory', 'Kinesthetic'],
        colors: ['#4F46E5', '#8B5CF6', '#EC4899'],
        legend: {
          position: 'bottom'
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      }
    };
  };
  
  const generatePersonalityData = () => {
    // Generate personality trait scores based on the insights
    return {
      series: [{
        data: [85, 75, 90, 65, 80]
      }],
      options: {
        chart: {
          type: 'bar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
            distributed: true,
            dataLabels: {
              position: 'top'
            }
          }
        },
        colors: ['#4F46E5', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return val + '%';
          },
          offsetX: 30,
          style: {
            fontSize: '12px',
            colors: ['#304758']
          }
        },
        xaxis: {
          categories: ['Creativity', 'Analytical', 'Social', 'Practical', 'Adaptability'],
          labels: {
            formatter: function (val: string) {
              return val + '%';
            }
          }
        },
        yaxis: {
          labels: {
            show: true
          }
        }
      }
    };
  };
  
  const generateTimelineData = () => {
    return {
      series: [
        {
          data: [
            {
              x: 'Elementary',
              y: [0, 5]
            },
            {
              x: 'Middle School',
              y: [5, 8]
            },
            {
              x: 'High School',
              y: [8, 12]
            },
            {
              x: 'College/Training',
              y: [12, 16]
            },
            {
              x: 'Early Career',
              y: [16, 20]
            }
          ]
        }
      ],
      options: {
        chart: {
          height: 350,
          type: 'rangeBar',
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            distributed: true,
            dataLabels: {
              hideOverflowingLabels: false
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function(val: any, opts: any) {
            const labels = [
              'Foundation Skills',
              'Explore Interests',
              'Skill Development',
              'Specialization',
              'Career Launch'
            ];
            return labels[opts.dataPointIndex];
          },
          style: {
            colors: ['#f3f4f5', '#fff']
          }
        },
        xaxis: {
          type: 'numeric',
          labels: {
            formatter: function(val: number) {
              return Math.abs(Math.round(val)) + ' yrs';
            }
          }
        },
        yaxis: {
          labels: {
            show: true
          }
        },
        colors: [
          '#4F46E5',
          '#8B5CF6',
          '#EC4899',
          '#F59E0B',
          '#10B981'
        ]
      }
    };
  };
  
  // Generate the chart data
  const skillsChartData = generateSkillsData();
  const careerCompatibilityData = generateCareerCompatibilityData();
  const learningStyleData = generateLearningStyleData();
  const personalityData = generatePersonalityData();
  const timelineData = generateTimelineData();
  
  return (
    <div className="space-y-8">
      {/* Success Message */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start">
        <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
        <div className="ml-3">
          <h3 className="text-green-800 font-medium">Career Guide Generated Successfully!</h3>
          <p className="text-green-700 mt-1">
            We've created a personalized career guide based on {result.studentName}'s responses.
            {isEmailSent ? ' A copy has been emailed to the parent.' : ''}
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-4 px-6 border-b-2 font-medium text-sm ${
            activeTab === 'overview'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Target className="h-5 w-5 inline mr-2" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-4 px-6 border-b-2 font-medium text-sm ${
            activeTab === 'analytics'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <BarChart2 className="h-5 w-5 inline mr-2" />
          Analytics
        </button>
        <button
          onClick={() => setActiveTab('careers')}
          className={`py-4 px-6 border-b-2 font-medium text-sm ${
            activeTab === 'careers'
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Briefcase className="h-5 w-5 inline mr-2" />
          Career Paths
        </button>
      </div>
      
      {/* Report Content */}
      <div ref={targetRef} className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        {/* Header */}
        <div className={`text-center mb-8 pb-6 border-b border-gray-200 transition-opacity duration-500 ${animationStep >= 0 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-4">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Career Pathway Guide</h2>
          <p className="text-lg text-gray-600 mt-2">Personalized for {result.studentName}, Age {result.age}</p>
          <p className="text-sm text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
        </div>
        
        {activeTab === 'overview' && (
          <>
            {/* Scores Section */}
            {(result.iqScore !== undefined || result.entrepreneurialScore !== undefined) && (
              <div className={`mb-8 transition-all duration-500 ${animationStep >= 1 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.iqScore !== undefined && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                          Thinking Skills
                        </h3>
                        <div className="text-2xl font-bold text-blue-600">{result.iqScore}%</div>
                      </div>
                      <div className="h-2 w-full bg-blue-100 rounded-full mb-2">
                        <div 
                          className="h-2 bg-blue-600 rounded-full" 
                          style={{ width: `${result.iqScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Rating: <span className="font-medium text-blue-700">{getScoreDescription(result.iqScore, 'iq')}</span>
                      </p>
                    </div>
                  )}
                  
                  {result.entrepreneurialScore !== undefined && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <Zap className="h-5 w-5 text-purple-600 mr-2" />
                          Entrepreneurial Potential
                        </h3>
                        <div className="text-2xl font-bold text-purple-600">{result.entrepreneurialScore}%</div>
                      </div>
                      <div className="h-2 w-full bg-purple-100 rounded-full mb-2">
                        <div 
                          className="h-2 bg-purple-600 rounded-full" 
                          style={{ width: `${result.entrepreneurialScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Rating: <span className="font-medium text-purple-700">{getScoreDescription(result.entrepreneurialScore, 'entrepreneurial')}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Overview */}
            <div className={`mb-8 transition-all duration-500 ${animationStep >= 2 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-indigo-600 mr-2" />
                Overview
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {result.overview}
              </p>
            </div>
            
            {/* Personality & Learning Style */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all duration-500 ${animationStep >= 3 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
              <div className="bg-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-indigo-600 mr-2" />
                  Personality Insights
                </h3>
                <p className="text-gray-700">
                  {result.personalityInsights}
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                  Learning Style
                </h3>
                <p className="text-gray-700">
                  {result.learningStyle}
                </p>
              </div>
            </div>
            
            {/* Top Career Paths */}
            <div className={`mb-8 transition-all duration-500 ${animationStep >= 4 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Rocket className="h-5 w-5 text-indigo-600 mr-2" />
                Top 3 Suggested Career Paths
              </h3>
              <div className="space-y-4">
                {result.topCareers.map((career, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:border-indigo-200 transition-all duration-500 ${animationStep >= 5 + index ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-10'}`}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-bold mr-3">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 font-medium">{career}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Skills to Develop */}
            <div className={`mb-8 transition-all duration-500 ${animationStep >= 6 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-indigo-600 mr-2" />
                Skills to Develop
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {result.skillsToDevelop.map((skill, index) => (
                  <div 
                    key={index}
                    className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <p className="text-gray-700">{skill}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Motivational Message */}
            <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white transition-all duration-500 ${animationStep >= 7 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
              <h3 className="text-xl font-semibold mb-3">Your Journey Begins Now</h3>
              <p className="leading-relaxed">
                {result.motivationalMessage}
              </p>
            </div>
          </>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Detailed Analytics</h3>
            
            {/* Skills Radar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-indigo-600 mr-2" />
                Skills Assessment & Growth Potential
              </h4>
              <div className="h-80">
                <Chart
                  options={skillsChartData.options}
                  series={skillsChartData.series}
                  type="radar"
                  height="100%"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>This radar chart shows current skill levels and potential growth areas based on the assessment.</p>
              </div>
            </div>
            
            {/* Learning Style Pie Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                  Learning Style Distribution
                </h4>
                <div className="h-64">
                  <Chart
                    options={learningStyleData.options}
                    series={learningStyleData.series}
                    type="pie"
                    height="100%"
                  />
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Understanding {result.studentName}'s learning preferences helps identify optimal educational approaches.</p>
                </div>
              </div>
              
              {/* Personality Traits */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="h-5 w-5 text-indigo-600 mr-2" />
                  Personality Trait Analysis
                </h4>
                <div className="h-64">
                  <Chart
                    options={personalityData.options}
                    series={personalityData.series}
                    type="bar"
                    height="100%"
                  />
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  <p>Key personality traits that influence career preferences and success factors.</p>
                </div>
              </div>
            </div>
            
            {/* Career Compatibility */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Compass className="h-5 w-5 text-green-600 mr-2" />
                Career Path Compatibility
              </h4>
              <div className="h-80">
                <Chart
                  options={careerCompatibilityData.options}
                  series={careerCompatibilityData.series}
                  type="radialBar"
                  height="100%"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Compatibility scores for recommended career paths based on interests, skills, and personality.</p>
              </div>
            </div>
            
            {/* Development Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="h-5 w-5 text-amber-600 mr-2" />
                Career Development Timeline
              </h4>
              <div className="h-80">
                <Chart
                  options={timelineData.options}
                  series={timelineData.series}
                  type="rangeBar"
                  height="100%"
                />
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Recommended focus areas at different educational and career stages.</p>
              </div>
            </div>
            
            {/* Entrepreneurial Potential */}
            {result.entrepreneurialScore !== undefined && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Rocket className="h-5 w-5 text-purple-600 mr-2" />
                  Entrepreneurial Potential Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-700">Innovation Score</h5>
                      <span className="text-lg font-semibold text-purple-600">{Math.round(result.entrepreneurialScore * 0.9)}%</span>
                    </div>
                    <div className="h-2 w-full bg-purple-100 rounded-full">
                      <div 
                        className="h-2 bg-purple-600 rounded-full" 
                        style={{ width: `${Math.round(result.entrepreneurialScore * 0.9)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-700">Risk Tolerance</h5>
                      <span className="text-lg font-semibold text-indigo-600">{Math.round(result.entrepreneurialScore * 0.8)}%</span>
                    </div>
                    <div className="h-2 w-full bg-indigo-100 rounded-full">
                      <div 
                        className="h-2 bg-indigo-600 rounded-full" 
                        style={{ width: `${Math.round(result.entrepreneurialScore * 0.8)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-medium text-gray-700">Leadership Potential</h5>
                      <span className="text-lg font-semibold text-pink-600">{Math.round(result.entrepreneurialScore * 1.1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-pink-100 rounded-full">
                      <div 
                        className="h-2 bg-pink-600 rounded-full" 
                        style={{ width: `${Math.min(100,Math.round(result.entrepreneurialScore * 1.1))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p className="text-gray-700">
                    {result.studentName} shows {result.entrepreneurialScore >= 75 ? 'exceptional' : result.entrepreneurialScore >= 60 ? 'strong' : 'developing'} entrepreneurial potential. 
                    {result.entrepreneurialScore >= 60 ? 
                      ' With the right guidance and opportunities, they could excel in creating and leading their own ventures.' : 
                      ' With continued development of key skills like creativity and risk-taking, their entrepreneurial abilities can be strengthened.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'careers' && (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Career Path Exploration</h3>
            
            {/* Top Career Paths - Detailed */}
            <div className="space-y-6">
              {result.topCareers.map((career, index) => {
                // Generate random career details
                const skills = [
                  'Communication',
                  'Problem Solving',
                  'Creativity',
                  'Technical Knowledge',
                  'Leadership',
                  'Analytical Thinking',
                  'Teamwork'
                ];
                
                // Select 3-5 random skills
                const numSkills = Math.floor(Math.random() * 3) + 3;
                const selectedSkills = [...skills].sort(() => 0.5 - Math.random()).slice(0, numSkills);
                
                // Generate random education paths
                const educationPaths = [
                  'Bachelor\'s Degree',
                  'Specialized Certification',
                  'Technical Training',
                  'Online Courses',
                  'Apprenticeship',
                  'Self-Learning'
                ];
                
                // Select 2-3 random education paths
                const numPaths = Math.floor(Math.random() * 2) + 2;
                const selectedPaths = [...educationPaths].sort(() => 0.5 - Math.random()).slice(0, numPaths);
                
                return (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 text-indigo-600 font-bold mr-3">
                        {index + 1}
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900">{career}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div className="bg-indigo-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Target className="h-4 w-4 text-indigo-600 mr-2" />
                          Key Skills
                        </h5>
                        <ul className="space-y-2">
                          {selectedSkills.map((skill, i) => (
                            <li key={i} className="flex items-center text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <GraduationCap className="h-4 w-4 text-purple-600 mr-2" />
                          Education Paths
                        </h5>
                        <ul className="space-y-2">
                          {selectedPaths.map((path, i) => (
                            <li key={i} className="flex items-center text-gray-700">
                              <ArrowRight className="h-4 w-4 text-purple-500 mr-2 flex-shrink-0" />
                              {path}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          Growth Potential
                        </h5>
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Demand</span>
                              <span className="text-xs font-medium text-gray-700">
                                {Math.floor(Math.random() * 30) + 70}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full">
                              <div 
                                className="h-1.5 bg-green-500 rounded-full" 
                                style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Salary Potential</span>
                              <span className="text-xs font-medium text-gray-700">
                                {Math.floor(Math.random() * 30) + 70}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full">
                              <div 
                                className="h-1.5 bg-green-500 rounded-full" 
                                style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Work-Life Balance</span>
                              <span className="text-xs font-medium text-gray-700">
                                {Math.floor(Math.random() * 30) + 70}%
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full">
                              <div 
                                className="h-1.5 bg-green-500 rounded-full" 
                                style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 text-amber-600 mr-2" />
                        Why This Fits {result.studentName}
                      </h5>
                      <p className="text-gray-700">
                        {career} aligns well with {result.studentName}'s 
                        {index === 0 ? ' strong creative abilities and problem-solving skills' : 
                         index === 1 ? ' excellent communication skills and interest in helping others' :
                         ' analytical mindset and attention to detail'}. 
                        Their {index === 0 ? 'innovative thinking' : 
                               index === 1 ? 'people skills' : 
                               'methodical approach'} would be a valuable asset in this field.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Development Roadmap */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Layers className="h-5 w-5 text-indigo-600 mr-2" />
                Career Development Roadmap
              </h4>
              
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-indigo-200"></div>
                <div className="space-y-8">
                  {[
                    {
                      phase: 'Exploration Phase (Now)',
                      description: 'Discover interests and natural abilities through diverse activities',
                      activities: [
                        'Join clubs related to interests',
                        'Try different hobby projects',
                        'Read books about different careers'
                      ]
                    },
                    {
                      phase: 'Skill Building (Next 2-3 Years)',
                      description: 'Develop foundational skills that align with career interests',
                      activities: [
                        'Take relevant courses',
                        'Participate in competitions',
                        'Find a mentor in area of interest'
                      ]
                    },
                    {
                      phase: 'Experience Gathering (4-6 Years)',
                      description: 'Gain practical experience through projects and internships',
                      activities: [
                        'Work on real-world projects',
                        'Volunteer in related fields',
                        'Build a portfolio of work'
                      ]
                    },
                    {
                      phase: 'Specialization (7+ Years)',
                      description: 'Focus on specific career path and advanced skills',
                      activities: [
                        'Pursue higher education or specialized training',
                        'Network with professionals',
                        'Develop expertise in niche areas'
                      ]
                    }
                  ].map((phase, index) => (
                    <div key={index} className="relative flex items-start ml-8">
                      <div className="absolute -left-8 mt-1">
                        <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-50 to-white rounded-lg p-4 border border-indigo-100 w-full">
                        <h5 className="font-medium text-gray-900 mb-2">{phase.phase}</h5>
                        <p className="text-gray-600 mb-3">{phase.description}</p>
                        <ul className="space-y-1">
                          {phase.activities.map((activity, i) => (
                            <li key={i} className="flex items-center text-gray-700 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* SpeakCEO Programs */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2" />
                How SpeakCEO Can Help
              </h4>
              <p className="mb-4">
                Our specialized programs can help {result.studentName} develop the key skills needed for their future career path:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h5 className="font-medium mb-2 flex items-center">
                    <Rocket className="h-4 w-4 mr-2" />
                    Entrepreneurship Program
                  </h5>
                  <p className="text-sm text-indigo-100">
                    Develop business acumen, innovation skills, and leadership abilities through hands-on projects.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h5 className="font-medium mb-2 flex items-center">
                    <Mic className="h-4 w-4 mr-2" />
                    Public Speaking & Confidence
                  </h5>
                  <p className="text-sm text-indigo-100">
                    Build communication skills and confidence through structured speaking exercises and presentations.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h5 className="font-medium mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2" />
                    Critical Thinking & Problem Solving
                  </h5>
                  <p className="text-sm text-indigo-100">
                    Enhance analytical abilities and creative problem-solving through challenging scenarios.
                  </p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h5 className="font-medium mb-2 flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Personalized Mentorship
                  </h5>
                  <p className="text-sm text-indigo-100">
                    One-on-one guidance from industry experts who can provide career-specific advice and support.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full mt-6 bg-white text-indigo-600 px-4 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                <span>Explore Our Programs</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>This career guide is based on the information provided and is meant to be a starting point for exploration.</p>
          <p className="mt-1">© {new Date().getFullYear()} SpeakCEO. All rights reserved.</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          data-tooltip-id="download-tooltip"
          data-tooltip-content="Download as PDF"
        >
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
        
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-70"
          data-tooltip-id="share-tooltip"
          data-tooltip-content="Share via link"
        >
          <Share2 className="h-5 w-5" />
          <span>{isSharing ? 'Sharing...' : 'Share Report'}</span>
        </button>
        
        <button
          onClick={handleEmailReport}
          disabled={isEmailSent}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
          data-tooltip-id="email-tooltip"
          data-tooltip-content="Send to parent's email"
        >
          <Mail className="h-5 w-5" />
          <span>{isEmailSent ? 'Email Sent!' : 'Email Report'}</span>
        </button>
      </div>
      
      {/* Next Steps */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Take the Next Step?</h3>
        <p className="text-gray-700 mb-4">
          Discover how SpeakCEO can help your child develop the entrepreneurial skills needed for their dream career.
        </p>
        <button
          onClick={onClose}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all w-full justify-center"
        >
          <span>Explore Our Programs</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
      
      <Tooltip id="share-tooltip" />
      <Tooltip id="email-tooltip" />
      <Tooltip id="download-tooltip" />
    </div>
  );
}