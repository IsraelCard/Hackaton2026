import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Zap, AlertTriangle } from 'lucide-react';

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-20 flex flex-col items-center justify-center text-center opacity-60 min-h-[600px] transition-colors"
    >
      <div className="w-20 h-20 bg-zinc-200 dark:bg-zinc-800 rounded-3xl flex items-center justify-center mb-6">
        <MapPin className="text-zinc-400 dark:text-zinc-600" size={32} />
      </div>
      <h3 className="text-2xl font-display font-bold text-zinc-900 dark:text-white mb-2">Selecciona un punto</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">Configura la zona y consulta para ver el estado del tráfico en tiempo real asistido por IA.</p>
    </motion.div>
  );
}

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-200 dark:border-zinc-800 p-12 min-h-[600px] flex flex-col items-center justify-center text-center transition-colors shadow-sm"
    >
      <div className="relative w-44 h-44 mb-10 flex items-center justify-center">
        {/* Todo el spinner gira junto */}
        <div className="absolute inset-0 animate-spin">
          {/* Cuadrado exterior */}
          <div className="absolute inset-0 border-[6px] border-blue-600 rounded-[48px]" />
          {/* Cuadrado intermedio punteado */}
          <div className="absolute inset-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-[38px]" />
          {/* Cuadrado interior con hueco */}
          <div className="absolute inset-8 border-[6px] border-blue-600 rounded-[30px] border-t-transparent" />
          {/* Fondo que tapa el hueco sin girar visualmente */}
          <div className="absolute inset-8 border-8 border-zinc-100 dark:border-zinc-800 rounded-[30px] -z-10" />
        </div>
        {/* Icono central fijo — fuera del div que gira */}
        <Zap className="text-blue-600 animate-pulse" size={32} />
      </div>
      <h3 className="text-3xl font-display font-bold text-zinc-950 dark:text-white mb-2">Analizando Datos</h3>
      <p className="text-zinc-500 dark:text-zinc-400 font-medium font-sans">Cruzando información de TomTom API con reportes locales...</p>
    </motion.div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-zinc-900 rounded-[40px] border border-red-200 dark:border-red-900/50 p-12 min-h-[600px] flex flex-col items-center justify-center text-center transition-colors shadow-sm"
    >
      <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mb-6">
        <AlertTriangle size={36} />
      </div>
      <h3 className="text-2xl font-display font-bold text-zinc-950 dark:text-white mb-2">Error al consultar</h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">{message}</p>
    </motion.div>
  );
}
