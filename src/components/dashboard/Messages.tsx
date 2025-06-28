import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Send, 
  ThumbsUp, 
  RefreshCw,
  Brain,
  Clock,
  Users,
  ChevronRight,
  HelpCircle,
  CheckCircle,
  XCircle,
  BarChart2
} from 'lucide-react';
import { useUserStore } from '../../lib/store';
import { 
  getMessages, 
  createMessage, 
  upvoteMessage,
  getActivePolls,
  getPollResponses,
  submitPollResponse,
  getUserPollResponses
} from '../../lib/api/messages';
import type { Message, Poll, PollStats } from '../../lib/types/messages';

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [pollStats, setPollStats] = useState<PollStats | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [answeredPolls, setAnsweredPolls] = useState<string[]>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    loadMessages();
    loadPolls();
    if (user) {
      loadUserResponses();
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadPolls = async () => {
    try {
      const data = await getActivePolls();
      setPolls(data);
    } catch (error) {
      console.error('Failed to load polls:', error);
    }
  };

  const loadUserResponses = async () => {
    if (!user) return;
    try {
      const responses = await getUserPollResponses(user.id);
      setAnsweredPolls(responses);
    } catch (error) {
      console.error('Failed to load user responses:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setIsLoading(true);
    try {
      await createMessage(newMessage);
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (messageId: string) => {
    try {
      await upvoteMessage(messageId);
      loadMessages();
    } catch (error) {
      console.error('Failed to upvote:', error);
    }
  };

  const handlePollSubmit = async () => {
    if (!selectedPoll || selectedOption === null) return;
    try {
      await submitPollResponse(selectedPoll.id, selectedOption);
      const stats = await getPollResponses(selectedPoll.id);
      setPollStats(stats);
      setShowResult(true);
      setAnsweredPolls([...answeredPolls, selectedPoll.id]);
    } catch (error) {
      console.error('Failed to submit poll response:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Messages Section */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ask the CEO</h2>
          
          {/* Message Input */}
          <div className="mb-6">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask your business-related question..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={3}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="absolute bottom-3 right-3 p-2 text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <p className="text-gray-600">{message.content}</p>
                    {message.ai_response && (
                      <div className="mt-3 p-3 bg-indigo-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-5 w-5 text-indigo-600" />
                          <span className="font-medium text-indigo-600">CEO Response:</span>
                        </div>
                        <p className="text-gray-700">{message.ai_response}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleUpvote(message.id)}
                    className="flex items-center space-x-1 text-gray-400 hover:text-indigo-600"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{message.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Polls Section */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daily Business Challenge</h2>
          
          {selectedPoll ? (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedPoll(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Back to Polls
              </button>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {selectedPoll.title}
                </h3>
                {selectedPoll.description && (
                  <p className="text-gray-600 mb-6">{selectedPoll.description}</p>
                )}

                {!showResult ? (
                  <div className="space-y-4">
                    {selectedPoll.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedOption(index)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedOption === index
                            ? 'bg-white border-indigo-200 shadow-sm'
                            : 'border-gray-200 hover:border-indigo-200 hover:bg-white'
                        }`}
                      >
                        {option}
                      </button>
                    ))}

                    <button
                      onClick={handlePollSubmit}
                      disabled={selectedOption === null}
                      className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                    >
                      Submit Answer
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pollStats && (
                      <div>
                        {selectedPoll.options.map((option, index) => {
                          const percentage = (pollStats.option_counts[index] || 0) / pollStats.total_responses * 100;
                          return (
                            <div key={index} className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  {index === selectedPoll.correct_option ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                  ) : (
                                    index === selectedOption && (
                                      <XCircle className="h-5 w-5 text-red-500 mr-2" />
                                    )
                                  )}
                                  <span className={
                                    index === selectedPoll.correct_option
                                      ? 'text-green-700'
                                      : index === selectedOption
                                      ? 'text-red-700'
                                      : 'text-gray-700'
                                  }>
                                    {option}
                                  </span>
                                </div>
                                <span className="text-sm font-medium text-gray-500">
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    index === selectedPoll.correct_option
                                      ? 'bg-green-500'
                                      : 'bg-gray-300'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {selectedPoll.explanation && (
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="h-5 w-5 text-indigo-600" />
                          <span className="font-medium text-indigo-600">Explanation:</span>
                        </div>
                        <p className="text-gray-700">{selectedPoll.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {polls.map((poll) => (
                <button
                  key={poll.id}
                  onClick={() => setSelectedPoll(poll)}
                  disabled={answeredPolls.includes(poll.id)}
                  className={`w-full text-left p-6 rounded-xl border transition-all ${
                    answeredPolls.includes(poll.id)
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{poll.title}</h3>
                      {poll.description && (
                        <p className="text-sm text-gray-500 mt-1">{poll.description}</p>
                      )}
                    </div>
                    {answeredPolls.includes(poll.id) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-2">
                <MessageSquare className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-indigo-200">Questions Asked</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-2">
                <BarChart2 className="h-6 w-6" />
              </div>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-indigo-200">Correct Answers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}