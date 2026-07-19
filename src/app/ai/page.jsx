'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, getAuthToken } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiSend, FiRefreshCw, FiZap, FiLayers, FiClock, FiFilter, FiClock as FiHistory, FiTrendingUp } from 'react-icons/fi';

const priorityColor = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-green-100 text-green-700'
};

const categoryColor = {
  Frontend: 'bg-indigo-100 text-indigo-700',
  Backend: 'bg-violet-100 text-violet-700',
  Auth: 'bg-pink-100 text-pink-700',
  Database: 'bg-teal-100 text-teal-700',
  Testing: 'bg-orange-100 text-orange-700',
  DevOps: 'bg-slate-100 text-slate-700'
};

export default function AIPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('medium');
  const [content, setContent] = useState(null);
  const [generating, setGenerating] = useState(false);

  const [featureRequest, setFeatureRequest] = useState('');
  const [story, setStory] = useState(null);
  const [generatingStory, setGeneratingStory] = useState(false);

  // --- new: recommendation engine state ---
  const [history, setHistory] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [feedback, setFeedback] = useState('');
  const [refining, setRefining] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data) {
          router.push('/login');
          return;
        }
        setSession(data);
        fetchHistory(data.user.id);
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const fetchHistory = async (userId) => {
    try {
      
      const token = await getAuthToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/story-history/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data2 = await res.json();
      setHistory(data2);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleGenerateContent = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      
      const token = await getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ topic, type: 'description', length }),
      });
      const data2 = await response.json();
      setContent(data2);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!featureRequest || !session) return;
    setGeneratingStory(true);
    try {
      
      const token = await getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ featureRequest, userId: session.user.id }),
      });
      const data2 = await response.json();
      setStory(data2);
      setCategoryFilter('all');
      setPriorityFilter('all');
      fetchHistory(session?.user.id);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleRefineStory = async () => {
    if (!feedback || !story) return;
    setRefining(true);
    try {
      
      const token = await getAuthToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/refine-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({ featureRequest, previousStory: story, feedback }),
      });
      const data2 = await response.json();
      setStory(data2);
      setFeedback('');
    } catch (error) {
      console.error('Error refining story:', error);
    } finally {
      setRefining(false);
    }
  };

  const loadFromHistory = (item) => {
    setFeatureRequest(item.featureRequest);
    setStory(item.story);
    setCategoryFilter('all');
    setPriorityFilter('all');
  };

  const filteredTasks = story?.tasks?.filter((task) => {
    const catOk = categoryFilter === 'all' || task.category === categoryFilter;
    const prioOk = priorityFilter === 'all' || task.priority === priorityFilter;
    return catOk && prioOk;
  }) || [];

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
          <p className="text-sm text-gray-400">Loading AI tools...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mx-auto mb-4">
            <FiCpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">AI Tools</h1>
          <p className="text-gray-500 mt-2">Powered by artificial intelligence</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'generate', label: 'Content Generator', icon: FiCpu },
            { id: 'story', label: 'Story Generator', icon: FiLayers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Content Generator */}
          {activeTab === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-6 max-w-2xl mx-auto"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiCpu className="w-5 h-5 text-indigo-600" />
                AI Content Generator
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic..."
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateContent}
                  disabled={!topic || generating}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {generating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      <span>Generate Content</span>
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence>
                {content && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl overflow-hidden border border-gray-100"
                  >
                    {content.reasoning && (
                      <div className="flex items-start space-x-2 mb-3 text-xs text-violet-600 bg-violet-50 rounded-xl p-2 border border-violet-100">
                        <FiZap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="italic">{content.reasoning}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{content.title}</h3>
                      <button onClick={handleGenerateContent} className="text-indigo-600 hover:text-indigo-800">
                        <FiRefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-600">{content.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {content.tags?.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Story Generator (now: AI Recommendation Engine) */}
          {activeTab === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="max-w-3xl mx-auto space-y-4"
            >
              <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                  <FiLayers className="w-5 h-5 text-indigo-600" />
                  AI Agile Story & Task Recommender
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Type a feature request. AI writes the user story, breaks it into tagged, prioritized tasks,
                  and learns from your past requests + feedback.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature Request</label>
                    <input
                      type="text"
                      value={featureRequest}
                      onChange={(e) => setFeatureRequest(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGenerateStory()}
                      placeholder="e.g. Google Login feature banaite hobe"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateStory}
                    disabled={!featureRequest || generatingStory}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {generatingStory ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Breaking down feature...</span>
                      </>
                    ) : (
                      <>
                        <FiLayers className="w-5 h-5" />
                        <span>Generate Story & Tasks</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {story && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl mb-4 border border-violet-100">
                        <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">User Story</span>
                        <p className="text-gray-800 mt-1">{story.userStory}</p>
                      </div>

                      {/* Filters */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <FiFilter className="w-4 h-4 text-gray-400" />
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50/50"
                        >
                          <option value="all">All Categories</option>
                          {Object.keys(categoryColor).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <select
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                          className="px-3 py-1.5 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50/50"
                        >
                          <option value="all">All Priorities</option>
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Task Breakdown ({filteredTasks.length})
                        </span>
                        {filteredTasks.map((task, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{task.title}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor[task.category] || 'bg-gray-100 text-gray-700'}`}>
                                  {task.category}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColor[task.priority] || 'bg-gray-100 text-gray-700'}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500 text-sm flex-shrink-0 ml-3">
                              <FiClock className="w-4 h-4" />
                              <span>{task.estimatedHours}h</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Refine box */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Not quite right? Give feedback to refine
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRefineStory()}
                            placeholder="e.g. add more testing tasks, reduce hours"
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                          />
                          <button
                            onClick={handleRefineStory}
                            disabled={!feedback || refining}
                            className="px-4 py-2 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center gap-1 shadow-sm shadow-violet-200"
                          >
                            {refining ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <FiRefreshCw className="w-4 h-4" />
                            )}
                            Refine
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* History (context-aware recommendations) */}
              {history.length > 0 && (
                <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FiHistory className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">Your Past Requests</span>
                  </div>
                  <div className="space-y-2">
                    {history.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-indigo-50 rounded-xl text-sm text-gray-700 transition-colors border border-transparent hover:border-indigo-100"
                      >
                        {item.featureRequest}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}