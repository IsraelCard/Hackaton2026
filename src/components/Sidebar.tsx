import React from 'react';
import { MapPin, Clock, Zap, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { ZONAS, HOURS } from '../constants';

interface SidebarProps {
  zone: string;
  setZone: (z: string) => void;
  hour: number;
  setHour: (h: number) => void;
  isTomorrow: boolean;
  setIsTomorrow: (t: boolean) => void;
  loading: boolean;
  handlePredict: () => void;
}

export default function Sidebar({ 
  zone, setZone, hour, setHour, isTomorrow, setIsTomorrow, loading, handlePredict 
}: SidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-6">
      <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-8 shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-zinc-950 dark:text-white mb-1">Configuración</h2>
          <p className="text-zinc-400 dark:text-zinc-500 text-sm">Ajusta los parámetros de tu viaje.</p>
        </div>

        <div className="space-y-6">
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 rounded-2xl">
            <button
              onClick={() => setIsTomorrow(false)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                !isTomorrow ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Hoy
            </button>
            <button
              onClick={() => setIsTomorrow(true)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                isTomorrow ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              Mañana
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Zona</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer text-zinc-950 dark:text-zinc-100"
              >
                {Object.keys(ZONAS).map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Hora estimadas</label>
            <div className="relative">
              <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600" />
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value))}
                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer text-zinc-950 dark:text-zinc-100"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}:00 hrs</option>
                ))}
              </select>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} />}
            {loading ? "Calculando..." : "Consultar Ahora"}
          </motion.button>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors">
        <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4">Leyenda de Score</h3>
        <div className="space-y-3">
          {[
            { range: "0.0 - 0.35", label: "Libre", color: "bg-emerald-500", desc: "Tránsito fluido, velocidad máxima." },
            { range: "0.35 - 0.65", label: "Moderado", color: "bg-amber-500", desc: "Retrasos ligeros, tráfico común." },
            { range: "0.65 - 1.0", label: "Pesado", color: "bg-red-500", desc: "Congestión alta, evitar zona." }
          ].map((item) => (
            <div key={item.label} className="flex gap-4">
              <div className={cn("w-1.5 h-10 rounded-full shrink-0", item.color)} />
              <div>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">{item.label}</span>
                  <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500">{item.range}</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-500 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
