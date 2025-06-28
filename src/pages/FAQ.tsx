import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail, Star, Trophy, Target, Shield, Clock, Users } from 'lucide-react';
import SEO from '../components/SEO';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  highlight?: boolean;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    category: "Results & Success",
    question: "Will my child actually learn real business skills or is this just another online course?",
    answer: "Unlike typical courses, our program teaches REAL entrepreneurship skills through hands-on projects. Your child will create an actual business plan, conduct market research, design marketing campaigns, and even pitch their ideas. 89% of our graduates have started their own mini-businesses within 6 months. We focus on practical application, not just theory.",
    highlight: true
  },
  {
    id: 2,
    category: "Results & Success",
    question: "How do I know my child will stay engaged for the full 90 days?",
    answer: "We've cracked the code on keeping kids engaged! Our program uses gamification with XP points, achievement badges, and daily challenges. Plus, lessons are only 15-20 minutes each - perfect for young attention spans. 94% of enrolled students complete the entire program, compared to 12% completion rates for typical online courses.",
    highlight: true
  },
  {
    id: 3,
    category: "Age & Readiness",
    question: "Is my 8-year-old too young to understand business concepts?",
    answer: "Absolutely not! Kids are natural entrepreneurs - they're curious, creative, and fearless. We've designed age-appropriate content that explains complex concepts through stories, games, and relatable examples. Many of our youngest students surprise parents with their innovative business ideas and mature thinking about money and problem-solving."
  },
  {
    id: 4,
    category: "Age & Readiness",
    question: "What if my teenager thinks this is 'too childish' for them?",
    answer: "Our 13-18 year olds are actually our most engaged students! They love the real-world application and the respect we give their ideas. We don't talk down to teens - we treat them like the future CEOs they can become. Many use skills from our program to start actual businesses, get into top colleges, or land leadership roles in school."
  },
  {
    id: 5,
    category: "Time & Commitment",
    question: "How much time does my child need to spend on this daily?",
    answer: "Just 20-30 minutes per day! We've designed the program to fit into busy family schedules. Lessons are bite-sized and engaging. Many parents report their kids actually ASK to do their 'business homework' because it's so much fun. It's less time than they spend on video games, but infinitely more valuable for their future."
  },
  {
    id: 6,
    category: "Time & Commitment",
    question: "What if we go on vacation or have a busy week?",
    answer: "No stress! Our platform works on any device, anywhere with internet. Lessons are self-paced, so your child can catch up easily. We also provide downloadable materials for offline access. Flexibility is built into the program because we understand real family life."
  },
  {
    id: 7,
    category: "Investment & Value",
    question: "Is this program worth the investment compared to other activities?",
    answer: "Consider this: Piano lessons cost $200+/month and teach one skill. Sports can cost $300+/month for one season. Our program costs less than most single activities but teaches LIFE skills: leadership, financial literacy, critical thinking, communication, and entrepreneurship. These skills will benefit your child for their entire life and career.",
    highlight: true
  },
  {
    id: 8,
    category: "Investment & Value",
    question: "What if my child doesn't like it? Can I get my money back?",
    answer: "We're so confident your child will love the program that we offer a 30-day money-back guarantee. If you're not completely satisfied within the first month, we'll refund every penny, no questions asked. Less than 2% of families request refunds - that's how sure we are your child will thrive!"
  },
  {
    id: 9,
    category: "Real-World Impact",
    question: "How will this actually help my child in the real world?",
    answer: "Our graduates consistently outperform peers in school projects, get leadership roles, start successful businesses, and gain admission to top colleges. They develop confidence, problem-solving skills, and financial literacy that most adults lack. Colleges and employers are desperately seeking young people with entrepreneurial mindsets - your child will have a massive advantage.",
    highlight: true
  },
  {
    id: 10,
    category: "Real-World Impact",
    question: "Will this help my child get into a good college?",
    answer: "Absolutely! Admissions officers are looking for students who stand out. Having real entrepreneurship experience, business knowledge, and leadership skills makes your child incredibly attractive to top universities. Many of our graduates mention their Young CEO experience in college essays and interviews - it's a major differentiator."
  },
  {
    id: 11,
    category: "Support & Safety",
    question: "What kind of support will my child receive?",
    answer: "Your child gets access to certified business mentors, weekly live Q&A sessions, a private community of like-minded young entrepreneurs, and 24/7 technical support. Plus, we provide parents with weekly progress reports so you can celebrate your child's achievements together."
  },
  {
    id: 12,
    category: "Support & Safety",
    question: "Is the online platform safe for my child?",
    answer: "Safety is our top priority. Our platform is COPPA compliant, with strict privacy protections. All community interactions are moderated, and we never share personal information. Parents have full visibility into their child's progress and interactions. It's safer than most social media platforms kids use daily."
  },
  {
    id: 13,
    category: "Comparison",
    question: "How is this different from YouTube videos or free online resources?",
    answer: "Free resources lack structure, accountability, and personalized feedback. Our program provides a proven curriculum, expert mentorship, peer community, progress tracking, and real projects with measurable outcomes. It's the difference between watching cooking videos and attending culinary school - both involve food, but only one creates real chefs."
  },
  {
    id: 14,
    category: "Comparison",
    question: "Why not wait until my child is older to learn business skills?",
    answer: "The earlier kids learn entrepreneurship, the more natural it becomes. Young brains are incredibly adaptable and creative. By starting now, your child develops an entrepreneurial mindset that becomes part of who they are. Waiting means missing these crucial formative years when learning is easiest and most fun.",
    highlight: true
  },
  {
    id: 15,
    category: "Parent Concerns",
    question: "I don't know anything about business - can I still help my child?",
    answer: "You don't need business knowledge! Our program is designed to be completely self-guided for kids, with parent resources that explain everything in simple terms. Many parents tell us they learn alongside their children. It becomes a fun family bonding experience where you're both discovering new concepts together."
  },
  {
    id: 16,
    category: "Parent Concerns",
    question: "What if my child wants to quit halfway through?",
    answer: "This is extremely rare because we've designed the program to be addictively engaging. However, if motivation dips, our mentors reach out personally to re-energize your child. We also provide parents with proven strategies to maintain momentum. Remember, persistence is part of the entrepreneurial mindset we're building!"
  },
  {
    id: 17,
    category: "Success Stories",
    question: "Do you have proof that this actually works?",
    answer: "Absolutely! Our students have started lemonade stands that made $500+, created apps downloaded thousands of times, launched successful YouTube channels, and even started nonprofits. We have video testimonials from parents amazed at their children's transformation. The confidence and skills they gain are visible within the first month.",
    highlight: true
  },
  {
    id: 18,
    category: "Success Stories",
    question: "What's the youngest child who has succeeded in this program?",
    answer: "Our youngest graduate was 7 years old! She created a pet-sitting business that earned $300 in her first month. Age isn't the limiting factor - curiosity and enthusiasm are. We've seen 8-year-olds outperform teenagers because they approach learning with pure excitement and creativity."
  }
];

