import { supabase } from '../supabase';

interface CareerGuideFormData {
  // Step 1: Basic Info
  studentName: string;
  age: string;
  grade: string;
  parentEmail: string;
  parentPhone?: string;
  
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
  
  // Step 8: IQ Questions (optional in API)
  iqQuestions?: {
    patternRecognition: string;
    logicalReasoning: string;
    spatialAwareness: string;
    wordProblem: string;
  };
  
  // Step 9: Career Matching (optional in API)
  careerMatches?: string[];
  
  // Step 10: Wrap-Up
  morningExcitement: string;
  adultUnderstanding?: string;
  additionalInfo?: string;
}

interface CareerGuideResult {
  studentName: string;
  age: string;
  overview: string;
  personalityInsights: string;
  learningStyle: string;
  topCareers: string[];
  skillsToDevelop: string[];
  motivationalMessage: string;
  iqScore?: number;
  entrepreneurialScore?: number;
  strengthsWeaknesses?: {
    strengths: string[];
    weaknesses: string[];
  };
  careerCompatibility?: Record<string, number>;
  learningStyleBreakdown?: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  personalityTraits?: Record<string, number>;
  developmentTimeline?: {
    phase: string;
    timeframe: string;
    focus: string;
    activities: string[];
  }[];
}

// Map interest IDs to their full descriptions
const interestMap: Record<string, string> = {
  'puzzles': 'Solving puzzles or playing logic games',
  'art': 'Drawing, painting, or storytelling',
  'helping': 'Helping others and organizing things',
  'selling': 'Selling things or starting little businesses',
  'tech': 'Playing with gadgets or coding',
  'speaking': 'Speaking on stage or debating',
  'content': 'Making videos or content for social media',
  'reading': 'Reading books or writing blogs'
};

// Map career IDs to their full descriptions
const careerMap: Record<string, string> = {
  'entrepreneur': 'Entrepreneur',
  'engineer': 'Engineer',
  'doctor': 'Doctor',
  'artist': 'Artist',
  'scientist': 'Scientist',
  'teacher': 'Teacher',
  'programmer': 'Programmer',
  'designer': 'Designer',
  'writer': 'Writer',
  'marketer': 'Marketer'
};

export async function generateCareerGuide(formData: CareerGuideFormData): Promise<CareerGuideResult> {
  try {
    // Map interests to their full descriptions
    const interestDescriptions = formData.interests.map(id => interestMap[id] || id);
    
    // Map career matches if available
    const careerMatchDescriptions = formData.careerMatches?.map(id => careerMap[id] || id) || [];
    
    // Calculate IQ score if available (simple calculation for demo)
    let iqScore: number | undefined;
    let correctAnswers = 0;
    const totalQuestions = 4;
    
    if (formData.iqQuestions) {
      const correctAnswersMap = {
        patternRecognition: "32",
        logicalReasoning: "Fluffy definitely has a tail",
        spatialAwareness: "4",
        wordProblem: "14"
      };
      
      if (formData.iqQuestions.patternRecognition === correctAnswersMap.patternRecognition) correctAnswers++;
      if (formData.iqQuestions.logicalReasoning === correctAnswersMap.logicalReasoning) correctAnswers++;
      if (formData.iqQuestions.spatialAwareness === correctAnswersMap.spatialAwareness) correctAnswers++;
      if (formData.iqQuestions.wordProblem === correctAnswersMap.wordProblem) correctAnswers++;
      
      iqScore = Math.round((correctAnswers / totalQuestions) * 100);
    }
    
    // Calculate entrepreneurial score
    const entrepreneurialScore = calculateEntrepreneurialScore(formData);
    
    // Generate basic career guide result (fallback implementation)
    const result: CareerGuideResult = {
      studentName: formData.studentName,
      age: formData.age,
      overview: `${formData.studentName} shows strong potential in ${interestDescriptions.slice(0, 2).join(' and ')}.`,
      personalityInsights: `Based on the assessment, ${formData.studentName} demonstrates ${formData.confidence >= 4 ? 'high confidence' : 'developing confidence'} and ${formData.creativity >= 4 ? 'strong creativity' : 'emerging creativity'}.`,
      learningStyle: formData.learningStyle,
      topCareers: careerMatchDescriptions.length > 0 ? careerMatchDescriptions.slice(0, 3) : ['Entrepreneur', 'Designer', 'Engineer'],
      skillsToDevelop: [
        formData.communication < 4 ? 'Communication skills' : null,
        formData.leadership < 4 ? 'Leadership abilities' : null,
        formData.timeManagement < 4 ? 'Time management' : null
      ].filter(Boolean) as string[],
      motivationalMessage: `${formData.studentName}, you have amazing potential! Keep exploring your interests in ${interestDescriptions[0]} and remember that every successful entrepreneur started with curiosity and determination.`,
      iqScore,
      entrepreneurialScore,
      strengthsWeaknesses: {
        strengths: [
          formData.creativity >= 4 ? 'Creative thinking' : null,
          formData.problemSolving >= 4 ? 'Problem solving' : null,
          formData.curiosity >= 4 ? 'Natural curiosity' : null
        ].filter(Boolean) as string[],
        weaknesses: [
          formData.confidence < 3 ? 'Building confidence' : null,
          formData.communication < 3 ? 'Communication skills' : null
        ].filter(Boolean) as string[]
      },
      careerCompatibility: {
        'Entrepreneur': entrepreneurialScore,
        'Engineer': formData.problemSolving * 20,
        'Artist': formData.creativity * 20,
        'Teacher': formData.communication * 20
      },
      learningStyleBreakdown: {
        visual: formData.learningStyle.includes('visual') ? 70 : 30,
        auditory: formData.learningStyle.includes('listening') ? 70 : 30,
        kinesthetic: formData.learningStyle.includes('hands-on') ? 70 : 30
      },
      personalityTraits: {
        'Creativity': formData.creativity * 20,
        'Leadership': formData.leadership * 20,
        'Communication': formData.communication * 20,
        'Problem Solving': formData.problemSolving * 20
      },
      developmentTimeline: [
        {
          phase: 'Foundation Building',
          timeframe: 'Next 6 months',
          focus: 'Core skills development',
          activities: ['Join entrepreneurship clubs', 'Practice public speaking', 'Start a small project']
        },
        {
          phase: 'Skill Enhancement',
          timeframe: '6-12 months',
          focus: 'Specialized learning',
          activities: ['Take online courses', 'Find a mentor', 'Build a portfolio']
        },
        {
          phase: 'Application',
          timeframe: '1-2 years',
          focus: 'Real-world experience',
          activities: ['Start a business', 'Internships', 'Leadership roles']
        }
      ]
    };
    
    return result;
  } catch (error) {
    console.error('Error generating career guide:', error);
    throw new Error('Failed to generate career guide');
  }
}

