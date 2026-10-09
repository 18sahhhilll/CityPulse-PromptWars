# CityPulse Development Tasks & Checklist

## Phase 0: Setup & Architecture Foundation
- [x] Create documentation memory system (`RULES.md`, `PRD.md`, `MEMORY.md`, `TASKS.md`, `DESIGN.md`, `PROGRESS.md`, `AGENTS.md`)
- [x] Initialize Vite + React project, install dependencies (Tailwind, Lucide, Leaflet, Framer Motion, Recharts, Zustand, Supabase client)
- [x] Configure Tailwind CSS, custom theme tokens, Google Fonts, dark mode styling
- [x] Generate SVG favicons and PWA `manifest.webmanifest`
- [x] Create folder structure (`src/routes`, `pages`, `components`, `services`, `hooks`, `store`, `utils`, `config`, `data`)
- [x] Implement React Router v6 setup with lazy-loaded route shells and 404 page
- [x] Create mock datasets (`src/data/incidents.json`, `places.json`, `heritage.json`, `social.json`, `traditions.json`)

## Phase 1: Home / Dashboard & Core Map
- [x] Implement `cityStore`, `filterStore`, `settingsStore`, `favoriteStore`, `reportStore` with Zustand
- [x] Build search bar with Nominatim geocoding & Geolocation ("Use my location") + Pune fallback
- [x] Implement `MapView` component with CartoDB dark/light tile switching and map controls
- [x] Create live metric cards: Weather now, AQI meter, Traffic mood, Safety score
- [x] Implement composite "City Pulse Score" calculator utility (0–100)
- [x] Build Home dashboard layout with quick-action navigation tiles

## Phase 2: Explore (Hospitality & Places)
- [x] Overpass API integration with caching and mock data fallback
- [x] Interactive Category Chips (Attractions, Food, Hotels, Budget, Cafes, Parks, Hospitals, Police)
- [x] Multi-criteria filters: budget level (₹/₹₹/₹₹₹), rating, distance, open now, accessibility
- [x] "Budget Mode" toggle for low-cost spots
- [x] Split Map + List synchronized view
- [x] Place Detail Page with photo gallery, tags, opening hours, score breakdown, nearby places, reviews, and bookmarking

## Phase 3: History & Culture
- [x] Heritage site map layer (`historic=*`, `heritage=*`)
- [x] Story Card modal with Wikipedia API integration, era, and historical importance
- [x] Local Traditions & Culture section (festivals, food, crafts)
- [x] Heritage Trail Builder (interactive multi-point walking route creation using OSRM foot routing)

## Phase 4: Citizen Reports & Smart City Insights
- [x] Citizen Report Form (category, description, pin location, photo upload preview, voice recorder)
- [x] Web Speech API voice recorder with speech-to-text transcription
- [x] Dual storage handler (Supabase with IndexedDB / LocalStorage fallback)
- [x] AI NLP classification pipeline (category validation, sentiment, severity 1–5, duplicate detection, verification score)
- [x] Community Upvote / Confirmation verification system
- [x] Insights Dashboard with Recharts (category distribution, time-of-day trends, AI city summary, alert banner)
- [x] Social Pulse simulated feed with live sentiment breakdown

## Phase 5: Safety & Security
- [x] Safety Heatmap layer using `leaflet.heat` (citizen reports + seeded incident dataset)
- [x] Interactive Safety map layer toggles (Unsafe, Accident zones, Poorly lit, Police, Hospitals)
- [x] Safer Route Finder (fetches OSRM alternative routes, evaluates lighting/incidents, highlights Safest vs Fastest)
- [x] SOS Emergency Card with 1-tap dial numbers (112, 100, 108) and nearest emergency facilities

## Phase 6: Best vs Worst Places (Location Comparison)
- [x] Weighted multi-metric scoring engine (Safety, Cleanliness, Affordability, Ratings, Accessibility)
- [x] Interactive score weight sliders in Settings & Compare views
- [x] Compare Page (side-by-side comparison of 2–4 places with Recharts Radar Chart and details table)
- [x] City Leaderboards ("Best in City" vs "Needs Attention") with data confidence level indicators

## Phase 7: Polish & Verification
- [x] Framer Motion animations & page transition wrappers
- [x] Responsive UI audit (Desktop top bar + mobile bottom navigation bar)
- [x] Accessibility pass (ARIA labels, keyboard navigation, contrast check)
- [x] Error boundary & loading skeleton polish
- [x] Final verification pass: Zero API key runtime check & full documentation update