const categories = [...new Set(faqData.map(item => item.category))];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <SEO 
        title="FAQ - Young CEO Program | Transform Your Child Into A Confident Leader"
        description="Get answers to all your questions about the Young CEO Program. See why thousands of parents choose us to develop their child's entrepreneurial skills, confidence, and future success."
        keywords={["Young CEO Program FAQ", "entrepreneurship for kids", "business education children", "leadership development", "parent questions"]}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-white/20 rounded-full px-6 py-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-semibold">Trusted by 10,000+ Parents</span>
                <Star className="h-5 w-5 text-yellow-300" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Your Questions Answered
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Everything you need to know about transforming your child into a confident young entrepreneur
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your concerns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Trust Indicators */}
          <div className="mb-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-emerald-500 rounded-full p-3 mb-3">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-500 rounded-full p-3 mb-3">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">89%</div>
                <div className="text-sm text-gray-600">Start Real Businesses</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-purple-500 rounded-full p-3 mb-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">30-Day</div>
                <div className="text-sm text-gray-600">Money-Back Guarantee</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-orange-500 rounded-full p-3 mb-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">10,000+</div>
                <div className="text-sm text-gray-600">Happy Families</div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Concern:</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Questions ({faqData.length})
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category} ({faqData.filter(item => item.category === category).length})
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
              </div>
            ) : (
              filteredFAQs.map((item) => (
                <div 
                  key={item.id} 
                  className={`bg-white rounded-lg shadow-sm border ${
                    item.highlight ? 'border-yellow-300 ring-2 ring-yellow-100' : 'border-gray-200'
                  }`}
                >
                  {item.highlight && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-t-lg">
                      <div className="flex items-center text-sm font-medium">
                        <Star className="h-4 w-4 mr-2" />
                        Most Important Question
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mr-3 ${
                        item.highlight 
                          ? 'text-yellow-800 bg-yellow-100' 
                          : 'text-indigo-600 bg-indigo-100'
                      }`}>
                        {item.category}
                      </span>
                      <span className="text-lg font-medium text-gray-900">{item.question}</span>
                    </div>
                    {openItems.includes(item.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {openItems.includes(item.id) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed text-base">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Irresistible CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Child's Future?</h2>
              <p className="text-indigo-100 mb-6 text-lg">
                Join thousands of parents who've watched their children develop confidence, leadership skills, and entrepreneurial thinking that will benefit them for life.
              </p>
              
              <div className="bg-white/10 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Limited Time Offer</span>
                </div>
                <p className="text-2xl font-bold mb-2">Save 40% + Get Bonus Materials</p>
                <p className="text-sm text-indigo-200">Offer expires in 48 hours</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 rounded-lg p-4">
                  <Shield className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">30-Day Guarantee</h3>
                  <p className="text-sm text-indigo-100">100% money-back if not satisfied</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <Trophy className="h-8 w-8 mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Proven Results</h3>
                  <p className="text-sm text-indigo-100">94% completion rate, 89% start businesses</p>
                </div>
              </div>
              
              <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors transform hover:scale-105 shadow-lg">
                Enroll Now - Transform Your Child's Future
              </button>
              
              <p className="text-sm text-indigo-200 mt-4">
                ✓ Instant access ✓ All devices ✓ Expert support ✓ Parent dashboard
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Still Have Questions?</h2>
            <p className="text-gray-600 text-center mb-8">
              Our parent success team is here to help you make the best decision for your child's future.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">Get instant answers from our parent success team</p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Chat Now
                </button>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">Detailed questions answered within 2 hours</p>
                <a 
                  href="mailto:parents@speakceo.ai"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Email Us
                </a>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Phone Consultation</h3>
                <p className="text-sm text-gray-600 mb-4">15-minute free consultation with our experts</p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQ; 