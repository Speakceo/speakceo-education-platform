import React, { useState, useRef, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  Upload, 
  FileText, 
  Image, 
  Mic, 
  Video, 
  Link, 
  Calendar,
  Trophy,
  Filter,
  Plus,
  Edit3,
  Zap,
  Target,
  BookOpen,
  Brain,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  Download
} from 'lucide-react';
import { useUserProgress } from '../../contexts/UserProgressContext';

// Simplified types for this component
interface Task {
  id: string;
  title: string;
  description: string;
  instructions: string;
  inputType: string;
  requiredInputs: string[];
  xpReward: number;
  dueDate: string;
  weekNumber: number;
  order: number;
  isRequired: boolean;
  estimatedTime: number;
  examples?: string[];
}

interface TaskSubmission {
  id: string;
  taskId: string;
  submittedAt: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'completed';
  textContent?: string;
  fileUrls?: string[];
  linkUrl?: string;
  reflection?: string;
  aiReview?: {
    feedback: string;
    score: number;
    suggestions: string[];
  };
  xpAwarded: number;
}

interface TaskProgress {
  taskId: string;
  status: 'pending' | 'submitted' | 'reviewed' | 'completed';
  submissionId?: string;
  lastUpdated: string;
  xpEarned: number;
}

type FilterType = 'all' | 'pending' | 'submitted' | 'completed' | 'upcoming';

