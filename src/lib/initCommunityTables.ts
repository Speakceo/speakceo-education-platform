import { supabase } from './supabaseClient';

// Sample users for posts and comments
interface SampleUser {
  id: string;
  name: string;
  avatar_url: string;
}

// Sample posts data
const samplePosts = [
  {
    content: "I just launched my first business! It's a small e-commerce store selling handmade crafts. Would love some advice on marketing strategies for beginners.",
    category: "general",
    tags: ["business", "marketing", "beginner"],
    likes: 24,
    comments_count: 5,
    shares: 3,
    ai_tags: ["entrepreneurship", "marketing", "e-commerce", "startup"],
    ai_summary: "New entrepreneur seeking marketing advice for handmade crafts e-commerce store."
  },
  {
    content: "How do you all manage your time between school and running a small business? I'm finding it really challenging to balance everything.",
    category: "question",
    tags: ["time-management", "school", "balance"],
    likes: 18,
    comments_count: 8,
    shares: 2,
    ai_tags: ["time-management", "work-life balance", "student entrepreneur"],
    ai_summary: "Student seeking advice on balancing school and business responsibilities."
  },
  {
    content: "I'm working on a mobile app that helps students find internships. Looking for beta testers and feedback!",
    category: "project",
    tags: ["app", "internships", "beta"],
    likes: 32,
    comments_count: 7,
    shares: 12,
    ai_tags: ["mobile app", "internships", "beta testing", "student project"],
    ai_summary: "Student developing an internship-finding app seeking beta testers."
  },
  {
    content: "What if we created a platform where young entrepreneurs could get micro-funding from their communities? Like a localized Kickstarter specifically for teen business ideas.",
    category: "idea",
    tags: ["funding", "platform", "community"],
    likes: 45,
    comments_count: 10,
    shares: 15,
    ai_tags: ["crowdfunding", "teen entrepreneurs", "micro-funding", "startup idea"],
    ai_summary: "Proposal for a localized crowdfunding platform focused on teen entrepreneurs."
  },
  {
    content: "Join our virtual pitch competition next Saturday! Open to all student entrepreneurs ages 14-18. Cash prizes for top three ideas!",
    category: "event",
    tags: ["pitch", "competition", "virtual"],
    likes: 37,
    comments_count: 9,
    shares: 28,
    ai_tags: ["pitch competition", "student event", "entrepreneurship", "virtual event"],
    ai_summary: "Upcoming virtual pitch competition for teen entrepreneurs with cash prizes."
  }
];

// Sample comments data
const sampleComments = [
  {
    content: "Congratulations on your launch! For beginners, I'd suggest focusing on Instagram and TikTok to showcase your handmade crafts. Visual platforms work best for these products.",
    likes: 9
  },
  {
    content: "Have you considered partnering with local businesses or schools? That can be a great way to get word out in your community.",
    likes: 5
  },
  {
    content: "I use time blocking in my calendar to manage school and business. Each day, I allocate specific hours to each activity and treat those blocks as non-negotiable.",
    likes: 12
  },
  {
    content: "Your app sounds amazing! I'd love to be a beta tester. I've been struggling to find relevant internships.",
    likes: 7
  },
  {
    content: "This is a brilliant idea! Local funding could really help teens who might not have access to traditional startup capital.",
    likes: 11
  }
];

// Sample tags data
const sampleTags = [
  {
    name: "marketing",
    category: "business",
    post_count: 42
  },
  {
    name: "startup",
    category: "business",
    post_count: 38
  },
  {
    name: "time-management",
    category: "skills",
    post_count: 27
  },
  {
    name: "funding",
    category: "finance",
    post_count: 35
  },
  {
    name: "innovation",
    category: "ideas",
    post_count: 29
  }
];

