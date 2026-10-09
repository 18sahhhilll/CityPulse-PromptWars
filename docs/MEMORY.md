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

---

## Solved Quirks & Bugs
- *Explore Grid Clipping*: Fixed card grid layout to fill full width across screen break points.
- *Budget Badge Clipping*: Shortened label to `🏷️ Budget` with `min-w-fit truncate` to prevent overflow.
- *Sample Safety Score Transparency*: Added `sample` superscript to safety scores derived from seeded datasets.
- *Image Distortion*: Enforced `aspect-video` (16:9) with `object-cover` across all place thumbnails.
