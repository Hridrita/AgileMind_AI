'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiEye, FiPlus, FiUser, FiFolder } from 'react-icons/fi';
import EditProjectModal from '@/components/EditProjectModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import api from '@/lib/axios';

export default function ManageProjects() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Delete Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data) { 
          router.push('/login'); 
          return; 
        }
        setSession(data);
        // Get user ID from session
        const userId = data?.user?.id || data?.user?._id || data?.userId;
        setCurrentUserId(userId);
        fetchProjects(userId);
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const fetchProjects = async (userId) => {
    setFetchingProjects(true);
    try {
      // Fetch only projects created by current user
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/items/user/${userId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setFetchingProjects(false);
    }
  };

  // Handle delete - open modal instead of confirm
  const handleDeleteClick = (project) => {
    setDeletingProject(project);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    
    const id = deletingProject._id;
    setDeleting(id);
    setIsDeleteModalOpen(false);
    
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}?userId=${currentUserId}`);
      setProjects(projects.filter(project => project._id !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project. Please try again.');
    } finally {
      setDeleting(null);
      setDeletingProject(null);
    }
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setDeletingProject(null);
  };

  // Handle edit click - open modal
  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  // Handle project update from modal
  const handleProjectUpdate = (updatedProject) => {
    setProjects(projects.map(p => 
      p._id === updatedProject._id ? updatedProject : p
    ));
  };

  if (loading || fetchingProjects) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
          <p className="text-sm text-gray-400">Loading projects...</p>
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
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 flex-shrink-0">
              <FiFolder className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Projects</h1>
              <p className="text-gray-500 mt-1">View, edit, and delete your projects</p>
            </div>
          </div>
          <Link
            href="/items/add"
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add New</span>
          </Link>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 p-12 text-center"
          >
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-gray-700 text-lg font-semibold">No projects found</p>
            <p className="text-gray-400 text-sm mt-1">You haven't created any projects yet</p>
            <Link href="/items/add" className="inline-block mt-4 text-indigo-600 hover:underline font-medium">
              Create your first project →
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-indigo-50/30 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Framework</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Story Points</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Progress</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {projects.map((project) => (
                      <motion.tr
                        key={project._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="hover:bg-indigo-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm">
                              {project.title?.charAt(0).toUpperCase() || 'P'}
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{project.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs hidden sm:block">{project.shortDescription}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                            {project.framework || 'Scrum'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700 hidden sm:table-cell">
                          {project.storyPoints || 0} pts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                                style={{ width: `${project.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{project.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-1.5">
                            <Link href={`/items/${project._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleEditClick(project)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(project)}
                              disabled={deleting === project._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleting === project._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (<FiTrash2 className="w-4 h-4" />)}
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        project={editingProject}
        onUpdate={handleProjectUpdate}
        currentUserId={currentUserId}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleConfirmDelete}
        projectTitle={deletingProject?.title || ''}
      />
    </div>
  );
}