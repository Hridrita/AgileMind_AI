'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZap, FiTrendingUp, FiUserPlus, FiUsers, FiTag, FiCalendar, FiTarget } from 'react-icons/fi';
import api from '@/lib/axios';

export default function AddProject() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', 
    shortDescription: '', 
    fullDescription: '',
    storyPoints: '', 
    framework: '', 
    teamSize: '3', 
    progress: '0',
    startDate: '',
    endDate: ''
  });
  const [expanding, setExpanding] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [pointsReasoning, setPointsReasoning] = useState('');
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState({ name: '', email: '' });

  const frameworks = ['Scrum', 'Kanban', 'Agile', 'Waterfall', 'Lean'];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data) { router.push('/login'); return; }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addMember = () => {
    if (memberInput.name.trim() && memberInput.email.trim() && !members.some(m => m.email === memberInput.email.trim())) {
      setMembers([...members, { name: memberInput.name.trim(), email: memberInput.email.trim() }]);
      setMemberInput({ name: '', email: '' });
    }
  };

  const removeMember = (email) => {
    setMembers(members.filter(m => m.email !== email));
  };

  const handleExpandDescription = async () => {
    if (!formData.shortDescription) return;
    setExpanding(true);
    try {
      const {data} = await authClient.getSession();
      const token =  data?.session?.token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/expand-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({
          title: formData.title,
          shortDescription: formData.shortDescription,
          framework: formData.framework
        }),
      });
      const data2 = await response.json();
      setFormData(prev => ({ ...prev, fullDescription: data2.fullDescription }));
    } catch (error) {
      console.error('Error expanding description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setExpanding(false);
    }
  };

  const handleEstimatePoints = async () => {
    if (!formData.shortDescription && !formData.fullDescription) return;
    setEstimating(true);
    try {
      const { data } = await authClient.getSession();
      const token = data?.session?.token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/estimate-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({
          title: formData.title,
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription
        }),
      });
      const data2 = await response.json();
      setFormData(prev => ({ ...prev, storyPoints: String(data2.storyPoints) }));
      setPointsReasoning(data2.reasoning || '');
    } catch (error) {
      console.error('Error estimating points:', error);
      alert('Failed to estimate story points. Please try again.');
    } finally {
      setEstimating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const userId = session?.user?.id || session?.user?._id;
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        ...formData,
        members,
         createdBy: userId, 
        price: formData.storyPoints,
        category: formData.framework,
        location: formData.teamSize,
        rating: formData.progress
      });
      if (response.status === 201) router.push('/items/manage');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="text-gray-500 mt-1">Fill in the details below to create your project</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
          >
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text" 
                name="title" 
                required 
                value={formData.title} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter project name"
              />
            </div>

            {/* Framework */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Framework <span className="text-red-500">*</span>
              </label>
              <select
                name="framework" 
                required 
                value={formData.framework} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                <option value="">Select a framework</option>
                {frameworks.map((fw) => (
                  <option key={fw} value={fw}>{fw}</option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text" 
                name="shortDescription" 
                required 
                value={formData.shortDescription} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Brief description (max 100 chars)" 
                maxLength="100"
              />
            </div>

            {/* Full Description with AI Expand */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Description <span className="text-red-500">*</span>
                </label>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExpandDescription}
                  disabled={!formData.shortDescription || expanding}
                  className="flex items-center space-x-1.5 text-xs px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full hover:bg-violet-100 transition-colors disabled:opacity-50"
                >
                  {expanding ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-violet-700"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FiZap className="w-3.5 h-3.5" />
                      <span>AI Expand</span>
                    </>
                  )}
                </motion.button>
              </div>
              <textarea
                name="fullDescription" 
                required 
                value={formData.fullDescription} 
                onChange={handleChange} 
                rows="4"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Detailed project description (or click AI Expand above)"
              />
            </div>

            {/* Story Points & Team Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700">
                    Story Points <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleEstimatePoints}
                    disabled={(!formData.shortDescription && !formData.fullDescription) || estimating}
                    className="flex items-center space-x-1 text-xs text-violet-600 hover:text-violet-800 disabled:opacity-50"
                  >
                    {estimating ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-violet-700"></div>
                    ) : (
                      <>
                        <FiTrendingUp className="w-3.5 h-3.5" />
                        <span>AI Estimate</span>
                      </>
                    )}
                  </button>
                </div>
                <input
                  type="number" 
                  name="storyPoints" 
                  required 
                  min="1" 
                  value={formData.storyPoints} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="e.g., 21"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Team Size
                </label>
                <input
                  type="number" 
                  name="teamSize" 
                  min="1" 
                  value={formData.teamSize} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="3"
                />
              </div>
            </div>

            {/* Team Members */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Team Members
              </label>
              <div className="flex gap-2">
                <input
                  type="text" 
                  value={memberInput.name}
                  onChange={(e) => setMemberInput({ ...memberInput, name: e.target.value })}
                  onKeyDown={(e) => { 
                    if (e.key === 'Enter') { 
                      e.preventDefault(); 
                      addMember(); 
                    } 
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter member name"
                />
                <input
                  type="email"
                  value={memberInput.email}
                  onChange={(e) => setMemberInput({ ...memberInput, email: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addMember();
                    }
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter member email"
                />
                <button 
                  type="button" 
                  onClick={addMember} 
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-1"
                >
                  <FiUserPlus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {members.map((m) => (
                  <span key={m.email} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm">
                    <FiUsers className="w-3.5 h-3.5" />
                    {m.name} <span className="text-indigo-400">({m.email})</span>
                    <button 
                      type="button" 
                      onClick={() => removeMember(m.email)} 
                      className="hover:text-red-600 ml-1"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Reasoning */}
            <AnimatePresence>
              {pointsReasoning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start space-x-2 text-xs text-violet-600 bg-violet-50 rounded-xl p-3 overflow-hidden"
                >
                  <FiZap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="italic">{pointsReasoning}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date" 
                  name="startDate" 
                  value={formData.startDate} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  End Date
                </label>
                <input
                  type="date" 
                  name="endDate" 
                  value={formData.endDate} 
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Progress (%)
              </label>
              <input
                type="number" 
                name="progress" 
                min="0" 
                max="100" 
                value={formData.progress} 
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="0"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {submitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Project...</span>
                </span>
              ) : 'Create Project'}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}