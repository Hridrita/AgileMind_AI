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
import SprintBurndownChart from "@/components/SprintBurndownChart";
import TaskDistributionChart from "@/components/TaskDistributionChart";
import TeamVelocityChart from "@/components/TeamVelocityChart";
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
  const [refreshKey, setRefreshKey] = useState(0);

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
  setRefreshKey((prev) => prev + 1);
}, [fetchTaskStats]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-100 border-t-indigo-600"></div>
          <p className="text-sm text-gray-400">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-medium">Project not found</p>
        </div>
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

  const getProgressStroke = (progress) => {
    if (progress >= 75) return '#22c55e';
    if (progress >= 50) return '#eab308';
    if (progress >= 25) return '#f97316';
    return '#ef4444';
  };

  const circumference = 2 * Math.PI * 36;
  const strokeOffset = circumference - (displayProgress / 100) * circumference;

  const infoItems = [
    {
      icon: FiGitBranch,
      label: "Framework",
      value: project.framework || "Scrum",
      bg: "bg-indigo-100",
      color: "text-indigo-600",
    },
    {
      icon: FiUsers,
      label: "Team Size",
      value: `${totalMembers} members`,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      icon: FiTarget,
      label: "Story Points",
      value: project.storyPoints || 0,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      icon: FiAward,
      label: "Progress",
      value: `${displayProgress}%`,
      bg: "bg-purple-100",
      color: "text-purple-600",
    },
    {
      icon: FiClock,
      label: "Started",
      value: new Date(project.createdAt).toLocaleDateString(),
      bg: "bg-yellow-100",
      color: "text-yellow-600",
    },
  ];

  if (project.endDate) {
    infoItems.push({
      icon: FiCalendar,
      label: "End Date",
      value: new Date(project.endDate).toLocaleDateString(),
      bg: "bg-red-100",
      color: "text-red-600",
    });
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom py-8">
        {/* Back Button */}
        <Link
          href="/explore"
          className="inline-flex items-center space-x-2 text-gray-500 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Explore</span>
        </Link>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-gray-100 overflow-hidden mb-8"
        >
          {/* Decorative gradient banner */}
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: "radial-gradient(circle at 20% 30%, white 0%, transparent 50%), radial-gradient(circle at 80% 70%, white 0%, transparent 50%)"
            }} />
          </div>

          <div className="px-8 pb-8 -mt-12 relative">
            {/* Title & Framework */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div className="bg-white rounded-2xl shadow-sm p-1">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
                    {project.title}
                  </h1>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
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
              </div>

              {/* Circular Progress */}
              <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm p-3">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <motion.circle
                      cx="40" cy="40" r="36"
                      stroke={getProgressStroke(displayProgress)}
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: strokeOffset }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <span className="absolute text-lg font-bold text-gray-800">
                    {displayProgress}%
                  </span>
                </div>
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">Progress</div>
                  <div className={`text-sm font-semibold ${getProgressColor(displayProgress)}`}>
                    {displayProgress >= 75 ? "On Track" : displayProgress >= 50 ? "In Progress" : displayProgress >= 25 ? "Getting Started" : "Just Started"}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl p-4 text-center border border-indigo-100">
                <div className="text-2xl font-bold text-indigo-600">{project.storyPoints || 0}</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">Story Points</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-4 text-center border border-green-100">
                <div className="text-2xl font-bold text-green-600">{displayDone}</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">Tasks Done</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-4 text-center border border-blue-100">
                <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">Total Tasks</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-4 text-center border border-purple-100">
                <div className="text-2xl font-bold text-purple-600">{totalMembers}</div>
                <div className="text-xs text-gray-600 mt-1 font-medium">Team Members</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span className="font-medium">Overall Progress</span>
                <span className={`font-semibold ${getProgressColor(displayProgress)}`}>
                  {displayProgress}% Complete
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full transition-all ${
                    displayProgress >= 75 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                    displayProgress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                    displayProgress >= 25 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                    'bg-gradient-to-r from-red-400 to-red-600'
                  }`}
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {project.fullDescription || project.shortDescription || "No description provided."}
              </p>
            </div>

            {/* Project Information Grid */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                Project Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {infoItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-gray-500">{item.label}</div>
                      <div className="font-semibold text-gray-900 truncate">{item.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Team Members List */}
            {totalMembers > 0 && (
              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                  Team Members
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.members.map((member, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm border border-indigo-100 hover:shadow-sm transition-shadow"
                    >
                      <FiUsers className="w-3.5 h-3.5" />
                      {typeof member === 'string' ? member : member.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SprintBurndownChart projectId={params.id} refreshTrigger={refreshKey} />
          <TaskDistributionChart projectId={params.id} refreshTrigger={refreshKey} />
        </div>
        <div className="mb-8">
          <TeamVelocityChart projectId={params.id} refreshTrigger={refreshKey} />
        </div>

        {/* Task Board Section */}
        <TaskBoard 
          projectId={params.id} 
          members={project.members || []}
          onTaskUpdate={handleTaskUpdate}
        />

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related Projects</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
            </div>
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
                    <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-xl transition-all duration-300 border border-gray-100">
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
                            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all"
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