'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { authClient } from '@/lib/auth-client';
import { 
  FiHome, 
  FiSearch, 
  FiPlus, 
  FiList, 
  FiUser, 
  FiLogOut,
  FiMenu,
  FiX,
  FiCpu
} from 'react-icons/fi';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
    setIsMenuOpen(false);
  };

  // core logic: logged in -> full routes, logged out -> only 3 routes
  const isAuthenticated = !!session;

  const navLinks = isAuthenticated ? [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/explore', label: 'Explore', icon: FiSearch },
    { href: '/items/add', label: 'Add Item', icon: FiPlus },
    { href: '/items/manage', label: 'Manage', icon: FiList },
    { href: '/ai', label: 'AI Tools', icon: FiCpu },
  ] : [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/explore', label: 'Explore', icon: FiSearch },
    { href: '/login', label: 'Login', icon: FiUser },
  ];

  if (isPending) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white shadow-md">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg"></div>
              <span className="font-bold text-xl">
                <span className="text-indigo-600">Agile</span>
                <span className="text-violet-600">Mind</span>{' '}
                <span className="text-amber-500">AI</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">AI</span>
            </motion.div>
            <span className="font-bold text-xl">
              <span className="text-indigo-600">Agile</span>
              <span className="text-violet-600">Mind</span>{' '}
              <span className="text-amber-500">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>

          {/* Mobile Btn */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t overflow-hidden"
            >
              <div className="flex flex-col space-y-2 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100"
                    >
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 w-full"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}