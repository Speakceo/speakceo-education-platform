import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Star, 
  Trophy, 
  X, 
  ChevronRight, 
  GraduationCap,
  Target,
  Brain,
  Sparkles,
  Mic,
  DollarSign,
  Users,
  Calendar,
  Award,
  Lightbulb,
  TrendingUp,
  Heart,
  Gift,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  User
} from 'lucide-react';
import { createLead, LeadSource, getUTMParams } from '../lib/leads';
import { motion, AnimatePresence } from 'framer-motion';

interface EnrollmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollmentPopup({ isOpen, onClose }: EnrollmentPopupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    childName: '',
    parentName: '',
    age: '',
    email: '',
    phone: '',
    city: '',
    interests: [] as string[],
    aspirations: '',
    urgency: '',
    previousExperience: '',
    hearAboutUs: '',
    preferredContact: 'phone'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const navigate = useNavigate();

  // Track time spent on form for analytics
  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const interests = [
    { id: 'business', label: '🚀 Starting a Business', icon: Rocket, color: 'from-blue-500 to-cyan-500' },
    { id: 'leadership', label: '⭐ Leadership Skills', icon: Star, color: 'from-yellow-500 to-orange-500' },
    { id: 'public-speaking', label: '🎤 Public Speaking', icon: Mic, color: 'from-purple-500 to-pink-500' },
    { id: 'finance', label: '💰 Money Management', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { id: 'innovation', label: '🧠 Innovation & Creativity', icon: Brain, color: 'from-indigo-500 to-purple-500' },
    { id: 'tech', label: '💻 Technology & Apps', icon: Target, color: 'from-red-500 to-pink-500' },
    { id: 'marketing', label: '📈 Marketing & Sales', icon: TrendingUp, color: 'from-teal-500 to-blue-500' },
    { id: 'team-building', label: '👥 Team Building', icon: Users, color: 'from-orange-500 to-red-500' }
  ];

  const urgencyOptions = [
    { id: 'immediate', label: '🔥 Start Immediately', subtext: 'Ready to begin this week', premium: true },
    { id: 'month', label: '📅 Within a Month', subtext: 'Planning to start soon', popular: true },
    { id: 'quarter', label: '⏰ Next 3 Months', subtext: 'Exploring options' },
    { id: 'explore', label: '🔍 Just Exploring', subtext: 'Gathering information' }
  ];

  // Validation functions
  const validateStep = (currentStep: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      if (!formData.childName.trim()) newErrors.childName = 'Child\'s name is required';
      if (!formData.parentName.trim()) newErrors.parentName = 'Parent name is required';
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
    }
    
    if (currentStep === 2) {
      if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
    }
    
    if (currentStep === 4) {
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.urgency) newErrors.urgency = 'Please select when you\'d like to start';
      
      // Email validation
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Phone validation (basic)
      if (formData.phone && !/^[\+\(\)\s\-\d]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Get UTM parameters for tracking
      const utmParams = getUTMParams();
      
      // Create lead data using our new system
      const leadData = {
        email: formData.email,
        name: formData.parentName,
        phone: formData.phone,
        child_name: formData.childName,
        child_age: parseInt(formData.age) || undefined,
        source: LeadSource.ENROLLMENT_POPUP,
        ...utmParams,
        notes: `
CHILD INFORMATION:
• Name: ${formData.childName}
• Age: ${formData.age}
• City: ${formData.city}

PARENT INFORMATION:
• Name: ${formData.parentName}
• Preferred Contact: ${formData.preferredContact}

INTERESTS & GOALS:
• Interests: ${formData.interests.join(', ')}
• Aspirations: ${formData.aspirations}
• Previous Experience: ${formData.previousExperience}

ENROLLMENT DETAILS:
• Start Urgency: ${formData.urgency}
• How they heard about us: ${formData.hearAboutUs}

FORM ANALYTICS:
• Time spent: ${timeSpent} seconds
• Completion rate: 100%
• Conversion quality: HIGH (completed enhanced form)

FOLLOW-UP PRIORITY: ${formData.urgency === 'immediate' ? 'URGENT - Contact within 2 hours' : formData.urgency === 'month' ? 'HIGH - Contact within 24 hours' : 'NORMAL - Contact within 48 hours'}
        `.trim()
      };

      await createLead(leadData);

      // Track conversion analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          event_category: 'enrollment',
          event_label: 'enhanced_form_completion',
          value: 1,
          custom_parameters: {
            urgency: formData.urgency,
            time_spent: timeSpent,
            interests_count: formData.interests.length
          }
        });
      }

      setStep(5); // Success step
    } catch (error) {
      console.error('Failed to submit enrollment:', error);
      alert('Something went wrong. Please try again or contact us directly at hello@speakceo.com');
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  // Optimized animation variants (simplified to reduce lag)
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      <motion.div 
        key="overlay"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div 
          key="popup"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={popupVariants}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[95vh] overflow-y-auto relative shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Enhanced Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 z-10 transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Enhanced Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transition-all duration-700 ease-out"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-4 pt-8 pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i <= step 
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 scale-110' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          <div className="p-8 pt-4">
            <AnimatePresence mode="wait">
              {/* Step 1: Child Information */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div 
                      className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 mx-auto mb-6 shadow-lg"
                    >
                      <GraduationCap className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Let's Start Your Child's
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                        CEO Journey! 🚀
                      </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
                      Join 5,000+ young entrepreneurs who've already started building their future. 
                      Let's get to know your future CEO!
                    </p>
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-full">
                      <Gift className="h-4 w-4 text-emerald-600 mr-2" />
                      <span className="text-sm font-semibold text-emerald-700">FREE Consultation Worth $200</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Child's Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your child's name"
                        value={formData.childName}
                        onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                          errors.childName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                      {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Age</label>
                      <select
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                          errors.age ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      >
                        <option value="">Select age</option>
                        {Array.from({ length: 10 }, (_, i) => i + 8).map(age => (
                          <option key={age} value={age}>{age} years old</option>
                        ))}
                      </select>
                      {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Parent/Guardian Name
                      </label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                          errors.parentName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                      {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Your city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                          errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'
                        }`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  {/* Trust Indicators */}
                  <div className="flex justify-center space-x-8 pt-6 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">5,000+</div>
                      <div className="text-sm text-gray-600">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">98%</div>
                      <div className="text-sm text-gray-600">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">50+</div>
                      <div className="text-sm text-gray-600">Expert Mentors</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Interests */}
              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div 
                      className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 mx-auto mb-6 shadow-lg"
                    >
                      <Target className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      What Excites 
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
                        {formData.childName || 'Your Child'}? 🎯
                      </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Choose the areas your child is most passionate about. We'll customize their learning journey!
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                    {interests.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => {
                          const newInterests = formData.interests.includes(interest.id)
                            ? formData.interests.filter(i => i !== interest.id)
                            : [...formData.interests, interest.id];
                          setFormData({ ...formData, interests: newInterests });
                        }}
                        className={`flex items-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                          formData.interests.includes(interest.id)
                            ? 'border-transparent bg-gradient-to-r ' + interest.color + ' text-white shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                          formData.interests.includes(interest.id) 
                            ? 'bg-white/20' 
                            : 'bg-gradient-to-r ' + interest.color
                        }`}>
                          <interest.icon className={`h-6 w-6 ${
                            formData.interests.includes(interest.id) ? 'text-white' : 'text-white'
                          }`} />
                        </div>
                        <span className="font-semibold text-lg">{interest.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    Selected {formData.interests.length} interests • You can choose multiple
                  </div>
                  {errors.interests && (
                    <div className="text-center">
                      <p className="text-red-500 text-sm">{errors.interests}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Goals & Experience */}
              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div 
                      className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 mx-auto mb-6 shadow-lg"
                    >
                      <Lightbulb className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Tell Us About
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600">
                        Their Dreams! ✨
                      </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      Understanding their aspirations helps us create the perfect learning path
                    </p>
                  </div>
                  
                  <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        What does {formData.childName || 'your child'} aspire to achieve?
                      </label>
                      <textarea
                        placeholder="E.g., Start their own company, become a leader, solve world problems..."
                        value={formData.aspirations}
                        onChange={(e) => setFormData({ ...formData, aspirations: e.target.value })}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-lg"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Previous entrepreneurship or business experience?
                      </label>
                      <select
                        value={formData.previousExperience}
                        onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-lg"
                      >
                        <option value="">Select experience level</option>
                        <option value="none">No previous experience</option>
                        <option value="school">School projects or activities</option>
                        <option value="small">Small business/lemonade stand</option>
                        <option value="programs">Attended other programs</option>
                        <option value="advanced">Already running a business</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        How did you hear about us?
                      </label>
                      <select
                        value={formData.hearAboutUs}
                        onChange={(e) => setFormData({ ...formData, hearAboutUs: e.target.value })}
                        className="w-full px-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 text-lg"
                      >
                        <option value="">How did you find us?</option>
                        <option value="google">Google Search</option>
                        <option value="social">Social Media</option>
                        <option value="friend">Friend/Family Recommendation</option>
                        <option value="school">School/Teacher</option>
                        <option value="ad">Online Advertisement</option>
                        <option value="event">Event/Workshop</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Contact & Urgency */}
              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div 
                      className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 mx-auto mb-6 shadow-lg"
                    >
                      <Calendar className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Let's Connect &
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-600 to-pink-600">
                        Get Started! 🚀
                      </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                      We're excited to welcome {formData.childName || 'your child'} to our community of young entrepreneurs!
                    </p>
                  </div>
                  
                  <div className="space-y-8 max-w-2xl mx-auto">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                            errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20'
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className={`w-full px-4 py-4 rounded-2xl border-2 transition-all duration-300 text-lg ${
                            errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-200 focus:border-orange-500 focus:ring-orange-500/20'
                          }`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Preferred Contact Method */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-gray-700">Preferred Contact Method</label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'phone', label: 'Phone Call', icon: Phone },
                          { id: 'email', label: 'Email', icon: Mail }
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setFormData({ ...formData, preferredContact: method.id })}
                            className={`flex items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                              formData.preferredContact === method.id
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <method.icon className="h-5 w-5 mr-2" />
                            {method.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Urgency */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-gray-700">When would you like to start?</label>
                      <div className="space-y-3">
                        {urgencyOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => setFormData({ ...formData, urgency: option.id })}
                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 relative ${
                              formData.urgency === option.id
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            } ${errors.urgency ? 'border-red-200' : ''}`}
                          >
                            {option.premium && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">Premium</span>
                              </div>
                            )}
                            {option.popular && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Popular</span>
                              </div>
                            )}
                            <div className="font-semibold text-lg">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.subtext}</div>
                          </button>
                        ))}
                      </div>
                      {errors.urgency && <p className="text-red-500 text-sm mt-2">{errors.urgency}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <motion.div 
                  key="step5"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                  className="space-y-8 text-center"
                >
                  <div 
                    className="flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mx-auto shadow-2xl"
                  >
                    <CheckCircle className="h-12 w-12 text-white" />
                  </div>

                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      🎉 Welcome to SpeakCEO!
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                      Thank you for choosing us to guide {formData.childName || 'your child'}'s entrepreneurial journey! 
                      Our team will contact you within 24 hours to discuss the next steps.
                    </p>
                  </div>

                  <div
                    className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-lg">1. Personal Call</h4>
                        <p className="text-gray-600 text-sm">Our enrollment specialist will call you within 24 hours</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-lg">2. Program Design</h4>
                        <p className="text-gray-600 text-sm">We'll customize the perfect program for {formData.childName || 'your child'}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Rocket className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-lg">3. Start Learning!</h4>
                        <p className="text-gray-600 text-sm">Begin the exciting entrepreneurial journey</p>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-4"
                  >
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full max-w-md mx-auto block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      Explore Our Platform
                      <ArrowRight className="ml-2 h-5 w-5 inline" />
                    </button>
                    <p className="text-sm text-gray-500">
                      Check out our learning tools while you wait for our call!
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="mt-12 flex justify-between items-center">
                <button
                  onClick={() => setStep(step - 1)}
                  className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                    step === 1
                      ? 'opacity-0 cursor-default'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  disabled={step === 1}
                >
                  ← Back
                </button>

                <div className="flex-1 mx-8 text-center">
                  <div className="text-sm text-gray-500">
                    Step {step} of 4 • {Math.round(((step - 1) / 4) * 100)}% Complete
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (step === 4) {
                      handleSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl font-semibold transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Submitting...
                    </>
                  ) : step === 4 ? (
                    <>
                      Submit Application
                      <Trophy className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
