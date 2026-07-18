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

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 text-gray-300"
    >
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-lg mb-4">
              <span className="text-indigo-400">Agile</span>
              <span className="text-violet-400">Mind</span>{' '}
              <span className="text-amber-400">AI</span>
            </h3>
            <p className="text-sm leading-relaxed">
              AI-powered project management tool helping teams deliver faster with smart automation and insights.
            </p>
            <div className="flex space-x-4 mt-4">
              {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
                <motion.a key={i} href="#" whileHover={{ y: -3, scale: 1.15 }} className="hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ai" className="hover:text-white transition-colors">AI Content Generator</Link></li>
              <li><Link href="/ai" className="hover:text-white transition-colors">Smart Classification</Link></li>
              <li><Link href="/ai" className="hover:text-white transition-colors">Chat Assistant</Link></li>
              <li><Link href="/explore" className="hover:text-white transition-colors">Project Templates</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>support@agilemind.ai</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {currentYear} AgileMind AI. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 md:mt-0">
            Made with <FiHeart className="text-red-500 w-4 h-4" /> for agile teams
          </p>
        </div>
      </div>
    </motion.footer>
  );
}