'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiGitBranch, FiCalendar, FiCheckCircle } from 'react-icons/fi';

export default function ProjectDetails() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    if (params.id) fetchProjectDetails();
  }, [params.id]);

  const fetchProjectDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items/${params.id}`);
      setProject(response.data);
      const relatedResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        params: { framework: response.data.framework, limit: 4 }
      });
      setRelatedProjects(relatedResponse.data.items.filter(i => i._id !== params.id));
    } catch (error) {
      console.error('Error fetching project:', error);
      router.push('/explore');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Link href="/explore" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6">
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative h-64 lg:h-auto">
              <img
                src={project.imageUrl || 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=AgileMind'}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold">{project.title}</h1>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                  {project.framework || 'Scrum'}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <FiCheckCircle className="text-green-500 w-4 h-4" />
                  <span className="font-medium">{project.progress || 0}% Complete</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <FiUsers className="w-4 h-4" />
                  <span>{project.teamSize || 0} members</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-4 bg-indigo-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-indigo-600">{project.storyPoints || 0}</div>
                <div className="text-sm text-gray-600">Total Story Points</div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-2xl font-bold text-green-600">{project.completedTasks || 0}</div>
                <div className="text-sm text-gray-600">Tasks Done</div>
              </div>

              <p className="text-gray-600 mb-6">{project.fullDescription || project.shortDescription}</p>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Project Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Framework</span>
                    <div className="font-medium">{project.framework || 'Scrum'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Team Size</span>
                    <div className="font-medium">{project.teamSize || 0} members</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Started</span>
                    <div className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Progress</span>
                    <div className="font-medium">{project.progress || 0}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {relatedProjects.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProjects.map((related, i) => (
                <motion.div
                  key={related._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                >
                  <Link href={`/items/${related._id}`}>
                    <div className="card group">
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={related.imageUrl || 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=AgileMind'}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold truncate">{related.title}</h3>
                        <p className="text-indigo-600 font-bold">{related.framework || 'Scrum'}</p>
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