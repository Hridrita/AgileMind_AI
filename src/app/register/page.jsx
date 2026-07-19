"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { FaLock, FaRegUser, FaGoogle } from "react-icons/fa";
import { CiMail } from "react-icons/ci";
import { FiCpu, FiCheck, FiZap } from "react-icons/fi";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        setError(error.message || "Registration failed");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ─── LEFT: Brand Panel ─── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px'}} aria-hidden="true" />
        
        {/* Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FiCpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">AgileMind</span>
          </Link>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Start shipping,<br />
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">not just planning.</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed mb-10">
            Create your workspace in under 2 minutes — AI handles the sprint planning from day one.
          </p>

          <div className="relative h-48">
            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -6 }}
              animate={{ opacity: 1, y: [0, -8, 0], rotate: -6 }}
              transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, opacity: { duration: 0.6 } }}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 absolute left-0 top-0 w-44 shadow-xl"
            >
              <div className="text-[10px] uppercase tracking-wide text-indigo-300 font-semibold mb-2">Backlog</div>
              <div className="text-sm text-white font-medium mb-1">Onboarding flow v2</div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><FiZap className="w-3 h-3 text-amber-400" /> 3 pts</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 4 }}
              animate={{ opacity: 1, y: [0, 8, 0], rotate: 4 }}
              transition={{ y: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }, opacity: { duration: 0.6, delay: 0.2 } }}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 absolute right-0 top-10 w-44 shadow-xl"
            >
              <div className="text-[10px] uppercase tracking-wide text-emerald-300 font-semibold mb-2">Done</div>
              <div className="text-sm text-white font-medium mb-1">Workspace setup</div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><FiCheck className="w-3 h-3 text-emerald-400" /> Merged</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -2 }}
              animate={{ opacity: 1, y: [0, -6, 0], rotate: -2 }}
              transition={{ y: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }, opacity: { duration: 0.6, delay: 0.4 } }}
              className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 absolute left-8 bottom-0 w-44 shadow-xl"
            >
              <div className="text-[10px] uppercase tracking-wide text-violet-300 font-semibold mb-2">In Progress</div>
              <div className="text-sm text-white font-medium mb-1">Invite your team</div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400"><FiZap className="w-3 h-3 text-amber-400" /> 1 pt</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Form Panel ─── */}
      <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <FaRegUser className="w-6 h-6 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
          <p className="mt-2 text-slate-500">
            Start your journey with AgileMind
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3 pl-11 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
                    placeholder="John Doe"
                  />
                  <FaRegUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3 pl-11 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
                    placeholder="you@example.com"
                  />
                  <CiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 pl-11 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
                    placeholder="Minimum 6 characters"
                  />
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-3 pl-11 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-slate-50 hover:bg-white"
                    placeholder="Confirm your password"
                  />
                  <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              {loading ? "Creating account..." : "Create account"}
            </motion.button>
          </form>

          
            

            
          

          
        </motion.div>
      </div>
    </div>
  );
}