'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiUser, FiCalendar, FiFlag, FiX, FiAlertTriangle, FiInfo, FiEye } from 'react-icons/fi';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';
import api from '@/lib/axios';

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700'
};

const priorityIcons = {
  low: '🟢',
  medium: '🟡',
  high: '🟠',
  critical: '🔴'
};

const statusColors = {
  todo: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  review: 'bg-purple-100 text-purple-700',
  done: 'bg-green-100 text-green-700'
};

const statusLabels = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  review: 'Review',
  done: 'Done'
};

const statusColumns = [
  { id: 'todo', label: 'To Do', icon: '📋' },
  { id: 'in-progress', label: 'In Progress', icon: '🔄' },
  { id: 'review', label: 'Review', icon: '👀' },
  { id: 'done', label: 'Done', icon: '✅' }
];

// Toast Notification Component
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'error' ? <FiAlertTriangle className="w-5 h-5" /> : <FiInfo className="w-5 h-5" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-20 right-4 z-[100] ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3 max-w-md`}
    >
      {icon}
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <FiX className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// Task Details Modal (View Only)
function TaskDetailsModal({ isOpen, onClose, task, members = [] }) {
  const getAssigneeName = (email) => members.find(m => m.email === email)?.name || email || 'Unassigned';

  return (
    <AnimatePresence>
      {isOpen && task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">Task Details</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-lg font-semibold">{task.title}</h4>
                <div className="text-xs text-gray-400 mt-1">
                  Created by: <span className="font-medium">{task.createdBy || 'Unknown'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-3 py-1 rounded-full ${statusColors[task.status] || 'bg-gray-100'}`}>
                  📌 {statusLabels[task.status] || task.status}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full flex items-center space-x-1 ${priorityColors[task.priority] || 'bg-gray-100'}`}>
                  <span>{priorityIcons[task.priority] || '🟡'}</span>
                  <span>{task.priority}</span>
                </span>
              </div>

              {task.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">{task.description}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                <div className="flex items-center space-x-2">
                  <FiUser className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{getAssigneeName(task.assignee)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                  <span className="text-gray-600">{task.storyPoints || 0}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <span className="text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </span>
                </div>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Edit Task Modal Component
function EditTaskModal({ isOpen, onClose, task, onUpdate, currentUserId, members = [] }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    storyPoints: '',
    dueDate: '',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const isCreator = task?.creatorId === currentUserId;

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        assignee: task.assignee || '',
        priority: task.priority || 'medium',
        status: task.status || 'todo',
        storyPoints: task.storyPoints || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parsedTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);

      await api.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${task._id}`, {
        ...formData,
        requesterId: currentUserId,
        tags: parsedTags
      });

      
      const mergedTask = {
        ...task,
        ...formData,
        tags: parsedTags,
        storyPoints: parseInt(formData.storyPoints) || 0,
      };

      onUpdate(mergedTask);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">Edit Task</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="Enter task title"
                  disabled={!isCreator}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                  rows="3"
                  placeholder="Task description (optional)"
                  disabled={!isCreator}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    disabled={!isCreator}
                  >
                    <option value="">Unassigned</option>
                    {members.map((user) => (
                      <option key={user.email} value={user.email}>{user.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    disabled={!isCreator}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                  <input
                    type="number"
                    name="storyPoints"
                    value={formData.storyPoints}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="0"
                    min="0"
                    disabled={!isCreator}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    disabled={!isCreator}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="frontend, api, design"
                  disabled={!isCreator}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isCreator}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Delete Confirmation Modal Component
function DeleteTaskModal({ isOpen, onClose, task, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && task && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Delete Task</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{task?.title}"</span>?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This action cannot be undone. All associated data will be permanently removed.
              </p>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => onConfirm(task._id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete Task
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Main TaskBoard Component
export default function TaskBoard({ projectId, members = [], onTaskUpdate }) {
  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id || session?.user?._id;
  const currentUserEmail = session?.user?.email;
  const currentUserName = session?.user?.name || session?.user?.email || 'Unknown';

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showDeleteTask, setShowDeleteTask] = useState(false);
  const [showDetailsTask, setShowDetailsTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    status: 'todo',
    storyPoints: '',
    dueDate: '',
    tags: ''
  });

  const getAssigneeName = (email) => members.find(m => m.email === email)?.name || email || 'Unassigned';

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        ...formData,
        projectId: projectId,
        creatorId: currentUserId,
        creatorEmail: currentUserEmail,
        creatorName: currentUserName,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      });
      setTasks([response.data.task, ...tasks]);
      setShowAddTask(false);
      setFormData({
        title: '',
        description: '',
        assignee: '',
        priority: 'medium',
        status: 'todo',
        storyPoints: '',
        dueDate: '',
        tags: ''
      });
      if (onTaskUpdate) {
        await onTaskUpdate();
      }
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}?requesterId=${currentUserId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      setShowDeleteTask(false);
      setSelectedTask(null);
      if (onTaskUpdate) {
        await onTaskUpdate();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleUpdateTask = async(updatedTask) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    if (onTaskUpdate) {
      await onTaskUpdate();
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
        status: newStatus,
        requesterId: currentUserEmail 
      });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
      if (onTaskUpdate) {
        await onTaskUpdate();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const canEditDelete = (task) => {
    return task.creatorId === currentUserId;
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowDetailsTask(true);
  };

  const handleEditClick = (task) => {
    if (!canEditDelete(task)) {
      setToast({
        message: 'Only the task creator can edit this task!',
        type: 'error'
      });
      return;
    }
    setSelectedTask(task);
    setShowEditTask(true);
  };

  const handleDeleteClick = (task) => {
    if (!canEditDelete(task)) {
      setToast({
        message: 'Only the task creator can delete this task!',
        type: 'error'
      });
      return;
    }
    setSelectedTask(task);
    setShowDeleteTask(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Task Board</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and track your project tasks</p>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((column) => (
          <div key={column.id} className="bg-gray-50 rounded-xl p-4 min-h-[300px]">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
              <span>{column.icon}</span>
              <span>{column.label}</span>
              <span className="text-sm text-gray-500 ml-auto bg-white px-2 py-0.5 rounded-full">
                {getTasksByStatus(column.id).length}
              </span>
            </h3>

            <div className="space-y-3">
              <AnimatePresence>
                {getTasksByStatus(column.id).map((task) => {
                  const isCreator = canEditDelete(task);
                  const isAssignee = task.assignee === currentUserEmail;
                  
                  return (
                    <motion.div
                      key={task._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer group border border-gray-100"
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm flex-1">{task.title}</h4>
                        <div 
                          className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleEditClick(task)}
                            className={`p-1 rounded ${isCreator ? 'hover:bg-gray-100' : 'cursor-not-allowed opacity-50'}`}
                            title={isCreator ? "Edit Task" : "Only creator can edit"}
                            disabled={!isCreator}
                          >
                            <FiEdit2 className="w-3 h-3 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(task)}
                            className={`p-1 rounded ${isCreator ? 'hover:bg-red-100' : 'cursor-not-allowed opacity-50'}`}
                            title={isCreator ? "Delete Task" : "Only creator can delete"}
                            disabled={!isCreator}
                          >
                            <FiTrash2 className="w-3 h-3 text-red-500" />
                          </button>
                          <button
                            className="p-1 hover:bg-blue-100 rounded"
                            title="View Details"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task);
                            }}
                          >
                            <FiEye className="w-3 h-3 text-blue-500" />
                          </button>
                        </div>
                      </div>

                      <div className="text-xs text-gray-400 mt-1">
                        Created by: <span className="font-medium">{task.createdBy || 'Unknown'}</span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full flex items-center space-x-1 ${priorityColors[task.priority] || 'bg-gray-100'}`}>
                          <span>{priorityIcons[task.priority] || '🟡'}</span>
                          <span>{task.priority}</span>
                        </span>
                        {task.assignee && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <FiUser className="w-3 h-3" />
                            <span>{getAssigneeName(task.assignee)}</span>
                          </span>
                        )}
                        {task.storyPoints > 0 && (
                          <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                            {task.storyPoints} pts
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <FiCalendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                          </span>
                        )}
                      </div>

                      {/* Status Change Dropdown - শুধু Assignee পরিবর্তন করতে পারে */}
                      <select
                        value={task.status}
                        onChange={(e) => {
                          if (task.assignee !== currentUserEmail) {
                            setToast({
                              message: 'Only the assigned person can change task status!',
                              type: 'error'
                            });
                            return;
                          }
                          handleStatusChange(task._id, e.target.value);
                        }}
                        className={`mt-2 w-full text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 outline-none bg-white ${
                          task.assignee !== currentUserEmail ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={task.assignee !== currentUserEmail}
                      >
                        {statusColumns.map((col) => (
                          <option key={col.id} value={col.id}>
                            Move to {col.label}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {getTasksByStatus(column.id).length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8 bg-white rounded-lg border border-dashed border-gray-200">
                  <p className="text-2xl mb-1">📭</p>
                  <p>No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddTask(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                <h3 className="text-xl font-bold">Add New Task</h3>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                    rows="3"
                    placeholder="Task description (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                    <select
                      value={formData.assignee}
                      onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="">Unassigned</option>
                      {members.map((user) => (
                        <option key={user.email} value={user.email}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🟠 High</option>
                      <option value="critical">🔴 Critical</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                    <input
                      type="number"
                      value={formData.storyPoints}
                      onChange={(e) => setFormData({...formData, storyPoints: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="frontend, api, design"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={showDetailsTask}
        onClose={() => {
          setShowDetailsTask(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        members={members}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        isOpen={showEditTask}
        onClose={() => {
          setShowEditTask(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        currentUserId={currentUserId}
        members={members}
      />

      {/* Delete Task Modal */}
      <DeleteTaskModal
        isOpen={showDeleteTask}
        onClose={() => {
          setShowDeleteTask(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onConfirm={handleDeleteTask}
      />
    </div>
  );
}