'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiEdit3 } from 'react-icons/fi';
import axios from 'axios';
import api from '@/lib/axios';

export default function EditProjectModal({ isOpen, onClose, project, onUpdate }) {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    storyPoints: '',
    framework: '',
    imageUrl: '',
    teamSize: '',
    progress: ''
  });
  const [members, setMembers] = useState([]);
  const [memberInput, setMemberInput] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const frameworks = ['Scrum', 'Kanban', 'Agile', 'Waterfall', 'Lean'];

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        storyPoints: project.storyPoints || '',
        framework: project.framework || '',
        imageUrl: project.imageUrl || '',
        teamSize: project.teamSize || '',
        progress: project.progress || ''
      });
      setMembers(project.members || []);
      setPreviewImage(project.imageUrl || '');
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'imageUrl') setPreviewImage(value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.put(`${process.env.NEXT_PUBLIC_API_URL}/items/${project._id}`, {
        ...formData,
        members,
        price: formData.storyPoints,
        category: formData.framework,
        location: formData.teamSize,
        rating: formData.progress
      });
      if (response.status === 200) {
        onUpdate(response.data.item);
        onClose();
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-sm">
                  <FiEdit3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text" 
                  name="title" 
                  required 
                  value={formData.title} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Framework *</label>
                <select
                  name="framework" 
                  required 
                  value={formData.framework} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                >
                  <option value="">Select a framework</option>
                  {frameworks.map((fw) => (
                    <option key={fw} value={fw}>{fw}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
                <input
                  type="text" 
                  name="shortDescription" 
                  required 
                  value={formData.shortDescription} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="Brief description (max 100 chars)"
                  maxLength="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description *</label>
                <textarea
                  name="fullDescription" 
                  required 
                  value={formData.fullDescription} 
                  onChange={handleChange} 
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="Detailed project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Story Points *</label>
                  <input
                    type="number" 
                    name="storyPoints" 
                    required 
                    min="0" 
                    value={formData.storyPoints} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                  <input
                    type="number" 
                    name="teamSize" 
                    min="1" 
                    value={formData.teamSize} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                    placeholder="3"
                  />
                </div>
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Members</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={memberInput.name}
                    onChange={(e) => setMemberInput({ ...memberInput, name: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMember(); } }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                    placeholder="Member name"
                  />
                  <input
                    type="email"
                    value={memberInput.email}
                    onChange={(e) => setMemberInput({ ...memberInput, email: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMember(); } }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                    placeholder="Member email"
                  />
                  <button
                    type="button"
                    onClick={addMember}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm shadow-indigo-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {members.map((m) => (
                    <span
                      key={m.email || m}
                      className="flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 px-3 py-1 rounded-full text-sm border border-indigo-100"
                    >
                      {m.name || m} {m.email && <span className="text-indigo-400">({m.email})</span>}
                      <button
                        type="button"
                        onClick={() => removeMember(m.email || m)}
                        className="hover:text-red-600"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {members.length === 0 && (
                    <span className="text-xs text-gray-400">No members added yet</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                <input
                  type="number" 
                  name="progress" 
                  min="0" 
                  max="100" 
                  value={formData.progress} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url" 
                  name="imageUrl" 
                  value={formData.imageUrl} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50/50 focus:bg-white transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded-xl border border-gray-200 shadow-sm"
                      onError={() => setPreviewImage('')}
                    />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {submitting ? 'Updating...' : 'Update Project'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}