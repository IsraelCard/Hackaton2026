import React from 'react';
import { Car, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  todayStr: string;
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Header({ todayStr, isDark, toggleTheme }: HeaderProps) {
  return (
    <nav className="w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-4 px-8 flex justify-between items-center sticky top-0 z-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Car className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-black text-zinc-950 dark:text-white tracking-tight leading-none mb-1">
            Tráfico<span className="text-blue-600">Qro.</span>
          </h1>
          <p className="text-[10px] font-black text-blue-600/50 uppercase tracking-widest pl-0.5">Build v1.5.0</p>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Fecha Actual</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 capitalize">{todayStr}</p>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
          title={isDark ? "Modo Día" : "Modo Noche"}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
