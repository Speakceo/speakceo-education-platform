import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Palette, Edit3, CheckCircle } from 'lucide-react';
import { useUserStore } from '../../lib/store';
import { getUserBrandData } from '../../lib/supabase';

interface BrandShowcaseProps {
  className?: string;
}

export default function BrandShowcase({ className = '' }: BrandShowcaseProps) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [userBrand, setUserBrand] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserBrand();
  }, [user?.id]);

  const loadUserBrand = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const brandData = await getUserBrandData(user.id);
      if (brandData) {
        setUserBrand(brandData);
      }
    } catch (error) {
      console.error('Error loading user brand:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 animate-pulse ${className}`}>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-white/20 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/20 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userBrand?.brandData) {
    return (
      <div className={`bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6 border border-gray-200 ${className}`}>
        <div className="text-center">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Your Brand</h3>
          <p className="text-gray-600 mb-4">
            Build your brand identity with our AI-powered brand creator
          </p>
          <button
            onClick={() => navigate('/dashboard/business-simulation?tab=branding')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Rocket className="h-4 w-4" />
            <span>Start Creating</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {userBrand.logoUrl ? (
            <div className="relative">
              <img
                src={userBrand.logoUrl}
                alt="Brand Logo"
                className="h-12 w-12 rounded-lg object-cover bg-white p-1 shadow-md"
              />
              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full p-1">
                <CheckCircle className="h-3 w-3" />
              </div>
            </div>
          ) : (
            <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Palette className="h-6 w-6 text-white" />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-bold">{userBrand.brandData.name}</h3>
            <p className="text-indigo-100">{userBrand.brandData.tagline}</p>
            {userBrand.brandData.description && (
              <p className="text-indigo-200 text-sm mt-1 max-w-md">
                {userBrand.brandData.description.substring(0, 100)}
                {userBrand.brandData.description.length > 100 ? '...' : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/dashboard/business-simulation?tab=branding')}
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => navigate('/dashboard/business-simulation')}
            className="bg-white hover:bg-gray-100 text-indigo-600 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
          >
            <Rocket className="h-4 w-4" />
            <span>Continue Building</span>
          </button>
        </div>
      </div>
      
      {/* Brand Colors Preview */}
      {userBrand.brandData.colors && (
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-indigo-100 text-sm">Brand Colors:</span>
          <div className="flex space-x-1">
            {Object.values(userBrand.brandData.colors).map((color: any, index: number) => (
              <div
                key={index}
                className="h-4 w-4 rounded-full border border-white/30"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 