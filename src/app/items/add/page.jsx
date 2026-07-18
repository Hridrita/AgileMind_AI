'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZap, FiTrendingUp } from 'react-icons/fi';

export default function AddProject() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', shortDescription: '', fullDescription: '',
    storyPoints: '', framework: '', imageUrl: '', teamSize: '3', progress: '0'
  });
  const [previewImage, setPreviewImage] = useState('');
  const [expanding, setExpanding] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [pointsReasoning, setPointsReasoning] = useState('');
  const [members, setMembers] = useState([]);
const [memberInput, setMemberInput] = useState('');

const addMember = () => {
  if (memberInput.trim() && !members.includes(memberInput.trim())) {
    setMembers([...members, memberInput.trim()]);
    setMemberInput('');
  }
};

const removeMember = (name) => {
  setMembers(members.filter(m => m !== name));
};

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

  const frameworks = ['Scrum', 'Kanban', 'Agile', 'Waterfall', 'Lean'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') setPreviewImage(value);
  };

  const handleExpandDescription = async () => {
    if (!formData.shortDescription) return;
    setExpanding(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/expand-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          shortDescription: formData.shortDescription,
          framework: formData.framework
        }),
      });
      const data = await response.json();
      setFormData(prev => ({ ...prev, fullDescription: data.fullDescription }));
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/estimate-points`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          shortDescription: formData.shortDescription,
          fullDescription: formData.fullDescription
        }),
      });
      const data = await response.json();
      setFormData(prev => ({ ...prev, storyPoints: String(data.storyPoints) }));
      setPointsReasoning(data.reasoning || '');
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        ...formData,
        members,
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
        <div className="max-w-2xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6"
          >
            Create New Project
          </motion.h1>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-md p-6 space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
              <input
                type="text" name="title" required value={formData.title} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Framework *</label>
              <select
                name="framework" required value={formData.framework} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="">Select a framework</option>
                {frameworks.map((fw) => (<option key={fw} value={fw}>{fw}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
              <input
                type="text" name="shortDescription" required value={formData.shortDescription} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Brief description (max 100 chars)" maxLength="100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Full Description *</label>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleExpandDescription}
                  disabled={!formData.shortDescription || expanding}
                  className="flex items-center space-x-1 text-xs px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full hover:bg-violet-100 transition-colors disabled:opacity-50"
                >
                  {expanding ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-violet-700"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FiZap className="w-3 h-3" />
                      <span>AI Expand from Short Description</span>
                    </>
                  )}
                </motion.button>
              </div>
              <textarea
                name="fullDescription" required value={formData.fullDescription} onChange={handleChange} rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="Detailed project description (or click AI Expand above)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Story Points *</label>
                  <button
                    type="button"
                    onClick={handleEstimatePoints}
                    disabled={(!formData.shortDescription && !formData.fullDescription) || estimating}
                    className="text-violet-600 hover:text-violet-800 disabled:opacity-50"
                    title="AI Estimate"
                  >
                    {estimating ? (
                      <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-violet-700"></div>
                    ) : (
                      <FiTrendingUp className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <input
                  type="number" name="storyPoints" required min="1" value={formData.storyPoints} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="21"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                <input
                  type="number" name="teamSize" min="1" value={formData.teamSize} onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="3"
                />
              </div>
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
  <div className="flex gap-2">
    <input
      type="text" value={memberInput}
      onChange={(e) => setMemberInput(e.target.value)}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMember(); } }}
      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
      placeholder="Enter member name and press Enter"
    />
    <button type="button" onClick={addMember} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add</button>
  </div>
  <div className="flex flex-wrap gap-2 mt-2">
    {members.map((m) => (
      <span key={m} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
        {m}
        <button type="button" onClick={() => removeMember(m)} className="hover:text-red-600"><FiX className="w-3 h-3" /></button>
      </span>
    ))}
  </div>
</div>

            <AnimatePresence>
              {pointsReasoning && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start space-x-2 text-xs text-violet-600 bg-violet-50 rounded-lg p-2 overflow-hidden"
                >
                  <FiZap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="italic">{pointsReasoning}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
              <input
                type="number" name="progress" min="0" max="100" value={formData.progress} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
              <input
                type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="https://example.com/image.jpg"
              />
              {previewImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2 relative inline-block"
                >
                  <img
                    src={previewImage} alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                    onError={() => setPreviewImage('')}
                  />
                  <button
                    type="button"
                    onClick={() => { setFormData(prev => ({ ...prev, imageUrl: '' })); setPreviewImage(''); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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