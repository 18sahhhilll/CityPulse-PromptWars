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

### 7. Light & Gradient Theme Overhaul & Dark Background Purge
- **Zero Black Backgrounds**: Purged hardcoded `bg-dark-bg` and `bg-slate-950` from `PageShell.jsx`, `index.html`, `Footer.jsx`, `StoryCard.jsx`, and `MapView.jsx`.
- **CSS Root Invalidation**: Enforced `html, body, #root { background-color: #f8fafc !important; color: #0f172a; min-height: 100vh; }` in `globals.css`.
- **Pre-Paint Class Sync**: Integrated `useLayoutEffect` in `App.jsx` to toggle `.dark` on `document.documentElement` dynamically before first paint, guaranteeing a soft light background (`#f8fafc`) on app initialization.
- **Gradient Accents**: Integrated vibrant indigo/violet/pink gradient hero banners, card accents, and action controls.
- **Dark Mode Preservation**: Preserved dark mode toggle functionality via `.dark` class targeting in `globals.css` and Tailwind utility classes (`dark:bg-slate-900`, `dark:text-slate-100`).

### 8. Citizen Profile & Report Tracking Flow
- **Profile Dashboard (`/profile`)**: Created citizen profile displaying level badge ("Level 4 Civic Guardian"), trust score (96%), total reports filed, community upvotes received, and tabs for **My Filed Reports**, **Saved Places**, and **Civic Badges**.
- **Report Confirmation Modal**: Upon report submission in `ReportForm.jsx`, displays a success modal informing the user that their report is analyzed by AI and saved to their profile, featuring a direct **"Check My Profile"** CTA button.
- **Report Management**: Added `removeReport` to `useReportStore.js` allowing citizens to delete or view their filed reports on the safety map.

### 9. Navigation Bar De-congestion & Centered Location Sub-Bar Architecture
- **Primary Nav Row**: Cleaned top header bar (`h-16`) containing only Brand Logo (`CityPulse Live`), 6 navigation links (`Home`, `Explore`, `History`, `Safety`, `Compare`, `Insights`), and right action controls (`File Report`, `Profile`, `Saved`, `Theme`).
- **Centered Location Sub-Bar**: Re-architected the location sub-bar into a balanced 3-column flex layout (`sm:w-1/4` left chip, `max-w-xl mx-auto` center search bar, `sm:w-1/4` right spacer).
- **Dead-Center Search Alignment**: Guarantees the Nominatim city search bar sits dead-center on the screen across desktop and tablet viewports.

### 10. Location Approx Prices & Bracket Formatting
- **Dataset Field**: Added explicit `"approxPrice"` property to all place objects in `src/data/places.json` (e.g. `"₹25 - ₹50"`, `"₹100 - ₹300"`, `"₹200 - ₹500"`, `"₹7,000 - ₹15,000"`).
- **Dynamic Helper (`formatApproxPrice`)**: Built `formatApproxPrice` utility in `src/utils/format.js` that automatically wraps approx prices in brackets (e.g. `(₹200 - ₹400)`) and generates category/priceLevel fallbacks for dynamic Overpass OSM places.
- **Global Display Sync**: Synchronized bracket price display across `PlaceCard.jsx`, `PlaceDetail.jsx`, `MarkerLayer.jsx` map popups, and `Compare.jsx` badges, search dropdowns, and comparison table rows.

### 11. Map Popup Light Mode High-Contrast Text Fix
- **Root Cause**: `MarkerLayer.jsx` hardcoded dark mode text classes (`text-slate-100`, `text-slate-400`, `border-slate-800`), causing white text on white popup background when rendered in light mode.
- **Work Built**:
  - Updated `MarkerLayer.jsx` popup title to `text-slate-900 dark:text-slate-100`, address to `text-slate-600 dark:text-slate-400`, divider border to `border-slate-200 dark:border-slate-800`, price to `text-emerald-600 dark:text-emerald-400`, and details link to `text-indigo-600 dark:text-cyan-400`.
  - Enforced `.leaflet-popup-content { color: #0f172a !important; }` in `globals.css` with `.dark .leaflet-popup-content { color: #f8fafc !important; }` override.

