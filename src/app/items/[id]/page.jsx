"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiUsers,
  FiGitBranch,
  FiCalendar,
  FiCheckCircle,
  FiTarget,
  FiClock,
  FiAward,
} from "react-icons/fi";
import TaskBoard from "@/components/TaskBoard";
import api from "@/lib/axios";

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    done: 0,
    progress: 0,
  });

  const fetchTaskStats = useCallback(async () => {
    try {
      const tasksRes = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/projects/${params.id}/tasks`,
        {
          params: { _t: Date.now() },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        }
      );
      const tasks = tasksRes.data;
      const total = tasks.length;
      const done = tasks.filter((t) => t.status === "done").length;
      const dynamicProgress = total > 0 ? Math.round((done / total) * 100) : 0;
      setTaskStats({
        total,
        done,
        progress: dynamicProgress,
      });
      setProject(prev => prev ? { ...prev, progress: dynamicProgress } : prev);
    } catch (error) {
      console.error("Error fetching task stats:", error);
    }
  }, [params.id]);

  const fetchProjectDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/items/${params.id}`,
        {
          params: { _t: Date.now() },
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        }
      );
      setProject(response.data);
      await fetchTaskStats();

      const relatedResponse = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL}/items`,
        {
          params: { framework: response.data.framework, limit: 4 },
        }
      );
      setRelatedProjects(
        relatedResponse.data.items.filter((i) => i._id !== params.id)
      );
    } catch (error) {
      console.error("Error fetching project:", error);
      router.push("/explore");
    } finally {
      setLoading(false);
    }
  }, [params.id, router, fetchTaskStats]);

  

  useEffect(() => {
    if (params.id) fetchProjectDetails();
  }, [params.id, fetchProjectDetails]);

  const handleTaskUpdate = useCallback(async () => {
    await fetchTaskStats();
  }, [fetchTaskStats]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Project not found</p>
      </div>
    );
  }

  const displayProgress = taskStats.progress || project.progress || 0;
  const displayDone = taskStats.done || 0;
  const totalMembers = project.members?.length || 0;

  // Status color based on progress
  const getProgressColor = (progress) => {
    if (progress >= 75) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBg = (progress) => {
    if (progress >= 75) return 'bg-green-100';
    if (progress >= 50) return 'bg-yellow-100';
    if (progress >= 25) return 'bg-orange-100';
    return 'bg-red-100';
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Back Button */}
        <Link
          href="/explore"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore</span>
        </Link>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-8">
            {/* Title & Framework */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  {project.title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium flex items-center gap-1.5">
                    <FiGitBranch className="w-3.5 h-3.5" />
                    {project.framework || "Scrum"}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5" />
                    Started {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">
                    {displayProgress}%
                  </div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600">{project.storyPoints || 0}</div>
                <div className="text-xs text-gray-600 mt-1">Story Points</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{displayDone}</div>
                <div className="text-xs text-gray-600 mt-1">Tasks Done</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
                <div className="text-xs text-gray-600 mt-1">Total Tasks</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{totalMembers}</div>
                <div className="text-xs text-gray-600 mt-1">Team Members</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-1.5">
                <span>Progress</span>
                <span className={`font-semibold ${getProgressColor(displayProgress)}`}>
                  {displayProgress}% Complete
                </span>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full transition-all ${
                    displayProgress >= 75 ? 'bg-green-500' :
                    displayProgress >= 50 ? 'bg-yellow-500' :
                    displayProgress >= 25 ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {project.fullDescription || project.shortDescription || "No description provided."}
              </p>
            </div>

            {/* Project Information Grid */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Project Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FiGitBranch className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Framework</div>
                    <div className="font-medium text-gray-900">{project.framework || "Scrum"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FiUsers className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Team Size</div>
                    <div className="font-medium text-gray-900">{totalMembers} members</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiTarget className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Story Points</div>
                    <div className="font-medium text-gray-900">{project.storyPoints || 0}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FiAward className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Progress</div>
                    <div className="font-medium text-gray-900">{displayProgress}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FiClock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Started</div>
                    <div className="font-medium text-gray-900">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {project.endDate && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <FiCalendar className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">End Date</div>
                      <div className="font-medium text-gray-900">
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Team Members List */}
            {totalMembers > 0 && (
              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {project.members.map((member, index) => (
                    <span key={index} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm">
                      <FiUsers className="w-3.5 h-3.5" />
                      {typeof member === 'string' ? member : member.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Task Board Section */}
        <TaskBoard 
          projectId={params.id} 
          members={project.members || []}
          onTaskUpdate={handleTaskUpdate}
        />

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProjects.map((related, i) => (
                <motion.div
                  key={related._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <Link href={`/items/${related._id}`}>
                    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 truncate flex-1">
                          {related.title}
                        </h3>
                        <span className="ml-2 text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full whitespace-nowrap">
                          {related.framework || "Scrum"}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                        <FiUsers className="w-3.5 h-3.5" />
                        <span>{related.members?.length || 0} members</span>
                        <span className="mx-1">•</span>
                        <span>{related.storyPoints || 0} pts</span>
                      </div>
                      <div className="mt-2">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${related.progress || 0}%` }}
                          />
                        </div>
                        <div className="text-right text-xs text-gray-500 mt-0.5">
                          {related.progress || 0}%
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}