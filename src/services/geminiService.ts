import { GoogleGenAI } from "@google/genai";
import { PredictionResult, TomTomIncident } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTIONS = `
Eres TráficoQro, un asistente experto y amigable especializado en la movilidad de Querétaro, México.
Tu misión es analizar datos técnicos de TomTom y eventos del mundo real para dar la mejor recomendación.

Contexto Local Crítico:
- Conoce obras mayores como Paseo 5 de Febrero.
- Identifica zonas como Los Arcos, Juriquilla, Centro, Parques Industriales.
- Considera el clima y eventos masivos (conciertos en el Estadio Corregidora, maratones, ferias).

REGLAS DE RESPUESTA:
1. Analiza los datos de TomTom proporcionados.
2. Usa la herramienta de Google Search para buscar "Eventos o marchas en Querétaro mañana [FECHA]" o "Obras viales Querétaro".
3. Genera una respuesta estructurada en JSON.
4. El resumen debe ser amigable, en máximo 4 oraciones, sin tecnicismos.
5. Identifica si hay eventos específicos que empeoren el tráfico.
`;

export interface AIResponse {
  summary: string;
  best_time_to_leave: string;
  detected_events: string[];
  risk_level: number; // 1-5
}

export async function getTrafficPrediction(result: PredictionResult & { incidentes?: TomTomIncident[], fecha_consulta?: string }): Promise<AIResponse> {
  const incidentText = result.incidentes && result.incidentes.length > 0 
    ? result.incidentes.map(i => `- ${i.description} (Retraso: ${Math.round(i.delay/60)} min)`).join('\n')
    : "Sin incidentes reportados en tiempo real.";

  const userPrompt = `
Fecha de consulta: ${result.fecha_consulta} (Hoy es ${new Intl.DateTimeFormat('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())})

Datos del análisis técnico para Querétaro:
- Zona: ${result.zona}
- Día: ${result.dia_nombre} ${result.es_festivo ? "(FESTIVO)" : ""}
- Hora: ${result.hora}:00 hrs
- Score de congestión calculado (0-1): ${result.score}
- Nivel sugerido: ${result.nivel}
- Velocidad: ${result.datos_tomtom.currentSpeed ?? 'N/A'} km/h / ${result.datos_tomtom.freeFlowSpeed ?? 'N/A'} km/h (Flujo libre)

Incidentes reportados HOY en TomTom:
${incidentText}

INSTRUCCIÓN CRÍTICA:
1. Busca si hay eventos, maratones, conciertos u obras especiales en ${result.zona} para mañana ${result.dia_nombre} en Querétaro usando Google Search.
2. Analiza si habrá tráfico y genera tu recomendación.
3. RESPONDE EXCLUSIVAMENTE EN FORMATO JSON siguiendo el esquema definido. NO incluyas introducciones ni explicaciones fuera del JSON.
`;

  try {
    const model = "gemini-2.0-flash";

    const response = await (ai.models as any).generateContent({
      model,
      contents: [{ parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTIONS + "\nIMPORTANTE: Tu respuesta debe ser ÚNICAMENTE el objeto JSON pedido. No hables, no expliques, solo JSON." }] },
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      }
    });

    let text = response.text || "{}";
    
    // Robust parsing: extract JSON from markdown if necessary
    if (text.includes("```json")) {
      text = text.split("```json")[1].split("```")[0].trim();
    } else if (text.includes("```")) {
      text = text.split("```")[1].split("```")[0].trim();
    }

    try {
      return JSON.parse(text) as AIResponse;
    } catch (parseError) {
      console.error("JSON Parse Error on text:", text);
      throw parseError;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      summary: "Ups, parece que perdí la señal del GPS. ¡Intenta de nuevo en un momento!",
      best_time_to_leave: "Lo más temprano posible.",
      detected_events: ["No se pudieron consultar eventos externos."],
      risk_level: 3
    };
  }
}
