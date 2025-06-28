import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Send, 
  Clock, 
  ChevronRight,
  Star,
  Smile,
  Frown,
  Meh,
  CheckCircle,
  User,
  Users,
  Briefcase,
  Mic,
  Search,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface FormData {
  userType: string;
  name: string;
  email: string;
  phone: string;
  contactMethod: string;
  preferredTime?: string;
  message: string;
  captchaAnswer?: string;
  rating?: number;
}

const officeLocations = [
  {
    city: 'Mumbai',
    address: 'Level 21, World Trade Centre, Cuffe Parade',
    phone: '+91 (800) 123-4567',
    email: 'mumbai@speakceo.ai',
    timing: '9:00 AM - 6:00 PM IST',
    coordinates: { lat: 18.9067, lng: 72.8147 }
  },
  {
    city: 'Delhi',
    address: 'Cyber Hub, DLF Cyber City, Gurugram',
    phone: '+91 (800) 123-4568',
    email: 'delhi@speakceo.ai',
    timing: '9:00 AM - 6:00 PM IST',
    coordinates: { lat: 28.4595, lng: 77.0266 }
  },
  {
    city: 'Bangalore',
    address: 'Prestige Trade Tower, Palace Road',
    phone: '+91 (800) 123-4569',
    email: 'bangalore@speakceo.ai',
    timing: '9:00 AM - 6:00 PM IST',
    coordinates: { lat: 12.9716, lng: 77.5946 }
  }
];

const userTypes = [
  { id: 'student', label: 'A Curious Student 🎓', description: 'Explore our learning programs' },
  { id: 'parent', label: 'A Passionate Parent 👨‍👩‍👧‍👦', description: 'Learn about your child\'s future' },
  { id: 'partner', label: 'An Interested Partner 🤝', description: 'Collaborate with us' },
  { id: 'instructor', label: 'A Future Instructor 🎤', description: 'Join our teaching team' },
  { id: 'explorer', label: 'Just Exploring! 🚀', description: 'Discover what we offer' }
];

const timeSlots = [
  '9:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '2:00 PM - 3:00 PM',
  '3:00 PM - 4:00 PM',
  '4:00 PM - 5:00 PM'
];

const commonQueries = [
  {
    question: 'How do your programs work?',
    answer: 'Our programs combine live classes, interactive projects, and mentorship to help young minds develop entrepreneurial skills.'
  },
  {
    question: 'What age groups do you cater to?',
    answer: 'Our programs are designed for students aged 6-16 years, with different levels tailored to each age group.'
  },
  {
    question: 'How much does it cost?',
    answer: 'We offer various programs starting from ₹40,000. The exact cost depends on the program duration and level.'
  }
];

