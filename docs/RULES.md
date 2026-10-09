# CityPulse Coding Standards & Rules

## 1. Core Principles & Philosophy
- **FREE ONLY**: Rely exclusively on free APIs, open datasets, and free tier services. No paid APIs, no credit card requirements.
- **Graceful Fallbacks & Zero Blank Screens**: Every external API call (Overpass, Nominatim, Open-Meteo, OSRM, Wikipedia, Supabase) MUST have:
  - Active loading state (skeleton / spinner)
  - Clear error state
  - Dual-layer caching (in-memory + `localStorage` with TTL)
  - Automatic fallback to local mock data in `src/data/` so the app works 100% offline or when API limits are hit.
- **Secrets & Security**: Never hardcode API keys or credentials. Always read from `import.meta.env` and supply `.env.example`.
- **Data Transparency**: Clearly badge data sources as **Verified**, **Estimated**, or **Sample/Mock Data**.

## 2. API & Rate-Limiting Rules
- **Nominatim Geocoding**: Limit requests to max 1 per second. Debounce user search inputs by at least 400ms. Cache search results.
- **Overpass API**: Use bounded bounding boxes or radius queries with reasonable caps (`[out:json][timeout:15]`). Cache responses by geo-quad or radius key.
- **Open-Meteo**: Cache weather data for 15 minutes in `localStorage`.
- **OSRM Routing**: Request route geometry in JSON format. Provide fallback straight-line or pre-computed segment paths if OSRM is unreachable.

## 3. Tech Stack & Library Standards
- **React 18 + Vite**: Use functional components, custom hooks, and React 18 patterns.
- **Tailwind CSS**: Use utility classes with customized design tokens. Dark-first color palette (`#0B1020` base).
- **State Management**: Use Zustand stores (`cityStore`, `filterStore`, `reportStore`, `favoriteStore`, `settingsStore`).
- **Icons & Visuals**: Use Lucide React icons with semantic emoji accents defined in `src/config/categories.js`.
- **Maps**: Leaflet + `react-leaflet` + `leaflet.heat` + marker clustering. Handle Leaflet default icon asset paths properly.
- **Charts**: Recharts (`ResponsiveContainer`, `RadarChart`, `BarChart`, `AreaChart`).

## 4. Code & Directory Structure
- Modular components under 200 lines where practical.
- Grouping:
  - `src/components/layout/`: Navbar, Sidebar, BottomNav, Footer, PageShell
  - `src/components/map/`: MapView, MarkerLayer, HeatLayer, RouteLayer, MapControls
  - `src/components/cards/`: PlaceCard, WeatherCard, AlertCard, ScoreCard, StoryCard
  - `src/components/charts/`: RadarCompare, TrendChart, CategoryBar
  - `src/components/forms/`: ReportForm, VoiceRecorder, PhotoUpload, SearchBar
  - `src/components/ui/`: Button, Chip, Badge, Modal, Skeleton, Toast, EmptyState
  - `src/services/`: Modular API clients (overpass.js, nominatim.js, openMeteo.js, wikipedia.js, routing.js, traffic.js, supabase.js, ai.js)
  - `src/hooks/`: Custom hooks
  - `src/store/`: Zustand stores
  - `src/utils/`: Pure utilities (scoring.js, safetyScore.js, geo.js, format.js, cache.js)
  - `src/config/`: Configuration objects (app.config.js, scoring.config.js, categories.js)
  - `src/data/`: Rich local JSON mock datasets

## 5. Accessibility & UX Guidelines
- High contrast, mobile-first, responsive layouts.
- Keyboard navigable controls and descriptive ARIA labels (`aria-label`, `role`).
- Glassmorphism effects with backdrop blur and high legibility text (`text-slate-100` / `text-slate-900`).
