"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LuMessageCircleMore } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { FaArrowRight, FaClock, FaSearch, FaUser } from "react-icons/fa";

export default function Blog() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = [
    "all",
    "AI & ML",
    "Agile",
    "Productivity",
    "Team Management",
    "Technology",
  ];

  const posts = [
    {
      id: 1,
      title: "How AI is Transforming Project Management",
      excerpt:
        "Discover how artificial intelligence is revolutionizing the way teams plan, execute, and deliver projects.",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600",
      category: "AI & ML",
      author: "Sarah Johnson",
      date: "Mar 15, 2026",
      readTime: "5 min read",
      comments: 12,
    },
    {
      id: 2,
      title: "Mastering Agile Sprint Planning",
      excerpt:
        "Learn the best practices for effective sprint planning and how to keep your team aligned throughout the sprint.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600",
      category: "Agile",
      author: "Mike Chen",
      date: "Mar 10, 2026",
      readTime: "7 min read",
      comments: 8,
    },
    {
      id: 3,
      title: "10 Productivity Hacks for Remote Teams",
      excerpt:
        "Boost your remote team productivity with these proven strategies and tools that actually work.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
      category: "Productivity",
      author: "Emily Davis",
      date: "Mar 5, 2026",
      readTime: "6 min read",
      comments: 15,
    },
    {
      id: 4,
      title: "Building High-Performance Teams",
      excerpt:
        "The key ingredients to building and maintaining high-performance teams in today's fast-paced environment.",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600",
      category: "Team Management",
      author: "David Wilson",
      date: "Feb 28, 2026",
      readTime: "4 min read",
      comments: 6,
    },
    {
      id: 5,
      title: "The Future of Remote Work Technology",
      excerpt:
        "Exploring the emerging technologies that will shape the future of remote work and distributed teams.",
      image:
        "https://images.unsplash.com/photo-1432889821006-a7ce0366ae80?w=600",
      category: "Technology",
      author: "Lisa Park",
      date: "Feb 20, 2026",
      readTime: "8 min read",
      comments: 10,
    },
    {
      id: 6,
      title: "AI-Powered Decision Making in Projects",
      excerpt:
        "How AI can help project managers make better decisions faster with real-time data and predictive analytics.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600",
      category: "AI & ML",
      author: "Sarah Johnson",
      date: "Feb 15, 2026",
      readTime: "6 min read",
      comments: 9,
    },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || post.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-12">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Blog</h1>
            <p className="text-lg opacity-90">
              Insights, tips, and stories from the AgileMind team
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-8">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
            />
            <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[160px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-indigo-600 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                  <Link
                    href={`/blog/${post.id}`}
                    className="hover:text-indigo-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-xs text-gray-500 space-x-4">
                  <span className="flex items-center space-x-1">
                    <FaUser className="w-3.5 h-3.5" />
                    <span>{post.author}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <SlCalender className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center space-x-1">
                      <FaClock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <LuMessageCircleMore className="w-3.5 h-3.5" />
                      <span>{post.comments}</span>
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center space-x-1 group"
                  >
                    <span>Read More</span>
                    <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found</p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              className="text-indigo-600 hover:underline mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
