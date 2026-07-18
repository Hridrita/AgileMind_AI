'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiUsers, FiGitBranch, FiTarget, FiCalendar, FiTrendingUp } from 'react-icons/fi';

export default function Explore() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [framework, setFramework] = useState('all');
  const [sort, setSort] = useState('newest');
  const [minPoints, setMinPoints] = useState('');
  const [maxPoints, setMaxPoints] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const frameworks = ['all', 'Scrum', 'Kanban', 'Agile', 'Waterfall', 'Lean'];
  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'points-asc', label: 'Points: Low to High' },
    { value: 'points-desc', label: 'Points: High to Low' },
    { value: 'progress', label: 'Most Progress' }
  ];

  useEffect(() => {
    fetchProjects();
  }, [search, framework, sort, minPoints, maxPoints, page]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        params: { search, framework, sort, minPoints, maxPoints, page, limit: 8 }
      });
      setProjects(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjects();
  };

  const handleResetFilters = () => {
    setSearch('');
    setFramework('all');
    setSort('newest');
    setMinPoints('');
    setMaxPoints('');
    setPage(1);
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressTextColor = (progress) => {
    if (progress >= 75) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Explore Projects</h1>
          <p className="text-gray-500 mt-2">Discover amazing projects and resources</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>

              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[160px]"
              >
                {frameworks.map((fw) => (
                  <option key={fw} value={fw}>
                    {fw === 'all' ? 'All Frameworks' : fw}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[180px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex gap-4 flex-1">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Min Story Points</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minPoints}
                    onChange={(e) => setMinPoints(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-600 block mb-1">Max Story Points</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors font-medium"
              >
                Reset Filters
              </button>
            </div>
          </form>
        </motion.div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full w-full"></div>
                  <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg">No projects found</p>
            <button 
              onClick={handleResetFilters} 
              className="text-indigo-600 hover:underline mt-2 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 flex-1">
                          {project.title}
                        </h3>
                        <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full">
                          {project.framework || 'Scrum'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3 min-h-[40px]">
                        {project.shortDescription || 'No description'}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <FiGitBranch className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{project.framework || 'Scrum'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <FiUsers className="w-3.5 h-3.5 text-blue-500" />
                          <span>{project.members?.length || 0} members</span>
                        </div>
                      </div>

                      {/* Story Points & Tasks */}
                      <div className="flex items-center gap-3 mb-3 text-xs">
                        <span className="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                          <FiTarget className="w-3 h-3" />
                          {project.storyPoints || 0} pts
                        </span>
                        <span className="flex items-center gap-1 bg-green-50 text-green-600 px-2.5 py-1 rounded-full">
                          <FiTrendingUp className="w-3 h-3" />
                          {project.progress || 0}% done
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                          <span>Progress</span>
                          <span className={`font-medium ${getProgressTextColor(project.progress || 0)}`}>
                            {project.progress || 0}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress || 0}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${getProgressColor(project.progress || 0)}`}
                          />
                        </div>
                      </div>

                      {/* View Details Button */}
                      <Link
                        href={`/items/${project._id}`}
                        className="block w-full text-center bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200"
                      >
                        View Details →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`px-4 py-2 rounded-xl transition-all duration-200 font-medium ${
                      page === index + 1
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}