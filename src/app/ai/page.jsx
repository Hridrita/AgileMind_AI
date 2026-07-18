'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiSend, FiRefreshCw, FiZap, FiLayers, FiClock } from 'react-icons/fi';

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

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data) {
          router.push('/login');
          return;
        }
        setSession(data);
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleGenerateContent = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type: 'description', length }),
      });
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateStory = async () => {
    if (!featureRequest) return;
    setGeneratingStory(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-story`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureRequest }),
      });
      const data = await response.json();
      setStory(data);
    } catch (error) {
      console.error('Error generating story:', error);
    } finally {
      setGeneratingStory(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold">AI Tools</h1>
          <p className="text-gray-600 mt-2">Powered by artificial intelligence</p>
        </motion.div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'generate', label: 'Content Generator', icon: FiCpu },
            { id: 'story', label: 'Story Generator', icon: FiLayers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
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
              className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto"
            >
              <h2 className="text-xl font-semibold mb-4">AI Content Generator</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
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
                    className="mt-6 p-4 bg-gray-50 rounded-lg overflow-hidden"
                  >
                    {content.reasoning && (
                      <div className="flex items-start space-x-2 mb-3 text-xs text-violet-600 bg-violet-50 rounded-lg p-2">
                        <FiZap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span className="italic">{content.reasoning}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{content.title}</h3>
                      <button onClick={handleGenerateContent} className="text-indigo-600 hover:text-indigo-800">
                        <FiRefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-600">{content.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {content.tags?.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Story Generator */}
          {activeTab === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto"
            >
              <h2 className="text-xl font-semibold mb-1">AI Agile Story Generator</h2>
              <p className="text-sm text-gray-500 mb-4">
                Type a feature request in one line. AI writes the user story and breaks it into tagged, prioritized tasks.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feature Request</label>
                  <input
                    type="text"
                    value={featureRequest}
                    onChange={(e) => setFeatureRequest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateStory()}
                    placeholder="e.g. Google Login feature banaite hবে"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerateStory}
                  disabled={!featureRequest || generatingStory}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
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
                    <div className="p-4 bg-violet-50 rounded-lg mb-4">
                      <span className="text-xs font-semibold text-violet-600 uppercase tracking-wide">User Story</span>
                      <p className="text-gray-800 mt-1">{story.userStory}</p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Task Breakdown</span>
                      {story.tasks?.map((task, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}