import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  PenTool, 
  Palette, 
  Type, 
  Download,
  Save,
  Share2,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  Wand2
} from 'lucide-react';
import { generateBrandSuggestions, generateLogo } from '../../lib/openai';
import { useBrandStore, useUserStore } from '../../lib/store';
import { saveUserBrandLogo } from '../../lib/supabase';
import confetti from 'canvas-confetti';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
}

interface Typography {
  heading: string;
  body: string;
}

interface BrandIdentity {
  name: string;
  tagline: string;
  description: string;
  values: string[];
  colors: ColorPalette;
  typography: Typography;
  industry: string;
  personality: string;
  logo?: {
    file?: File;
    preview: string;
    style: 'icon-text' | 'text-only' | 'emblem';
    isAIGenerated?: boolean;
  };
}

const defaultBrandIdentity: BrandIdentity = {
  name: 'SpeakCEO.ai',
  tagline: 'Empowering Young Leaders',
  description: 'Transforming young minds into future business leaders through immersive AI-powered learning experiences.',
  values: ['Leadership', 'Innovation', 'Education', 'Technology'],
  industry: 'Educational Technology',
  personality: 'Professional',
  colors: {
    primary: '#2563EB',    // Modern blue
    secondary: '#4F46E5',  // Deep indigo
    accent: '#0EA5E9',     // Bright blue
    neutral: '#64748B'     // Slate gray
  },
  typography: {
    heading: 'Inter',
    body: 'Inter'
  }
};

const fonts = [
  'Inter',
  'Poppins',
  'Roboto',
  'Montserrat',
  'Open Sans',
  'Playfair Display',
  'Source Sans Pro'
];

const logoStyles = [
  { id: 'icon-text', name: 'Icon + Text', description: 'Logo with icon and brand name' },
  { id: 'text-only', name: 'Text Only', description: 'Typography-focused logo design' },
  { id: 'emblem', name: 'Emblem/Badge', description: 'Enclosed design with integrated elements' }
] as const;

const industries = [
  'Educational Technology',
  'E-Learning',
  'Professional Development',
  'Youth Leadership',
  'Business Education',
  'Career Development',
  'Skills Training',
  'Online Learning',
  'Educational Consulting',
  'Leadership Development'
];

const personalities = [
  'Professional',
  'Innovative',
  'Empowering',
  'Trustworthy',
  'Dynamic',
  'Forward-thinking',
  'Inspiring',
  'Transformative',
  'Engaging',
  'Visionary'
];