export default function ContactUs() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    name: '',
    email: '',
    phone: '',
    contactMethod: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof officeLocations[0] | null>(null);
  const [showFaq, setShowFaq] = useState(false);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Simulate form submission
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setStep(1);
      setFormData({
        userType: '',
        name: '',
        email: '',
        phone: '',
        contactMethod: '',
        message: ''
      });
    }, 3000);
  };

  const getProgressWidth = () => {
    return `${(step / 5) * 100}%`;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 kid-font">Who are you?</h3>
            <div className="grid gap-4">
              {userTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setFormData({ ...formData, userType: type.id });
                    handleNext();
                  }}
                  className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${
                    formData.userType === type.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                  } animate-wiggle`}
                  style={{animationDelay: `${parseInt(type.id, 36) % 5 * 0.1}s`}}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{type.label}</p>
                    <p className="text-sm text-gray-500">{type.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 kid-font">Tell us about yourself</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 kid-font">How would you like us to reach you?</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {['email', 'phone', 'whatsapp'].map((method) => (
                  <button
                    key={method}
                    onClick={() => {
                      setFormData({ ...formData, contactMethod: method });
                      handleNext();
                    }}
                    className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${
                      formData.contactMethod === method
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                    } animate-wiggle`}
                    style={{animationDelay: `${method === 'email' ? 0 : method === 'phone' ? 0.1 : 0.2}s`}}
                  >
                    <div className="flex items-center space-x-3">
                      {method === 'email' && <Mail className="h-6 w-6 text-indigo-600" />}
                      {method === 'phone' && <Phone className="h-6 w-6 text-green-600" />}
                      {method === 'whatsapp' && <MessageSquare className="h-6 w-6 text-blue-600" />}
                      <span className="font-medium text-gray-900 capitalize">{method}</span>
                    </div>
                    <ChevronRight className="ml-auto h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>

              {formData.contactMethod === 'phone' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time for Call
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setFormData({ ...formData, preferredTime: slot })}
                        className={`p-3 text-sm rounded-lg border transition-all duration-300 ${
                          formData.preferredTime === slot
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 kid-font">What would you like to know?</h3>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Tell us how we can help..."
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Common Queries:</p>
              <div className="space-y-2">
                {commonQueries.map((query, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors cursor-pointer animate-wiggle"
                    style={{animationDelay: `${index * 0.1}s`}}
                    onClick={() => setFormData({ ...formData, message: query.question })}
                  >
                    <p className="text-sm font-medium text-gray-900">{query.question}</p>
                    <p className="text-sm text-gray-500 mt-1">{query.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 kid-font">Fun Captcha Challenge</h3>
            <p className="text-gray-600">Which emoji represents a CEO?</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '👩‍💼', label: 'Business Woman', correct: true },
                { emoji: '🦈', label: 'Shark', correct: false },
                { emoji: '🚀', label: 'Rocket', correct: false },
                { emoji: '🍕', label: 'Pizza', correct: false }
              ].map((option) => (
                <button
                  key={option.emoji}
                  onClick={() => {
                    if (option.correct) {
                      handleSubmit();
                    }
                  }}
                  className="flex flex-col items-center justify-center p-6 rounded-xl border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-300 animate-wiggle"
                  style={{animationDelay: `${option.emoji.charCodeAt(0) % 5 * 0.1}s`}}
                >
                  <span className="text-4xl mb-2">{option.emoji}</span>
                  <span className="text-sm text-gray-600">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-mint-50 relative overflow-hidden py-16">
      <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-tr from-pink-200 via-yellow-100 to-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-56 h-56 bg-gradient-to-tr from-mint-200 via-purple-100 to-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-pink-500 to-mint-500 mb-6 drop-shadow-lg">Contact Us</h1>
        <div className="bg-white/80 rounded-2xl shadow-xl p-8 max-w-3xl mx-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-3xl p-8 shadow-lg relative animate-wiggle">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                    style={{ width: getProgressWidth() }}
                  />
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8 pt-4">
                  <button
                    onClick={handleBack}
                    className={`p-2 rounded-lg transition-colors ${
                      step > 1
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                    disabled={step === 1}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm font-medium text-gray-500">
                    Step {step} of 5
                  </span>
                  <button
                    onClick={handleNext}
                    className={`p-2 rounded-lg transition-colors ${
                      step < 5 && formData.userType
                        ? 'text-gray-600 hover:bg-gray-100'
                        : 'text-gray-300 cursor-not-allowed'
                    }`}
                    disabled={step === 5 || !formData.userType}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Form Steps */}
                <div className="min-h-[400px]">
                  {showSuccess ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 kid-font">
                        Thank you for reaching out!
                      </h3>
                      <p className="text-gray-500">
                        We'll get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                    renderStep()
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Quick Contact */}
                <div className="bg-white rounded-3xl p-8 shadow-lg animate-wiggle" style={{animationDelay: "0.2s"}}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 kid-font">Quick Contact</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                        <Phone className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Call Us</p>
                        <p className="text-lg font-semibold text-gray-900">+91 (800) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email Us</p>
                        <p className="text-lg font-semibold text-gray-900">support@speakceo.ai</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-pink-100 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-pink-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Live Chat</p>
                        <p className="text-lg font-semibold text-gray-900">Available 24/7</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Office Locations */}
                <div className="bg-white rounded-3xl p-8 shadow-lg animate-wiggle" style={{animationDelay: "0.3s"}}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 kid-font">Our Offices</h2>
                  <div className="space-y-6">
                    {officeLocations.map((office) => (
                      <div
                        key={office.city}
                        className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors cursor-pointer"
                        onClick={() => setSelectedLocation(office)}
                      >
                        <h3 className="text-xl font-semibold text-gray-900">{office.city}</h3>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-indigo-600 mt-1" />
                            <p className="text-gray-600">{office.address}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-indigo-600" />
                            <p className="text-gray-600">{office.phone}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-indigo-600" />
                            <p className="text-gray-600">{office.email}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            <p className="text-gray-600">{office.timing}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white animate-wiggle" style={{animationDelay: "0.4s"}}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold kid-font">Frequently Asked Questions</h2>
                    <button
                      onClick={() => setShowFaq(!showFaq)}
                      className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-4">
                    {commonQueries.slice(0, showFaq ? undefined : 2).map((query, index) => (
                      <div key={index} className="bg-white/10 rounded-xl p-4 animate-wiggle" style={{animationDelay: `${0.5 + index * 0.1}s`}}>
                        <h3 className="font-medium mb-2">{query.question}</h3>
                        <p className="text-sm text-indigo-100">{query.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}