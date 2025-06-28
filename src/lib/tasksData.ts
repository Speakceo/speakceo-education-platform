import { EnhancedTask, TaskSubmission, TaskProgress } from '../types';

// Define all enhanced tasks as specified in requirements
export const enhancedTasks: EnhancedTask[] = [
  // Week 1 Tasks
  {
    id: 'task-1-1',
    title: 'Define Your Startup Idea',
    description: 'Create a clear, one-sentence description of your startup idea',
    instructions: 'Write a compelling one-sentence pitch that explains what your startup does, who it helps, and why it matters. Optionally, record an audio explanation.',
    inputType: 'text-audio',
    requiredInputs: ['text'],
    xpReward: 15,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    weekNumber: 1,
    order: 1,
    isRequired: true,
    estimatedTime: 30,
    examples: [
      'We help busy parents save time by delivering healthy, pre-made meals directly to their doorstep.',
      'Our app connects local tutors with students who need help, making quality education accessible to everyone.'
    ],
    rubric: [
      { criteria: 'Clarity and conciseness', points: 5 },
      { criteria: 'Target audience identification', points: 5 },
      { criteria: 'Value proposition clarity', points: 5 }
    ]
  },
  {
    id: 'task-1-2',
    title: 'Create Customer Persona',
    description: 'Design a detailed customer persona for your target audience',
    instructions: 'Create a comprehensive customer persona document or infographic that includes demographics, pain points, goals, and behaviors.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 20,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 1,
    order: 2,
    isRequired: true,
    estimatedTime: 60,
    examples: [
      'Include age, profession, income level, hobbies, and challenges',
      'Add a photo and name to make the persona feel real'
    ]
  },
  
  // Week 2 Tasks
  {
    id: 'task-2-1',
    title: 'Personal Brand Statement',
    description: 'Craft your personal brand statement as a young entrepreneur',
    instructions: 'Write a compelling personal brand statement and record yourself presenting it with confidence.',
    inputType: 'text-audio',
    requiredInputs: ['text', 'audio'],
    xpReward: 18,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 2,
    order: 1,
    isRequired: true,
    estimatedTime: 45
  },
  {
    id: 'task-2-2',
    title: 'Introduction Video',
    description: 'Create a 30-second introduction video',
    instructions: 'Record a professional 30-second video introducing yourself, your background, and your entrepreneurial goals.',
    inputType: 'video',
    requiredInputs: ['video'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 2,
    order: 2,
    isRequired: true,
    estimatedTime: 90
  },

  // Week 3 Tasks
  {
    id: 'task-3-1',
    title: 'Market Research Report',
    description: 'Conduct comprehensive market research for your industry',
    instructions: 'Create a detailed market research report with market size, trends, and opportunities. Include an optional audio summary.',
    inputType: 'pdf-audio',
    requiredInputs: ['pdf'],
    xpReward: 30,
    dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 3,
    order: 1,
    isRequired: true,
    estimatedTime: 120
  },
  {
    id: 'task-3-2',
    title: 'Competitor Analysis',
    description: 'Analyze your top 3-5 competitors',
    instructions: 'Create a comprehensive competitor analysis comparing features, pricing, strengths, and weaknesses.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 3,
    order: 2,
    isRequired: true,
    estimatedTime: 90
  },

  // Week 4 Tasks
  {
    id: 'task-4-1',
    title: 'Personal Budget Plan',
    description: 'Create a personal budget plan for your entrepreneurial journey',
    instructions: 'Develop a detailed budget plan showing income, expenses, and savings goals in a clear tabular or chart format.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 20,
    dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 4,
    order: 1,
    isRequired: true,
    estimatedTime: 60
  },
  {
    id: 'task-4-2',
    title: 'Expense Tracking Report',
    description: 'Track and analyze your weekly expenses',
    instructions: 'Create a weekly expense tracking report with categories, amounts, and insights about your spending patterns.',
    inputType: 'image',
    requiredInputs: ['image'],
    xpReward: 15,
    dueDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 4,
    order: 2,
    isRequired: false,
    estimatedTime: 30
  },

  // Week 5 Tasks
  {
    id: 'task-5-1',
    title: 'Business Model Canvas',
    description: 'Complete a Business Model Canvas for your startup',
    instructions: 'Fill out all 9 sections of the Business Model Canvas and provide an audio explanation of your choices.',
    inputType: 'image-audio',
    requiredInputs: ['image', 'audio'],
    xpReward: 35,
    dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 5,
    order: 1,
    isRequired: true,
    estimatedTime: 120
  },
  {
    id: 'task-5-2',
    title: 'Value Proposition Design',
    description: 'Design your value proposition canvas',
    instructions: 'Create a clear value proposition with supporting text and visual diagram.',
    inputType: 'text',
    requiredInputs: ['text'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 5,
    order: 2,
    isRequired: true,
    estimatedTime: 75
  },

  // Week 6 Tasks
  {
    id: 'task-6-1',
    title: 'Logo Design',
    description: 'Create a logo for your startup',
    instructions: 'Design a professional logo that represents your brand identity. Include optional rationale for design choices.',
    inputType: 'image',
    requiredInputs: ['image'],
    xpReward: 20,
    dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 6,
    order: 1,
    isRequired: true,
    estimatedTime: 90
  },
  {
    id: 'task-6-2',
    title: 'Brand Identity Package',
    description: 'Create a comprehensive brand identity package',
    instructions: 'Develop a brand guide including fonts, colors, styles, and usage guidelines.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 30,
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 6,
    order: 2,
    isRequired: true,
    estimatedTime: 105
  },

  // Week 7 Tasks
  {
    id: 'task-7-1',
    title: 'Revenue Streams Analysis',
    description: 'Analyze potential revenue streams for your business',
    instructions: 'Document different ways your business can generate revenue with detailed analysis and optional audio explanation.',
    inputType: 'pdf-audio',
    requiredInputs: ['pdf'],
    xpReward: 28,
    dueDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 7,
    order: 1,
    isRequired: true,
    estimatedTime: 90
  },
  {
    id: 'task-7-2',
    title: 'Pricing Strategy',
    description: 'Develop a comprehensive pricing strategy',
    instructions: 'Create a pricing document with competitive analysis, cost structure, and pricing rationale.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 7,
    order: 2,
    isRequired: true,
    estimatedTime: 75
  },

  // Week 8 Tasks
  {
    id: 'task-8-1',
    title: 'Pitch Recording',
    description: 'Record your 1-minute elevator pitch',
    instructions: 'Create a compelling 1-minute pitch that covers your problem, solution, and ask.',
    inputType: 'video',
    requiredInputs: ['video'],
    xpReward: 30,
    dueDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 8,
    order: 1,
    isRequired: true,
    estimatedTime: 60
  },
  {
    id: 'task-8-2',
    title: 'Debate Participation',
    description: 'Participate in entrepreneurship debate preparation',
    instructions: 'Prepare debate notes and reflection on key entrepreneurship topics.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 20,
    dueDate: new Date(Date.now() + 59 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 8,
    order: 2,
    isRequired: false,
    estimatedTime: 45
  },

  // Week 9 Tasks
  {
    id: 'task-9-1',
    title: 'Social Media Strategy',
    description: 'Create a comprehensive social media strategy',
    instructions: 'Develop a content plan with sample posts and engagement strategy.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 9,
    order: 1,
    isRequired: true,
    estimatedTime: 90
  },
  {
    id: 'task-9-2',
    title: 'Marketing Campaign Design',
    description: 'Design a complete marketing campaign',
    instructions: 'Create a campaign presentation with voice narration explaining your strategy.',
    inputType: 'presentation-audio',
    requiredInputs: ['pdf', 'audio'],
    xpReward: 35,
    dueDate: new Date(Date.now() + 66 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 9,
    order: 2,
    isRequired: true,
    estimatedTime: 120
  },

  // Week 10 Tasks
  {
    id: 'task-10-1',
    title: 'Organization Structure',
    description: 'Design your organization structure',
    instructions: 'Create a team chart or hierarchy showing roles and responsibilities.',
    inputType: 'image',
    requiredInputs: ['image'],
    xpReward: 20,
    dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 10,
    order: 1,
    isRequired: true,
    estimatedTime: 60
  },
  {
    id: 'task-10-2',
    title: 'Team Roles Document',
    description: 'Define detailed team roles and responsibilities',
    instructions: 'Create comprehensive role descriptions with optional audio explanation.',
    inputType: 'pdf-audio',
    requiredInputs: ['pdf'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 73 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 10,
    order: 2,
    isRequired: true,
    estimatedTime: 75
  },

  // Week 11 Tasks
  {
    id: 'task-11-1',
    title: 'Pitch Deck',
    description: 'Create a comprehensive pitch deck',
    instructions: 'Develop a professional pitch deck with voice narration for each slide.',
    inputType: 'presentation-audio',
    requiredInputs: ['pdf', 'audio'],
    xpReward: 40,
    dueDate: new Date(Date.now() + 77 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 11,
    order: 1,
    isRequired: true,
    estimatedTime: 150
  },
  {
    id: 'task-11-2',
    title: 'Funding Proposal',
    description: 'Prepare a detailed funding proposal',
    instructions: 'Create a financial document with forecasts, funding requirements, and usage plan.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 35,
    dueDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 11,
    order: 2,
    isRequired: true,
    estimatedTime: 120
  },

  // Week 12 Tasks
  {
    id: 'task-12-1',
    title: 'Business Plan',
    description: 'Complete your comprehensive business plan',
    instructions: 'Create a full business plan covering all aspects of your startup.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 50,
    dueDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 12,
    order: 1,
    isRequired: true,
    estimatedTime: 180
  },

  // Week 13 Tasks
  {
    id: 'task-13-1',
    title: 'Final Presentation',
    description: 'Deliver your final pitch presentation',
    instructions: 'Create a comprehensive final presentation showcasing your complete business concept.',
    inputType: 'video',
    requiredInputs: ['video'],
    xpReward: 60,
    dueDate: new Date(Date.now() + 91 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 13,
    order: 1,
    isRequired: true,
    estimatedTime: 120
  }
];

// Demo task submissions for testing
export const demoTaskSubmissions: TaskSubmission[] = [
  {
    id: 'submission-1',
    taskId: 'task-1-1',
    userId: 'demo-user',
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'reviewed',
    textContent: 'EcoEats helps busy professionals eat healthily by delivering fresh, locally-sourced meals that are ready in under 3 minutes.',
    reflection: 'I learned that a good startup idea needs to solve a real problem that people face daily.',
    aiReview: {
      feedback: 'Excellent work! Your startup idea is clear and addresses a specific target audience with a compelling value proposition.',
      score: 9,
      suggestions: [
        'Consider adding a sustainability angle to differentiate further',
        'Think about scalability in different markets'
      ],
      generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    resubmissionAllowed: false,
    reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    xpAwarded: 15
  },
  {
    id: 'submission-2',
    taskId: 'task-1-2',
    userId: 'demo-user',
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'submitted',
    fileUrls: ['/uploads/customer-persona-demo.pdf'],
    reflection: 'Creating a customer persona helped me understand my target audience much better.',
    resubmissionAllowed: true,
    xpAwarded: 0
  },
  {
    id: 'submission-3',
    taskId: 'task-2-1',
    userId: 'demo-user',
    submittedAt: new Date().toISOString(),
    status: 'pending',
    textContent: 'I am a passionate young entrepreneur dedicated to creating sustainable solutions that make healthy living accessible to everyone.',
    fileUrls: ['/uploads/brand-statement-audio.mp3'],
    resubmissionAllowed: true,
    xpAwarded: 0
  }
];

// Demo task progress
export const demoTaskProgress: TaskProgress[] = [
  {
    taskId: 'task-1-1',
    status: 'completed',
    submissionId: 'submission-1',
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    xpEarned: 15
  },
  {
    taskId: 'task-1-2',
    status: 'submitted',
    submissionId: 'submission-2',
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    xpEarned: 0
  },
  {
    taskId: 'task-2-1',
    status: 'submitted',
    submissionId: 'submission-3',
    lastUpdated: new Date().toISOString(),
    xpEarned: 0
  }
];

export default enhancedTasks; 