'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiGithub, 
  FiTwitter, 
  FiLinkedin, 
  FiMail, 
  FiMapPin,
  FiPhone,
  FiHeart
} from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: FiGithub,   label: 'GitHub',   color: 'hover:text-white hover:bg-slate-700' },
    { Icon: FiTwitter,  label: 'Twitter',  color: 'hover:text-sky-400 hover:bg-sky-400/10' },
    { Icon: FiLinkedin, label: 'LinkedIn', color: 'hover:text-blue-400 hover:bg-blue-400/10' },
  ];

  const columnHeadingClass =
    'text-white font-semibold text-sm uppercase tracking-wider mb-5';
  const linkClass =
    'text-slate-400 hover:text-white transition-colors duration-200 text-sm leading-relaxed';

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-slate-900 text-slate-400 relative"
    >
      {/* Gradient accent line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-amber-400" />

      {/* Top border subtle */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-14">

          {/* 4-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* About */}
            <div className="space-y-5">
              {/* Logo */}
              <div>
                <h3 className="font-extrabold text-xl tracking-tight">
                  <span className="text-indigo-400">Agile</span>
                  <span className="text-violet-400">Mind</span>{' '}
                  <span className="text-amber-400">AI</span>
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-medium">
                  Intelligent Project Management
                </p>
              </div>

              {/* Tagline */}
              <p className="text-sm leading-relaxed text-slate-400">
                AI-powered project management tool helping teams deliver faster with smart automation and insights.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3 pt-1">
                {socialLinks.map(({ Icon, label, color }, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    aria-label={label}
                    whileHover={{ scale: 1.18, y: -2 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 ${color} transition-all duration-200`}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className={columnHeadingClass}>Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/explore" className={linkClass}>Explore</Link></li>
                <li><Link href="/about"   className={linkClass}>About Us</Link></li>
                <li><Link href="/contact" className={linkClass}>Contact</Link></li>
                <li><Link href="/blog"    className={linkClass}>Blog</Link></li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className={columnHeadingClass}>Features</h4>
              <ul className="space-y-3">
                <li><Link href="/ai"      className={linkClass}>AI Content Generator</Link></li>
                <li><Link href="/ai"      className={linkClass}>Smart Classification</Link></li>
                <li><Link href="/ai"      className={linkClass}>Chat Assistant</Link></li>
                <li><Link href="/explore" className={linkClass}>Project Templates</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className={columnHeadingClass}>Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <FiMail className="w-3.5 h-3.5 text-indigo-400" />
                  </span>
                  <span className="text-sm text-slate-400">support@agilemind.ai</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <FiPhone className="w-3.5 h-3.5 text-violet-400" />
                  </span>
                  <span className="text-sm text-slate-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <FiMapPin className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <span className="text-sm text-slate-400">San Francisco, CA</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 mt-12 pt-7 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-500">
            <p>
              &copy; {currentYear}{' '}
              <span className="text-slate-400 font-medium">AgileMind AI</span>. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5">
              Made with{' '}
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <FiHeart className="text-red-500 w-4 h-4 fill-red-500" />
              </motion.span>{' '}
              for agile teams
            </p>
          </div>

        </div>
      </div>
    </motion.footer>
  );
}