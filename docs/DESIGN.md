# CityPulse Design System & UI Specifications

## 1. Visual Vibe & Aesthetics
- **Theme**: "CityPulse" - Premium Travel App meets Smart City Dashboard (Airbnb + Linear + Stripe vibe).
- **Style**: Bright, airy, confident, and modern. Clean white/light base with bold indigo/violet/pink gradient accents, soft elevation shadows (`0 4px 16px rgba(99,102,241,0.12)`), glassmorphism cards (`rgba(255, 255, 255, 0.92)`), vibrant category colors, light mode by default with full dark mode toggle support.
- **Mood**: Elevating, high-tech, responsive, intuitive, reassuring, and urban.

---

## 2. Color Tokens & Semantic Palette

### Light Mode (Default)
- **Background Base**: `#F8FAFC` (`var(--bg-page)`)
- **Card Background**: `#FFFFFF` (`var(--bg-card)`)
- **Muted Surface**: `#F1F5F9` (`var(--bg-muted)`)
- **Border Subtle**: `#E2E8F0` (`var(--border)`)
- **Text Primary**: `#0F172A` (`var(--text-primary)`)
- **Text Secondary**: `#475569` (`var(--text-secondary)`)
- **Text Muted**: `#94A3B8` (`var(--text-muted)`)
- **Primary Accent**: Indigo (`#6366F1` / `#4F46E5`), Violet (`#8B5CF6`), Pink (`#EC4899`)
- **Gradients**:
  - `gradient-hero`: `linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)`
  - `gradient-card`: `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`
  - `gradient-safe`: `linear-gradient(135deg, #10b981 0%, #06b6d4 100%)`
  - `gradient-warm`: `linear-gradient(135deg, #f97316 0%, #ec4899 100%)`
  - `gradient-sky`: `linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)`

### Dark Mode (Toggle Option)
- **Background Base**: `#0F172A` (`bg-slate-900`)
- **Card Background**: `#1E293B` (`bg-slate-800`)
- **Border Subtle**: `#334155` (`border-slate-700`)
- **Text Primary**: `#F8FAFC` (`text-slate-50`)

### Semantic Colors
- **Safe / High Score**: Emerald Green (`#10B981` / `text-emerald-600` / `bg-emerald-50`)
- **Caution / Moderate**: Amber Yellow (`#F59E0B` / `text-amber-600` / `bg-amber-50`)
- **Danger / Severe**: Rose Red (`#EF4444` / `text-rose-600` / `bg-rose-50`)
- **Info / Neutral**: Cyan / Indigo (`#06B6D4` / `#6366F1` / `bg-indigo-50`)

---

## 3. Typography & Icons
- **Headings**: Google Fonts "Space Grotesk" or "Poppins" (bold, clean geometric styling).
- **Body**: Google Fonts "Inter" (ultra-legible at all font sizes).
- **Icons**: Lucide React + Emojis for quick visual scanning:
  - 🍜 Food & Dining
  - 🏨 Stays & Hotels
  - 🏛️ Heritage & History
  - 🛡️ Safety & Security
  - ☔ Weather & AQI
  - 🚦 Traffic & Routing
  - 🚨 SOS & Emergency

---

## 4. UI Layout Wireframes (ASCII)

### Desktop Navigation Layout
```
+-------------------------------------------------------------------------+
| [CityPulse Logo]  [Search City...]  [Home] [Explore] [History] [Safety] |
+-------------------------------------------------------------------------+
| [ Left Sidebar Filters ]  | [ Main Interactive Leaflet Map View ]       |
|  - Categories             |                                             |
|  - Price range (₹ ₹₹ ₹₹₹) | [ Selected Place Card Overlay ]             |
|  - Pulse Score Slider     |                                             |
+-------------------------------------------------------------------------+
| [ Bottom Status Bar: Weather 28°C | AQI 42 | Safety 88% | Traffic Normal] |
+-------------------------------------------------------------------------+
```

### Mobile Layout
```
+------------------------------------+
| [CityPulse]   [Search]  [Theme]    |
+------------------------------------+
|                                    |
|   [ Mobile Map / Card Feed ]       |
|                                    |
+------------------------------------+
| [Home] [Explore]  (+)  [Safety] [More]|
|                  Report             |
+------------------------------------+
```

---

## 5. Map Styling Rules
- **Tile Priority**:
  - Priority 1: MapTiler (`api.maptiler.com`) Dataviz Light / Dark (if key configured)
  - Priority 2: Stadia (`tiles.stadiamaps.com`) Alidade Smooth Light / Dark
  - Priority 3: OpenStreetMap fallback (`tile.openstreetmap.org`) with CSS filter for dark mode
- **Custom Marker Pins**: Distinct SVG colored pin icons based on category (Violet for attractions, Amber for food, Rose for unsafe, Blue for police/hospitals).
