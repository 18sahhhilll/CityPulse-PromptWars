# CityPulse Design System & UI Specifications

## 1. Visual Vibe & Aesthetics
- **Theme**: "CityPulse" - Neon Nightlife meets Clean Modern Travel App.
- **Style**: Frosted glassmorphism (`backdrop-blur-md bg-slate-900/70 border border-slate-800`), glowing accent borders, subtle gradients, high-contrast dark palette by default with a light mode toggle.
- **Mood**: High-tech, responsive, intuitive, reassuring, and urban.

---

## 2. Color Tokens & Semantic Palette

### Dark Mode (Default)
- **Background Base**: `#0B1020` (`bg-slate-950` / `#0B1020`)
- **Card Background**: `rgba(15, 23, 42, 0.75)` with `backdrop-blur-lg`
- **Border Subtle**: `rgba(255, 255, 255, 0.08)` / `#1E293B`
- **Primary Accent**: Electric Violet to Cyan (`from-violet-600 via-indigo-500 to-cyan-400`)
- **Secondary Accent**: Hot Pink / Amber (`from-pink-500 to-rose-500`)

### Semantic Colors
- **Safe / High Score**: Emerald Green (`#10B981` / `text-emerald-400` / `bg-emerald-500/20`)
- **Caution / Moderate**: Amber Yellow (`#F59E0B` / `text-amber-400` / `bg-amber-500/20`)
- **Danger / Severe**: Rose Red (`#EF4444` / `text-rose-400` / `bg-rose-500/20`)
- **Info / Neutral**: Cyan / Slate (`#06B6D4` / `text-cyan-400` / `bg-slate-800`)

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
- **Dark Mode Tiles**: CartoDB Dark Matter (`https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`)
- **Light Mode Tiles**: CartoDB Positron (`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`)
- **Custom Marker Pins**: Distinct SVG colored pin icons based on category (Violet for attractions, Amber for food, Rose for unsafe, Blue for police/hospitals).
