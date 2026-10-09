# 🏙️ CityPulse — Smart, Interactive City Exploration & Safety Web App

> **Title**: City Life: Exploring, Experiencing & Navigating the Chaos We Call Home.  
> **Tagline**: Turning scattered real-world city data into verified, actionable urban insights.

---

## 🌟 Overview

CityPulse is a modern, responsive web application designed for urban exploration, safety navigation, historical discovery, multi-criteria location comparison, and real-time citizen reporting. Built using **React 18**, **Vite**, **Tailwind CSS**, **Leaflet**, **Framer Motion**, **Recharts**, **Zustand**, and client-side **AI NLP**, CityPulse operates 100% on **FREE, keyless APIs** with dual-layer caching (in-memory + `localStorage`) and graceful local mock fallbacks so it never displays a blank screen.

---

## ✨ Features

### 1. 🏠 Home / Dashboard & Compact Mini Map
- **City Search & Geolocation**: Nominatim autocomplete search bar with policy email parameter + browser Geolocation API with Pune, India as fallback.
- **Hero Interactive Mini Map**: Compact map on the hero banner showing city center and top spots.
- **Live Metrics**: Weather Now, EPA Air Quality (AQI), estimated Traffic Mood, and Area Safety Score.
- **City Pulse Score**: Composite 0–100 livability dial with transparent formula tooltip (Safety 35%, Air Score 25%, Traffic 20%, Weather 20%).

### 2. 🗺️ Explore (Hospitality & Places)
- **OpenStreetMap & Overpass API**: Live query for attractions, restaurants, cafes, hotels, hostels, parks, hospitals, and police stations.
- **Category Chips & Filters**: Multi-criteria filtering by price level (₹ / ₹₹ / ₹₹₹), minimum rating, and budget mode.
- **Budget Mode**: One-tap toggle surfacing low-cost eats, hostels, and free attractions.
- **Synchronized Split View**: Interactive Leaflet map with custom SVG category pins linked to place cards.
- **Place Detail View**: Multi-metric score breakdown, open hours, tags, reviews, and bookmarking.

### 3. 🏛️ History & Culture
- **Heritage Map Layer**: Maps OSM heritage landmarks and historic monuments.
- **Wikipedia Story Cards**: Rich historical overviews, builder metadata, era timelines, and images via Wikipedia REST API.
- **Local Traditions & Cuisine**: Curated guides to regional festivals (Ganeshotsav, Palkhi), iconic food (Misal Pav), and GI-tagged crafts.
- **Heritage Trail Builder**: Pick 2 to 6 sites to generate an ordered walking itinerary with OSRM foot routing and distance/duration estimates.

### 4. 🛡️ Safety & Security
- **Safety Heatmap**: Rendered using `leaflet.heat` based on citizen reports and 15 seeded sample incident datasets.
- **Map Layer Toggles**: Unsafe zones, accident-prone curves, poorly lit alleys, police stations, and hospitals.
- **OSRM Safer Route Finder**: Calculates 2–3 alternative driving/walking routes, evaluates safety scores against nearby incidents, and highlights the **Recommended Safest Route** vs Fastest.
- **SOS Emergency Card**: One-tap dialing for national emergency numbers (112, 100, 108, 1091).

### 5. 📊 Best vs Worst Places (Location Comparison)
- **Multi-Metric Scoring Engine**: Transparent 0–100 scoring based on Safety, Cleanliness, Affordability, Ratings, and Transit Accessibility.
- **Customizable Weight Sliders**: Adjust live score weights in Settings or Compare view to match personal priorities.
- **Recharts Radar Chart**: Side-by-side radar overlay comparing 2 to 4 locations.
- **City Leaderboards**: "Best in City" vs "Needs Attention" ranked lists.

### 6. 📡 Smart City Insights & Citizen Reporting
- **Citizen Report Form**: Log issues across 8 categories with text, location pin, voice note (Web Speech API speech-to-text), and photo upload.
- **AI NLP Pipeline**: Client-side Gemini / keyword classifier analyzes sentiment, severity (1–5), category verification, duplicate detection, and assigns a verification confidence score.
- **Community Verification Engine**: Confirm / Upvote reports to increase verification status badges.
- **Insights Dashboard**: Recharts analytics (category distribution, time-of-day trends), AI executive plain-language summary, live broadcast alerts, and simulated Social Pulse feed.

---

## 🛠️ Tech Stack & Free Data Sources

| Role | Technology / Free Source |
|---|---|
| **Frontend Framework** | React 18 + Vite (JavaScript / JSX) |
| **Styling & UI** | Tailwind CSS (Glassmorphism theme), Lucide React icons |
| **Animations** | Framer Motion |
| **Interactive Maps** | Leaflet + `react-leaflet` + `leaflet.heat` + CartoDB dark/light tile layers (OSM tile fallback) |
| **Data Visualization** | Recharts (Radar, Area, Progress Bars) |
| **State Management** | Zustand stores |
| **Geocoding & Search** | Nominatim (OSM) with 400ms debouncing |
| **Places & POIs** | Overpass API (`tourism`, `amenity`, `historic`, `leisure`) |
| **Weather & AQI** | Open-Meteo Weather & Air Quality APIs (EPA US AQI) |
| **Heritage Summaries** | Wikipedia REST API & Wikidata |
| **Routing & Trails** | OSRM Public Routing API (Driving & Foot navigation) |
| **NLP Pipeline** | Google Gemini Free API (fallback to in-browser keyword classifier) |
| **Database & Storage** | Supabase (free tier) with automatic IndexedDB / LocalStorage fallback |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Installation & Local Setup

```bash
# 1. Clone or navigate to project directory
cd citypulse

# 2. Install dependencies
npm install

# 3. Create .env file (Optional: Defaults provided)
cp .env.example .env

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Production Build & Deployment

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

### Free Deployment Steps
For detailed deployment instructions on Vercel and Netlify, see [DEPLOY.md](DEPLOY.md).

---

## 📜 Known Limitations & Data Honesty
- **Overpass API Rate Limits**: Overpass public servers occasionally return 429 HTML responses during peak hours. CityPulse automatically catches this and falls back to local curated datasets without showing blank screens.
- **Browser User-Agent Restriction**: Browsers prohibit custom `User-Agent` headers in fetch requests. Nominatim policy compliance is maintained using the `email` query parameter.
- **Seeded Sample Data**: All demo incidents, fallback places, and social feed items are explicitly badged **Sample** in the UI.
