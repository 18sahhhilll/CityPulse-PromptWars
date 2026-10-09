# CityPulse Progress Changelog & Status Summary

## Current Status Summary
- **Current Status**: Complete (Compare Page Location Search UX Implemented)
- **Overall Completion**: 100%
- **Build Status**: Production bundle verified (`npm run build` completed cleanly in 5.29s).

---

## Phased Dated Changelog

### Compare Page Location Search UX Redesign Pass (2026-10-09)
- **Work Built**:
  - Replaced the cluttered chip wall on the Compare page ([`Compare.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/Compare.jsx)) with a clean location search bar and real-time autocomplete dropdown.
  - Selected Locations Bar: Displays currently selected 2 to 4 locations as styled gradient pills with remove `X` controls (enforcing minimum 2 items).
  - Search Input & Dropdown: Live filtering by name, area, and category with `+ Add` / `✓ Selected` action buttons and max 4 selection caps.
- **Build Status**: `npm run build` verified cleanly (2730 modules transformed in 5.29s).

### Supabase Server Setup & Skill Integration Pass (2026-10-09)
- **Work Built**:
  - Installed `@supabase/server` backend package (`npm install @supabase/server`).
  - Added Supabase environment variables (`SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_JWKS_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) to `.env` and documented templates in `.env.example`.
  - Installed `supabase-server` AI coding skill (`npx skills add supabase/server`).
- **Build Status**: `npm run build` verified cleanly (2730 modules transformed in 5.68s).

### Card-to-Map Synchronization & Map Polish Pass (2026-10-09)
- **Work Built**:
  - Implemented `useMapStore.js` Zustand store for stable Leaflet map instance sharing and marker ref registration.
  - Card-to-Map Hover Sync: Hovering any place card on Home ("Top Local Highlights") or Explore Split View smooth-flies the map to `[lat, lng]` at zoom 15 (`duration: 0.8s`), opens the marker popup automatically, and highlights the card with `ring-2 ring-violet-500/60` and Framer Motion scale-up (`scale-[1.02]`).
  - Card-to-Map Hover End: Closes popup while leaving map view at last location without jarring reset.
  - Card Actions: Added a dedicated "View on map" icon button (`MapPin` icon) to fly to place without navigating away, alongside card click navigation to `/explore/:id`.
  - Map View Reset: Added ghost "Reset view" button on top-right of `MapView` returning map to city center at zoom 12.
  - Overpass Place Descriptions Fix: Replaced raw `"listed on OpenStreetMap."` text strings with rich tag-based and category-based descriptions in `overpass.js`.
  - Dark Mode Map Tiles Fix: Applied `dark-map-filter` CSS filter to map wrapper div to ensure OSM fallback tiles render properly inverted in dark mode.
- **Build Status**: `npm run build` verified cleanly (2730 modules transformed in 4.93s).

### Citizen Reporting Navigation & Photo/Voice Verification Pass (2026-10-09)
- **Work Built**:
  - Re-verified full Citizen Reporting flow at `/report` (`ReportPage.jsx`, `ReportForm.jsx`, `PhotoUpload.jsx`, `VoiceRecorder.jsx`).
  - Added direct **"File Report"** CTA buttons to desktop `Navbar.jsx` and `Home.jsx` hero banner alongside the mobile bottom navigation bar button (`+ Report`).
  - Confirmed text description, image upload preview (`FileReader` Base64), Web Speech API voice transcription, AI NLP severity calculation, and live safety heatmap sync.
- **Build Status**: `npm run build` verified cleanly (2729 modules transformed in 6.30s).

### Explore Page Image & Layout Polish Pass (2026-10-09)
- **Work Built**:
  - Implemented 5-tier Image Resolution Priority Chain in `src/services/imageResolver.js`: (1) Wikipedia REST API summary thumbnail, (2) Wikimedia Commons API search, (3) Curated local fallback catalog in `src/assets/places/fallbacks.json`, (4) Category-specific vector SVG placeholders in `src/utils/categoryPlaceholders.js`, (5) Debug attribute `data-img-source`.
  - Added disambiguation suffix stripping for Wikipedia searches (e.g. `Shaniwar Wada` vs `Shaniwar Wada, Pune`).
  - Enhanced `usePlaces.js` to ensure the Explore grid ALWAYS displays 8 to 12+ cards on initial load by combining Overpass results with `places.json` fallback items badged **Sample Data**.
  - Updated grid layout to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` filling full container width properly.
  - Card Polish: Allowed place name up to 2 lines (`line-clamp-2`), shortened Budget badge to `🏷️ Budget`, added `sample` superscript for seeded safety scores, enforced `aspect-video` (16:9) object-cover image rendering.
- **Bugs & Fixes**:
  - *Bug*: Incorrect or missing images on Overpass nodes.
  - *Fix*: Integrated vector SVG placeholders and Wikipedia REST API thumbnails.
  - *Bug*: Card clipping on small screens.
  - *Fix*: Applied `aspect-video` and `min-w-fit truncate` badges.

---

## QA Category Chip Filter Test Matrix (100% PASS)

| Category Chip | Count | Sample Fallback | Result |
|---|---|---|:---:|
| **All Categories** | 8-12+ | Active when Overpass < 4 | **PASS** |
| **Attractions (🏛️)** | 4+ | Local places fallback | **PASS** |
| **Food & Dining (🍜)** | 4+ | Local places fallback | **PASS** |
| **Cafes (☕)** | 3+ | Local places fallback | **PASS** |
| **Stays & Hotels (🏨)** | 3+ | Local places fallback | **PASS** |
| **Budget Spots (🏷️)** | 4+ | Local places fallback | **PASS** |
| **Parks & Nature (🌳)** | 2+ | Local places fallback | **PASS** |
| **Hospitals (🏥)** | 2+ | Local places fallback | **PASS** |
| **Police Stations (👮)** | 2+ | Local places fallback | **PASS** |
