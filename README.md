# TráficoQro

**Asistente inteligente de tráfico para la ciudad de Querétaro, México.**  
Combina datos en tiempo real de TomTom con análisis de IA de Google Gemini para predecir el tráfico y recomendar la mejor hora para salir.

![Version](https://img.shields.io/badge/versión-1.5.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss)

</div>

---

## Índice

1. [Descripción general](#descripción-general)
2. [Funcionalidades](#funcionalidades)
3. [Stack tecnológico](#stack-tecnológico)
4. [Estructura del proyecto](#estructura-del-proyecto)
5. [Arquitectura y flujo de datos](#arquitectura-y-flujo-de-datos)
6. [Instalación y configuración](#instalación-y-configuración)
7. [Variables de entorno](#variables-de-entorno)
8. [Scripts disponibles](#scripts-disponibles)
9. [Componentes](#componentes)
10. [Servicios y lógica de negocio](#servicios-y-lógica-de-negocio)
11. [Algoritmo de predicción](#algoritmo-de-predicción)
12. [Zonas disponibles](#zonas-disponibles)
13. [Leyenda de la interfaz](#leyenda-de-la-interfaz)

---

## Descripción general

TráficoQro es una aplicación web que ayuda a los habitantes de Querétaro a planificar sus desplazamientos. Consulta el estado del tráfico para cualquier zona de la ciudad, para hoy o mañana, a la hora que el usuario elija.

El sistema fusiona dos fuentes de información:

- **Datos en tiempo real** — velocidades e incidentes actuales obtenidos de la API de TomTom.
- **Patrones históricos** — multiplicadores horarios calibrados por tipo de día (laboral, sábado, domingo/festivo).

La combinación de ambas fuentes alimenta a **Gemini AI**, que genera un veredicto en lenguaje natural, detecta eventos locales que puedan afectar el tráfico y sugiere la hora ideal para salir.

---

## Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Selección de zona | 7 zonas predefinidas de Querétaro con coordenadas exactas |
| Selección de hora | Consulta para cualquier hora del día (0–23 h) |
| Hoy / Mañana | Toggle para elegir el día de la predicción |
| Score de congestión | Valor 0–1 que combina datos reales e históricos |
| Veredicto Gemini | Resumen en lenguaje natural con recomendación y hora ideal de salida |
| Detección de eventos | Gemini busca en Google eventos, obras o marchas en la zona consultada |
| Nivel de riesgo | Indicador visual de 1 a 5 generado por Gemini |
| Mapa interactivo | Mapa TomTom con overlay de flujo de tráfico e incidentes en vivo |
| Expandir mapa | Vista fullscreen del mapa con animación |
| Detalles del sensor | Panel desplegable con velocidad actual, flujo libre, confianza y cierre vial |
| Modo oscuro | Detección automática del sistema con toggle manual |
| Diseño responsivo | Adaptado a móvil, tablet y escritorio |

---

## Stack tecnológico

### Frontend

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework principal |
| TypeScript | 5.8 | Tipado estático |
| Vite | 6.2 | Build tool y servidor de desarrollo |
| Tailwind CSS | 4.1 | Estilos y diseño responsivo |
| Motion (Framer Motion) | 12 | Animaciones y transiciones |
| Lucide React | 0.546 | Íconos |

### APIs externas

| Servicio | Uso |
|---|---|
| **TomTom Flow API** | Velocidad actual y velocidad de flujo libre por coordenada |
| **TomTom Incidents API** | Incidentes en un radio de ~10 km alrededor de la zona |
| **TomTom Maps SDK** | Renderizado del mapa interactivo con capas de tráfico |
| **Google Gemini 2.0 Flash** | Análisis inteligente, búsqueda de eventos y generación del veredicto |

### Utilidades

| Librería | Uso |
|---|---|
| `clsx` + `tailwind-merge` | Composición condicional de clases CSS |
| `react-markdown` | Renderizado de markdown en respuestas de IA |
| `dotenv` | Carga de variables de entorno |

---

## Estructura del proyecto

```
tráficoqro/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Barra de navegación — logo, fecha, toggle de tema
│   │   ├── Sidebar.tsx         # Panel de control — zona, hora, día, leyenda
│   │   ├── AnalysisResults.tsx # Resultados — mapa, veredicto Gemini, eventos, sensores
│   │   ├── TrafficMap.tsx      # Mapa TomTom interactivo con overlay de tráfico
│   │   ├── MapExpansion.tsx    # Modal fullscreen del mapa
│   │   └── StatusViews.tsx     # Estados: vacío, cargando, error
│   ├── services/
│   │   └── geminiService.ts    # Integración con Google Gemini AI
│   ├── lib/
│   │   └── utils.ts            # Utilidad cn() para merge de clases
│   ├── App.tsx                 # Componente raíz — estado global y orquestación
│   ├── main.tsx                # Punto de entrada de React
│   ├── constants.ts            # Zonas, patrones, interfaces y funciones de TomTom
│   └── index.css               # Estilos globales, temas y fuentes
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .env                        # Variables de entorno (no subir al repositorio)
```

---

## Arquitectura y flujo de datos

```
Usuario selecciona zona + hora + día
           │
           ▼
     predecir() [constants.ts]
      ┌─────────────────────┐
      │  obtener_datos_      │  ──► TomTom Flow API
      │  tomtom()            │       (velocidad actual / flujo libre)
      │                      │
      │  obtener_incidentes_ │  ──► TomTom Incidents API
      │  tomtom()            │       (incidentes en radio de 10 km)
      │                      │
      │  calcular_score()    │  ──► Fórmula híbrida (real + histórico)
      └─────────────────────┘
           │
           ▼
  getTrafficPrediction() [geminiService.ts]
      ┌─────────────────────┐
      │  Gemini 2.0 Flash   │  ──► Google Search (eventos del día)
      │  + Google Search    │
      │                     │
      │  Salida JSON:        │
      │  · summary           │
      │  · best_time_to_leave│
      │  · detected_events  │
      │  · risk_level (1-5) │
      └─────────────────────┘
           │
           ▼
    App.tsx setResult()
           │
           ▼
    AnalysisResults.tsx
    (mapa + veredicto + eventos + sensores)
```

---

## Instalación y configuración

### Prerrequisitos

- **Node.js** v18 o superior
- Cuenta en [developer.tomtom.com](https://developer.tomtom.com) para obtener una API key
- Cuenta en [Google AI Studio](https://aistudio.google.com) para obtener una Gemini API key

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd tráficoqro

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Editar el archivo .env con tus API keys (ver sección siguiente)

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La app estará disponible en `http://localhost:3000`.

---

## Variables de entorno

Crear o editar el archivo `.env` en la raíz del proyecto:

```env
# Requerido — API key de Google Gemini
# Obtener en: https://aistudio.google.com/app/apikey
GEMINI_API_KEY="tu_gemini_api_key_aqui"

# Requerido — API key de TomTom
# Obtener en: https://developer.tomtom.com/
TOMTOM_API_KEY="tu_tomtom_api_key_aqui"

# Opcional — URL de hosting (inyectado automáticamente en Cloud Run)
APP_URL="http://localhost:3000"
```

> **Nota:** Nunca subas el archivo `.env` al repositorio. Agrega `.env` a tu `.gitignore`.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en el puerto 3000 |
| `npm run build` | Genera el build de producción en `/dist` |
| `npm run preview` | Vista previa del build de producción |
| `npm run clean` | Elimina la carpeta `/dist` |
| `npm run lint` | Valida tipos TypeScript sin emitir archivos |

---

## Componentes

### `App.tsx`
Componente raíz. Maneja el estado global de la aplicación:
- `zone` — zona seleccionada
- `hour` — hora de consulta (0–23)
- `isTomorrow` — si la predicción es para mañana o hoy
- `loading` / `error` — estados de la petición
- `result` — objeto con los datos de predicción y el análisis de Gemini
- `isDark` — tema oscuro/claro (detecta preferencia del sistema)

### `Header.tsx`
Barra de navegación fija. Muestra el logo, la fecha actual en español y el botón de cambio de tema.

### `Sidebar.tsx`
Panel de control lateral. Contiene:
- Toggle **Hoy / Mañana**
- Selector de **zona** con ícono de pin
- Selector de **hora** con ícono de reloj
- Botón **Consultar Ahora** (con estado de carga)
- Sección **Leyenda** colapsable con 5 categorías

### `AnalysisResults.tsx`
Panel principal de resultados. Compuesto por:
- **Mapa** con gradiente, overlay de hover para expandir, score en esquina superior derecha, y datos de zona en la parte inferior
- **Tarjeta Veredicto Gemini** — resumen en cursiva, hora ideal y nivel de riesgo visual
- **Tarjeta Eventos y Reportes** — lista de eventos detectados y panel desplegable de detalles del sensor

### `TrafficMap.tsx`
Integra el SDK de TomTom Maps. Renderiza el mapa con:
- Capa de flujo de tráfico (`trafficFlow: true`)
- Capa de incidentes (`trafficIncidents: true`)
- Controles de navegación y pantalla completa (modo interactivo)
- Leyenda de colores superpuesta

### `MapExpansion.tsx`
Modal fullscreen animado con el mapa en vista expandida. Se cierra haciendo click fuera o en el botón ×.

### `StatusViews.tsx`
Tres estados de la UI principal:
- **`EmptyState`** — pantalla inicial antes de la primera consulta
- **`LoadingState`** — spinner animado durante el análisis
- **`ErrorState`** — mensaje de error cuando falla la predicción

---

## Servicios y lógica de negocio

### `constants.ts`

Exporta las zonas, los patrones históricos, las interfaces TypeScript y las funciones de acceso a TomTom:

- **`ZONAS`** — Record con nombre → coordenadas `{lat, lng}` de las 7 zonas
- **`PATRONES`** — Multiplicadores horarios (0–1) para `LABORAL`, `SABADO` y `DOMINGO`
- **`DIAS_FESTIVOS`** — Set de fechas en formato `MM-DD` con días festivos nacionales y regionales
- **`obtener_datos_tomtom(lat, lng)`** — Consulta el endpoint de flujo de TomTom y devuelve `TomTomData`
- **`obtener_incidentes_tomtom(lat, lng)`** — Consulta incidentes en un bbox de ±0.05° (~5 km) alrededor del punto
- **`calcular_score(tomtom, hora, dia_semana, es_festivo)`** — Calcula el score de congestión (ver sección siguiente)
- **`predecir(zona, hora, mañana)`** — Orquesta todo: obtiene datos TomTom, calcula el score y devuelve el resultado completo

### `geminiService.ts`

Integra Gemini 2.0 Flash con `@google/genai`:

- Envía un prompt con los datos técnicos de TomTom (velocidades, score, incidentes, fecha)
- Usa la herramienta **Google Search** para buscar eventos del día en la zona consultada
- Devuelve un objeto `AIResponse` con `summary`, `best_time_to_leave`, `detected_events` y `risk_level`
- Incluye fallback: si Gemini falla, devuelve una respuesta genérica sin romper la UI

---

## Algoritmo de predicción

El score final (0–1) se calcula con una **fórmula de blending** que pondera datos reales contra datos históricos según la confianza del sensor:

```
Si TomTom tiene datos (currentSpeed, freeFlowSpeed, confidence > 0):

  congestion_real = 1 - (currentSpeed / freeFlowSpeed)   → clamp [0, 1]
  weight          = confidence × 0.8                      → máximo 80% de peso real
  score           = (congestion_real × weight) + (multiplicador_histórico × (1 - weight))

Si TomTom NO tiene datos (fallback):

  score = multiplicador_histórico[tipo_dia][hora]
```

**Clasificación del score:**

| Rango | Nivel | Color |
|---|---|---|
| 0.00 – 0.34 | Libre | 🟢 Verde |
| 0.35 – 0.64 | Moderado | 🟡 Amarillo |
| 0.65 – 1.00 | Alto / Pesado | 🔴 Rojo |

**Tipo de día:**
- `LABORAL` — lunes a viernes sin festivo
- `SABADO` — sábados
- `DOMINGO` — domingos y días festivos (patrones de tráfico ligero)

---

## Zonas disponibles

| Zona | Latitud | Longitud |
|---|---|---|
| Centro Histórico | 20.5886 | -100.3899 |
| Blvd. Bernardo Quintana | 20.6011 | -100.4155 |
| Constituyentes | 20.5780 | -100.4020 |
| Corregidora | 20.5560 | -100.3920 |
| Juriquilla | 20.7010 | -100.4410 |
| El Marqués | 20.5230 | -100.3400 |
| Periférico | 20.6200 | -100.4300 |

---

## Leyenda de la interfaz

### Score de congestión
| Barra | Rango | Descripción |
|---|---|---|
| 🟩 Verde | 0.00 – 0.35 | Tránsito fluido, velocidad máxima |
| 🟨 Ámbar | 0.35 – 0.65 | Retrasos ligeros, tráfico común |
| 🟥 Rojo | 0.65 – 1.00 | Congestión alta, evitar zona |

### Capas del mapa
| Color | Significado |
|---|---|
| Verde | Fluido — velocidad cercana al límite permitido |
| Ámbar | Lento — velocidad reducida, demora leve |
| Rojo | Congestionado — velocidad muy baja o detenido |

### Íconos del sistema
| Ícono | Significado |
|---|---|
| 📶 Wifi verde | Datos en vivo de TomTom activos |
| 📵 Wifi tachado | Sin señal — predicción basada en datos históricos |
| ⚠️ Triángulo ámbar | Día festivo — tráfico atípico esperado |
| ⚡ Rayo azul | Análisis y veredicto de Gemini AI |

### Nivel de riesgo Gemini (1–5 barras)
| Barras | Nivel | Recomendación |
|---|---|---|
| ██░░░ | Bajo (1–2) | Condiciones favorables |
| ███░░ | Moderado (3) | Precaución recomendada |
| █████ | Alto (4–5) | Evitar la zona si es posible |

---

<div align="center">
  <p>© 2026 TráficoQro • Predicción Inteligente de Movilidad</p>
  <p>
    <a href="https://developer.tomtom.com">TomTom Developer</a> ·
    <a href="https://gemini.google.com">Gemini AI</a>
  </p>
</div>
