'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiCalendar } from 'react-icons/fi';

export default function ItemDetails() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    if (params.id) fetchItemDetails();
  }, [params.id]);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items/${params.id}`);
      setItem(response.data);
      const relatedResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/items`, {
        params: { category: response.data.category, limit: 4 }
      });
      setRelatedItems(relatedResponse.data.items.filter(i => i._id !== params.id));
    } catch (error) {
      console.error('Error fetching item:', error);
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

  if (!item) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Item not found</p>
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
                src={item.imageUrl || 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=AgileMind'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 lg:p-8">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold">{item.title}</h1>
                <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                  {item.category}
                </span>
              </div>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <span className="text-amber-400">★</span>
                  <span className="font-medium">{item.rating || 4.5}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <FiMapPin className="w-4 h-4" />
                  <span>{item.location || 'Online'}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-indigo-600 mb-4">${item.price}</div>

              <p className="text-gray-600 mb-6">{item.fullDescription || item.shortDescription}</p>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Key Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Category</span>
                    <div className="font-medium">{item.category}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location</span>
                    <div className="font-medium">{item.location || 'Online'}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Added</span>
                    <div className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Rating</span>
                    <div className="font-medium">{item.rating || 4.5} / 5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {relatedItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedItems.map((related, i) => (
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
                        <p className="text-indigo-600 font-bold">${related.price}</p>
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