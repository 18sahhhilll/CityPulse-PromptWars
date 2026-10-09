# CityPulse Long-Term Memory & Architecture Decisions

## Key Architectural Decisions

### 1. Offline-First Dual Storage Strategy
- **Primary**: Remote Supabase client for citizen reports & media storage (if keys supplied in `.env`).
- **Fallback**: Browser `IndexedDB` / `localStorage` store automatically engaged when Supabase keys are missing or API requests fail.
- **Result**: CityPulse functions seamlessly in zero-config offline mode for local demonstration without displaying blank screens.

### 2. Image Resolution Priority Chain (Explore & Place Cards)
1. **Wikipedia REST API Thumbnail**: Fetched by exact place name (`/api/rest_v1/page/summary/{title}`). Disambiguation tags like `(Pune)` are stripped and retried automatically.
2. **Wikimedia Commons Search API**: Query by place name if summary thumbnail is missing.
3. **Curated Local Fallback Images**: Curated catalog in `src/assets/places/fallbacks.json` for Pune's top attractions.
4. **Category Vector Placeholder SVG**: Clean vector icon + gradient generated dynamically in `src/utils/categoryPlaceholders.js` so cards never render broken or incorrect images.
5. **Debug Attribute**: Every card `<img>` tag logs its source (`data-img-source="wikipedia" | "commons" | "local" | "category_placeholder"`).

### 3. Grid Layout & Overpass Fallback Resilience
- The Explore grid renders at least **8 to 12+ cards on initial load**.
- If Overpass returns < 4 items, it immediately supplements with local places from `src/data/places.json` with a **Sample Data** badge.
- Full width grid styling: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` in List View and `grid-cols-1 sm:grid-cols-2` in Split View.

### 4. Card-to-Map Synchronization & Leaflet Store (`useMapStore.js`)
- **Shared Map Instance**: `useMapStore` Zustand store maintains a stable reference to active Leaflet `map` instance and registered `markerRefs`.
- **Smooth Fly-to & Popup**: Hovering or clicking any `PlaceCard` on Home or Explore Split View triggers `map.flyTo([lat, lng], 15, { duration: 0.8 })` and opens the place marker popup.
- **Card Styling**: Active cards receive `ring-2 ring-violet-500/60` and Framer Motion `scale-[1.02]`.
- **Map Control**: Ghost "Reset view" button on `MapView` returns to city center at zoom 12. "View on map" icon button on cards triggers fly-to without page navigation.

### 5. Supabase Server Integration (`@supabase/server`)
- **Backend Package**: Installed `@supabase/server` package for server-side auth verification and Supabase context handling.
- **Environment Keys**: Added `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_JWKS_URL`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` to `.env` (git-ignored) and `.env.example`.
- **AI Skill**: Configured `supabase-server` AI coding skill under `.\.agents\skills\supabase-server`.

### 6. Compare Page Location Search UX Redesign
- **Search & Filter Selection**: Replaced the crowded chip wall on the Compare page with a clean search bar and real-time autocomplete dropdown filtering by location name, category, or area.
- **Selected Location Badges**: Active 2 to 4 selected locations are displayed as gradient pills with single-click remove `X` controls (minimum 2 items enforced).
- **Max Selection Safety**: Intelligently disables selection when 4 locations are active, guiding the user to swap out locations.

---

## Solved Quirks & Bugs
- *Explore Grid Clipping*: Fixed card grid layout to fill full width across screen break points.
- *Budget Badge Clipping*: Shortened label to `🏷️ Budget` with `min-w-fit truncate` to prevent overflow.
- *Sample Safety Score Transparency*: Added `sample` superscript to safety scores derived from seeded datasets.
- *Image Distortion*: Enforced `aspect-video` (16:9) with `object-cover` across all place thumbnails.
- *Raw OSM Attribution Descriptions*: Replaced raw `X listed on OpenStreetMap.` text with rich category and tag-based fallbacks in `overpass.js`.
- *Dark Theme Map Tiles*: Applied `dark-map-filter` CSS filter on container wrapper when OSM fallback tiles are active in dark mode.
