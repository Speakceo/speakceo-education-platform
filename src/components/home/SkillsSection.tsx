import React from 'react';
import { BrainCircuit, DollarSign, TrendingUp, Terminal } from 'lucide-react';

export default function SkillsSection() {
  const skills = [
    {
      name: 'AI & Technology',
      description: 'Learn to use AI tools, coding basics, and understand technology trends.',
      icon: BrainCircuit,
      color: 'bg-purple-600',
      iconColor: 'text-white'
    },
    {
      name: 'Financial Literacy',
      description: 'Master personal finance, business economics, and investment fundamentals.',
      icon: DollarSign,
      color: 'bg-indigo-600',
      iconColor: 'text-white'
    },
    {
      name: 'Marketing & Communication',
      description: 'Develop skills in storytelling, digital marketing, and persuasive communication.',
      icon: TrendingUp,
      color: 'bg-blue-600',
      iconColor: 'text-white'
    },
    {
      name: 'Problem Solving',
      description: 'Build frameworks for critical thinking, innovation, and decision making.',
      icon: Terminal,
      color: 'bg-violet-600',
      iconColor: 'text-white'
    }
  ];

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden -mt-1">
      {/* Add subtle pattern background */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)', 
        backgroundSize: '30px 30px',
        opacity: 0.3
      }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Section header with improved contrast and hierarchy */}
          <div className="lg:col-span-5">
            <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Future-proof skills
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Skills That Last a Lifetime
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Master AI, money, and marketing — skills for life, not just for school.
            </p>
            <div>
              <a 
                href="/skills" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Explore all skills
              </a>
            </div>
          </div>
          
          {/* Skills grid with improved visual hierarchy and contrast */}
          <div className="mt-12 lg:mt-0 lg:col-span-7">
            <div className="grid gap-6 sm:grid-cols-2">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex flex-col h-full overflow-hidden rounded-xl shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] bg-white"
                >
                  <div className={`p-5 ${skill.color}`}>
                    <skill.icon className={`h-8 w-8 ${skill.iconColor}`} />
                  </div>
                  <div className="flex-1 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{skill.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{skill.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 