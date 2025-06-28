import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Flag, 
  Search, 
  Filter, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  X, 
  Shield,
  Calendar,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Post } from '../../lib/types/community';

interface ReportedPost {
  id: string;
  author_id: string;
  author_name: string; 
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  reports_count: number;
  status: 'pending' | 'flagged' | 'approved' | 'removed';
}

export default function CommunityModeration() {
  const [posts, setPosts] = useState<ReportedPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ReportedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ReportedPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'reported' | 'flagged' | 'approved'>('all');
  const [showModerateModal, setShowModerateModal] = useState(false);
  const [moderationNote, setModerationNote] = useState('');
  const [moderationAction, setModerationAction] = useState<'approve' | 'flag' | 'remove' | ''>('');
  
  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...posts];
    
    // Apply status filter
    if (filterStatus === 'reported') {
      result = result.filter(post => post.reports_count && post.reports_count > 0);
    } else if (filterStatus === 'flagged') {
      result = result.filter(post => post.status === 'flagged');
    } else if (filterStatus === 'approved') {
      result = result.filter(post => post.status === 'approved');
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.content.toLowerCase().includes(query) || 
        post.author_name?.toLowerCase().includes(query)
      );
    }
    
    setFilteredPosts(result);
  }, [posts, filterStatus, searchQuery]);

  // Fetch posts
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would fetch from Supabase
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock data
      const mockPosts: ReportedPost[] = Array.from({ length: 20 }, (_, i) => {
        const authorNames = [
          'Alex Johnson', 
          'Maria Garcia', 
          'James Smith', 
          'Linda Wilson', 
          'Robert Brown'
        ];
        
        const postContents = [
          'Just joined this community! Excited to connect with fellow entrepreneurs.',
          'Has anyone tried implementing the lean startup methodology? Looking for advice.',
          "I'm struggling with my marketing strategy. Any recommendations for B2B startups?",
          'Check out this great article on fundraising I found: [link removed for moderation]',
          'Is anyone else having trouble with the course materials loading?'
        ];
        
        const categories = ['general', 'question', 'idea', 'project'];
        const statusOptions = ['pending', 'flagged', 'approved', 'removed'];
        
        return {
          id: `post-${i + 1}`,
          author_id: `user-${Math.floor(Math.random() * 10) + 1}`,
          author_name: authorNames[Math.floor(Math.random() * authorNames.length)],
          content: postContents[Math.floor(Math.random() * postContents.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          likes_count: Math.floor(Math.random() * 30),
          comments_count: Math.floor(Math.random() * 10),
          created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          reports_count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
          status: Math.random() > 0.8 ? 
            statusOptions[Math.floor(Math.random() * 3) + 1] as ReportedPost['status'] : 
            'pending'
        };
      });
      
      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle post moderation
  const handleModeratePost = async () => {
    if (!selectedPost || !moderationAction) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, you would update the database
      // For now, we'll just update the local state
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Map action to status
      let postStatus: 'pending' | 'flagged' | 'approved' | 'removed';
      if (moderationAction === 'approve') postStatus = 'approved';
      else if (moderationAction === 'flag') postStatus = 'flagged';
      else postStatus = 'removed';
      
      // Update posts array
      const updatedPosts = posts.map(post => {
        if (post.id === selectedPost.id) {
          return {
            ...post,
            status: postStatus
          };
        }
        return post;
      });
      
      setPosts(updatedPosts);
      
      setShowModerateModal(false);
      setModerationNote('');
      setModerationAction('');
      setSuccess(`Post has been ${moderationAction === 'approve' ? 'approved' : 
                               moderationAction === 'flag' ? 'flagged' : 
                               'removed'}`);
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error moderating post:', error);
      setError('Failed to moderate post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate mock data for reported posts
  const generateMockReportedPosts = (): ReportedPost[] => {
    const samplePostContents = [
      'Just joined this community! Excited to connect with fellow entrepreneurs.',
      'Has anyone tried implementing the lean startup methodology? Looking for advice.',
      "I'm struggling with my marketing strategy. Any recommendations for B2B startups?",
      'Check out this great article on fundraising I found: [link removed for moderation]',
      'Is anyone else having trouble with the course materials loading?'
    ];
    
    const authorNames = [
      'Alex Johnson', 
      'Maria Garcia', 
      'James Smith', 
      'Linda Wilson', 
      'Robert Brown'
    ];
    
    const categories = ['general', 'question', 'idea', 'project'];
    const statusOptions = ['pending', 'flagged', 'approved', 'removed'];
    
    return Array.from({ length: 20 }, (_, i) => ({
      id: `post-${i + 1}`,
      author_id: `user-${Math.floor(Math.random() * 10) + 1}`,
      author_name: authorNames[Math.floor(Math.random() * authorNames.length)],
      content: samplePostContents[Math.floor(Math.random() * samplePostContents.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      likes_count: Math.floor(Math.random() * 30),
      comments_count: Math.floor(Math.random() * 10),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      reports_count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
      status: Math.random() > 0.8 ? 
        statusOptions[Math.floor(Math.random() * 3) + 1] as ReportedPost['status'] : 
        'pending'
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Community Moderation</h1>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{success}</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Search and filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search posts or authors..."
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
            >
              <option value="all">All Posts</option>
              <option value="reported">Reported</option>
              <option value="flagged">Flagged</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts list */}
      <div className="bg-white rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try changing your search or filters'
                : 'There are no posts to moderate at the moment'}
            </p>
            {(searchQuery || filterStatus !== 'all') && (
              <button
                onClick={() => { setSearchQuery(''); setFilterStatus('all'); }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Post</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {post.content.substring(0, 100)}
                        {post.content.length > 100 ? '...' : ''}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {post.comments_count} comments • {post.likes_count} likes
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          {post.author_name ? post.author_name.charAt(0) : 'U'}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{post.author_name || 'Unknown User'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.reports_count && post.reports_count > 0 ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.reports_count >= 5 ? 'bg-red-100 text-red-800' :
                          post.reports_count >= 2 ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          <Flag className="h-3 w-3 mr-1" />
                          {post.reports_count} {post.reports_count === 1 ? 'report' : 'reports'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">No reports</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.status === 'flagged' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Flagged
                        </span>
                      ) : post.status === 'approved' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </span>
                      ) : post.status === 'removed' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <X className="h-3 w-3 mr-1" />
                          Removed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => {
                          setSelectedPost(post);
                          setShowModerateModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Shield className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Moderation Modal */}
      {showModerateModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Review Post
            </h2>
            
            <div className="mb-6 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start space-x-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-600">
                  {selectedPost.author_name ? selectedPost.author_name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium">{selectedPost.author_name || 'Unknown User'}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      • {new Date(selectedPost.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-800">{selectedPost.content}</p>
                </div>
              </div>
            </div>
            
            {/* Moderation actions */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Moderation Action</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Moderation Note (optional)
                </label>
                <textarea
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                  placeholder="Add a note about why this post is being moderated..."
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <button
                  onClick={() => setModerationAction('approve')}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    moderationAction === 'approve'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-green-600 border border-green-600'
                  }`}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => setModerationAction('flag')}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    moderationAction === 'flag'
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-amber-600 border border-amber-600'
                  }`}
                >
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Flag for Review
                </button>
                <button
                  onClick={() => setModerationAction('remove')}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    moderationAction === 'remove'
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-red-600 border border-red-600'
                  }`}
                >
                  <X className="h-5 w-5 mr-2" />
                  Remove Post
                </button>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowModerateModal(false);
                    setSelectedPost(null);
                    setModerationNote('');
                    setModerationAction('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModeratePost}
                  disabled={!moderationAction}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    moderationAction 
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Submit Moderation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 