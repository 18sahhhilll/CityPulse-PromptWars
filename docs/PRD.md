# Product Requirements Document (PRD) - CityPulse

## 1. Executive Summary
**Title**: CityPulse - Exploring, Experiencing & Navigating the Chaos We Call Home.
**Tagline**: Turning scattered real-world city data into verified, actionable urban insights.

CityPulse is an interactive web platform for urban exploration, safety navigation, historical discovery, location comparison, and real-time citizen reporting. It bridges real-time open data (OSM, Open-Meteo, Wikipedia, OSRM) with user-generated reports and NLP analytics to present a holistic "Pulse" of any city.

---

## 2. Target Users & Personas
- **The Tourist & Explorer**: Wants to discover top sights, local food, budget stays, and historic walking trails with rich stories and photos.
- **The Daily Commuter & Resident**: Seeks live weather/AQI updates, safety heatmaps, safer route recommendations, traffic mood, and quick emergency contacts.
- **The Relocator / Apartment Hunter**: Compares neighborhoods and specific spots on multi-criteria metrics (safety, cleanliness, affordability, ratings, accessibility).
- **The Active Citizen**: Reports urban hazards (flooding, dark alleys, accidents, garbage) via text, photo, and voice notes, gaining community verification.

---

## 3. Core Modules & User Stories

### Module 1: Home / Dashboard
- **Story**: As a user, I want an instant overview of my selected city's weather, air quality, safety score, traffic mood, and live alerts.
- **Key Features**:
  - Nominatim City Autocomplete + Geolocation ("Use my location") with Pune, India as configurable fallback.
  - Live metric cards: Weather Now, AQI meter, Traffic Mood indicator, Area Safety Score.
  - Overall composite "City Pulse Score" (0-100).
  - Quick action tiles routing to Explore, History, Safety, Compare, Insights, and Report.

### Module 2: Explore (Hospitality & Places)
- **Story**: As an explorer, I want to filter and view places (food, hotels, attractions, cafes, budget spots) on an interactive map and list.
- **Key Features**:
  - Dual Map + List view with synchronous highlighting.
  - Category chips: Attractions, Food, Hotels, Budget, Cafes, Parks, Hospitals, Police.
  - Filters: Budget level (₹ / ₹₹ / ₹₹₹), Distance radius, Open Now, Rating, Accessibility.
  - "Budget Mode" toggle highlighting low-cost eats & stays.
  - Place Detail Page: Photos, OSM tags, open hours, score breakdown, nearby places, user reviews, "Save to Favorites".

### Module 3: History & Culture
- **Story**: As a history enthusiast, I want to explore historic landmarks and heritage sites with Wikipedia stories and plan walking trails.
- **Key Features**:
  - Dedicated Heritage map layer (OSM `historic=*`, `heritage=*`).
  - Story Cards: Wikipedia summary, Wikidata era/timeline, image, cultural significance.
  - Local Traditions section: Curated festivals, local cuisine, traditional crafts.
  - Heritage Trail Builder: Select 3–6 sites to generate an ordered, map-routed walking itinerary.

### Module 4: Safety & Security
- **Story**: As a night traveler or safety-conscious resident, I want safety heatmaps, safer route guidance, and emergency contacts.
- **Key Features**:
  - Safety Heatmap (`leaflet.heat`) generated from citizen reports + seeded sample incidents.
  - Toggle layers: Unsafe areas, Accident-prone zones, Poorly lit, Police stations, Hospitals.
  - Safer Route Finder: Compare 2–3 OSRM routes evaluated against nearby incident reports, lighting conditions, and time of day, highlighting Safest vs Fastest.
  - SOS Emergency Card: One-tap access to nearest police station, hospital, and national emergency hotlines (112, 100, 108).

### Module 5: Best vs Worst Places (Location Comparison)
- **Story**: As a decision-maker, I want to compare 2–4 locations side-by-side across weighted livability metrics.
- **Key Features**:
  - Transparent 0–100 scoring engine based on: Safety, Cleanliness, Affordability, Ratings, Accessibility.
  - Interactive user-adjustable score weights (sliders in Settings/Compare).
  - Side-by-side Compare page with Radar Chart and comparison table.
  - City Leaderboards: "Best in City" vs "Needs Attention" per category with confidence indicators.

### Module 6: Smart City Insights & Citizen Reporting
- **Story**: As a citizen, I want to report city issues with text, photo, and voice notes, and view AI-classified city intelligence.
- **Key Features**:
  - Report Form: Hazards, accidents, harassment, dark alleys, garbage, flooding, traffic.
  - Input options: Map click / GPS location, photo attachment, voice note recording with speech-to-text transcription.
  - AI NLP Pipeline: Category verification, sentiment analysis, severity score (1–5), location keyword extraction, spam/duplicate check, and verification score generation.
  - Community Verification: Upvote/confirm reports to increase verification badge status.
  - City Insights Dashboard: Recharts analytics (reports by category, time-of-day trends), AI-generated city summary, and simulated "Social Pulse" feed.

### Module 7: Utility Pages & Extras
- **Saved Places**: LocalStorage-persisted collection of bookmarked places and saved heritage trails.
- **Settings**: Dark/Light mode toggle, language/units configuration, custom scoring weights.
- **About Page**: Architecture outline, free API attributions, data disclaimers.
- **404 Page**: Responsive fallback route.

---

## 4. Priority Matrix (P0 / P1 / P2)
- **P0 (Critical Path)**: Vite project scaffold, Tailwind theme, Layout/Nav, Leaflet MapView, City Search/Geo, Overpass API places, Safety heatmap, Report form + local fallback, Storage & Zustand state.
- **P1 (Core Enhancements)**: Wikipedia integration, OSRM Safer Route Finder, Recharts Compare Radar & Leaderboards, AI NLP classification pipeline, Open-Meteo Weather/AQI cards, Heritage Trail builder.
- **P2 (Polish & Extras)**: Voice recorder with speech-to-text, Framer Motion page transitions, dark/light map tiles switch, Social Pulse feed, PWA manifest, Favicons.

---

## 5. Success Metrics
- 0 JavaScript runtime errors on launch.
- 100% offline-demo resilience (every feature operates seamlessly using local fallback data if internet or external APIs fail).
- Sub-1s responsive UI transitions and debounced API requests.
