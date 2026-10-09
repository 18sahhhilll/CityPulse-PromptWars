# CityPulse Long-Term Memory & Architecture Decisions

## Key Architectural Decisions

### 1. Offline-First Dual Storage Strategy
- **Primary**: Remote Supabase client for citizen reports & media storage (if keys supplied in `.env`).
- **Fallback**: Browser `IndexedDB` / `localStorage` store automatically engaged when Supabase keys are missing or API requests fail.
- **Result**: CityPulse functions seamlessly in zero-config offline mode for local demonstration without displaying blank screens.

### 2. Live API Testing & Rate Limit Quirks Discovered
- **Nominatim (Geocoding)**:
  - Base URL: `https://nominatim.openstreetmap.org`
  - *Empirical test result*: PASS. Returned accurate Pune bounding box & display names.
  - *Quirk*: Rate limit strictly 1 req/sec. Managed via 400ms input debouncing and custom `User-Agent: CityPulse/1.0` headers.
- **Overpass API (POIs & Heritage)**:
  - Endpoints: `https://overpass-api.de/api/interpreter`, `https://overpass.khtml.disroot.org/api/interpreter`.
  - *Empirical test result*: Primary server occasionally returns 429 HTML rate-limit pages. Handled by multi-mirror retries and automatic fallback to `src/data/places.json`.
- **Open-Meteo (Weather & AQI)**:
  - Endpoints: `https://api.open-meteo.com/v1/forecast`, `https://air-quality-api.open-meteo.com/v1/air-quality`.
  - *Empirical test result*: PASS. Returned live 32.5°C temperature & 108 AQI.
- **Wikipedia / Wikidata**:
  - Endpoint: `https://en.wikipedia.org/api/rest_v1/page/summary/`
  - *Empirical test result*: PASS. Returned Shaniwar Wada summary and thumbnail image.
- **OSRM (Routing)**:
  - Endpoint: `https://router.project-osrm.org/route/v1/driving/`
  - *Empirical test result*: PASS. Returned 2.95km route geometry.

### 3. AI NLP Pipeline Strategy
- **Tier 1**: Google Gemini Free Tier API (`import.meta.env.VITE_GEMINI_API_KEY`).
- **Tier 2 (Browser NLP)**: Client-side keyword and sentiment analysis engine built in `src/services/ai.js`.
- **Classification Output**: Category match, sentiment score (-1.0 to +1.0), severity level (1–5), location keyword extraction, and verification confidence score based on duplicate detection and proximity heuristics.

---

## Environment Variables (.env.example)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GEMINI_API_KEY=your-gemini-api-key-here
VITE_DEFAULT_CITY=Pune
VITE_DEFAULT_LAT=18.5204
VITE_DEFAULT_LNG=73.8567
```

---

## Solved Quirks & Bugs
- *Leaflet Icon Path Bug in Vite*: Leaflet marker assets default to relative bundle paths. Fixed by creating custom SVG marker icons for each place category in `src/components/map/MarkerLayer.jsx`.
- *Node-fetch module ESM resolution*: Modern Node 18+ uses global native `fetch`. Updated endpoint test script to use native `fetch`.
