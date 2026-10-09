# 🎬 CityPulse 3-Minute Demo Walkthrough Script

This document provides a step-by-step 3-minute presentation script and judge Q&A guide for demonstrating **CityPulse**.

---

## ⏱️ 3-Minute Presentation Script

### Minute 0:00 – 0:45: Home Dashboard & Data Transparency
1. **Action**: Open [CityPulse Home Page](http://localhost:3000).
2. **Script**:
   > *"Welcome to CityPulse: Exploring, Experiencing & Navigating the Chaos We Call Home. CityPulse turns scattered open city data into actionable urban insights. Notice the live hero mini-map and our live metric cards: Open-Meteo weather, EPA Air Quality (AQI), estimated traffic mood, and our composite City Pulse Score dial. Tap the info icon on the Pulse Score to see our transparent weighting algorithm: Safety 35%, Air score 25%, Traffic 20%, and Weather 20%."*

### Minute 0:45 – 1:30: Explore & Heritage Walking Trails
1. **Action**: Click **Explore** on top navbar. Toggle **Budget Mode**.
2. **Script**:
   > *"In Explore, we query live OpenStreetMap POIs via Overpass API. Toggle 'Budget Mode' with one tap to instantly highlight low-cost eats, hostels, and free parks. Next, let's open the History & Culture module. Here, every landmark has a Wikipedia story card. Using our Heritage Trail Builder, I select Shaniwar Wada, Lal Mahal, and Pataleshwar Cave, and click 'Generate Trail'—instantly receiving an ordered walking itinerary with OSRM foot navigation."*

### Minute 1:30 – 2:30: Live Citizen Reporting, AI NLP & Safety Heatmap
1. **Action**: Click **Report** button. Submit report with text: *"Dim streetlights near FC Road lane 2"*, click microphone icon for voice note, attach photo, and click **Submit Report**.
2. **Script**:
   > *"Now for active safety navigation. As a citizen, I can file an urban issue. I type the headline, record a voice note via Web Speech API, and attach a photo. Upon clicking submit, our client AI NLP pipeline analyzes the text in real-time—assigning category, severity (4/5), negative sentiment, and a verification score. Moving to the Safety page, you can see our leaflet.heat heatmap dynamically update with the new incident. Now let's run the Safer Route Finder: comparing two OSRM routes, CityPulse highlights Route B as Recommended Safest because it bypasses the unlit alley."*

### Minute 2:30 – 3:00: Multi-Metric Comparison & Leaderboards
1. **Action**: Click **Compare**. Select 3 places and adjust the Safety weight slider.
2. **Script**:
   > *"Finally, on the Compare page, users can evaluate 2 to 4 locations side-by-side using our Recharts Radar profile and detailed comparison table. Notice how adjusting the score weight sliders immediately updates composite rankings. CityPulse is 100% free-tier, keyless, and offline-demo resilient."*

---

## 🙋 Judge & Evaluator Q&A Guide

### Q1: What data sources are used, and is any paid API required?
**Answer**: CityPulse is **100% free and keyless**. It uses OpenStreetMap & Overpass for POIs, Open-Meteo for weather/AQI, Nominatim for geocoding, Wikipedia REST API for heritage stories, OSRM for routing, and CARTO for map tiles. All calls have dual-layer caching and local mock fallbacks so the app operates 100% offline ready without credit cards or paid services.

### Q2: How does the AI NLP classification work?
**Answer**: CityPulse utilizes a dual-tier NLP architecture. If a Google Gemini API key is supplied in `.env`, it performs remote LLM classification. Otherwise, it seamlessly falls back to our client-side keyword and sentiment classifier (`src/services/ai.js`), analyzing sentiment, severity (1-5), duplicate detection, and verification confidence score.

### Q3: How are safety scores and safer routes computed?
**Answer**: Area safety score is calculated as `100 - (Weighted Incident Density + Nighttime Penalty - Lighting Factor)`. The Safer Route Finder queries OSRM for route geometries, checks bounding-box incident proximity along polyline coordinates, and scores each route to present a clear "Safest vs Fastest" explanation.

### Q4: How do you distinguish sample data from live data?
**Answer**: Data honesty is enforced in the UI. Live API data is badged **LIVE** (updated timestamp). Cached API data is badged **Cached**. Seeded demo incidents and fallback places are explicitly badged **Sample** and tagged `[Sample]`. Estimated traffic mood is badged **Estimated**.
