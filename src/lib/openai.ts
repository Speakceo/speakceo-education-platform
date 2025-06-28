import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Generate AI response for the learning coach
export async function generateAIResponse(input: string, category: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert AI learning coach specializing in ${category}. 
            Provide clear, concise, and structured responses with bullet points and real-world examples.
            Keep responses under 200 words and focus on actionable advice.`
        },
        {
          role: "user",
          content: input
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content?.trim() || 'I apologize, but I could not generate a response. Please try asking your question again.';
  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'I apologize, but I encountered an error. Please try asking your question again.';
  }
}

// Generate speech for AI responses
export async function generateSpeech(text: string): Promise<string> {
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = await response.arrayBuffer();
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}

// Generate logo using DALL·E
export async function generateLogo(params: {
  name: string;
  tagline?: string;
  personality: string;
  industry: string;
  typography: string;
  colors: string[];
  style: 'icon-text' | 'text-only' | 'emblem';
}): Promise<string> {
  try {
    const prompt = `Design a high-quality, modern logo for an educational technology brand.

Brand Name: "${params.name}"
${params.tagline ? `Tagline: "${params.tagline}"` : ''}
Brand Personality: ${params.personality}
Industry: ${params.industry}
Typography Style: ${params.typography}
Color Palette: ${params.colors.join(', ')}

Preferred Logo Style: ${params.style}

The logo should be:
- Clean, minimalist, and scalable
- Professional with a modern tech aesthetic
- Balanced and visually appealing
- Suitable for both digital and print media
- With a transparent background
- Using the specified colors thoughtfully
- Following the specified typography style
- Conveying trust and educational expertise

Make it ${params.personality.toLowerCase()} in style while maintaining a professional, tech-forward appearance.
Focus on symbolizing growth, learning, and leadership in the design.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural",
      response_format: "url"
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Error generating logo:', error);
    throw error;
  }
}

