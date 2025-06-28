import React from 'react';
import { Lightbulb, DollarSign, Target, Users, TrendingUp, Mic } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-900 mb-6">SpeakCEO - Pop Challenges</h1>
          <p className="text-xl text-blue-700 mb-8">Quick business challenges to spark your entrepreneurial mind!</p>
        </div>
        
        {/* Pop Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Challenge 1 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-emerald-600 font-semibold">5 mins</div>
                <div className="text-sm text-gray-500">50 XP</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Spot the Million Dollar Idea</h3>
            <p className="text-gray-600 mb-6">Look around your daily life and identify 3 problems that could become profitable businesses!</p>
            <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
              Start Challenge
            </button>
          </div>

          {/* Challenge 2 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-purple-600 font-semibold">7 mins</div>
                <div className="text-sm text-gray-500">75 XP</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Price It Right</h3>
            <p className="text-gray-600 mb-6">Master pricing psychology with real examples. Learn why $9.99 feels cheaper than $10!</p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
              Start Challenge
            </button>
          </div>

          {/* Challenge 3 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-blue-600 font-semibold">6 mins</div>
                <div className="text-sm text-gray-500">60 XP</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Brand or Bland?</h3>
            <p className="text-gray-600 mb-6">Test your brand recognition skills! Learn what makes brand names unforgettable.</p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
              Start Challenge
            </button>
          </div>

          {/* Challenge 4 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-orange-600 font-semibold">8 mins</div>
                <div className="text-sm text-gray-500">80 XP</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer or Competitor?</h3>
            <p className="text-gray-600 mb-6">Sharpen your market analysis skills by identifying target customers for different businesses.</p>
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
              Start Challenge
            </button>
          </div>

          {/* Challenge 5 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-teal-600 font-semibold">10 mins</div>
                <div className="text-sm text-gray-500">100 XP</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Profit or Loss?</h3>
            <p className="text-gray-600 mb-6">Quick math challenges with real business scenarios. Learn to calculate profit margins!</p>
            <button className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
              Start Challenge
            </button>
          </div>

          {/* Challenge 6 */}
          <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-indigo-600 font-semibold">5 mins</div>
                <div className="text-sm text-gray-500">50 XP</div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Pitch Perfect</h3>
            <p className="text-gray-600 mb-6">Practice your elevator pitch skills! Learn to explain your business idea in 30 seconds.</p>
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all">
              Start Challenge
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <div className="bg-green-100 border border-green-300 rounded-lg p-6 inline-block">
            <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 Pop Challenges are Live!</h2>
            <p className="text-green-700">The white screen issue has been fixed. You can now see all 6 Pop Challenges above!</p>
          </div>
        </div>
      </div>
    </div>
  );
}