import tt from '@tomtom-international/web-sdk-maps';
import { services } from '@tomtom-international/web-sdk-services';
import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

// Using process.env for consistency with existing project vars
const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;

interface TrafficMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  interactive?: boolean;
}

export default function TrafficMap({ center, zoom = 13, interactive = true }: TrafficMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<tt.Map | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    if (!TOMTOM_API_KEY) {
      setError('Configuración requerida: TOMTOM_API_KEY');
      return;
    }

    // Initialize map
    const ttMap = tt.map({
      key: TOMTOM_API_KEY,
      container: mapElement.current,
      center: [center.lng, center.lat],
      zoom: zoom,
      stylesVisibility: {
        trafficIncidents: true,
        trafficFlow: true,
      },
      interactive: interactive
    });

    if (interactive) {
      ttMap.addControl(new tt.FullscreenControl());
      ttMap.addControl(new tt.NavigationControl());
    }

    map.current = ttMap;

    return () => {
      ttMap.remove();
    };
  }, []);

  // Update center when props change
  useEffect(() => {
    if (map.current) {
      map.current.setCenter([center.lng, center.lat]);
    }
  }, [center]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900 dark:bg-black">
      <div ref={mapElement} className="w-full h-full" style={{ minHeight: '300px' }} />

      <AnimatePresence>
        {error && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Error de Configuración</h2>
              <p className="text-neutral-500 mb-6">{error}</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Map Legend (Overlay) */}
      <div className="absolute bottom-4 right-4 z-40 bg-zinc-950/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg p-3 px-4 flex gap-4 text-[9px] font-mono uppercase tracking-wider font-bold text-white">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-1 bg-emerald-500 rounded-full" />
          <span>Fluido</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-1 bg-amber-500 rounded-full" />
          <span>Medio</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-1 bg-red-600 rounded-full" />
          <span>Lento</span>
        </div>
      </div>
    </div>
  );
}
