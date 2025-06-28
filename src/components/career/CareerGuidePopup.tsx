import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Rocket, 
  Target, 
  Brain, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw 
} from 'lucide-react';
import CareerGuideResult from './CareerGuideResult';
import { generateCareerGuide } from '../../lib/api/career';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

interface CareerGuidePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the form data structure
interface FormData {
  // Step 1: Basic Info
  studentName: string;
  age: string;
  grade: string;
  parentEmail: string;
  parentPhone: string;
  
  // Step 2: Interest Mapping
  interests: string[];
  
  // Step 3: Self-Assessment
  creativity: number;
  confidence: number;
  communication: number;
  leadership: number;
  problemSolving: number;
  teamwork: number;
  timeManagement: number;
  curiosity: number;
  
  // Step 4: Future Preferences
  futureAspiration: string;
  workEnvironment: 'indoors' | 'outdoors' | 'both';
  workStyle: 'with people' | 'alone' | 'both';
  problemApproach: 'building' | 'fixing' | 'both';
  
  // Step 5: Learning Style
  learningStyle: string;
  favoriteSubject: string;
  challengingSubject: string;
  
  // Step 6: Entrepreneurial Thinking
  hasSoldCreated: boolean;
  excitedForCompany: boolean;
  invention: string;
  
  // Step 7: Personality Type
  friendsDescription: string;
  riskTaking: string;
  problemSolvingApproach: string;
  
  // Step 8: IQ Questions
  iqQuestions: {
    patternRecognition: string;
    logicalReasoning: string;
    spatialAwareness: string;
    wordProblem: string;
  };
  
  // Step 9: Career Matching
  careerMatches: string[];
  
  // Step 10: Wrap-Up
  morningExcitement: string;
  adultUnderstanding: string;
  additionalInfo: string;
}

// Define the interests options
const interests = [
  { id: 'puzzles', label: 'Solving puzzles or playing logic games', icon: Brain },
  { id: 'art', label: 'Drawing, painting, or storytelling', icon: Sparkles },
  { id: 'helping', label: 'Helping others and organizing things', icon: CheckCircle },
  { id: 'selling', label: 'Selling things or starting little businesses', icon: Rocket },
  { id: 'tech', label: 'Playing with gadgets or coding', icon: Target },
  { id: 'speaking', label: 'Speaking on stage or debating', icon: Brain },
  { id: 'content', label: 'Making videos or content for social media', icon: Sparkles },
  { id: 'reading', label: 'Reading books or writing blogs', icon: CheckCircle }
];

// Define the career options
const careers = [
  { id: 'entrepreneur', label: 'Entrepreneur', description: 'Starting and running businesses' },
  { id: 'engineer', label: 'Engineer', description: 'Building and designing things' },
  { id: 'doctor', label: 'Doctor', description: 'Helping people stay healthy' },
  { id: 'artist', label: 'Artist', description: 'Creating beautiful things' },
  { id: 'scientist', label: 'Scientist', description: 'Discovering how things work' },
  { id: 'teacher', label: 'Teacher', description: 'Helping others learn' },
  { id: 'programmer', label: 'Programmer', description: 'Creating apps and websites' },
  { id: 'designer', label: 'Designer', description: 'Making things look good' },
  { id: 'writer', label: 'Writer', description: 'Telling stories and sharing ideas' },
  { id: 'marketer', label: 'Marketer', description: 'Helping people find products' }
];

// Initialize the form data
const initialFormData: FormData = {
  studentName: '',
  age: '',
  grade: '',
  parentEmail: '',
  parentPhone: '',
  interests: [],
  creativity: 3,
  confidence: 3,
  communication: 3,
  leadership: 3,
  problemSolving: 3,
  teamwork: 3,
  timeManagement: 3,
  curiosity: 3,
  futureAspiration: '',
  workEnvironment: 'both',
  workStyle: 'both',
  problemApproach: 'both',
  learningStyle: '',
  favoriteSubject: '',
  challengingSubject: '',
  hasSoldCreated: false,
  excitedForCompany: false,
  invention: '',
  friendsDescription: '',
  riskTaking: '',
  problemSolvingApproach: '',
  iqQuestions: {
    patternRecognition: '',
    logicalReasoning: '',
    spatialAwareness: '',
    wordProblem: ''
  },
  careerMatches: [],
  morningExcitement: '',
  adultUnderstanding: '',
  additionalInfo: ''
};

