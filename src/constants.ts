export const ZONAS: Record<string, { lat: number; lng: number }> = {
  "Centro Histórico": { lat: 20.5886, lng: -100.3899 },
  "Blvd. Bernardo Quintana": { lat: 20.6011, lng: -100.4155 },
  "Constituyentes": { lat: 20.5780, lng: -100.4020 },
  "Corregidora": { lat: 20.5560, lng: -100.3920 },
  "Juriquilla": { lat: 20.7010, lng: -100.4410 },
  "El Marqués": { lat: 20.5230, lng: -100.3400 },
  "Periferico": { lat: 20.6200, lng: -100.4300 },
};

export const DIAS_FESTIVOS = new Set([
  "01-01", "02-03", "03-17", "04-17", "04-18",
  "05-01", "05-05", "09-16", "11-02", "11-17",
  "12-12", "12-25",
]);

export const PATRONES: Record<string, Record<number, number>> = {
  LABORAL: {
    0: 0.3, 1: 0.2, 2: 0.2, 3: 0.2, 4: 0.3, 5: 0.5, 6: 0.7, 7: 1.0, 8: 1.0, 9: 0.8,
    10: 0.6, 11: 0.6, 12: 0.7, 13: 0.8, 14: 0.7, 15: 0.6, 16: 0.7, 17: 0.9, 18: 1.0, 19: 0.9,
    20: 0.7, 21: 0.5, 22: 0.4, 23: 0.3,
  },
  SABADO: {
    0: 0.3, 1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.3, 6: 0.4, 7: 0.5, 8: 0.6, 9: 0.7,
    10: 0.8, 11: 0.8, 12: 0.8, 13: 0.7, 14: 0.6, 15: 0.6, 16: 0.6, 17: 0.7, 18: 0.7, 19: 0.6,
    20: 0.5, 21: 0.4, 22: 0.4, 23: 0.3,
  },
  DOMINGO: {
    0: 0.2, 1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.2, 6: 0.3, 7: 0.4, 8: 0.5, 9: 0.5,
    10: 0.5, 11: 0.5, 12: 0.5, 13: 0.5, 14: 0.4, 15: 0.4, 16: 0.4, 17: 0.4, 18: 0.5, 19: 0.4,
    20: 0.3, 21: 0.3, 22: 0.3, 23: 0.2,
  },
};

export interface TomTomData {
  currentSpeed: number | null;
  freeFlowSpeed: number | null;
  confidence: number;
  roadClosure: boolean;
}

export interface PredictionResult {
  score: number;
  nivel: 'LIBRE' | 'MODERADO' | 'ALTO';
  emoji: string;
  descripcion: string;
  tipo_dia: string;
  multiplicador: number;
  datos_tomtom: TomTomData;
  zona: string;
  hora: number;
  dia_nombre: string;
  es_festivo: boolean;
}

export const DAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export async function obtener_datos_tomtom(lat: number, lng: number): Promise<TomTomData> {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey || apiKey === "MY_TOMTOM_API_KEY") {
    return { currentSpeed: null, freeFlowSpeed: null, confidence: 0, roadClosure: false };
  }

  const url = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lng}&key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('TomTom API error');
    const data = await response.json();
    const flow = data.flowSegmentData;
    return {
      currentSpeed: flow.currentSpeed,
      freeFlowSpeed: flow.freeFlowSpeed,
      confidence: flow.confidence,
      roadClosure: flow.roadClosure,
    };
  } catch (error) {
    console.warn("Falling back to historical data", error);
    return {
      currentSpeed: null,
      freeFlowSpeed: null,
      confidence: 0.0,
      roadClosure: false,
    };
  }
}

