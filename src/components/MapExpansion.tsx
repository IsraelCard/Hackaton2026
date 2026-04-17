import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import TrafficMap from './TrafficMap';
import { ZONAS } from '../constants';

interface MapExpansionProps {
  result: { data: { zona: string } };
  setIsMapExpanded: (v: boolean) => void;
}

export default function MapExpansion({ result, setIsMapExpanded }: MapExpansionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl p-4 md:p-10 flex flex-col items-center justify-center"
      onClick={() => setIsMapExpanded(false)}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-6xl aspect-video bg-zinc-900 rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <TrafficMap center={ZONAS[result.data.zona]} zoom={15} />
        
        <div className="absolute bottom-10 left-10 flex items-center gap-3">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-5 rounded-3xl">
            <h4 className="text-white font-display font-black text-3xl mb-1">{result.data.zona}</h4>
            <p className="text-zinc-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <MapPin size={14} className="text-blue-500" />
              Vista Detallada de Red Vial
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsMapExpanded(false)}
          className="absolute top-8 right-8 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white transition-all text-2xl"
        >
          ×
        </button>
      </motion.div>
      <p className="mt-8 text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">Cerrar haciendo click afuera o en el botón</p>
    </motion.div>
  );
}