function calculateEntrepreneurialScore(formData: CareerGuideFormData): number {
  let score = 0;
  
  // Interest in selling/business
  if (formData.interests.includes('selling')) score += 20;
  if (formData.interests.includes('speaking')) score += 15;
  if (formData.interests.includes('content')) score += 10;
  
  // Self-assessment scores
  score += formData.leadership * 4;
  score += formData.confidence * 4;
  score += formData.communication * 3;
  score += formData.problemSolving * 3;
  
  // Entrepreneurial thinking
  if (formData.hasSoldCreated) score += 15;
  if (formData.excitedForCompany) score += 15;
  
  // Risk-taking attitude
  if (formData.riskTaking.includes('love') || formData.riskTaking.includes('enjoy')) score += 10;
  
  return Math.min(score, 100);
}

export async function emailCareerGuide(email: string, pdfUrl: string, studentName: string): Promise<boolean> {
  try {
    // For now, just log the email attempt
    console.log(`Would email career guide to ${email} for ${studentName}`);
    return true;
  } catch (error) {
    console.error('Error emailing career guide:', error);
    return false;
  }
}

export async function storeCareerGuideData(formData: CareerGuideFormData, result: CareerGuideResult): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('career_guides')
      .insert({
        student_name: formData.studentName,
        age: formData.age,
        grade: formData.grade,
        parent_email: formData.parentEmail,
        parent_phone: formData.parentPhone,
        interests: formData.interests,
        self_assessment: {
          creativity: formData.creativity,
          confidence: formData.confidence,
          communication: formData.communication,
          leadership: formData.leadership,
          problemSolving: formData.problemSolving,
          teamwork: formData.teamwork,
          timeManagement: formData.timeManagement,
          curiosity: formData.curiosity
        },
        future_preferences: {
          futureAspiration: formData.futureAspiration,
          workEnvironment: formData.workEnvironment,
          workStyle: formData.workStyle,
          problemApproach: formData.problemApproach
        },
        learning_style: {
          learningStyle: formData.learningStyle,
          favoriteSubject: formData.favoriteSubject,
          challengingSubject: formData.challengingSubject
        },
        entrepreneurial_thinking: {
          hasSoldCreated: formData.hasSoldCreated,
          excitedForCompany: formData.excitedForCompany,
          invention: formData.invention
        },
        personality: {
          friendsDescription: formData.friendsDescription,
          riskTaking: formData.riskTaking,
          problemSolvingApproach: formData.problemSolvingApproach
        },
        iq_questions: formData.iqQuestions,
        career_matches: formData.careerMatches,
        wrap_up: {
          morningExcitement: formData.morningExcitement,
          adultUnderstanding: formData.adultUnderstanding,
          additionalInfo: formData.additionalInfo
        },
        guide_result: result,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Supabase error storing career guide:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error storing career guide data:', error);
    return false;
  }
}