export function calcular_score(
  tomtom: TomTomData,
  hora: number,
  dia_semana: number,
  es_festivo: boolean
) {
  let tipo_dia = "";
  if (es_festivo || dia_semana === 0) {
    tipo_dia = "DOMINGO";
  } else if (dia_semana === 6) {
    tipo_dia = "SABADO";
  } else {
    tipo_dia = "LABORAL";
  }

  const multiplicador_hist = PATRONES[tipo_dia][hora];
  let score = 0;

  // Blending formula: (RealTime * Weight) + (Historical * (1 - Weight))
  // Weight is based on TomTom confidence.
  if (tomtom.currentSpeed !== null && tomtom.freeFlowSpeed !== null && tomtom.confidence > 0) {
    let congestion_real = 1 - (tomtom.currentSpeed / tomtom.freeFlowSpeed);
    congestion_real = Math.max(0.0, Math.min(1.0, congestion_real));
    
    // We trust TomTom data up to 80% if confidence is 1.0
    const weight = tomtom.confidence * 0.8;
    score = (congestion_real * weight) + (multiplicador_hist * (1 - weight));
  } else {
    // Fallback purely to historical
    score = multiplicador_hist;
  }

  // Final clamp and normalize
  score = Math.max(0.0, Math.min(1.0, score));

  let nivel: PredictionResult['nivel'] = 'LIBRE';
  let emoji = '🟢';
  let descripcion = 'Tráfico fluido';

  if (score < 0.35) {
    nivel = 'LIBRE';
    emoji = '🟢';
    descripcion = 'Tráfico fluido';
  } else if (score < 0.65) {
    nivel = 'MODERADO';
    emoji = '🟡';
    descripcion = 'Tráfico moderado';
  } else {
    nivel = 'ALTO';
    emoji = '🔴';
    descripcion = 'Tráfico congestionado';
  }

  return {
    score: parseFloat(score.toFixed(3)),
    nivel,
    emoji,
    descripcion,
    tipo_dia,
    multiplicador: multiplicador_hist,
    datos_tomtom: tomtom,
  };
}

export interface TomTomIncident {
  id: string;
  type: string;
  description: string;
  delay: number;
}

export async function obtener_incidentes_tomtom(lat: number, lng: number): Promise<TomTomIncident[]> {
  const apiKey = process.env.TOMTOM_API_KEY;
  if (!apiKey || apiKey === "MY_TOMTOM_API_KEY") return [];

  // 10km radius around the point
  const url = `https://api.tomtom.com/traffic/services/4/incidentDetails/s3/json?bbox=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&fields={incidents{type,geometry{type,coordinates},properties{id,iconCategory,magnitude,description,delay,tmc{tableNumber,version,direction,id}}}}&language=es-MX&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return (data.incidents || []).map((inc: any) => ({
      id: inc.properties.id,
      type: inc.properties.iconCategory,
      description: inc.properties.description,
      delay: inc.properties.delay
    }));
  } catch (error) {
    console.error("Incidents API error", error);
    return [];
  }
}

export async function predecir(zona_nombre: string, hora_consulta: number = 8, predecir_mañana: boolean = true): Promise<PredictionResult & { incidentes: TomTomIncident[], fecha_consulta: string }> {
  const zona = ZONAS[zona_nombre];
  if (!zona) throw new Error(`Zona no encontrada: ${zona_nombre}`);

  const targetDate = new Date();
  if (predecir_mañana) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  
  const dia_semana = targetDate.getDay();
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');
  const year = targetDate.getFullYear();
  const fecha_str = `${day}/${month}/${year}`;
  const fecha_id = `${month}-${day}`;
  
  const es_festivo = DIAS_FESTIVOS.has(fecha_id);
  const nombre_dia = DAYS[dia_semana];

  const [tomtom, incidentes] = await Promise.all([
    obtener_datos_tomtom(zona.lat, zona.lng),
    obtener_incidentes_tomtom(zona.lat, zona.lng)
  ]);

  const baseResult = calcular_score(tomtom, hora_consulta, dia_semana, es_festivo);

  return {
    ...baseResult,
    incidentes,
    zona: zona_nombre,
    hora: hora_consulta,
    dia_nombre: nombre_dia,
    es_festivo,
    fecha_consulta: fecha_str
  };
}