export default function BrandCreator() {
  // All hooks must be called at the top level, before any conditional logic
  const [brand, setBrand] = useState<BrandIdentity>(defaultBrandIdentity);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'identity' | 'colors' | 'typography' | 'logo'>('identity');
  const [selectedLogoStyle, setSelectedLogoStyle] = useState<'icon-text' | 'text-only' | 'emblem'>('icon-text');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { setBrand: setGlobalBrand } = useBrandStore();
  const { user } = useUserStore();

  // Function to save logo to user profile
  const saveLogo = useCallback(async (logoUrl: string) => {
    try {
      if (!user?.id) return;
      
      await saveUserBrandLogo(user.id, logoUrl, {
        name: brand.name,
        tagline: brand.tagline,
        colors: brand.colors
      });
    } catch (error) {
      console.error('Failed to save logo:', error);
      setError('Failed to save logo to profile');
    }
  }, [user?.id, brand.name, brand.tagline, brand.colors]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith('image/')) return;

    const logoUrl = URL.createObjectURL(file);
    
    setBrand(prev => ({
      ...prev,
      logo: {
        file,
        preview: logoUrl,
        style: selectedLogoStyle
      }
    }));

    // Save uploaded logo to user's profile
    await saveLogo(logoUrl);
  }, [selectedLogoStyle, saveLogo]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    maxFiles: 1
  });

  // Initialize component
  useEffect(() => {
    try {
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing BrandCreator:', error);
      setError('Failed to initialize brand creator');
      setIsLoading(false);
    }
  }, []);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (brand.logo?.preview && !brand.logo.isAIGenerated) {
        URL.revokeObjectURL(brand.logo.preview);
      }
    };
  }, [brand.logo]);

  // Save brand data to localStorage and global store when it changes
  useEffect(() => {
    // Save to localStorage for other components to access
    localStorage.setItem('brandCreator', JSON.stringify({
      name: brand.name,
      tagline: brand.tagline,
      description: brand.description,
      logo: brand.logo,
      colors: brand.colors,
      typography: brand.typography
    }));

    // Update global brand store
    if (brand.name) {
      setGlobalBrand({
        name: brand.name,
        tagline: brand.tagline,
        description: brand.description,
        logoUrl: brand.logo?.preview || '',
        colors: brand.colors,
        typography: brand.typography
      });
    }

    // Save logo to user profile when it changes
    if (brand.logo?.preview && user?.id) {
      saveLogo(brand.logo.preview);
    }
  }, [brand, setGlobalBrand, user?.id, saveLogo]);

  // Conditional rendering after all hooks are called
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading Brand Creator...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Brand Creator Error</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                // Force re-initialization
                setTimeout(() => setIsLoading(false), 100);
              }}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleGenerateBrand = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const suggestions = await generateBrandSuggestions({
        industry: brand.industry,
        target_audience: 'young professionals',
        values: brand.values
      });

      setBrand(prev => ({
        ...prev,
        name: suggestions.name || prev.name,
        tagline: suggestions.tagline || prev.tagline,
        description: suggestions.description || prev.description,
        colors: {
          ...prev.colors,
          primary: suggestions.colors?.[0] || prev.colors.primary,
          secondary: suggestions.colors?.[1] || prev.colors.secondary,
          accent: suggestions.colors?.[2] || prev.colors.accent
        }
      }));

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error('Error generating brand suggestions:', error);
      setError('Failed to generate brand suggestions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateLogo = async () => {
    if (!brand.name) {
      setError('Please enter a brand name before generating a logo.');
      return;
    }

    setIsGeneratingLogo(true);
    setError(null);
    try {
      const logoUrl = await generateLogo({
        name: brand.name,
        tagline: brand.tagline,
        personality: brand.personality,
        industry: brand.industry,
        typography: brand.typography.heading,
        colors: [brand.colors.primary, brand.colors.secondary, brand.colors.accent],
        style: selectedLogoStyle
      });

      setBrand(prev => ({
        ...prev,
        logo: {
          preview: logoUrl,
          style: selectedLogoStyle,
          isAIGenerated: true
        }
      }));

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Auto-switch to logo tab to show the result
      setActiveTab('logo');

      // Save logo to user's profile
      await saveLogo(logoUrl);
    } catch (error) {
      console.error('Error generating logo:', error);
      setError('Failed to generate logo. Please try again.');
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const data = {
      ...brand,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-brand-guidelines.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRemoveLogo = () => {
    if (brand.logo?.preview && !brand.logo.isAIGenerated) {
      URL.revokeObjectURL(brand.logo.preview);
    }
    setBrand(prev => ({
      ...prev,
      logo: undefined
    }));
  };

  const handleDownloadLogo = (format: 'png' | 'svg') => {
    if (!brand.logo?.preview) return;

    const link = document.createElement('a');
    link.href = brand.logo.preview;
    link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-logo.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleGenerateBrand}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            <span>{isGenerating ? 'Generating...' : 'Generate Brand'}</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Guidelines</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Save className="h-4 w-4" />
            <span>Save Draft</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('identity')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'identity'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PenTool className="h-5 w-5 inline mr-2" />
            Brand Identity
          </button>
          <button
            onClick={() => setActiveTab('colors')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'colors'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Palette className="h-5 w-5 inline mr-2" />
            Color Palette
          </button>
          <button
            onClick={() => setActiveTab('typography')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'typography'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Type className="h-5 w-5 inline mr-2" />
            Typography
          </button>
          <button
            onClick={() => setActiveTab('logo')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'logo'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ImageIcon className="h-5 w-5 inline mr-2" />
            Logo
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {activeTab === 'identity' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Name & Tagline</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brand.name}
                      onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={brand.tagline}
                      onChange={(e) => setBrand({ ...brand, tagline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter tagline"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Description
                    </label>
                    <textarea
                      value={brand.description}
                      onChange={(e) => setBrand({ ...brand, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe your brand"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Attributes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      value={brand.industry}
                      onChange={(e) => setBrand({ ...brand, industry: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Personality
                    </label>
                    <select
                      value={brand.personality}
                      onChange={(e) => setBrand({ ...brand, personality: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {personalities.map((personality) => (
                        <option key={personality} value={personality.toLowerCase()}>
                          {personality}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand Values
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {brand.values.map((value, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          {value}
                          <button
                            onClick={() => {
                              const newValues = [...brand.values];
                              newValues.splice(index, 1);
                              setBrand({ ...brand, values: newValues });
                            }}
                            className="ml-2 text-indigo-500 hover:text-indigo-700"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a brand value"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = e.currentTarget.value.trim();
                            if (value && !brand.values.includes(value)) {
                              setBrand({
                                ...brand,
                                values: [...brand.values, value]
                              });
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add a brand value"]') as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !brand.values.includes(value)) {
                            setBrand({
                              ...brand,
                              values: [...brand.values, value]
                            });
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Color Palette</h3>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(brand.colors).map(([name, color]) => (
                  <div key={name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {name}
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) =>
                          setBrand({
                            ...brand,
                            colors: { ...brand.colors, [name]: e.target.value }
                          })
                        }
                        className="h-10 w-20 rounded border border-gray-300"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) =>
                          setBrand({
                            ...brand,
                            colors: { ...brand.colors, [name]: e.target.value }
                          })
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <button
                        onClick={() => handleCopyColor(color)}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                      >
                        {copied ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <Copy className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Typography</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading Font
                  </label>
                  <select
                    value={brand.typography.heading}
                    onChange={(e) =>
                      setBrand({
                        ...brand,
                        typography: { ...brand.typography, heading: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                  <p
                    className="mt-4 text-3xl"
                    style={{ fontFamily: brand.typography.heading }}
                  >
                    {brand.name || 'Sample Heading'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body Font
                  </label>
                  <select
                    value={brand.typography.body}
                    onChange={(e) =>
                      setBrand({
                        ...brand,
                        typography: { ...brand.typography, body: e.target.value }
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font}>
                        {font}
                      </option>
                    ))}
                  </select>
                  <p
                    className="mt-4"
                    style={{ fontFamily: brand.typography.body }}
                  >
                    {brand.description || 'Sample body text. This is how your main content will look.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logo' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Logo Style</h3>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {logoStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedLogoStyle(style.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedLogoStyle === style.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      <h4 className="font-medium text-gray-900">{style.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center mb-6">
                  <button
                    onClick={handleGenerateLogo}
                    disabled={isGeneratingLogo || !brand.name}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {isGeneratingLogo ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <Wand2 className="h-5 w-5" />
                    )}
                    <span>{isGeneratingLogo ? 'Generating Logo...' : 'Generate Logo with AI'}</span>
                  </button>
                </div>

                <div className="text-center text-sm text-gray-500 mb-6">
                  <p>Or upload your own logo</p>
                </div>

                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    isDragActive
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-700">
                        {isDragActive
                          ? 'Drop your logo here...'
                          : 'Drag & drop your logo here, or click to select a file'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports PNG, JPG, JPEG, SVG up to 5MB
                      </p>
                    </div>
                  </div>
                </div>

                {brand.logo && (
                  <div className="mt-6">
                    <div className="relative">
                      <img
                        src={brand.logo.preview}
                        alt="Logo preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        onClick={handleRemoveLogo}
                        className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex justify-center space-x-4">
                      <button 
                        onClick={() => handleDownloadLogo('png')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Download PNG
                      </button>
                      <button 
                        onClick={() => handleDownloadLogo('svg')}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Download SVG
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
            <div
              className="p-6 rounded-lg"
              style={{ backgroundColor: brand.colors.neutral + '10' }}
            >
              {brand.logo && (
                <div className="mb-4 flex justify-center">
                  <img
                    src={brand.logo.preview}
                    alt="Brand logo"
                    className="max-h-24 rounded-lg"
                  />
                </div>
              )}
              <h2
                className="text-2xl font-bold mb-2 text-center"
                style={{
                  fontFamily: brand.typography.heading,
                  color: brand.colors.primary
                }}
              >
                {brand.name || 'SpeakCEO.ai'}
              </h2>
              <p
                className="text-lg mb-4 text-center"
                style={{
                  color: brand.colors.secondary
                }}
              >
                {brand.tagline || 'Empowering Young Leaders'}
              </p>
              <p
                className="text-center mb-6"
                style={{
                  fontFamily: brand.typography.body,
                  color: brand.colors.neutral
                }}
              >
                {brand.description || 'Transforming young minds into future business leaders through immersive AI-powered learning experiences.'}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(brand.values.length > 0 ? brand.values : ['Leadership', 'Innovation', 'Education', 'Technology']).map((value, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: brand.colors.accent + '15',
                      color: brand.colors.accent
                    }}
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">AI Brand Assistant</h3>
            </div>
            <p className="text-indigo-100 mb-4">
              Need help with your brand identity? Our AI can generate brand suggestions and create a professional logo based on your inputs.
            </p>
            <div className="space-y-2">
              <button
                onClick={handleGenerateBrand}
                disabled={isGenerating}
                className="w-full bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Brand Identity'}
              </button>
              <button
                onClick={handleGenerateLogo}
                disabled={isGeneratingLogo || !brand.name}
                className="w-full bg-white/20 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                {isGeneratingLogo ? 'Generating...' : 'Generate Logo with AI'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}