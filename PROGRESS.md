# CityPulse Progress Changelog & Status Summary

## Current Status Summary
- **Current Status**: Complete (Safety Heatmap Opacity & Intensity Boosted for High Visibility)
- **Overall Completion**: 100%
- **Build Status**: Production bundle verified (`npm run build` completed cleanly in 10.37s).

---

## Phased Dated Changelog

### Git Commit & Push to Remote (2026-10-09)
- **Work Built**:
  - Staged all modified and untracked files (`src/components/auth/`, `src/pages/Profile.jsx`, `src/store/useAuthStore.js`, etc.).
  - Created commit `04ac20d`: `"feat: full light theme rebuild, Supabase Auth integration, citizen profile, location bracket pricing, safety heatmap boost, and UI polish"`.
  - Successfully pushed to remote repository `https://github.com/18sahhhilll/CityPulse-PromptWars.git` on branch `main`.
- **Build Status**: Verified production build clean (`npm run build`).

### Safety Heatmap Opacity & Visibility Optimization Pass (2026-10-09)
- **Root Cause**: Default Leaflet heat layer settings (`minOpacity: 0.05`, unscaled intensity) caused incident heatspots to render at 5% opacity, resulting in pale, translucent, hard-to-recognize spots on the Safety map.
- **Work Built**:
  - Refactored [`HeatLayer.jsx`](file:///c:/Projects/PromptWars-Project/src/components/map/HeatLayer.jsx) point intensity calculation: `Math.max(0.6, Math.min(1.0, (severity / 5) * 1.25))`.
  - Added `minOpacity: 0.7`, `radius: 40`, `blur: 15`, and `maxZoom: 14` props in `HeatLayer.jsx` and [`Safety.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/Safety.jsx).
  - Configured high-contrast gradient (`#3b82f6` -> `#06b6d4` -> `#10b981` -> `#f59e0b` -> `#ef4444` -> `#b91c1c`) so incident heatspots stand out vividly across light and dark map modes.
- **Build Status**: `npm run build` verified cleanly (2732 modules transformed in 10.37s).

### Global Light & Dark Theme Text Contrast Audit Pass (2026-10-09)
- **Root Cause**: Identified hardcoded dark text tokens (`text-slate-100`, `text-slate-300`, `text-slate-400`, `bg-slate-900`) across [`About.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/About.jsx), [`Settings.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/Settings.jsx), [`Saved.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/Saved.jsx), [`Modal.jsx`](file:///c:/Projects/PromptWars-Project/src/components/ui/Modal.jsx), and [`Footer.jsx`](file:///c:/Projects/PromptWars-Project/src/components/layout/Footer.jsx), which caused low-contrast white/faint text on white backgrounds in light mode.
- **Work Built**:
  - Replaced all hardcoded text classes with theme-responsive Tailwind pairings (`text-slate-900 dark:text-slate-100` for titles, `text-slate-600 dark:text-slate-300` for body text, `text-slate-500 dark:text-slate-400` for descriptions).
  - Updated card containers & borders to `bg-slate-50 dark:bg-slate-900/60` and `border-slate-200 dark:border-slate-800`.
- **Build Status**: `npm run build` verified cleanly (2732 modules transformed in 5.65s).

### Map Popup Light Mode High-Contrast Text Pass (2026-10-09)
- **Root Cause**: [`MarkerLayer.jsx`](file:///c:/Projects/PromptWars-Project/src/components/map/MarkerLayer.jsx) used hardcoded dark mode text classes (`text-slate-100`, `text-slate-400`, `border-slate-800`), causing popup place titles (e.g. "Vaishali Restaurant") to render white text on white popup background in light mode.
- **Work Built**:
  - Refactored [`MarkerLayer.jsx`](file:///c:/Projects/PromptWars-Project/src/components/map/MarkerLayer.jsx) popup title to `text-slate-900 dark:text-slate-100` (deep charcoal text in light mode, crisp white in dark mode).
  - Updated address text to `text-slate-600 dark:text-slate-400`, section divider to `border-slate-200 dark:border-slate-800`, price text to `text-emerald-600 dark:text-emerald-400`, and details link to `text-indigo-600 dark:text-cyan-400`.
  - Added global base CSS rules in [`globals.css`](file:///c:/Projects/PromptWars-Project/src/styles/globals.css) enforcing `.leaflet-popup-content { color: #0f172a !important; }` in light mode and `#f8fafc` in dark mode.
- **Build Status**: `npm run build` verified cleanly (2732 modules transformed in 6.06s).

### Location Approx Prices & Bracket Formatting Pass (2026-10-09)
- **Work Built**:
  - Added explicit `"approxPrice"` fields to all location entries in [`places.json`](file:///c:/Projects/PromptWars-Project/src/data/places.json) (e.g., `"₹25 - ₹50"`, `"₹100 - ₹300"`, `"₹200 - ₹500"`, `"₹7,000 - ₹15,000"`).
  - Updated [`overpass.js`](file:///c:/Projects/PromptWars-Project/src/services/overpass.js) to compute realistic approx prices for dynamic OpenStreetMap elements.
  - Implemented `formatApproxPrice(place)` helper function in [`format.js`](file:///c:/Projects/PromptWars-Project/src/utils/format.js) to standardize bracket formatting `(₹200 - ₹400)`.
  - Integrated bracket price displays across [`PlaceCard.jsx`](file:///c:/Projects/PromptWars-Project/src/components/cards/PlaceCard.jsx), [`PlaceDetail.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/PlaceDetail.jsx), [`MarkerLayer.jsx`](file:///c:/Projects/PromptWars-Project/src/components/map/MarkerLayer.jsx) Leaflet popups, and [`Compare.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/Compare.jsx) location badges, search dropdowns, and comparison tables.
- **Build Status**: `npm run build` verified cleanly (2732 modules transformed in 5.83s).

### Navigation Bar De-congestion & Centered City Search Bar Pass (2026-10-09)
- **Work Built**:
  - Re-architected [`Navbar.jsx`](file:///c:/Projects/PromptWars-Project/src/components/layout/Navbar.jsx) location sub-bar layout into a balanced 3-column flex container.
  - Primary Nav Row (`h-16`): Now cleanly houses only the Brand Logo (`CityPulse Live`), 6 navigation links (`Home`, `Explore`, `History`, `Safety`, `Compare`, `Insights`), and action buttons (`File Report`, `Profile`, `Saved`, `Theme`). Enabled `md:flex` breakpoint visibility for nav links.
  - Centered Search Sub-Bar: Positioned the Nominatim city search input bar (`max-w-xl mx-auto`) dead-center on the screen with a `1/4` width left container for `Active City: Pune (Maharashtra)` chip and a `1/4` width right spacer for perfect layout symmetry.
- **Build Status**: `npm run build` verified cleanly (2732 modules transformed in 8.43s).

### Wikipedia 404 Console Log Cleanup Pass (2026-10-09)
- **Work Built**:
  - Refactored `fetchWikipediaSummary` in [`wikipedia.js`](file:///c:/Projects/PromptWars-Project/src/services/wikipedia.js) to catch HTTP 404 non-existent page responses silently.
  - Implemented 24-hour negative caching (`setCachedData(cacheKey, null)`) for 404 hits to prevent redundant external API requests.
  - Removed noisy `console.warn` log outputs to maintain a clean browser DevTools console.
- **Build Status**: `npm run build` verified cleanly (2731 modules transformed in 6.98s).

### Profile Page Runtime TypeError Fix Pass (2026-10-09)
- **Root Cause**: [`Profile.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/Profile.jsx) attempted to read `favorites.length` from `useFavoriteStore`, but the store state property is named `favoriteIds` (array of place IDs).
- **Work Built**:
  - Imported `usePlaces` hook and replaced invalid `favorites` reference with `favoriteIds` and `savedPlaces` filter (`allPlaces.filter(p => favoriteIds.includes(p.id))`).
  - Updated Saved Places tab label count to `favoriteIds.length` and list rendering to `savedPlaces.map()`.
- **Build Status**: `npm run build` verified cleanly (2731 modules transformed in 7.97s).

### Full Light Theme Rebuild Pass (2026-10-09)
- **Work Built**:
  - Set default theme to `'light'` in `src/store/useSettingsStore.js` and synced HTML dark class in `src/App.jsx` using `useLayoutEffect`.
  - Removed hardcoded `class="dark"` from `index.html` and updated body background to `bg-slate-50 text-slate-900`.
  - Added global base background rules in `src/styles/globals.css` enforcing `html, body, #root { background-color: #f8fafc !important; color: #0f172a; min-height: 100vh; }`.
  - Replaced hardcoded `bg-dark-bg` in `src/components/layout/PageShell.jsx` with `bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100`.
  - Updated `Footer.jsx`, `StoryCard.jsx`, `MapView.jsx`, `Navbar.jsx`, `BottomNav.jsx`, and all page shells to guarantee zero black backgrounds remain in light mode.
- **Build Status**: `npm run build` verified cleanly (2731 modules transformed in 5.41s).

### Citizen Profile & Report Confirmation Flow Pass (2026-10-09)
- **Work Built**:
  - Built dedicated **Citizen Profile** page ([`Profile.jsx`](file:///c:/Projects/PromptWars-Project/src/pages/Profile.jsx)) registered at `/profile`.
  - Added user header banner with level badge ("Level 4 Civic Guardian"), stats grid (Reports Filed, Community Upvotes, 96% AI Trust Score, Civic Impact rating), and tabs for **My Filed Reports**, **Saved Places**, and **Civic Badges & Achievements**.
  - Integrated report confirmation success modal in [`ReportForm.jsx`](file:///c:/Projects/PromptWars-Project/src/components/forms/ReportForm.jsx) informing users that their report is analyzed by AI and saved to their profile, with a direct **"Check My Profile"** CTA button.
  - Added `removeReport` function in [`useReportStore.js`](file:///c:/Projects/PromptWars-Project/src/store/useReportStore.js) enabling report management and deletion from profile with localStorage sync.
  - Updated [`Navbar.jsx`](file:///c:/Projects/PromptWars-Project/src/components/layout/Navbar.jsx) and [`BottomNav.jsx`](file:///c:/Projects/PromptWars-Project/src/components/layout/BottomNav.jsx) with direct "Profile" links and `User` icon buttons.
- **Build Status**: `npm run build` verified cleanly (2731 modules transformed in 8.59s).

### Light & Gradient Theme Overhaul Pass (2026-10-09)
- **Work Built**:
  - Replaced dark theme tokens with light-first palette (`brand`, `accent`, `surface`, `text`) in `tailwind.config.js`.
  - Configured `:root` CSS variables, light glass panels (`rgba(255, 255, 255, 0.92)`), Leaflet popups, scrollbars, and `.dark` mode overrides in `src/styles/globals.css`.
  - Set default theme to `'light'` in `src/store/useSettingsStore.js` with instant root element class synchronization.
  - Updated all page layouts (`Home.jsx`, `Safety.jsx`, `History.jsx`, `Compare.jsx`, `Insights.jsx`, `ReportPage.jsx`, `ReportForm.jsx`, `Explore.jsx`) with clean light surface backgrounds, crisp text contrast, soft elevation shadows (`rgba(99, 102, 241, 0.12)`), and bold gradient banners (`from-indigo-600 via-violet-600 to-pink-500`).
  - Refactored `SearchBar.jsx` search input, budget chip, and category chips to render cleanly on light surfaces with dark mode fallbacks.
  - Refactored components (`Navbar.jsx`, `BottomNav.jsx`, `PlaceCard.jsx`, `WeatherCard.jsx`, `ScoreCard.jsx`, `AlertCard.jsx`, `Badge.jsx`, `Button.jsx`, `Skeleton.jsx`, `EmptyState.jsx`) to adopt light-first styling while maintaining full dark mode toggle functionality.
- **Build Status**: `npm run build` verified cleanly (2730 modules transformed in 5.80s).

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
