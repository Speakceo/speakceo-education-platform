import React from 'react';
import { LucideIcon, Rocket, Target, Award, Check } from 'lucide-react';

interface JourneyStep {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

export default function JourneySection() {
  const steps: JourneyStep[] = [
    {
      title: 'Mindset & Founders',
      description: 'Kick off your journey by discovering the power of your ideas. Through inspiring founder stories and interactive workshops, you\'ll learn to think like an entrepreneur—embracing curiosity, resilience, and creative problem-solving.',
      icon: Rocket,
      color: 'bg-purple-700',
      iconColor: 'text-white'
    },
    {
      title: 'Idea to MVP',
      description: 'Transform your ideas into real products or services. Learn market research, identify real problems, and validate your concepts. Guided by hands-on activities, you\'ll build your first MVP and gain confidence.',
      icon: Target,
      color: 'bg-indigo-700',
      iconColor: 'text-white'
    },
    {
      title: 'Future-Ready Skills',
      description: 'Master AI, money, and marketing — skills for life, not just for school. Through practical exercises and real-world applications, you\'ll develop competencies that will serve you well beyond the classroom.',
      icon: Award,
      color: 'bg-blue-700',
      iconColor: 'text-white'
    }
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
      {/* Background pattern with better visibility */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header with high contrast */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">The 90-Day Journey</h2>
          <p className="text-xl text-white/90 leading-relaxed drop-shadow-sm">From idea to impact: A step-by-step curriculum for young innovators.</p>
        </div>
        
        {/* Journey steps with card design */}
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white/15 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-xl">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0 md:mt-1">
                  <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-md">
                    <step.icon className="h-8 w-8 text-indigo-700" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <h4 className="text-xl text-white mb-4 opacity-90">
                    {index === 0 && "Unlocking the Entrepreneurial Mindset"}
                    {index === 1 && "From Dream to First Prototype"}
                    {index === 2 && "Master Skills for Life"}
                  </h4>
                  <p className="text-white leading-relaxed text-base opacity-90">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* CTA with enhanced visibility */}
        <div className="mt-16 text-center">
          <a 
            href="/journey" 
            className="inline-flex items-center px-8 py-4 border-2 border-white text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-lg transition-all"
          >
            Explore the full journey
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 