// Brand Analysis and Suggestions
export async function generateBrandSuggestions(data: {
  industry: string;
  target_audience: string;
  values: string[];
}): Promise<{
  name: string;
  tagline: string;
  description: string;
  colors: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a branding expert providing color, typography, and design suggestions based on brand values and industry."
        },
        {
          role: "user",
          content: `Generate brand suggestions for:
            Industry: ${data.industry}
            Target Audience: ${data.target_audience}
            Values: ${data.values.join(', ')}
            
            Please provide:
            1. A unique brand name
            2. A catchy tagline
            3. A brief description
            4. Three brand colors (in hex format)
            
            Format the response as JSON.`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content in response');

    try {
      return JSON.parse(content);
    } catch {
      // If JSON parsing fails, try to extract information using regex
      const nameMatch = content.match(/name["']?\s*:\s*["']([^"']+)["']/i);
      const taglineMatch = content.match(/tagline["']?\s*:\s*["']([^"']+)["']/i);
      const descriptionMatch = content.match(/description["']?\s*:\s*["']([^"']+)["']/i);
      const colorMatches = content.match(/#[0-9A-F]{6}/gi);

      return {
        name: nameMatch?.[1] || '',
        tagline: taglineMatch?.[1] || '',
        description: descriptionMatch?.[1] || '',
        colors: colorMatches || ['#4F46E5', '#7C3AED', '#EC4899']
      };
    }
  } catch (error) {
    console.error('Error generating brand suggestions:', error);
    return {
      name: '',
      tagline: '',
      description: '',
      colors: ['#4F46E5', '#7C3AED', '#EC4899']
    };
  }
}

// Business Model Canvas Analysis
export async function analyzeBusinessModel(components: any[]): Promise<{
  suggestions: string[];
  analysis: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a business strategy expert analyzing business model components. Provide actionable insights and suggestions for improvement."
        },
        {
          role: "user",
          content: `Analyze this business model canvas and provide suggestions: ${JSON.stringify(components)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content?.trim() || '';
    const suggestions = analysis.split('\n').filter(s => s.startsWith('- ')).map(s => s.slice(2));

    return {
      suggestions,
      analysis
    };
  } catch (error) {
    console.error('Error analyzing business model:', error);
    return {
      suggestions: [],
      analysis: 'Failed to analyze business model. Please try again.'
    };
  }
}

// Financial Projections Analysis
export async function analyzeFinancials(data: {
  revenues: any[];
  expenses: any[];
  projections: any[];
}): Promise<{
  insights: string;
  recommendations: string[];
  healthScore: number;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a financial analyst providing insights on business financials. Calculate key metrics and provide recommendations."
        },
        {
          role: "user",
          content: `Analyze these financial data points and provide insights: ${JSON.stringify(data)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content?.trim() || '';
    const recommendations = analysis.split('\n').filter(s => s.startsWith('- ')).map(s => s.slice(2));
    
    // Calculate health score based on revenue/expense ratio and growth
    const healthScore = calculateFinancialHealthScore(data);

    return {
      insights: analysis,
      recommendations,
      healthScore
    };
  } catch (error) {
    console.error('Error analyzing financials:', error);
    return {
      insights: 'Failed to analyze financials. Please try again.',
      recommendations: [],
      healthScore: 0
    };
  }
}

// Marketing Campaign Analysis
export async function analyzeMarketing(campaign: {
  name: string;
  budget: number;
  audience: string;
  goals: string[];
}): Promise<{
  predictions: {
    reach: number;
    engagement: number;
    conversion: number;
  };
  suggestions: string[];
  channels: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a marketing strategist analyzing campaign potential and providing optimization suggestions."
        },
        {
          role: "user",
          content: `Analyze this marketing campaign and predict outcomes: ${JSON.stringify(campaign)}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content?.trim() || '';
    const suggestions = analysis.split('\n').filter(s => s.startsWith('- ')).map(s => s.slice(2));

    // Extract predicted metrics
    const predictions = {
      reach: estimateReach(campaign.budget, campaign.audience),
      engagement: estimateEngagement(campaign.goals),
      conversion: estimateConversion(campaign.goals)
    };

    // Extract recommended channels
    const channels = suggestions
      .filter(s => s.toLowerCase().includes('channel') || s.toLowerCase().includes('platform'))
      .map(s => s.replace(/^(channel|platform):\s*/i, ''));

    return {
      predictions,
      suggestions,
      channels
    };
  } catch (error) {
    console.error('Error analyzing marketing campaign:', error);
    return {
      predictions: { reach: 0, engagement: 0, conversion: 0 },
      suggestions: [],
      channels: []
    };
  }
}

// Pitch Analysis
export async function analyzePitch(pitch: {
  content: string;
  duration: number;
  context?: {
    businessModel?: string;
    financial?: string;
    branding?: string;
    marketing?: string;
  };
}): Promise<{
  feedback: {
    strengths: string[];
    weaknesses: string[];
    clarity: number;
    innovation: number;
    businessModel: number;
    audienceRelevance: number;
    delivery: number;
  };
  score: number;
  improvements: string[];
  enhancedPitch: string;
  oneLiner: string;
  motivationalNote: string;
}> {
  try {
    const systemPrompt = `You are a startup mentor evaluating a student's business pitch. Provide:
1. A detailed analysis with strengths and weaknesses
2. Score out of 100 (broken down into 5 categories: Clarity, Innovation, Business Model, Audience Relevance, Delivery - each worth 20 points)
3. 3-5 specific suggestions for improvement
4. An enhanced and refined version of the pitch
5. A one-liner summary of the startup for investors
6. A motivational note for the student

Format your response as JSON with the following structure:
{
  "feedback": {
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "clarity": 15,
    "innovation": 15,
    "businessModel": 15,
    "audienceRelevance": 15,
    "delivery": 15
  },
  "score": 75,
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "enhancedPitch": "Refined pitch text...",
  "oneLiner": "A [industry] startup that helps [audience] achieve [goal] using [unique method].",
  "motivationalNote": "Personalized encouragement..."
}`;

    const userPrompt = `Analyze this business pitch:

Pitch Content:
${pitch.content}

${pitch.context?.businessModel ? `Business Model Context:\n${pitch.context.businessModel}\n` : ''}
${pitch.context?.financial ? `Financial Context:\n${pitch.context.financial}\n` : ''}
${pitch.context?.branding ? `Branding Context:\n${pitch.context.branding}\n` : ''}
${pitch.context?.marketing ? `Marketing Context:\n${pitch.context.marketing}\n` : ''}

Pitch Duration: ${pitch.duration} seconds`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content in response');

    try {
      const result = JSON.parse(content);
      return result;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('Error analyzing pitch:', error);
    // Return default structure with error message
    return {
      feedback: {
        strengths: ['Your effort in creating a pitch is commendable'],
        weaknesses: ['We encountered an error analyzing your pitch in detail'],
        clarity: 10,
        innovation: 10,
        businessModel: 10,
        audienceRelevance: 10,
        delivery: 10
      },
      score: 50,
      improvements: [
        'Try to be more specific about your value proposition',
        'Clearly define your target market',
        'Include information about your business model'
      ],
      enhancedPitch: pitch.content,
      oneLiner: "A startup with potential that needs further refinement.",
      motivationalNote: "Keep working on your pitch! Every great entrepreneur starts somewhere, and persistence is key to success."
    };
  }
}

// Task Submission Analysis
export async function analyzeSubmission(submission: {
  content: string;
  taskTitle: string;
  taskDescription: string;
  taskType: string;
}): Promise<{
  score: number;
  strengths: string[];
  improvements: string[];
  summary: string;
}> {
  try {
    const systemPrompt = `You are an educational AI assistant analyzing a student's task submission. Provide:
1. A score out of 100 based on the quality of the submission
2. 2-3 strengths of the submission
3. 2-3 areas for improvement
4. A brief summary of your assessment (2-3 sentences)

Format your response as JSON with the following structure:
{
  "score": 85,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "summary": "Brief assessment summary..."
}`;

    const userPrompt = `Analyze this task submission:

Task Title: ${submission.taskTitle}
Task Description: ${submission.taskDescription}
Task Type: ${submission.taskType}

Submission Content:
${submission.content}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content in response');

    try {
      const result = JSON.parse(content);
      return result;
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      throw new Error('Failed to parse analysis response');
    }
  } catch (error) {
    console.error('Error analyzing submission:', error);
    // Return default structure with error message
    return {
      score: 70,
      strengths: [
        'You completed the submission',
        'You addressed the task requirements'
      ],
      improvements: [
        'Consider adding more detail to your response',
        'Try to connect your answer more directly to the task objectives',
        'Review for clarity and organization'
      ],
      summary: "Your submission meets the basic requirements but could benefit from more detail and focus. Continue developing your ideas and be more specific in addressing the task objectives."
    };
  }
}

// Helper Functions
function calculateFinancialHealthScore(data: any): number {
  try {
    const totalRevenue = data.revenues.reduce((sum: number, rev: any) => sum + rev.amount, 0);
    const totalExpenses = data.expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0);
    
    if (totalExpenses === 0) return 0;
    
    const ratio = totalRevenue / totalExpenses;
    const growth = calculateGrowthRate(data.projections);
    
    // Score based on revenue/expense ratio (0-50) and growth rate (0-50)
    const ratioScore = Math.min(ratio * 25, 50);
    const growthScore = Math.min(growth * 10, 50);
    
    return Math.round(ratioScore + growthScore);
  } catch (error) {
    console.error('Error calculating financial health score:', error);
    return 0;
  }
}

function calculateGrowthRate(projections: any[]): number {
  if (projections?.length < 2) return 0;
  
  const first = projections[0]?.revenue || 0;
  const last = projections[projections.length - 1]?.revenue || 0;
  
  if (first === 0) return 0;
  
  return (last - first) / first;
}

function estimateReach(budget: number, audience: string): number {
  // Simplified reach estimation based on budget and audience specificity
  const baseReach = budget * 100; // Assume 100 people reached per unit of budget
  const audienceMultiplier = audience.length > 50 ? 0.8 : 1.2; // More specific audience = better targeting
  return Math.round(baseReach * audienceMultiplier);
}

function estimateEngagement(goals: string[]): number {
  // Estimate engagement rate based on campaign goals
  const baseEngagement = 0.02; // 2% base engagement rate
  const goalMultiplier = Math.min(goals.length * 0.005, 0.03); // More goals can mean more engagement opportunities
  return Number((baseEngagement + goalMultiplier).toFixed(3));
}

function estimateConversion(goals: string[]): number {
  // Estimate conversion rate based on campaign goals
  const baseConversion = 0.01; // 1% base conversion rate
  const conversionGoals = goals.filter(g => 
    g.toLowerCase().includes('sale') || 
    g.toLowerCase().includes('purchase') ||
    g.toLowerCase().includes('conversion')
  ).length;
  const goalMultiplier = conversionGoals * 0.002;
  return Number((baseConversion + goalMultiplier).toFixed(3));
}