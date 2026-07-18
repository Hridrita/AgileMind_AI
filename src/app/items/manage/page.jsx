'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

export default function ManageItems() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [fetchingItems, setFetchingItems] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data) { router.push('/login'); return; }
        setSession(data);
        fetchItems();
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const fetchItems = async () => {
    setFetchingItems(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items`);
      setItems(response.data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setFetchingItems(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setDeleting(id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  if (loading || fetchingItems) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold">Manage Items</h1>
            <p className="text-gray-600 mt-1">View, edit, and delete your items</p>
          </div>
          <Link
            href="/items/add"
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            <FiPlus className="w-5 h-5" />
            <span>Add New</span>
          </Link>
        </motion.div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No items found</p>
            <Link href="/items/add" className="inline-block mt-4 text-indigo-600 hover:underline font-medium">
              Create your first item →
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.tr
                        key={item._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.imageUrl || 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=AI'}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/40/4F46E5/FFFFFF?text=AI'; }}
                            />
                            <div className="min-w-0">
                              <div className="font-medium text-gray-900 truncate">{item.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs hidden sm:block">{item.shortDescription}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <span className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium hidden sm:table-cell">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="flex items-center space-x-1">
                            <span className="text-amber-400">★</span>
                            <span>{item.rating || 4.5}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Link href={`/items/${item._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                              <FiEye className="w-4 h-4" />
                            </Link>
                            <Link href={`/items/edit/${item._id}`} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                              <FiEdit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(item._id)}
                              disabled={deleting === item._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleting === item._id ? (
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
    </div>
  );
}