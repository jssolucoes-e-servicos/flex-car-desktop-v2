import React, { useState } from 'react';
import { User } from '../types';
import { seedUsers } from '../data/seedData';
import { useTheme } from '../context/ThemeContext';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { theme } = useTheme();
  const [username, setUsername] = useState('ADMIN');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check seedUsers for match (case-insensitive login)
    const foundUser = seedUsers.find(
      (u) => u.login.toUpperCase() === username.trim().toUpperCase() && u.active
    );

    if (foundUser) {
      onLoginSuccess(foundUser);
    } else {
      setError('Usuário ou senha incorretos ou inativos.');
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-6 ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      <div className={`w-[620px] h-[400px] rounded-2xl shadow-2xl overflow-hidden border flex flex-col sm:flex-row ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        
        {/* Left Side: Brand Logo */}
        <div className={`w-full sm:w-1/2 p-8 flex flex-col justify-center items-center ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
          <div className={`w-24 h-12 mb-4 flex items-center justify-center ${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'}`}>
            <svg viewBox="0 0 100 40" className="w-full h-full fill-none stroke-current stroke-[2.5]" strokeLinecap="round">
              <path d="M 15 25 C 25 10, 55 10, 75 22" />
              <path d="M 28 14 C 40 4, 65 4, 80 15" />
              <path d="M 75 22 Q 83 23, 85 28 L 85 30 L 15 30 L 12 28 Q 13 25, 15 25 Z" className="opacity-10" />
              <circle cx="28" cy="28" r="4.5" className="stroke-2" />
              <circle cx="70" cy="28" r="4.5" className="stroke-2" />
            </svg>
          </div>
          
          <h1 className={`text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            flex<span className={`${theme === 'dark' ? 'text-blue-500' : 'text-blue-600'} font-black`}>CAR</span>
          </h1>
          <p className={`text-xs mt-2 uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            Micro CRM
          </p>
        </div>

        {/* Right Side: Credentials Input Form */}
        <div className="w-full sm:w-1/2 bg-white p-8 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-center text-xl font-black text-[#00a2ff] tracking-wider uppercase border-b-2 border-[#00a2ff]/20 pb-2">
              IDENTIFIQUE-SE
            </h2>
          </div>

            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: ADMIN"
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                required
              />
            </div>

            {error && (
              <p className={`text-xs font-semibold p-3 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                {error}
              </p>
            )}

            <button
              id="login_btn"
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-900/20 transition-all transform active:scale-95"
            >
              ENTRAR
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[10px] text-neutral-400 font-mono uppercase">
              Dica: Usuário <span className="text-neutral-700 font-bold">ADMIN</span>, Senha qualquer
            </p>
          </div>
        </div>
      </div>

      {/* Outer App Environment watermark/credit */}
      <div className="absolute bottom-4 text-center font-mono text-[10px] text-neutral-500">
        <p>flexCar | Micro CRM - Emulador Desktop VCL</p>
        <p className="text-neutral-600 mt-0.5">Versão de Web Containers • 2026</p>
      </div>
    </div>
  );
}