// Create community tables
export async function createCommunityTables() {
  try {
    // Check if tables already exist
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['posts', 'comments', 'tags']);
    
    if (checkError) {
      console.error('Error checking existing tables:', checkError);
      return { success: false, error: checkError.message };
    }
    
    const tablesExist = existingTables && existingTables.length === 3;
    
    if (tablesExist) {
      console.log('Community tables already exist');
      return { success: true };
    }
    
    // Create posts table
    const createPostsQuery = `
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        likes INTEGER DEFAULT 0,
        status TEXT DEFAULT 'published'
      );
    `;
    
    // Create comments table
    const createCommentsQuery = `
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        likes INTEGER DEFAULT 0
      );
    `;
    
    // Create tags table
    const createTagsQuery = `
      CREATE TABLE IF NOT EXISTS tags (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    // Enable RLS on tables
    const enablePostsRLSQuery = `
      ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
    `;
    
    const enableCommentsRLSQuery = `
      ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
    `;
    
    const enableTagsRLSQuery = `
      ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
    `;
    
    // Create RLS policies
    const postsReadPolicy = `
      CREATE POLICY "Public can read posts" ON posts
      FOR SELECT USING (true);
    `;
    
    const postsInsertPolicy = `
      CREATE POLICY "Authenticated users can insert posts" ON posts
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    `;
    
    const commentsReadPolicy = `
      CREATE POLICY "Public can read comments" ON comments
      FOR SELECT USING (true);
    `;
    
    const commentsInsertPolicy = `
      CREATE POLICY "Authenticated users can insert comments" ON comments
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    `;
    
    const tagsReadPolicy = `
      CREATE POLICY "Public can read tags" ON tags
      FOR SELECT USING (true);
    `;
    
    const tagsInsertPolicy = `
      CREATE POLICY "Authenticated users can insert tags" ON tags
      FOR INSERT WITH CHECK (true);
    `;
    
    // Execute all SQL queries
    const queries = [
      createPostsQuery,
      createCommentsQuery,
      createTagsQuery,
      enablePostsRLSQuery,
      enableCommentsRLSQuery,
      enableTagsRLSQuery,
      postsReadPolicy,
      postsInsertPolicy,
      commentsReadPolicy,
      commentsInsertPolicy,
      tagsReadPolicy,
      tagsInsertPolicy
    ];
    
    for (const query of queries) {
      const { error } = await supabase.rpc('execute_sql', { sql_query: query });
      if (error) {
        console.error('Error executing query:', error);
        return { success: false, error: error.message };
      }
    }
    
    console.log('Community tables created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error creating community tables:', error);
    return { success: false, error };
  }
}

// Seed sample community data
export async function seedCommunityData(userId: string) {
  try {
    // Check if there are already posts in the database
    const { data: existingPosts, error: checkError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error checking existing posts:', checkError);
      return { success: false, error: checkError.message };
    }
    
    if (existingPosts && existingPosts.length > 0) {
      console.log('Community data already exists');
      return { success: true };
    }
    
    // Sample posts
    const samplePosts = [
      {
        title: 'Just completed my first AI project!',
        content: `I'm excited to share that I just finished my first AI project using what I learned in the Machine Learning Fundamentals module! I built a simple image classifier that can identify different types of plants. The accuracy isn't perfect yet, but I'm really proud of what I've accomplished so far. Has anyone else completed a similar project? Any tips for improving accuracy?`,
        user_id: userId,
        likes: 15
      },
      {
        title: 'Struggling with neural network concepts',
        content: `I'm having a hard time understanding backpropagation in neural networks. I've watched the video lectures multiple times, but I still can't grasp how the gradients flow backward through the network. Can someone recommend additional resources or explain it in a different way? I really want to understand this before moving on to the next lesson.`,
        user_id: userId,
        likes: 8
      },
      {
        title: 'Job interview coming up - need advice!',
        content: `I have an interview for a junior data scientist position next week, and I'm both excited and nervous! This is my first technical interview in the AI field. The job description mentions experience with Python, scikit-learn, and TensorFlow (which I've been learning through this platform). Does anyone have advice on what kinds of technical questions I should prepare for? Any interview tips specific to AI/ML roles would be greatly appreciated!`,
        user_id: userId,
        likes: 23
      },
      {
        title: 'Resources for NLP projects?',
        content: `I'm particularly interested in Natural Language Processing and want to start a project in this area. I've completed the introductory NLP lessons, but I'm looking for more advanced resources and project ideas. What are some good datasets to practice with? Any recommended libraries beyond NLTK and spaCy? I'd love to hear about projects that others have worked on!`,
        user_id: userId,
        likes: 11
      },
      {
        title: 'Weekly study group for deep learning',
        content: `Would anyone be interested in forming a weekly study group focused on deep learning? I find that I learn better when discussing concepts with others. We could meet via Zoom, discuss course materials, share project progress, and help each other with challenging concepts. I'm thinking Saturdays at 10 AM EST would work well. Let me know if you're interested or have other time suggestions!`,
        user_id: userId,
        likes: 19
      }
    ];
    
    // Insert sample posts
    for (const post of samplePosts) {
      const { data: newPost, error: postError } = await supabase
        .from('posts')
        .insert([post])
        .select();
      
      if (postError) {
        console.error('Error creating post:', postError);
        return { success: false, error: postError.message };
      }
      
      if (!newPost || newPost.length === 0) {
        console.error('No post created');
        continue;
      }
      
      const postId = newPost[0].id;
      
      // Sample comments for each post
      const sampleComments = [
        {
          post_id: postId,
          user_id: userId,
          content: 'Great insights! I learned a lot from this post.',
          likes: Math.floor(Math.random() * 10)
        },
        {
          post_id: postId,
          user_id: userId,
          content: 'I had similar experiences with this topic. It helps to practice with real-world datasets.',
          likes: Math.floor(Math.random() * 10)
        },
        {
          post_id: postId,
          user_id: userId,
          content: 'Have you tried using the technique described in module 3? It might help with this problem.',
          likes: Math.floor(Math.random() * 10)
        }
      ];
      
      // Insert sample comments
      for (const comment of sampleComments) {
        const { error: commentError } = await supabase
          .from('comments')
          .insert([comment]);
        
        if (commentError) {
          console.error('Error creating comment:', commentError);
          // Continue with other comments even if one fails
        }
      }
      
      // Sample tags for each post
      const tagOptions = ['AI', 'MachineLearning', 'DeepLearning', 'Python', 'DataScience', 
                         'NLP', 'ComputerVision', 'Beginners', 'Career', 'Projects'];
      
      // Select 2-4 random tags for each post
      const numTags = 2 + Math.floor(Math.random() * 3); // 2 to 4 tags
      const selectedTags: string[] = [];
      
      while (selectedTags.length < numTags) {
        const randomTag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
        if (!selectedTags.includes(randomTag)) {
          selectedTags.push(randomTag);
        }
      }
      
      // Insert tags for the post
      for (const tagName of selectedTags) {
        const { error: tagError } = await supabase
          .from('tags')
          .insert([{ post_id: postId, name: tagName }]);
        
        if (tagError) {
          console.error('Error creating tag:', tagError);
          // Continue with other tags even if one fails
        }
      }
    }
    
    console.log('Community data seeded successfully');
    return { success: true };
  } catch (error) {
    console.error('Error seeding community data:', error);
    return { success: false, error };
  }
} 