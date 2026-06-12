import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center select-none font-sans ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`w-[620px] h-[400px] rounded-2xl shadow-2xl flex flex-col items-center justify-center animate-fade-in relative p-6 ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}>
        
        {/* Logo */}
        <div className={`w-32 h-16 mb-4 flex items-center justify-center ${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'}`}>
            <svg viewBox="0 0 100 40" className="w-full h-full fill-none stroke-current stroke-[2.5]" strokeLinecap="round">
                <path d="M 15 25 C 25 10, 55 10, 75 22" />
                <path d="M 28 14 C 40 4, 65 4, 80 15" />
                <path d="M 75 22 Q 83 23, 85 28 L 85 30 L 15 30 L 12 28 Q 13 25, 15 25 Z" className="opacity-10" />
                <circle cx="28" cy="28" r="4.5" className="stroke-2" />
                <circle cx="70" cy="28" r="4.5" className="stroke-2" />
            </svg>
        </div>

        <h1 className={`text-4xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            flex<span className={`${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'} font-black`}>CAR</span>
        </h1>

        <div className="mt-8 w-full max-w-sm">
            <p className={`text-xs font-mono mb-2 uppercase tracking-wide ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Inicializando sistema...
            </p>
            <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <div className={`h-full animate-progress w-full ${theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
            </div>
        </div>
      </div>
    </div>
  );
}
