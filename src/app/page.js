'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight, FiCpu, FiLayers, FiClock, FiUsers, FiStar,
  FiCheck, FiZap, FiShield, FiTrendingUp, FiTarget, FiCode,
  FiChevronDown, FiPlay, FiGitBranch, FiCalendar, FiAward
} from 'react-icons/fi';

/* ─── Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

/* ─── Data ─── */
const slides = [
  {
    label: 'AI-Powered',
    title: 'Project Management',
    subtitle: 'Reimagined',
    description: 'Let intelligent agents handle the complexity so your team can focus on what matters most.'
  },
  {
    label: 'Smart Planning',
    title: 'Sprint Planning',
    subtitle: 'Made Effortless',
    description: 'AI-driven sprint planning that adapts to your team\'s velocity and priorities automatically.'
  },
  {
    label: 'Real-time',
    title: 'Analytics &',
    subtitle: 'Insights',
    description: 'Get actionable insights with real-time burn-down charts and performance metrics.'
  },
];

const features = [
  { icon: FiCpu, title: 'AI Content Generator', description: 'Generate user stories, tasks, and documentation with a single click using Groq-powered AI.', color: 'from-indigo-500 to-violet-500' },
  { icon: FiLayers, title: 'Smart Classification', description: 'Auto-tag and categorize tasks by priority, category, and estimated effort intelligently.', color: 'from-violet-500 to-purple-600' },
  { icon: FiTrendingUp, title: 'Sprint Analytics', description: 'Track team velocity with real-time burn-down charts and progress visualizations.', color: 'from-amber-500 to-orange-500' },
  { icon: FiUsers, title: 'Team Collaboration', description: 'Assign tasks, manage roles, and collaborate seamlessly with your entire team.', color: 'from-indigo-500 to-blue-500' },
  { icon: FiShield, title: 'Role-Based Access', description: 'Creator-only edit permissions and assignee-based status control for secure workflows.', color: 'from-emerald-500 to-teal-500' },
  { icon: FiTarget, title: 'Story Points System', description: 'AI-estimated story points that help your team plan accurately every sprint.', color: 'from-pink-500 to-rose-500' },
];

const stats = [
  { value: '10K+', label: 'Projects Managed', icon: FiTarget },
  { value: '500+', label: 'Active Teams', icon: FiUsers },
  { value: '98%', label: 'Satisfaction Rate', icon: FiStar },
  { value: '50K+', label: 'Tasks Completed', icon: FiCheck },
];

const steps = [
  { step: '01', title: 'Create Your Project', description: 'Set up a project with title, framework, description, and team members in under 2 minutes.' },
  { step: '02', title: 'AI Generates Content', description: 'Our AI expands your description, estimates story points, and generates user stories automatically.' },
  { step: '03', title: 'Manage With Kanban', description: 'Use the visual task board to track progress across To Do, In Progress, Review, and Done columns.' },
  { step: '04', title: 'Deliver Faster', description: 'Monitor team performance with real-time analytics and iterate with AI-powered refinements.' },
];

const testimonials = [
  { name: 'Sarah Johnson', role: 'CTO, TechStart Inc.', initial: 'S', quote: 'AgileMind has transformed how our team manages projects. The AI features are genuinely game-changing — we ship 40% faster now.', stars: 5 },
  { name: 'Marcus Chen', role: 'Product Lead, DevFlow', initial: 'M', quote: 'The story generator alone saves us 3 hours every sprint planning session. The task breakdown is incredibly accurate.', stars: 5 },
  { name: 'Priya Patel', role: 'Scrum Master, Agile Corp', initial: 'P', quote: 'Finally a PM tool that speaks our language. The Kanban board with permission controls is exactly what enterprise teams need.', stars: 5 },
];

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Perfect for solo developers and small projects',
    features: ['3 Projects', '5 Team Members', 'Basic AI Features', 'Kanban Board', 'Email Support'],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$12',
    period: 'per month',
    description: 'For growing teams that need more power',
    features: ['Unlimited Projects', 'Unlimited Members', 'Full AI Suite', 'Advanced Analytics', 'Priority Support', 'Custom Workflows'],
    cta: 'Start Free Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'per seat/mo',
    description: 'For large teams with advanced requirements',
    features: ['Everything in Pro', 'SSO / SAML', 'Dedicated Account Manager', 'SLA Guarantee', 'Custom Integrations', 'Audit Logs'],
    cta: 'Contact Sales',
    highlighted: false
  },
];

