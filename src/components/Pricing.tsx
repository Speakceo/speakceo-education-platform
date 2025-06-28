import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Star, Rocket, Brain, Target, Users, Sparkles } from 'lucide-react';
import EnrollmentPopup from './EnrollmentPopup';

const plans = [
  {
    name: 'Basic Program',
    price: '₹40,000',
    description: 'Perfect for beginners starting their entrepreneurial journey',
    features: [
      'Access to core business courses',
      'Basic business simulation tools',
      'Monthly group mentoring sessions',
      'Community forum access',
      'Certificate of completion',
      'Email support'
    ],
    color: 'from-blue-500 to-indigo-500',
    icon: Brain
  },
  {
    name: 'Premium Program',
    price: '₹80,000',
    description: 'Comprehensive program for serious young entrepreneurs',
    features: [
      'All Basic Program features',
      'Advanced business simulations',
      'Weekly 1-on-1 mentoring',
      'Real investor pitch opportunities',
      'Startup incubation support',
      'Priority technical support',
      'Business tools subscription',
      'Networking events access'
    ],
    featured: true,
    color: 'from-indigo-500 to-purple-500',
    icon: Rocket
  }
];

export default function Pricing() {
  const [showEnrollment, setShowEnrollment] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-mint-50 relative overflow-hidden py-16">
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr from-pink-200 via-yellow-100 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-tr from-mint-200 via-purple-100 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-500 to-mint-500 mb-6 drop-shadow-lg">Pricing</h1>
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
              Pricing Plans
            </h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Invest in your
              <span className="gradient-text"> future</span>
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Choose the perfect program that aligns with your entrepreneurial goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl bg-white p-8 shadow-xl card-hover animate-wiggle ${
                  plan.featured ? 'ring-4 ring-purple-500 ring-opacity-20' : ''
                }`}
                style={{animationDelay: plan.featured ? '0.3s' : '0s'}}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-6 transform -translate-y-1/2">
                    <div className="inline-flex rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1 text-sm font-semibold text-white animate-pulse">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <p className="mt-4 text-gray-500">{plan.description}</p>
                  <div className="mt-6">
                    <span className="text-5xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-base font-medium text-gray-500">/year</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <div className={`flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="ml-3 text-base text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowEnrollment(true)}
                  className={`w-full inline-flex items-center justify-center px-6 py-4 border-0 rounded-full text-base font-medium text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all duration-300 transform hover:scale-105`}
                >
                  Get Started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Additional Benefits Section */}
          <div className="mt-24">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
              Every Plan Includes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="mx-auto h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <Star className="h-7 w-7 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Fun Learning</h4>
                <p className="text-sm text-gray-500">Interactive games and activities</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="mx-auto h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <Target className="h-7 w-7 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Goal Setting</h4>
                <p className="text-sm text-gray-500">Personalized learning paths</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="mx-auto h-14 w-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                  <Users className="h-7 w-7 text-pink-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Community</h4>
                <p className="text-sm text-gray-500">Connect with peers worldwide</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="mx-auto h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-amber-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Creativity</h4>
                <p className="text-sm text-gray-500">Develop innovative thinking</p>
              </div>
            </div>
          </div>

          <EnrollmentPopup isOpen={showEnrollment} onClose={() => setShowEnrollment(false)} />
        </div>
      </div>
    </div>
  );
}