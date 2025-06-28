import React, { useState, useEffect } from 'react';
import { Image, Check, X, RefreshCw } from 'lucide-react';
import { useUserStore } from '../../lib/store';
import { getUserBrandData, saveUserBrandLogo } from '../../lib/supabase';

export default function LogoTest() {
  const { user } = useUserStore();
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    loadUserLogo();
  }, [user?.id]);

  const loadUserLogo = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const brandData = await getUserBrandData(user.id);
      if (brandData?.logoUrl) {
        setLogoUrl(brandData.logoUrl);
        setStatus('✅ Logo found in database');
      } else {
        setStatus('❌ No logo found in database');
      }
    } catch (error) {
      setStatus('❌ Error loading logo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const testSaveLogo = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Save a test logo URL
      const testLogoUrl = 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=TEST';
      await saveUserBrandLogo(user.id, testLogoUrl, {
        name: 'Test Brand',
        tagline: 'Testing Logo Persistence',
        description: 'This is a test brand for logo persistence'
      });
      
      setLogoUrl(testLogoUrl);
      setStatus('✅ Test logo saved successfully');
    } catch (error) {
      setStatus('❌ Error saving test logo');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Image className="h-5 w-5 mr-2" />
        Logo Persistence Test
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Current Status:</span>
          <span className="text-sm font-medium">{status}</span>
        </div>
        
        {logoUrl && (
          <div className="flex justify-center">
            <img
              src={logoUrl}
              alt="User Logo"
              className="h-24 w-24 rounded-lg object-cover border border-gray-200"
            />
          </div>
        )}
        
        <div className="flex space-x-3">
          <button
            onClick={loadUserLogo}
            disabled={loading}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Reload</span>
          </button>
          
          <button
            onClick={testSaveLogo}
            disabled={loading}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            <span className="ml-2">Test Save</span>
          </button>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <strong>Test Instructions:</strong>
          <br />1. Click "Test Save" to save a test logo
          <br />2. Refresh the page or logout/login
          <br />3. Click "Reload" to check if logo persists
          <br />4. If it persists, the issue is fixed! 🎉
        </div>
      </div>
    </div>
  );
} 