const faqs = [
  { q: 'How does the AI story generator work?', a: 'Our AI uses Groq to analyze your feature request and generate a structured user story with categorized, prioritized tasks and time estimates. It learns from your history to improve over time.' },
  { q: 'Can I use AgileMind with any framework?', a: 'Yes! AgileMind supports Scrum, Kanban, Agile, Waterfall, and Lean methodologies. You can choose the framework that fits your team best.' },
  { q: 'Who can edit and delete tasks?', a: 'Only the task creator can edit or delete a task. Only the assignee can change the task status. This ensures clear accountability and security.' },
  { q: 'Is there a limit on team members?', a: 'The free plan supports up to 5 team members per project. Pro and Enterprise plans offer unlimited team members with role-based permissions.' },
  { q: 'How accurate is the AI story point estimation?', a: 'Our AI estimates based on description complexity, framework type, and historical data. Teams report ~85% accuracy, which improves as the system learns your team\'s velocity.' },
];

const blogPosts = [
  {
    title: 'How AI is Transforming Project Management',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way teams plan, execute, and deliver projects.',
    category: 'AI & ML',
    date: 'Mar 15, 2026',
    readTime: '5 min read'
  },
  {
    title: 'Mastering Agile Sprint Planning',
    excerpt: 'Learn the best practices for effective sprint planning and how to keep your team aligned throughout the sprint.',
    category: 'Agile',
    date: 'Mar 10, 2026',
    readTime: '7 min read'
  },
  {
    title: '10 Productivity Hacks for Remote Teams',
    excerpt: 'Boost your remote team productivity with these proven strategies and tools that actually work.',
    category: 'Productivity',
    date: 'Mar 5, 2026',
    readTime: '6 min read'
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ─── SECTION 1: HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container-custom relative z-10 pt-20 pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center text-white max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium text-indigo-200 mb-6"
              >
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                {slides[currentSlide].label}
              </motion.div>

              <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                {slides[currentSlide].title}
              </motion.h1>
              <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {slides[currentSlide].subtitle}
              </motion.h1>

              <motion.p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                {slides[currentSlide].description}
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-base">
                  Get Started Free <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/explore" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/25 text-white font-semibold hover:bg-white/20 transition-all duration-300 text-base">
                  <FiPlay className="w-4 h-4" /> Explore Projects
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Slide dots */}
          <div className="flex justify-center gap-2 mt-12">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 h-2.5 bg-amber-400' : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="flex justify-center mt-12">
            <FiChevronDown className="w-6 h-6 text-white/40" />
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 2: STATS BANNER ─── */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="flex items-center justify-center gap-1.5 text-gray-500 text-sm font-medium mt-1">
                  <stat.icon className="w-3.5 h-3.5 text-indigo-400" />
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: FEATURES ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Everything Your Team <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Needs to Ship</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto mt-4 rounded-full" />
            <p className="text-gray-500 max-w-xl mx-auto mt-4 text-lg">
              Powerful AI-driven tools designed to supercharge every stage of your agile workflow.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: HOW IT WORKS ─── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 text-sm font-semibold rounded-full mb-4">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              From Idea to <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Delivery in 4 Steps</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-violet-500 to-purple-500 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200 relative">
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: TESTIMONIALS ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Loved by <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Agile Teams</span> Worldwide
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, s) => (
                    <FiStar key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1 italic mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 6: BLOG / INSIGHTS ─── */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">Blog</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Insights & Tips</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4 rounded-full" />
            <p className="text-gray-500 max-w-xl mx-auto mt-4 text-lg">
              Stay updated with the latest trends in AI and project management.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -6 }}
                className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">{post.category}</span>
                  <span className="text-xs text-gray-400">{post.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FiClock className="w-3.5 h-3.5" /> {post.readTime}
                  </span>
                  <Link href="/blog" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                    Read More <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: FAQ ─── */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Questions</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full" />
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0">
                    <FiChevronDown className="w-5 h-5 text-indigo-500" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}