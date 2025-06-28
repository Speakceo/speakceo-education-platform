import React from 'react';
import HeroSection from './HeroSection';
import JourneySection from './JourneySection';
import SkillsSection from './SkillsSection';
import CTASection from './CTASection';
import Footer from '../common/Footer';
import Navbar from '../common/Navbar';
import { BookOpen, Target, Users } from 'lucide-react';

export default function HomePage() {
  const heroContent = {
    title: "Start their entrepreneurial journey early",
    subtitle: "Practical, engaging, and fun skills for young innovators. We help children ages 8-16 discover their talents, develop business skills, and dream big.",
    features: [
      { name: "Problem Identification", icon: BookOpen },
      { name: "Market Research", icon: Users },
      { name: "Idea Validation", icon: Target },
    ],
    ctaText: "Start Free Trial",
    heroImage: "/images/hero-illustration.svg"
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Main content with seamless sections - no gaps */}
      <main className="relative">
        {/* Hero Section */}
        <HeroSection 
          title={heroContent.title}
          subtitle={heroContent.subtitle}
          features={heroContent.features} 
          ctaText={heroContent.ctaText}
          heroImage={heroContent.heroImage}
        />
        
        {/* Skills Section - directly connected */}
        <SkillsSection />
        
        {/* Journey Section - directly connected */}
        <JourneySection />
        
        {/* CTA Section - directly connected */}
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
} 