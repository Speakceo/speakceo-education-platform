import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  MessageSquare,
  ThumbsUp,
  Share2,
  Flag,
  Send,
  Image as ImageIcon,
  Smile,
  Users,
  TrendingUp,
  Star,
  Bell,
  Brain,
  Target,
  Sparkles,
  ChevronRight,
  RefreshCw,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useUserStore, useUnifiedProgressStore } from '../../lib/store';
import { 
  getPosts, 
  createPost, 
  getComments, 
  createComment,
  likePost,
  sharePost,
  getTrendingTags,
  getCommunityStats
} from '../../lib/api/community';
import type { Post, Comment, Tag, CommunityStats } from '../../lib/types/community';

const categories = [
  { id: 'all', name: 'All Posts', icon: MessageSquare },
  { id: 'question', name: 'Questions', icon: Brain },
  { id: 'project', name: 'Projects', icon: Target },
  { id: 'idea', name: 'Ideas', icon: Sparkles },
  { id: 'event', name: 'Events', icon: Calendar }
];

export default function Community() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [trendingTags, setTrendingTags] = useState<Tag[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserStore((state) => state.user);
  const { recordActivity } = useUnifiedProgressStore();

  useEffect(() => {
    loadPosts();
    loadStats();
    loadTrendingTags();
  }, [activeCategory]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPosts(activeCategory === 'all' ? undefined : activeCategory);
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getCommunityStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadTrendingTags = async () => {
    try {
      const data = await getTrendingTags();
      setTrendingTags(data);
    } catch (error) {
      console.error('Error loading trending tags:', error);
    }
  };

  const loadComments = async (postId: string) => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;

    try {
      setIsSubmitting(true);
      await createPost(newPost, activeCategory === 'all' ? 'general' : activeCategory, []);
      setNewPost('');
      
      // Record activity
      recordActivity({
        type: 'community',
        title: 'Created a new post',
        xpEarned: 15
      });
      
      // Reload data
      loadPosts();
      loadStats();
      loadTrendingTags();
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateComment = async () => {
    if (!selectedPost || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await createComment(selectedPost.id, newComment);
      setNewComment('');
      
      // Record activity
      recordActivity({
        type: 'community',
        title: 'Posted a comment',
        xpEarned: 5
      });
      
      // Reload comments
      loadComments(selectedPost.id);
      
      // Reload posts to update comment count
      loadPosts();
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikePost = async (post: Post) => {
    try {
      await likePost(post.id);
      
      // Record activity
      recordActivity({
        type: 'community',
        title: 'Liked a post',
        xpEarned: 2
      });
      
      // Reload posts
      loadPosts();
    } catch (error) {
      console.error('Error liking post:', error);
      setError('Failed to like post. Please try again.');
    }
  };

  const handleSharePost = async (post: Post) => {
    try {
      await sharePost(post.id);
      
      // Record activity
      recordActivity({
        type: 'community',
        title: 'Shared a post',
        xpEarned: 5
      });
      
      // Reload posts
      loadPosts();
    } catch (error) {
      console.error('Error sharing post:', error);
      setError('Failed to share post. Please try again.');
    }
  };

  const handlePostClick = async (post: Post) => {
    setSelectedPost(post);
    loadComments(post.id);
    
    // Record activity
    recordActivity({
      type: 'community',
      title: 'Viewed post details',
      xpEarned: 1
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Community</h2>
            <p className="text-gray-500 mt-1">Connect and share with fellow entrepreneurs</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-4 mt-6 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-start space-x-4">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"}
                alt={user?.name || "User"}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="Share your thoughts, questions, or ideas..."
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <ImageIcon className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <Smile className="h-5 w-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={isSubmitting || !newPost.trim()}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Post</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePostClick(post)}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.profiles?.avatar_url || "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"}
                      alt={post.profiles?.name || "User"}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {post.profiles?.name || "User"}
                        </h3>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400 text-sm">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600">{post.content}</p>
                      {post.ai_tags && post.ai_tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-3">
                          {post.ai_tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center space-x-6 mt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLikePost(post);
                          }}
                          className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <ThumbsUp className="h-5 w-5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors">
                          <MessageSquare className="h-5 w-5" />
                          <span>{post.comments_count}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSharePost(post);
                          }}
                          className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Share2 className="h-5 w-5" />
                          <span>{post.shares}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-red-600 transition-colors">
                          <Flag className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-500">
                Be the first to start a discussion in this category!
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.total_posts || 0}</p>
                <p className="text-sm text-gray-500">Total Posts</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats?.active_users || 0}</p>
                <p className="text-sm text-gray-500">Active Users</p>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
            <div className="space-y-4">
              {trendingTags.length > 0 ? (
                trendingTags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-medium text-gray-900">{tag.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">{tag.post_count} posts</span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No trending tags yet. Start posting to create some!
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button 
                className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => {
                  recordActivity({
                    type: 'community',
                    title: 'Viewed analytics',
                    xpEarned: 3
                  });
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span>View Analytics</span>
              </button>
              <button 
                className="flex items-center space-x-3 w-full p-3 rounded-xl hover:bg-white/10 transition-colors"
                onClick={() => {
                  recordActivity({
                    type: 'community',
                    title: 'Searched for mentors',
                    xpEarned: 3
                  });
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Users className="h-5 w-5" />
                </div>
                <span>Find Mentors</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <img
                  src={selectedPost.profiles?.avatar_url || "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"}
                  alt={selectedPost.profiles?.name || "User"}
                  className="h-10 w-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">
                      {selectedPost.profiles?.name || "User"}
                    </h3>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400 text-sm">
                      {new Date(selectedPost.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{selectedPost.content}</p>
                  {selectedPost.ai_tags && selectedPost.ai_tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-3">
                      {selectedPost.ai_tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center space-x-6 mt-4">
                    <button
                      onClick={() => handleLikePost(selectedPost)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span>{selectedPost.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors">
                      <MessageSquare className="h-5 w-5" />
                      <span>{selectedPost.comments_count}</span>
                    </button>
                    <button
                      onClick={() => handleSharePost(selectedPost)}
                      className="flex items-center space-x-2 text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                      <span>{selectedPost.shares}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-400 hover:text-red-600 transition-colors">
                      <Flag className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Comments</h4>
                <div className="space-y-4 mb-6">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="flex items-start space-x-3">
                        <img
                          src={comment.profiles?.avatar_url || "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"}
                          alt={comment.profiles?.name || "User"}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="flex-1 bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">
                              {comment.profiles?.name || "User"}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{comment.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>

                <div className="flex items-start space-x-3">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"}
                    alt={user?.name || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={handleCreateComment}
                        disabled={isSubmitting || !newComment.trim()}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Comment</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}