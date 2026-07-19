'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaHeart, FaRocket, FaShieldAlt, FaUsers } from 'react-icons/fa';
import { 
  FiCpu, FiAward, FiZap 
} from 'react-icons/fi';
import { IoMdTrendingUp } from 'react-icons/io';

export default function About() {
  const values = [
    {
      icon: FiCpu,
      title: 'AI-Powered Innovation',
      description: 'Leveraging cutting-edge artificial intelligence to transform project management'
    },
    {
      icon: FaUsers,
      title: 'Team First Approach',
      description: 'Built for teams of all sizes, from startups to enterprises'
    },
    {
      icon: FaRocket,
      title: 'Agile at Heart',
      description: 'Designed to accelerate your agile workflow and boost productivity'
    },
    {
      icon: FaShieldAlt,
      title: 'Enterprise Grade Security',
      description: 'Your data is protected with industry-leading security standards'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Projects Managed', icon: IoMdTrendingUp },
    { value: '500+', label: 'Active Teams', icon: FaUsers },
    { value: '98%', label: 'Satisfaction Rate', icon: FiAward },
    { value: '24/7', label: 'Support Available', icon: FaHeart }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About AgileMind AI</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              We're on a mission to revolutionize how teams work together by combining 
              the power of artificial intelligence with agile project management methodologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              AgileMind AI was born from a simple observation: project management tools 
              were becoming more complex, but not necessarily more intelligent. We saw an 
              opportunity to create something different—a tool that doesn't just track work, 
              but actively helps teams work smarter.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, AgileMind AI is trusted by teams worldwide to automate repetitive tasks, 
              provide intelligent insights, and accelerate project delivery. Our platform 
              combines the best of agile methodologies with state-of-the-art AI capabilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-indigo-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-indigo-600 mb-3">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To empower teams with intelligent automation and insights that transform 
                how they plan, execute, and deliver projects. We believe that technology 
                should work for people, not the other way around.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-violet-50 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-violet-600 mb-3">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                A world where every team has access to intelligent project management 
                that makes work more meaningful, efficient, and enjoyable. Where AI 
                handles the complexity, so humans can focus on creativity and innovation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
            <p className="text-gray-600 mt-2">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-8 h-8 opacity-80" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-80 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center max-w-3xl mx-auto"
          >
            <FiZap className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Transform Your Workflow?</h3>
            <p className="text-gray-600 mb-6">
              Join thousands of teams already using AgileMind AI to deliver projects faster and smarter.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              <span>Get Started Free</span>
              <FiZap className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}