'use client'; 

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    
    console.error('App Error Hooked:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center select-none">
     
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <svg
          className="w-24 h-24 text-indigo-500 animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

     
      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight sm:text-5xl mb-3">
        System Node Misalignment
      </h1>
      <p className="text-lg text-slate-400 max-w-md mx-auto mb-8">
        Oops! AgileMind AI encountered an unexpected glitch while processing your request. Don't worry, our digital agents are on it.
      </p>

      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
       
        <button
          onClick={() => reset()}
          className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 duration-200"
        >
          Try Reloading Page
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:bg-slate-850 hover:text-white rounded-xl transition-all active:scale-95 duration-200"
        >
          Back to Dashboard
        </Link>
      </div>

      
      <p className="mt-16 text-xs text-slate-600 tracking-wider uppercase">
        AgileMind AI • Error Reference: Core_Fault_Handler
      </p>
    </div>
  );
}