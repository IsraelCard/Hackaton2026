import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ZONAS, predecir, PredictionResult, TomTomIncident } from './constants';
import { getTrafficPrediction, AIResponse } from './services/geminiService';

// Modular Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AnalysisResults from './components/AnalysisResults';
import { EmptyState, LoadingState, ErrorState } from './components/StatusViews';
import MapExpansion from './components/MapExpansion';

export default function App() {
  // State
  const [zone, setZone] = useState(Object.keys(ZONAS)[0]);
  const [hour, setHour] = useState(new Date().getHours());
  const [isTomorrow, setIsTomorrow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    analysis: AIResponse,
    data: PredictionResult & { incidentes: TomTomIncident[], fecha_consulta: string }
  } | null>(null);

  // Constants
  const todayStr = new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  // Initialization
  useEffect(() => {
    handlePredict();
    // System Theme Detection
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
    }
  }, []);

  // Sync Theme with DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDark]);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predecir(zone, hour, isTomorrow);
      const prediction = await getTrafficPrediction(data);
      setResult({ analysis: prediction, data });
    } catch (err) {
      console.error(err);
      setError("No se pudo obtener la predicción. Revisa tu conexión o las API keys.");
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center transition-colors duration-300">
      <AnimatePresence>
        {isMapExpanded && result && (
          <MapExpansion result={result} setIsMapExpanded={setIsMapExpanded} />
        )}
      </AnimatePresence>

      <Header todayStr={todayStr} isDark={isDark} toggleTheme={toggleTheme} />

      <main className="max-w-7xl w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Sidebar 
          zone={zone}
          setZone={setZone}
          hour={hour}
          setHour={setHour}
          isTomorrow={isTomorrow}
          setIsTomorrow={setIsTomorrow}
          loading={loading}
          handlePredict={handlePredict}
        />

        <div className="lg:col-span-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingState key="loading" />
            ) : error ? (
              <ErrorState key="error" message={error} />
            ) : result ? (
              <AnalysisResults key="result" result={result} setIsMapExpanded={setIsMapExpanded} />
            ) : (
              <EmptyState key="empty" />
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full max-w-7xl mt-12 py-12 border-t border-zinc-200 dark:border-zinc-800 px-6 flex flex-col md:flex-row justify-between items-center gap-6 transition-colors">
        <p className="text-zinc-400 dark:text-zinc-500 text-xs font-medium">© 2026 TráficoQro • Predicción Inteligente de Movilidad.</p>
        <div className="flex gap-8">
          <a
            href="https://developer.tomtom.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]"
          >
            TomTom Flow
          </a>
          <a
            href="https://gemini.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]"
          >
            Gemini AI
          </a>
          {/* TODO: reemplazar con el link real del repositorio */}
          <a
            href="#"
            className="text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.2em] cursor-not-allowed"
            title="Repositorio próximamente"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