### 12. Global Light & Dark Theme Text Contrast Audit
- **Root Cause**: Pages such as `About.jsx`, `Settings.jsx`, `Saved.jsx`, and `Modal.jsx` contained hardcoded `text-slate-100`, `text-slate-300`, `text-slate-400`, and `bg-slate-900` tokens left over from legacy dark styling. In light theme, this resulted in low-contrast white/grey text on light card backgrounds.
- **Work Built**: Replaced all hardcoded text tokens with responsive theme pairings across `About.jsx`, `Settings.jsx`, `Saved.jsx`, `Modal.jsx`, and `Footer.jsx`:
  - Main Page Titles: `text-slate-900 dark:text-slate-100`
  - Subtitles & Descriptions: `text-slate-500 dark:text-slate-400`
  - Card Headings & Bold Text: `text-slate-900 dark:text-slate-100`
  - Card Body Text: `text-slate-600 dark:text-slate-300`
  - Card Containers & Dividers: `bg-slate-50 dark:bg-slate-900/60`, `border-slate-200 dark:border-slate-800`

### 13. Safety Heatmap Opacity & Visibility Optimization
- **Root Cause**: Default Leaflet heat layer settings (`minOpacity: 0.05`, `intensity` scaled down) produced faint, translucent, 5% opacity spots that were barely visible against map tiles.
- **Work Built**:
  - Boosted point intensity formula in `HeatLayer.jsx`: `Math.max(0.6, Math.min(1.0, (severity / 5) * 1.25))`.
  - Set `minOpacity: 0.7`, `radius: 40`, `blur: 15`, and `maxZoom: 14` in `HeatLayer.jsx` & `Safety.jsx`.
  - Applied vivid high-contrast gradient (`#3b82f6` -> `#06b6d4` -> `#10b981` -> `#f59e0b` -> `#ef4444` -> `#b91c1c`) so incident heatspots stand out clearly in light and dark map modes.

### 14. Supabase Auth & Dynamic Citizen Profile Integration
- **Hardcoded User Removal**: Removed static mock user ("Sahil Deshmukh", initials "SD") from `Profile.jsx`.
- **Zustand Auth Store (`useAuthStore.js`)**: Built `useAuthStore` connecting directly to Supabase Auth (`supabase.auth.signInWithPassword`, `supabase.auth.signUp`, `supabase.auth.signOut`, `onAuthStateChange`). In offline mode, dynamically manages citizen session in `localStorage`.
- **Auth Modal (`AuthModal.jsx`)**: Implemented a responsive Sign In / Sign Up modal allowing citizens to authenticate with email & password, full name metadata, and instant profile sync.
- **Dynamic Profile Rendering**: Renders user's authentic name, email, avatar initials, joined date, civic level badge, and sign out control when logged in, with guest mode advisories when unauthenticated.

---

## Solved Quirks & Bugs
- *Wikipedia 404 Console Log Cleanup*: Silenced console warning logs on 404 Wikipedia REST summary requests in `wikipedia.js` and added 24h negative caching to avoid redundant API hits.
- *Profile Page TypeError*: Fixed `Cannot read properties of undefined (reading 'length')` in `Profile.jsx` by accessing `favoriteIds` from `useFavoriteStore` and filtering `allPlaces` via `usePlaces`.
- *Explore Grid Clipping*: Fixed card grid layout to fill full width across screen break points.
- *Budget Badge Clipping*: Shortened label to `🏷️ Budget` with `min-w-fit truncate` to prevent overflow.
- *Sample Safety Score Transparency*: Added `sample` superscript to safety scores derived from seeded datasets.
- *Image Distortion*: Enforced `aspect-video` (16:9) with `object-cover` across all place thumbnails.
- *Raw OSM Attribution Descriptions*: Replaced raw `X listed on OpenStreetMap.` text with rich category and tag-based fallbacks in `overpass.js`.
- *Dark Theme Map Tiles*: Applied `dark-map-filter` CSS filter on container wrapper when OSM fallback tiles are active in dark mode.