// Sample data with more weeks and tasks
const sampleTasks: Task[] = [
  // Week 1 Tasks
  {
    id: 'task-1-1',
    title: 'Define Your Startup Idea',
    description: 'Create a clear, one-sentence description of your startup idea',
    instructions: 'Write a compelling one-sentence pitch that explains what your startup does, who it helps, and why it matters.',
    inputType: 'text-audio',
    requiredInputs: ['text'],
    xpReward: 15,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 1,
    order: 1,
    isRequired: true,
    estimatedTime: 30,
    examples: ['We help busy parents save time by delivering healthy, pre-made meals directly to their doorstep.']
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
    estimatedTime: 60
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
    inputType: 'image',
    requiredInputs: ['image'],
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
    title: 'Business Model Canvas',
    description: 'Complete a Business Model Canvas for your startup',
    instructions: 'Fill out all 9 sections of the Business Model Canvas and provide an audio explanation of your choices.',
    inputType: 'image-audio',
    requiredInputs: ['image', 'audio'],
    xpReward: 35,
    dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 4,
    order: 1,
    isRequired: true,
    estimatedTime: 120
  },
  {
    id: 'task-4-2',
    title: 'Value Proposition Design',
    description: 'Design your value proposition canvas',
    instructions: 'Create a clear value proposition with supporting text and visual diagram.',
    inputType: 'text',
    requiredInputs: ['text'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 4,
    order: 2,
    isRequired: true,
    estimatedTime: 75
  },

  // Week 5 Tasks
  {
    id: 'task-5-1',
    title: 'Pitch Recording',
    description: 'Record your 1-minute elevator pitch',
    instructions: 'Create a compelling 1-minute pitch that covers your problem, solution, and ask.',
    inputType: 'video',
    requiredInputs: ['video'],
    xpReward: 30,
    dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 5,
    order: 1,
    isRequired: true,
    estimatedTime: 60
  },
  {
    id: 'task-5-2',
    title: 'Business Plan Summary',
    description: 'Write a comprehensive business plan summary',
    instructions: 'Create a 2-page business plan summary covering all key aspects of your startup.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 40,
    dueDate: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 5,
    order: 2,
    isRequired: true,
    estimatedTime: 150
  },

  // Week 6 Tasks
  {
    id: 'task-6-1',
    title: 'Logo Design',
    description: 'Create a professional logo for your startup',
    instructions: 'Design a memorable logo that represents your brand identity. Include rationale for design choices.',
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
    description: 'Create a comprehensive brand identity guide',
    instructions: 'Develop a brand guide including fonts, colors, styles, and usage guidelines for your startup.',
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
    instructions: 'Document different ways your business can generate revenue with detailed analysis and projections.',
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
    title: 'Marketing Strategy Plan',
    description: 'Create a comprehensive marketing strategy',
    instructions: 'Develop a detailed marketing plan including target audience, channels, and campaign ideas.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 32,
    dueDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 8,
    order: 1,
    isRequired: true,
    estimatedTime: 120
  },
  {
    id: 'task-8-2',
    title: 'Social Media Campaign',
    description: 'Design a social media marketing campaign',
    instructions: 'Create sample posts, content calendar, and engagement strategy for your startup.',
    inputType: 'image-audio',
    requiredInputs: ['image'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 59 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 8,
    order: 2,
    isRequired: true,
    estimatedTime: 80
  },

  // Week 9 Tasks
  {
    id: 'task-9-1',
    title: 'Financial Planning',
    description: 'Create detailed financial projections',
    instructions: 'Develop 3-year financial projections including revenue, expenses, and cash flow.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 35,
    dueDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 9,
    order: 1,
    isRequired: true,
    estimatedTime: 140
  },
  {
    id: 'task-9-2',
    title: 'Budget Allocation Plan',
    description: 'Plan your startup budget allocation',
    instructions: 'Create a detailed budget showing how you will allocate funds across different business areas.',
    inputType: 'image',
    requiredInputs: ['image'],
    xpReward: 22,
    dueDate: new Date(Date.now() + 66 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 9,
    order: 2,
    isRequired: true,
    estimatedTime: 60
  },

  // Week 10 Tasks
  {
    id: 'task-10-1',
    title: 'Team Structure Design',
    description: 'Design your ideal team structure',
    instructions: 'Create an organizational chart showing roles, responsibilities, and reporting structure.',
    inputType: 'image',
    requiredInputs: ['image'],
    xpReward: 25,
    dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 10,
    order: 1,
    isRequired: true,
    estimatedTime: 75
  },
  {
    id: 'task-10-2',
    title: 'Hiring Plan',
    description: 'Develop a comprehensive hiring strategy',
    instructions: 'Create a hiring plan including job descriptions, timeline, and recruitment strategy.',
    inputType: 'pdf-audio',
    requiredInputs: ['pdf'],
    xpReward: 28,
    dueDate: new Date(Date.now() + 73 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 10,
    order: 2,
    isRequired: true,
    estimatedTime: 95
  },

  // Week 11 Tasks
  {
    id: 'task-11-1',
    title: 'Pitch Deck Creation',
    description: 'Create a professional investor pitch deck',
    instructions: 'Develop a 10-slide pitch deck covering problem, solution, market, business model, and ask.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 40,
    dueDate: new Date(Date.now() + 77 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 11,
    order: 1,
    isRequired: true,
    estimatedTime: 150
  },
  {
    id: 'task-11-2',
    title: 'Investor Presentation',
    description: 'Record your investor pitch presentation',
    instructions: 'Present your pitch deck in a compelling 5-minute video presentation for potential investors.',
    inputType: 'video',
    requiredInputs: ['video'],
    xpReward: 45,
    dueDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 11,
    order: 2,
    isRequired: true,
    estimatedTime: 120
  },

  // Week 12 Tasks
  {
    id: 'task-12-1',
    title: 'Launch Strategy',
    description: 'Develop your go-to-market launch strategy',
    instructions: 'Create a comprehensive launch plan including timeline, marketing, and success metrics.',
    inputType: 'pdf',
    requiredInputs: ['pdf'],
    xpReward: 38,
    dueDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 12,
    order: 1,
    isRequired: true,
    estimatedTime: 130
  },
  {
    id: 'task-12-2',
    title: 'Pre-Launch Checklist',
    description: 'Complete your pre-launch preparation checklist',
    instructions: 'Document all preparations needed before launch including legal, technical, and marketing requirements.',
    inputType: 'text-audio',
    requiredInputs: ['text'],
    xpReward: 30,
    dueDate: new Date(Date.now() + 87 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 12,
    order: 2,
    isRequired: true,
    estimatedTime: 90
  },

  // Week 13 Tasks
  {
    id: 'task-13-1',
    title: 'Final Business Presentation',
    description: 'Present your complete business concept',
    instructions: 'Create a comprehensive final presentation showcasing your entire entrepreneurial journey and business plan.',
    inputType: 'video',
    requiredInputs: ['video'],
    xpReward: 50,
    dueDate: new Date(Date.now() + 91 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 13,
    order: 1,
    isRequired: true,
    estimatedTime: 180
  },
  {
    id: 'task-13-2',
    title: 'Launch Celebration & Reflection',
    description: 'Document your launch and reflect on your journey',
    instructions: 'Create a reflection piece and celebration video documenting your entrepreneurial journey and lessons learned.',
    inputType: 'video',
    requiredInputs: ['video'],
    xpReward: 55,
    dueDate: new Date(Date.now() + 94 * 24 * 60 * 60 * 1000).toISOString(),
    weekNumber: 13,
    order: 2,
    isRequired: true,
    estimatedTime: 120
  }
];

export default function TasksAssignments() {
  const [tasks] = useState<Task[]>(sampleTasks);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([
    {
      id: 'submission-1',
      taskId: 'task-1-1',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      textContent: 'EcoEats helps busy professionals eat healthily by delivering fresh, locally-sourced meals that are ready in under 3 minutes.',
      reflection: 'I learned that a good startup idea needs to solve a real problem that people face daily.',
      aiReview: {
        feedback: 'Excellent work! Your startup idea is clear and addresses a specific target audience.',
        score: 9,
        suggestions: ['Consider adding a sustainability angle', 'Think about scalability']
      },
      xpAwarded: 15
    }
  ]);
  const [taskProgress, setTaskProgress] = useState<TaskProgress[]>([
    {
      taskId: 'task-1-1',
      status: 'completed',
      submissionId: 'submission-1',
      lastUpdated: new Date().toISOString(),
      xpEarned: 15
    }
  ]);

  // Use progress context for real-time updates
  const { progress, completeTask } = useUserProgress();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [submissionModal, setSubmissionModal] = useState<{ task: Task; submission?: TaskSubmission } | null>(null);
  const [aiReviewEnabled, setAiReviewEnabled] = useState(true);

  // Handle task submission with progress context integration
  const handleTaskSubmission = (task: Task, submissionData: any) => {
    const newSubmission: TaskSubmission = {
      id: `submission-${Date.now()}`,
      taskId: task.id,
      submittedAt: new Date().toISOString(),
      status: 'submitted',
      ...submissionData,
      xpAwarded: 0
    };

    // Add submission
    setSubmissions(prev => [...prev, newSubmission]);

    // Update task progress
    setTaskProgress(prev => {
      const existing = prev.find(p => p.taskId === task.id);
      if (existing) {
        return prev.map(p => 
          p.taskId === task.id 
            ? { ...p, status: 'submitted', submissionId: newSubmission.id, lastUpdated: new Date().toISOString() }
            : p
        );
      } else {
        return [...prev, {
          taskId: task.id,
          status: 'submitted',
          submissionId: newSubmission.id,
          lastUpdated: new Date().toISOString(),
          xpEarned: 0
        }];
      }
    });

    // Simulate AI review after 3 seconds
    if (aiReviewEnabled) {
      setTimeout(() => {
        const score = Math.floor(Math.random() * 3) + 8; // 8-10 points
        const aiReview = {
          feedback: `Great work! Your submission demonstrates good understanding of the concepts.`,
          score,
          suggestions: ['Consider adding more details', 'Great job on the structure']
        };

        // Update submission with AI review
        setSubmissions(prev => prev.map(s => 
          s.id === newSubmission.id 
            ? { ...s, status: 'completed', aiReview, xpAwarded: score }
            : s
        ));

        // Update task progress to completed and award XP through context
        setTaskProgress(prev => prev.map(p => 
          p.taskId === task.id 
            ? { ...p, status: 'completed', xpEarned: score, lastUpdated: new Date().toISOString() }
            : p
        ));

        // Award XP through progress context
        completeTask(task.id, score);
      }, 3000);
    }

    setSubmissionModal(null);
  };

  // File input refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Calculate stats using progress context
  const totalTasks = tasks.length;
  const completedTasks = progress.completedTasks.length;
  const totalXpEarned = progress.totalXP;
  const totalPossibleXp = tasks.reduce((sum, task) => sum + task.xpReward, 0);
  const avgScore = completedTasks > 0 ? Math.round((totalXpEarned / completedTasks) * 10) / 10 : 0;

  // Get task status using progress context
  const getTaskStatus = (taskId: string) => {
    if (progress.completedTasks.includes(taskId)) return 'completed';
    const taskEntry = taskProgress.find((p: TaskProgress) => p.taskId === taskId);
    return taskEntry?.status || 'pending';
  };

  // Get task submission
  const getTaskSubmission = (taskId: string) => {
    const progress = taskProgress.find(p => p.taskId === taskId);
    return progress?.submissionId ? submissions.find(s => s.id === progress.submissionId) : undefined;
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const status = getTaskStatus(task.id);
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const isUpcoming = dueDate > today && status === 'pending';

    switch (selectedFilter) {
      case 'pending': return status === 'pending' && !isUpcoming;
      case 'submitted': return status === 'submitted';
      case 'completed': return status === 'completed' || status === 'reviewed';
      case 'upcoming': return isUpcoming;
      default: return true;
    }
  });

  // Group tasks by week
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const week = task.weekNumber;
    if (!groups[week]) groups[week] = [];
    groups[week].push(task);
    return groups;
  }, {} as Record<number, Task[]>);

  // Calculate time remaining
  const getTimeRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Overdue', color: 'text-red-500', urgent: true };
    if (diffDays === 0) return { text: 'Due today', color: 'text-orange-500', urgent: true };
    if (diffDays === 1) return { text: '1 day left', color: 'text-orange-500', urgent: true };
    if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'text-yellow-600', urgent: false };
    return { text: `${diffDays} days left`, color: 'text-gray-500', urgent: false };
  };

  // Get input type icon
  const getInputIcon = (inputType: string) => {
    switch (inputType) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      default: return <Upload className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">Tasks & Assignments</h1>
        </div>
        <p className="text-xl text-gray-600">
          Complete hands-on tasks to build your entrepreneurial skills and earn XP points
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-6 w-6" />
            <span className="font-medium">Total Points</span>
          </div>
          <p className="text-3xl font-bold">{totalXpEarned.toLocaleString()}</p>
          <p className="text-sm opacity-80">of {totalPossibleXp.toLocaleString()} possible</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-6 w-6" />
            <span className="font-medium">Completed</span>
          </div>
          <p className="text-3xl font-bold">{completedTasks}</p>
          <p className="text-sm opacity-80">of {totalTasks} tasks</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-6 w-6" />
            <span className="font-medium">Pending</span>
          </div>
          <p className="text-3xl font-bold">{progress.tasksSubmittedThisWeek}</p>
          <p className="text-sm opacity-80">submitted this week</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-6 w-6" />
            <span className="font-medium">Level</span>
          </div>
          <p className="text-3xl font-bold">{progress.level}</p>
          <p className="text-sm opacity-80">current level</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Tasks', icon: BookOpen },
            { key: 'pending', label: 'Pending', icon: Clock },
            { key: 'submitted', label: 'Submitted', icon: Upload },
            { key: 'completed', label: 'Completed', icon: CheckCircle },
            { key: 'upcoming', label: 'Upcoming', icon: Calendar }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key as FilterType)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedFilter === key
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Review Toggle */}
      <div className="mb-6">
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
          <Brain className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-purple-800">AI Feedback</span>
          <button
            onClick={() => setAiReviewEnabled(!aiReviewEnabled)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              aiReviewEnabled ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                aiReviewEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <span className="text-sm text-purple-600">
            {aiReviewEnabled ? 'Get AI feedback on submissions' : 'AI feedback disabled'}
          </span>
        </div>
      </div>

      {/* Tasks by Week */}
      <div className="space-y-8">
        {Object.entries(groupedTasks)
          .sort(([a], [b]) => parseInt(a) - parseInt(b))
          .map(([weekNumber, weekTasks]) => (
            <div key={weekNumber} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Week {weekNumber} Tasks
                  <span className="text-sm font-normal text-gray-500">
                    ({weekTasks.length} task{weekTasks.length !== 1 ? 's' : ''})
                  </span>
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {weekTasks.map((task) => {
                    const status = getTaskStatus(task.id);
                    const submission = getTaskSubmission(task.id);
                    const timeRemaining = getTimeRemaining(task.dueDate);
                    const isExpanded = expandedTask === task.id;

                    return (
                      <div
                        key={task.id}
                        className={`relative bg-gray-50 rounded-xl p-6 border-2 transition-all duration-200 ${
                          status === 'completed' || status === 'reviewed'
                            ? 'border-green-300 bg-green-50'
                            : status === 'submitted'
                            ? 'border-blue-300 bg-blue-50'
                            : timeRemaining.urgent
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                              {task.isRequired && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                            
                            {/* Task Meta */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="font-medium">{task.xpReward} XP</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{task.estimatedTime} min</span>
                              </div>
                              <div className="flex items-center gap-1">
                                {getInputIcon(task.inputType)}
                                <span className="capitalize">{task.inputType.replace('-', ' + ')}</span>
                              </div>
                              <div className={`flex items-center gap-1 ${timeRemaining.color}`}>
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">{timeRemaining.text}</span>
                                {timeRemaining.urgent && <AlertCircle className="h-4 w-4" />}
                              </div>
                            </div>
                          </div>

                          {/* Status Indicator */}
                          <div className="flex items-center gap-2">
                            {status === 'completed' || status === 'reviewed' ? (
                              <CheckCircle className="h-6 w-6 text-green-500" />
                            ) : status === 'submitted' ? (
                              <Clock className="h-6 w-6 text-blue-500" />
                            ) : (
                              <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => setExpandedTask(isExpanded ? null : task.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            Details
                          </button>

                          {status === 'pending' && (
                            <button
                              onClick={() => setSubmissionModal({ task })}
                              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                              Submit Task
                            </button>
                          )}

                          {status === 'completed' && submission && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                              <Star className="h-4 w-4" />
                              Completed
                            </button>
                          )}
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Instructions:</h4>
                              <p className="text-gray-600 text-sm">{task.instructions}</p>
                            </div>

                            {task.examples && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Examples:</h4>
                                <ul className="text-gray-600 text-sm space-y-1">
                                  {task.examples.map((example, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <span className="text-indigo-500 mt-1">•</span>
                                      {example}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Submission Preview */}
                            {submission && (
                              <div className="bg-white rounded-lg p-4 border">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                  <Upload className="h-4 w-4" />
                                  Your Submission
                                </h4>
                                
                                {submission.textContent && (
                                  <div className="mb-3">
                                    <p className="text-sm text-gray-600">{submission.textContent}</p>
                                  </div>
                                )}

                                {submission.reflection && (
                                  <div className="mb-3">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Reflection:</p>
                                    <p className="text-sm text-gray-600">{submission.reflection}</p>
                                  </div>
                                )}

                                {submission.aiReview && (
                                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <h5 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                                      <Brain className="h-4 w-4" />
                                      AI Feedback (Score: {submission.aiReview.score}/10)
                                    </h5>
                                    <p className="text-sm text-purple-700 mb-3">{submission.aiReview.feedback}</p>
                                    
                                    {submission.aiReview.suggestions.length > 0 && (
                                      <div>
                                        <p className="text-sm font-medium text-purple-800 mb-1">Suggestions:</p>
                                        <ul className="text-sm text-purple-700 space-y-1">
                                          {submission.aiReview.suggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                              <span className="text-purple-500 mt-1">•</span>
                                              {suggestion}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="text-xs text-gray-500 mt-3">
                                  Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Task Submission Modal */}
      {submissionModal && (
        <TaskSubmissionModal
          task={submissionModal.task}
          onSubmit={handleTaskSubmission}
          onClose={() => setSubmissionModal(null)}
        />
      )}

      {/* Hidden file inputs */}
      <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" />
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" />
      <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" />
    </div>
  );
}

// Task Submission Modal
function TaskSubmissionModal({ 
  task, 
  onSubmit, 
  onClose 
}: { 
  task: Task; 
  onSubmit: (task: Task, data: any) => void; 
  onClose: () => void; 
}) {
  const [textContent, setTextContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [reflection, setReflection] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [pdfTextContent, setPdfTextContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingType, setRecordingType] = useState<'audio' | 'video' | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  // File input refs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle recording timer
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  const handleFileUpload = (type: string) => {
    const fileInput = type === 'pdf' ? pdfInputRef.current :
                     type === 'image' ? imageInputRef.current :
                     type === 'audio' ? audioInputRef.current :
                     type === 'video' ? videoInputRef.current : null;

    if (fileInput) {
      fileInput.click();
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // In a real app, upload to server and get URL
          const fakeUrl = `/uploads/${file.name}`;
          setUploadedFiles(prev => [...prev, fakeUrl]);
        }
      };
    }
  };

  const startRecording = async (type: 'audio' | 'video') => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: type === 'video' ? 'video/webm' : 'audio/webm' });
        setRecordedBlob(blob);
        
        // Create fake URL for the recorded content
        const fakeUrl = `/uploads/recorded-${type}-${Date.now()}.${type === 'video' ? 'webm' : 'webm'}`;
        setUploadedFiles(prev => [...prev, fakeUrl]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setRecordingType(type);
      setIsRecording(true);
      setRecordingTime(0);

      recorder.start();
      
      // Auto-stop after 5 minutes
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 300000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      alert('Unable to access camera/microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setRecordingTime(0);
      setRecordingType(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const canSubmit = () => {
    if (task.requiredInputs.includes('text') && !textContent.trim()) return false;
    if (task.requiredInputs.includes('pdf') && !uploadedFiles.some(f => f.endsWith('.pdf')) && !pdfTextContent.trim()) return false;
    if (task.requiredInputs.includes('image') && !uploadedFiles.some(f => f.match(/\.(jpg|jpeg|png|gif|svg)$/i))) return false;
    if (task.requiredInputs.includes('audio') && !uploadedFiles.some(f => f.match(/\.(mp3|wav|m4a|aac|webm)$/i))) return false;
    if (task.requiredInputs.includes('video') && !uploadedFiles.some(f => f.match(/\.(mp4|mov|avi|wmv|webm)$/i))) return false;
    if (task.requiredInputs.includes('link') && !linkUrl.trim()) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!canSubmit()) return;

    const submissionData = {
      textContent: textContent.trim() || undefined,
      pdfTextContent: pdfTextContent.trim() || undefined,
      linkUrl: linkUrl.trim() || undefined,
      reflection: reflection.trim() || undefined,
      fileUrls: uploadedFiles.length > 0 ? uploadedFiles : undefined
    };

    onSubmit(task, submissionData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          <p className="text-gray-600 mt-2">{task.description}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <p className="text-blue-800 text-sm">{task.instructions}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Required Submissions:</h3>
            <div className="space-y-4">
              
              {/* Text Input */}
              {task.requiredInputs.includes('text') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Submission *
                  </label>
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Enter your text response here..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows={4}
                  />
                </div>
              )}

              {/* PDF Upload with Text Option */}
              {task.requiredInputs.includes('pdf') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Submission * (Choose one option)
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleFileUpload('pdf')}
                      className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors w-full"
                    >
                      <FileText className="h-4 w-4" />
                      <span>Upload PDF file</span>
                    </button>
                    <div className="text-center text-gray-500 text-sm">OR</div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Write your content as text:
                      </label>
                      <textarea
                        value={pdfTextContent}
                        onChange={(e) => setPdfTextContent(e.target.value)}
                        placeholder="Write your document content here..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows={6}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Image Upload */}
              {task.requiredInputs.includes('image') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Upload *
                  </label>
                  <button
                    onClick={() => handleFileUpload('image')}
                    className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors w-full"
                  >
                    <Image className="h-4 w-4" />
                    <span>Click to upload image file</span>
                  </button>
                </div>
              )}

              {/* Audio Upload with Recording */}
              {task.requiredInputs.includes('audio') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Audio Submission * (Choose one option)
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleFileUpload('audio')}
                      className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors w-full"
                    >
                      <Mic className="h-4 w-4" />
                      <span>Upload audio file</span>
                    </button>
                    <div className="text-center text-gray-500 text-sm">OR</div>
                    <div className="border-2 border-dashed border-green-300 rounded-lg p-4">
                      <div className="text-center">
                        {!isRecording && recordingType !== 'audio' && (
                          <button
                            onClick={() => startRecording('audio')}
                            className="flex items-center gap-2 justify-center p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors w-full"
                          >
                            <Mic className="h-5 w-5" />
                            <span>🎤 Record Audio</span>
                          </button>
                        )}
                        {isRecording && recordingType === 'audio' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-red-600 font-medium">Recording: {formatTime(recordingTime)}</span>
                            </div>
                            <button
                              onClick={stopRecording}
                              className="flex items-center gap-2 justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <span>⏹️ Stop Recording</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Video Upload with Recording */}
              {task.requiredInputs.includes('video') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Submission * (Choose one option)
                  </label>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleFileUpload('video')}
                      className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors w-full"
                    >
                      <Video className="h-4 w-4" />
                      <span>Upload video file</span>
                    </button>
                    <div className="text-center text-gray-500 text-sm">OR</div>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-4">
                      <div className="text-center">
                        {!isRecording && recordingType !== 'video' && (
                          <button
                            onClick={() => startRecording('video')}
                            className="flex items-center gap-2 justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
                          >
                            <Video className="h-5 w-5" />
                            <span>📹 Record Video</span>
                          </button>
                        )}
                        {isRecording && recordingType === 'video' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-red-600 font-medium">Recording: {formatTime(recordingTime)}</span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">Camera is active</div>
                            <button
                              onClick={stopRecording}
                              className="flex items-center gap-2 justify-center p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <span>⏹️ Stop Recording</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Link Input */}
              {task.requiredInputs.includes('link') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link Submission *
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com/your-work"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Optional Audio for eligible types */}
          {task.inputType.includes('audio') && !task.requiredInputs.includes('audio') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Explanation (Optional)
              </label>
              <button
                onClick={() => handleFileUpload('audio')}
                className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Mic className="h-4 w-4" />
                <span>Add audio explanation</span>
              </button>
            </div>
          )}

          {/* Uploaded Files Preview */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Uploaded Files:</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <Download className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{file.split('/').pop()}</span>
                    <button
                      onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                      className="ml-auto text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reflection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reflection (Optional)
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you learn from this task?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit()}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Submit Task
          </button>
        </div>

        {/* Hidden file inputs */}
        <input ref={pdfInputRef} type="file" accept=".pdf" className="hidden" />
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" />
        <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" />
        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" />
      </div>
    </div>
  );
} 