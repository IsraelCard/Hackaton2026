import React, { useState } from 'react';
import { MapPin, Clock, Zap, Loader2, ChevronDown, Wifi, WifiOff, AlertTriangle, Map } from 'lucide-react';
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
  const [legendOpen, setLegendOpen] = useState(false);

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
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 active:scale-95",
                !isTomorrow ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Hoy
            </button>
            <button
              onClick={() => setIsTomorrow(true)}
              className={cn(
                "flex-1 py-3 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 active:scale-95",
                isTomorrow ? "bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              )}
            >
              Mañana
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Zona</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
              <select
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer text-zinc-950 dark:text-zinc-100"
              >
                {Object.keys(ZONAS).map((z) => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Hora estimada</label>
            <div className="relative">
              <Clock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
              <select
                value={hour}
                onChange={(e) => setHour(parseInt(e.target.value))}
                className="w-full pl-12 pr-10 py-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm font-bold appearance-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer text-zinc-950 dark:text-zinc-100"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{h}:00 hrs</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handlePredict}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed py-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={18} />}
            {loading ? "Calculando..." : "Consultar Ahora"}
          </motion.button>
        </div>
      </section>

      <section className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-zinc-200 dark:border-zinc-800 transition-colors overflow-hidden">
        <button
          onClick={() => setLegendOpen(!legendOpen)}
          className="w-full flex items-center justify-between px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:ring-inset"
        >
          <h3 className="text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">Leyenda</h3>
          <ChevronDown size={15} className={cn("text-zinc-400 dark:text-zinc-600 transition-transform duration-300", legendOpen && "rotate-180")} />
        </button>

        <motion.div
          initial={false}
          animate={{ height: legendOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
        <div className="px-6 pb-6 space-y-5">

        {/* Score de congestión */}
        <div>
          <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Score de congestión</p>
          <div className="space-y-3">
            {[
              { range: "0.0–0.35", label: "Libre", color: "bg-emerald-500", desc: "Tránsito fluido, velocidad máxima." },
              { range: "0.35–0.65", label: "Moderado", color: "bg-amber-500", desc: "Retrasos ligeros, tráfico común." },
              { range: "0.65–1.0", label: "Pesado", color: "bg-red-500", desc: "Congestión alta, evitar zona." },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <div className={cn("w-1.5 h-10 rounded-full shrink-0", item.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">{item.label}</span>
                    <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 tabular-nums">{item.range}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Colores del mapa */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Map size={10} />
            Capas del mapa
          </p>
          <div className="space-y-2">
            {[
              { color: "bg-emerald-500", label: "Fluido", desc: "Velocidad cercana al límite." },
              { color: "bg-amber-500", label: "Lento", desc: "Velocidad reducida, demora leve." },
              { color: "bg-red-600", label: "Congestionado", desc: "Velocidad muy baja o detenido." },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={cn("w-5 h-1.5 rounded-full shrink-0", item.color)} />
                <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 w-24 shrink-0">{item.label}</span>
                <span className="text-[10px] text-zinc-500 leading-tight">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sensor TomTom */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Señal del sensor</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                <Wifi size={14} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">Datos en vivo</p>
                <p className="text-[10px] text-zinc-500 leading-tight">Velocidad real de TomTom activa.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <WifiOff size={14} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">Sin señal</p>
                <p className="text-[10px] text-zinc-500 leading-tight">Predicción basada en histórico.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores especiales */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Indicadores</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
                <AlertTriangle size={14} className="text-amber-500" />
              </div>
              <div>
                <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">Día festivo</p>
                <p className="text-[10px] text-zinc-500 leading-tight">Tráfico atípico esperado.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                <Zap size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[11px] font-black text-zinc-900 dark:text-zinc-100">Veredicto Gemini</p>
                <p className="text-[10px] text-zinc-500 leading-tight">Análisis de IA con contexto local.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nivel de riesgo */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-3">Nivel de riesgo</p>
          <div className="space-y-2">
            {[
              { label: "Bajo", bars: 2, desc: "Condiciones favorables." },
              { label: "Moderado", bars: 3, desc: "Precaución recomendada." },
              { label: "Alto", bars: 5, desc: "Evitar si es posible." },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((l) => (
                    <div key={l} className={cn("w-1.5 h-3 rounded-full", l <= item.bars ? "bg-red-500" : "bg-zinc-200 dark:bg-zinc-700")} />
                  ))}
                </div>
                <span className="text-[11px] font-black text-zinc-900 dark:text-zinc-100 w-16 shrink-0">{item.label}</span>
                <span className="text-[10px] text-zinc-500 leading-tight">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
        </div>
        </motion.div>
      </section>
    </div>
  );
}
