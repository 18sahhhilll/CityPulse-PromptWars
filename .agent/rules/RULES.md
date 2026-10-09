# CityPulse Agent Rules (Mirrored from docs/RULES.md)

1. FREE ONLY: Use free APIs and free tiers only. No paid services.
2. Read secrets from `.env` and supply `.env.example`.
3. Every external call must have loading state, error state, dual-layer caching, and local fallback data.
4. Respect API rate limits (e.g. Nominatim 1 req/sec with debouncing).
5. Mobile-first responsive UI, dark-mode default with light mode toggle.
6. Functional React 18, Zustand, Framer Motion, Leaflet, Recharts, Lucide icons.
7. Update TASKS.md, MEMORY.md, and PROGRESS.md continuously.
