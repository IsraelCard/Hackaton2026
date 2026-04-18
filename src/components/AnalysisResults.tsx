import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, CalendarDays, AlertTriangle, Zap, Clock, ExternalLink, Car, ChevronDown, Wifi, WifiOff } from 'lucide-react';
import TrafficMap from './TrafficMap';
import { ZONAS } from '../constants';
import { cn } from '../lib/utils';
import { AIResponse } from '../services/geminiService';
import { PredictionResult, TomTomIncident } from '../constants';

interface AnalysisResultsProps {
  result: { analysis: AIResponse, data: PredictionResult & { incidentes: TomTomIncident[], fecha_consulta: string } };
  setIsMapExpanded: (v: boolean) => void;
}

export default function AnalysisResults({ result, setIsMapExpanded }: AnalysisResultsProps) {
  const [showSensors, setShowSensors] = useState(false);
  const tt = result.data.datos_tomtom;
  const hasLiveData = tt.currentSpeed !== null && tt.freeFlowSpeed !== null;

  return (
    <motion.div
      key="result-active"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Visual Map Header */}
      <div className="bg-zinc-900 rounded-[40px] overflow-hidden relative border border-zinc-200 dark:border-zinc-800 shadow-2xl h-[400px] group">
        <TrafficMap center={ZONAS[result.data.zona]} zoom={14} interactive={false} />

        {/* Hover overlay — expandir mapa */}
        <div
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-20"
          onClick={(e) => { e.stopPropagation(); setIsMapExpanded(true); }}
        >
          <div className="bg-white/20 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">
            <ExternalLink size={16} />
            Expandir Mapa
          </div>
        </div>

        {/* Gradiente inferior para legibilidad */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

        {/* Arriba-izquierda: fecha y festivo */}
        <div className="absolute top-5 left-5 flex gap-2 z-30">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <CalendarDays size={13} className="text-blue-400" />
            <span className="text-[11px] font-bold text-white">{result.data.fecha_consulta}</span>
          </div>
          {result.data.es_festivo && (
            <div className="bg-amber-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
              <AlertTriangle size={13} className="text-white" />
              <span className="text-[11px] font-bold text-white">Festivo</span>
            </div>
          )}
        </div>

        {/* Arriba-derecha: score */}
        <div className="absolute top-5 right-5 z-30">
          <div className="bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <div className="text-right">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Congestión</p>
              <p className="text-xl font-display font-black text-white leading-none">{result.data.score}</p>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-2xl leading-none">{result.data.emoji}</div>
          </div>
        </div>

        {/* Abajo: zona y estado — sobre el gradiente */}
        <div className="absolute bottom-0 left-0 right-0 px-7 pb-6 z-20">
          <div className="flex items-center gap-1.5 text-blue-400 mb-1">
            <MapPin size={13} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Monitoreo en vivo</span>
          </div>
          <h4 className="text-3xl font-display font-black text-white tracking-tight leading-none">
            {result.data.zona}
          </h4>
          <p className="text-sm text-zinc-300 font-medium mt-1">
            {result.data.dia_nombre} · {result.data.hora}:00 hrs · <span className="capitalize">{result.data.descripcion}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Recommendation Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex flex-col h-full transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
              <Zap size={20} />
            </div>
            <h4 className="text-lg font-display font-black text-zinc-950 dark:text-white uppercase tracking-tight">Veredicto Gemini</h4>
          </div>
          <div className="flex-1">
            <p className="text-lg text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed mb-8 italic">
              "{result.analysis?.summary ?? 'Generando veredicto...'}"
            </p>
          </div>
          <div className="flex items-center gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex-1 bg-zinc-950 dark:bg-zinc-800 text-white p-4 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <Clock size={16} className="text-blue-400" />
                 <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Salida Ideal</span>
              </div>
              <span className="text-sm font-black text-blue-400">{result.analysis?.best_time_to_leave ?? '--:--'}</span>
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 px-6 py-4 rounded-2xl flex flex-col items-center">
              <span className="text-[9px] font-black text-zinc-400 dark:text-zinc-500 uppercase mb-1">Riesgo</span>
              <div className="flex gap-1">
                {(() => {
                  const level = result.analysis?.risk_level ?? 3;
                  return [1, 2, 3, 4, 5].map((l) => (
                    <div key={l} className={cn("w-1.5 h-3 rounded-full", l <= level ? "bg-red-500" : "bg-zinc-300 dark:bg-zinc-700")} />
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Grounding & Events */}
        <div className="bg-zinc-950 dark:bg-black rounded-[40px] p-8 text-white flex flex-col h-full shadow-2xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px]" />
          <div className="flex items-center gap-3 mb-8">
            <CalendarDays size={20} className="text-blue-500" />
            <h4 className="text-lg font-display font-black uppercase tracking-tight">Eventos y Reportes</h4>
          </div>
          
          <div className="flex-1 space-y-4">
            {result.analysis?.detected_events?.length ? result.analysis.detected_events.map((e, i) => (
              <div key={`event-${i}`} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <p className="text-sm font-medium text-zinc-300 leading-snug">{e}</p>
              </div>
            )) : (
              <div className="text-center py-10 opacity-30 flex flex-col items-center">
                <Car size={32} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Sin reportes externos</p>
              </div>
            )}
          </div>
          
          <AnimatePresence>
            {showSensors && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Velocidad actual</p>
                    <p className="text-xl font-black text-white">{hasLiveData ? `${tt.currentSpeed} km/h` : 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Flujo libre</p>
                    <p className="text-xl font-black text-white">{hasLiveData ? `${tt.freeFlowSpeed} km/h` : 'N/A'}</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Confianza</p>
                    <p className="text-xl font-black text-white">{Math.round(tt.confidence * 100)}%</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Cierre vial</p>
                    <p className={cn("text-xl font-black", tt.roadClosure ? "text-red-400" : "text-emerald-400")}>
                      {tt.roadClosure ? 'Sí' : 'No'}
                    </p>
                  </div>
                  {result.data.incidentes?.length > 0 && (
                    <div className="col-span-2 bg-white/5 rounded-2xl p-4">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Incidentes ({result.data.incidentes.length})</p>
                      <div className="space-y-1">
                        {result.data.incidentes.map((inc, i) => (
                          <p key={inc.id || `inc-${i}`} className="text-xs text-zinc-400">{inc.description || inc.type} {inc.delay > 0 ? `· ${Math.round(inc.delay / 60)} min` : ''}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <button
              onClick={() => setShowSensors(!showSensors)}
              className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white hover:bg-white/5 px-3 py-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-white/20 active:scale-95"
            >
              {hasLiveData ? <Wifi size={12} /> : <WifiOff size={12} />}
              DETALLES DE SENSORES
              <ChevronDown size={12} className={cn("transition-transform duration-200", showSensors && "rotate-180")} />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <div className={cn("w-1 h-1 rounded-full animate-pulse", hasLiveData ? "bg-emerald-500" : "bg-zinc-600")} />
              <span className="text-[9px] font-bold text-zinc-400">{hasLiveData ? 'TomTom Live' : 'Sin señal'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