export default function CareerGuidePopup({ isOpen, onClose }: CareerGuidePopupProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const totalSteps = 10;

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.studentName.trim()) newErrors.studentName = 'Please enter student name';
        if (!formData.age.trim()) newErrors.age = 'Please enter age';
        if (!formData.grade.trim()) newErrors.grade = 'Please enter grade';
        if (!formData.parentEmail.trim()) newErrors.parentEmail = 'Please enter parent email';
        else if (!/^\S+@\S+\.\S+$/.test(formData.parentEmail)) newErrors.parentEmail = 'Please enter a valid email';
        break;
      case 2:
        if (formData.interests.length === 0) newErrors.interests = 'Please select at least one interest';
        break;
      case 4:
        if (!formData.futureAspiration.trim()) newErrors.futureAspiration = 'Please enter future aspiration';
        break;
      case 5:
        if (!formData.learningStyle.trim()) newErrors.learningStyle = 'Please select a learning style';
        if (!formData.favoriteSubject.trim()) newErrors.favoriteSubject = 'Please enter favorite subject';
        break;
      case 6:
        if (!formData.invention.trim()) newErrors.invention = 'Please enter an invention idea';
        break;
      case 7:
        if (!formData.friendsDescription.trim()) newErrors.friendsDescription = 'Please enter how friends describe you';
        if (!formData.riskTaking) newErrors.riskTaking = 'Please select risk-taking preference';
        if (!formData.problemSolvingApproach) newErrors.problemSolvingApproach = 'Please select problem-solving approach';
        break;
      case 9:
        if (formData.careerMatches.length === 0) newErrors.careerMatches = 'Please select at least one career';
        break;
      case 10:
        if (!formData.morningExcitement.trim()) newErrors.morningExcitement = 'Please enter what excites you in the morning';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
        window.scrollTo(0, 0);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Generate the career guide
      const guideResult = await generateCareerGuide(formData);
      setResult(guideResult);

      // Store the data in Supabase
      await storeCareerGuideData(formData, guideResult);

      // Move to the results step
      setStep(totalSteps + 1);
    } catch (error) {
      console.error('Error submitting career guide:', error);
      alert('There was an error generating your career guide. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const storeCareerGuideData = async (formData: FormData, result: any) => {
    try {
      // Format the data for storage
      const selfAssessment = {
        creativity: formData.creativity,
        confidence: formData.confidence,
        communication: formData.communication,
        leadership: formData.leadership,
        problemSolving: formData.problemSolving,
        teamwork: formData.teamwork,
        timeManagement: formData.timeManagement,
        curiosity: formData.curiosity
      };

      const futurePreferences = {
        futureAspiration: formData.futureAspiration,
        workEnvironment: formData.workEnvironment,
        workStyle: formData.workStyle,
        problemApproach: formData.problemApproach
      };

      const learningStyle = {
        style: formData.learningStyle,
        favoriteSubject: formData.favoriteSubject,
        challengingSubject: formData.challengingSubject
      };

      const entrepreneurialThinking = {
        hasSoldCreated: formData.hasSoldCreated,
        excitedForCompany: formData.excitedForCompany,
        invention: formData.invention
      };

      const personalityType = {
        friendsDescription: formData.friendsDescription,
        riskTaking: formData.riskTaking,
        problemSolvingApproach: formData.problemSolvingApproach
      };

      const additionalInfo = {
        morningExcitement: formData.morningExcitement,
        adultUnderstanding: formData.adultUnderstanding,
        additionalInfo: formData.additionalInfo,
        iqQuestions: formData.iqQuestions,
        careerMatches: formData.careerMatches
      };

      // Create a lead first
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: formData.studentName,
          email: formData.parentEmail,
          phone: formData.parentPhone,
          source: 'career_guide',
          status: 'new',
          notes: `Age: ${formData.age}, Grade: ${formData.grade}, Career Guide Completed`
        })
        .select()
        .single();

      if (leadError) throw leadError;

      // Store the detailed response
      const { error: responseError } = await supabase
        .from('career_guide_responses')
        .insert({
          lead_id: leadData.id,
          student_name: formData.studentName,
          age: formData.age,
          grade: formData.grade,
          interests: formData.interests,
          self_assessment: selfAssessment,
          future_preferences: futurePreferences,
          learning_style: learningStyle,
          entrepreneurial_thinking: entrepreneurialThinking,
          personality_type: personalityType,
          additional_info: additionalInfo,
          generated_report: result
        });

      if (responseError) throw responseError;

    } catch (error) {
      console.error('Error storing career guide data:', error);
      // Continue anyway - we don't want to block the user from seeing their results
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => {
      const interests = prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests };
    });
  };

  const handleCareerToggle = (careerId: string) => {
    setFormData(prev => {
      const careerMatches = prev.careerMatches.includes(careerId)
        ? prev.careerMatches.filter(id => id !== careerId)
        : [...prev.careerMatches, careerId];
      return { ...prev, careerMatches };
    });
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Let's Get Started!</h3>
            <p className="text-gray-600">
              We'll create a personalized career guide for your child based on their interests, skills, and personality.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Child's Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.studentName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter child's name"
                />
                {errors.studentName && <p className="mt-1 text-sm text-red-600">{errors.studentName}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter age"
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
                </div>
                
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                    Grade/Class
                  </label>
                  <input
                    type="text"
                    id="grade"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className={`w-full px-4 py-2 border ${errors.grade ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Enter grade/class"
                  />
                  {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent's Email
                </label>
                <input
                  type="email"
                  id="parentEmail"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.parentEmail ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Enter parent's email"
                />
                {errors.parentEmail && <p className="mt-1 text-sm text-red-600">{errors.parentEmail}</p>}
              </div>
              
              <div>
                <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Parent's Phone (optional)
                </label>
                <input
                  type="tel"
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter parent's phone"
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">What Does Your Child Enjoy?</h3>
            <p className="text-gray-600">
              Select all the activities that your child enjoys doing.
            </p>
            
            {errors.interests && <p className="text-sm text-red-600">{errors.interests}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {interests.map((interest) => (
                <button
                  key={interest.id}
                  onClick={() => handleInterestToggle(interest.id)}
                  className={`flex items-center p-4 rounded-xl border transition-all ${
                    formData.interests.includes(interest.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                    <interest.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{interest.label}</p>
                  </div>
                  <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                    {formData.interests.includes(interest.id) && (
                      <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Self-Assessment</h3>
            <p className="text-gray-600">
              Rate your child on the following skills from 1 (needs improvement) to 5 (excellent).
            </p>
            
            <div className="space-y-6">
              {[
                { id: 'creativity', label: 'Creativity', description: 'Ability to come up with new ideas' },
                { id: 'confidence', label: 'Confidence', description: 'Belief in oneself and abilities' },
                { id: 'communication', label: 'Communication', description: 'Ability to express ideas clearly' },
                { id: 'leadership', label: 'Leadership', description: 'Ability to guide and inspire others' },
                { id: 'problemSolving', label: 'Problem Solving', description: 'Finding solutions to challenges' },
                { id: 'teamwork', label: 'Teamwork', description: 'Working well with others' },
                { id: 'timeManagement', label: 'Time Management', description: 'Using time effectively' },
                { id: 'curiosity', label: 'Curiosity', description: 'Eagerness to learn new things' }
              ].map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <label htmlFor={skill.id} className="block text-sm font-medium text-gray-700">
                        {skill.label}
                      </label>
                      <p className="text-xs text-gray-500">{skill.description}</p>
                    </div>
                    <span className="text-sm font-medium text-indigo-600">
                      {formData[skill.id as keyof typeof formData] as number}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    id={skill.id}
                    min="1"
                    max="5"
                    step="1"
                    value={formData[skill.id as keyof typeof formData] as number}
                    onChange={(e) => setFormData({ ...formData, [skill.id]: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Needs Improvement</span>
                    <span>Excellent</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Future Preferences</h3>
            <p className="text-gray-600">
              Let's understand what kind of future your child might enjoy.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="futureAspiration" className="block text-sm font-medium text-gray-700 mb-1">
                  What does your child want to be when they grow up?
                </label>
                <input
                  type="text"
                  id="futureAspiration"
                  value={formData.futureAspiration}
                  onChange={(e) => setFormData({ ...formData, futureAspiration: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.futureAspiration ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Astronaut, Doctor, Business Owner, etc."
                />
                {errors.futureAspiration && <p className="mt-1 text-sm text-red-600">{errors.futureAspiration}</p>}
              </div>
              
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Does your child prefer working:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'indoors', label: 'Indoors' },
                    { id: 'outdoors', label: 'Outdoors' },
                    { id: 'both', label: 'Both' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, workEnvironment: option.id as any })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.workEnvironment === option.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Does your child prefer working:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'with people', label: 'With People' },
                    { id: 'alone', label: 'Alone' },
                    { id: 'both', label: 'Both' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, workStyle: option.id as any })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.workStyle === option.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Does your child prefer:
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'building', label: 'Building New Things' },
                    { id: 'fixing', label: 'Fixing Problems' },
                    { id: 'both', label: 'Both' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, problemApproach: option.id as any })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.problemApproach === option.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Learning Style</h3>
            <p className="text-gray-600">
              Let's understand how your child learns best.
            </p>
            
            <div className="space-y-4">
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  How does your child learn best?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'visual', label: 'By seeing (Visual)', description: 'Pictures, videos, diagrams' },
                    { id: 'auditory', label: 'By hearing (Auditory)', description: 'Listening, discussions' },
                    { id: 'kinesthetic', label: 'By doing (Hands-on)', description: 'Activities, experiments' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, learningStyle: option.id })}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        formData.learningStyle === option.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{option.label}</p>
                      <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                    </button>
                  ))}
                </div>
                {errors.learningStyle && <p className="mt-1 text-sm text-red-600">{errors.learningStyle}</p>}
              </div>
              
              <div>
                <label htmlFor="favoriteSubject" className="block text-sm font-medium text-gray-700 mb-1">
                  What is your child's favorite subject in school?
                </label>
                <input
                  type="text"
                  id="favoriteSubject"
                  value={formData.favoriteSubject}
                  onChange={(e) => setFormData({ ...formData, favoriteSubject: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.favoriteSubject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="Math, Science, Art, etc."
                />
                {errors.favoriteSubject && <p className="mt-1 text-sm text-red-600">{errors.favoriteSubject}</p>}
              </div>
              
              <div>
                <label htmlFor="challengingSubject" className="block text-sm font-medium text-gray-700 mb-1">
                  What subject does your child find most challenging?
                </label>
                <input
                  type="text"
                  id="challengingSubject"
                  value={formData.challengingSubject}
                  onChange={(e) => setFormData({ ...formData, challengingSubject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Math, Science, Art, etc."
                />
              </div>
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Entrepreneurial Thinking</h3>
            <p className="text-gray-600">
              Let's explore your child's entrepreneurial potential.
            </p>
            
            <div className="space-y-4">
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Has your child ever sold something they made or created?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: true, label: 'Yes' },
                    { id: false, label: 'No' }
                  ].map((option) => (
                    <button
                      key={String(option.id)}
                      type="button"
                      onClick={() => setFormData({ ...formData, hasSoldCreated: option.id })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.hasSoldCreated === option.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  Is your child excited about the idea of starting their own company someday?
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: true, label: 'Yes' },
                    { id: false, label: 'No' }
                  ].map((option) => (
                    <button
                      key={String(option.id)}
                      type="button"
                      onClick={() => setFormData({ ...formData, excitedForCompany: option.id })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.excitedForCompany === option.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="invention" className="block text-sm font-medium text-gray-700 mb-1">
                  If your child could invent anything, what would it be?
                </label>
                <textarea
                  id="invention"
                  value={formData.invention}
                  onChange={(e) => setFormData({ ...formData, invention: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.invention ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  rows={3}
                  placeholder="Describe their invention idea..."
                />
                {errors.invention && <p className="mt-1 text-sm text-red-600">{errors.invention}</p>}
              </div>
            </div>
          </div>
        );
      
      case 7:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Personality Type</h3>
            <p className="text-gray-600">
              Let's understand your child's personality traits.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="friendsDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  How would your child's friends describe them?
                </label>
                <textarea
                  id="friendsDescription"
                  value={formData.friendsDescription}
                  onChange={(e) => setFormData({ ...formData, friendsDescription: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.friendsDescription ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  rows={3}
                  placeholder="Funny, kind, creative, etc."
                />
                {errors.friendsDescription && <p className="mt-1 text-sm text-red-600">{errors.friendsDescription}</p>}
              </div>
              
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  How does your child feel about trying new things?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'I love trying new things!', label: 'Loves trying new things' },
                    { id: 'I like to try new things sometimes', label: 'Sometimes tries new things' },
                    { id: 'I prefer sticking to what I know', label: 'Prefers familiar things' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, riskTaking: option.id })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.riskTaking === option.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.riskTaking && <p className="mt-1 text-sm text-red-600">{errors.riskTaking}</p>}
              </div>
              
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-2">
                  When your child faces a problem, what do they usually do?
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Try to solve it myself', label: 'Tries to solve it themselves' },
                    { id: 'Ask for help right away', label: 'Asks for help right away' },
                    { id: 'Avoid the problem', label: 'Tends to avoid problems' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, problemSolvingApproach: option.id })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.problemSolvingApproach === option.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors.problemSolvingApproach && <p className="mt-1 text-sm text-red-600">{errors.problemSolvingApproach}</p>}
              </div>
            </div>
          </div>
        );
      
      case 8:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Fun Brain Teasers</h3>
            <p className="text-gray-600">
              Let's see how your child approaches these fun puzzles! (These help us understand their thinking style)
            </p>
            
            <div className="space-y-6">
              <div className="bg-indigo-50 rounded-xl p-6">
                <p className="font-medium text-gray-900 mb-3">
                  1. What number comes next in this pattern? 2, 5, 11, 23, ?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['30', '32', '47', '46'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        iqQuestions: { ...formData.iqQuestions, patternRecognition: option }
                      })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.iqQuestions.patternRecognition === option
                          ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-200 hover:bg-indigo-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <p className="font-medium text-gray-900 mb-3">
                  2. All cats have tails. Fluffy is a cat. What can we say about Fluffy?
                </p>
                <div className="space-y-3">
                  {[
                    'Fluffy might have a tail',
                    'Fluffy definitely has a tail',
                    'We cannot tell if Fluffy has a tail',
                    'Fluffy has no tail'
                  ].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        iqQuestions: { ...formData.iqQuestions, logicalReasoning: option }
                      })}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        formData.iqQuestions.logicalReasoning === option
                          ? 'border-purple-500 bg-purple-100 text-purple-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <p className="font-medium text-gray-900 mb-3">
                  3. How many triangles do you see in this picture?
                </p>
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1621447980929-6438f7675d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80" 
                    alt="Triangles puzzle" 
                    className="h-40 object-contain"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['3', '4', '5', '6'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        iqQuestions: { ...formData.iqQuestions, spatialAwareness: option }
                      })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.iqQuestions.spatialAwareness === option
                          ? 'border-green-500 bg-green-100 text-green-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-green-200 hover:bg-green-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-xl p-6">
                <p className="font-medium text-gray-900 mb-3">
                  4. If you have 8 apples and you give half to your friend, then eat 1 yourself, how many apples do you have left?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['3', '4', '7', '14'].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        iqQuestions: { ...formData.iqQuestions, wordProblem: option }
                      })}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        formData.iqQuestions.wordProblem === option
                          ? 'border-amber-500 bg-amber-100 text-amber-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      
      case 9:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Career Exploration</h3>
            <p className="text-gray-600">
              Which of these careers might interest your child? Select all that apply.
            </p>
            
            {errors.careerMatches && <p className="text-sm text-red-600">{errors.careerMatches}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careers.map((career) => (
                <button
                  key={career.id}
                  onClick={() => handleCareerToggle(career.id)}
                  className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${
                    formData.careerMatches.includes(career.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{career.label}</p>
                    <p className="text-sm text-gray-500">{career.description}</p>
                  </div>
                  <div className="flex-shrink-0 h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                    {formData.careerMatches.includes(career.id) && (
                      <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      
      case 10:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Final Thoughts</h3>
            <p className="text-gray-600">
              Just a few more questions to help us create the most personalized career guide.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="morningExcitement" className="block text-sm font-medium text-gray-700 mb-1">
                  What gets your child excited to wake up in the morning?
                </label>
                <textarea
                  id="morningExcitement"
                  value={formData.morningExcitement}
                  onChange={(e) => setFormData({ ...formData, morningExcitement: e.target.value })}
                  className={`w-full px-4 py-2 border ${errors.morningExcitement ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                  rows={3}
                  placeholder="What motivates them?"
                />
                {errors.morningExcitement && <p className="mt-1 text-sm text-red-600">{errors.morningExcitement}</p>}
              </div>
              
              <div>
                <label htmlFor="adultUnderstanding" className="block text-sm font-medium text-gray-700 mb-1">
                  What do you wish adults understood better about your child? (optional)
                </label>
                <textarea
                  id="adultUnderstanding"
                  value={formData.adultUnderstanding}
                  onChange={(e) => setFormData({ ...formData, adultUnderstanding: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Any insights that might help us understand them better..."
                />
              </div>
              
              <div>
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
                  Anything else you'd like to share about your child? (optional)
                </label>
                <textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  placeholder="Any additional information..."
                />
              </div>
            </div>
          </div>
        );
      
      case totalSteps + 1:
        return <CareerGuideResult result={result} onClose={onClose} />;
      
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 overflow-y-auto ${isOpen ? 'block' : 'hidden'}`}>
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="relative bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Progress Bar */}
            {step <= totalSteps && (
              <div className="mb-8 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-indigo-900">Career Guide</h2>
                  <span className="text-gray-500 text-sm">Step {step} of {totalSteps}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="mt-3 sm:mt-0 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation Buttons */}
          {step <= totalSteps && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-base font-medium text-white hover:from-indigo-700 hover:to-purple-700 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : step === totalSteps ? (
                  <>
                    Submit
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-5 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}