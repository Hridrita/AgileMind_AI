import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center select-none">
      
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
        <h1 className="text-9xl font-extrabold text-indigo-500/20 tracking-widest font-mono">
          404
        </h1>
        <svg
          className="w-20 h-20 text-indigo-500 absolute drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 21l8.904-4.473L21 21l-1.187-5.096A9.005 9.005 0 0021 12a9 9 0 10-9 9 9.005 9.005 0 004.813-1.404z"
          />
        </svg>
      </div>

     
      <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight sm:text-4xl mb-3">
        Unknown Agent Destination
      </h1>
      <p className="text-base text-slate-400 max-w-md mx-auto mb-8">
        The route you are trying to access does not exist or has been relocated by the core matrix. Let's get you back on track.
      </p>

      
      <div>
        <Link
          href="/"
          className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 duration-200"
        >
          Return to Home
        </Link>
      </div>

     
      <p className="mt-16 text-xs text-slate-600 tracking-wider uppercase">
        AgileMind AI • Routing Framework
      </p>
    </div>
  );
}