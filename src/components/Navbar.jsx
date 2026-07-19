'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
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
  const pathname = usePathname();

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
      <nav className="fixed top-0 w-full z-50 h-16 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="container-custom h-full">
          <div className="flex items-center h-full">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
                <span className="text-white font-extrabold text-sm tracking-tight">AI</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
                AgileMind AI
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 h-16 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-lg shadow-slate-900/5'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="container-custom h-full">
        <div className="flex items-center justify-between h-full">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-300/40"
            >
              <span className="text-white font-extrabold text-sm tracking-tight">AI</span>
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent select-none">
              AgileMind AI
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-indigo-50 ring-1 ring-indigo-100"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <link.icon className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}

            {isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3.5 py-2 ml-1 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50/80 transition-all duration-200 ring-1 ring-transparent hover:ring-rose-100"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            )}
          </div>

          {/* ── Mobile Menu Toggle ── */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FiX className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <FiMenu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/70 shadow-xl shadow-slate-900/10 overflow-hidden"
          >
            <div className="container-custom py-3 flex flex-col gap-1">
              {navLinks.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.045, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150
                        ${isActive
                          ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                        }`}
                    >
                      <link.icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {isAuthenticated && (
                <motion.div
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navLinks.length * 0.045, duration: 0.2 }}
                  className="pt-1 mt-1 border-t border-slate-100"
                >
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50/70 transition-all duration-150"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}