'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiCpu, FiLayers, FiClock, FiUsers, FiStar } from 'react-icons/fi';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { title: 'AI-Powered Project Management', description: 'Automate your workflow with intelligent agents' },
    { title: 'Smart Sprint Planning', description: 'Let AI handle the complexity of agile planning' },
    { title: 'Real-time Analytics', description: 'Get insights that drive better decisions' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: FiCpu, title: 'AI Content Generator', description: 'Generate user stories, tasks, and documentation automatically' },
    { icon: FiLayers, title: 'Smart Classification', description: 'Auto-tag and categorize tasks for better organization' },
    { icon: FiClock, title: 'Sprint Analytics', description: 'Track progress with real-time burn-down charts' },
    { icon: FiUsers, title: 'Team Collaboration', description: 'Work together seamlessly with intelligent suggestions' }
  ];

  const stats = [
    { value: '10K+', label: 'Projects Managed' },
    { value: '500+', label: 'Active Teams' },
    { value: '98%', label: 'Satisfaction Rate' },
    { value: '50K+', label: 'Tasks Completed' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[65vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-90"></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative h-full flex items-center justify-center text-white px-4">
              <div className="text-center max-w-3xl">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-4xl md:text-6xl font-bold mb-6"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="text-xl md:text-2xl mb-8 opacity-90"
                >
                  {slides[currentSlide].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Link
                    href="/explore"
                    className="inline-flex items-center space-x-2 bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Get Started</span>
                    <FiArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            Powerful <span className="text-indigo-600">AI Features</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="card p-6 text-center"
              >
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-amber-400">{stat.value}</div>
                <div className="opacity-80 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container-custom">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            What Our <span className="text-indigo-600">Users Say</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="card p-6"
              >
                <div className="flex items-center space-x-2 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  "AgileMind has transformed how our team manages projects. The AI features are game-changing!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-sm">Sarah Johnson</div>
                    <div className="text-xs text-gray-500">CTO, TechStart Inc.</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-16 bg-gray-900 text-white"
      >
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of teams using AgileMind to deliver better projects faster.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300"
            >
              <span>Start Free Trial</span>
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}