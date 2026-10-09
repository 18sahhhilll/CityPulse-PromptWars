export const APP_CONFIG = {
  appName: 'CityPulse',
  tagline: 'Exploring, Experiencing & Navigating the Chaos We Call Home',
  defaultCity: {
    name: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    lat: 18.5204,
    lng: 73.8567,
    zoom: 13,
    boundingbox: [18.4, 18.6, 73.7, 74.0],
  },
  mapTilePriorities: {
    maptiler: {
      dark: (key) => `https://api.maptiler.com/maps/dataviz-dark/{z}/{x}/{y}.png?key=${key}`,
      light: (key) => `https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=${key}`,
      attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    stadia: {
      dark: (key) => `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png${key ? `?api_key=${key}` : ''}`,
      light: (key) => `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png${key ? `?api_key=${key}` : ''}`,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
    osm: {
      dark: () => 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      light: () => 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  apiEndpoints: {
    nominatim: 'https://nominatim.openstreetmap.org',
    overpass: [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.khtml.disroot.org/api/interpreter',
    ],
    openMeteoWeather: 'https://api.open-meteo.com/v1/forecast',
    openMeteoAirQuality: 'https://air-quality-api.open-meteo.com/v1/air-quality',
    wikipediaSummary: 'https://en.wikipedia.org/api/rest_v1/page/summary/',
    osrmRouting: 'https://router.project-osrm.org/route/v1',
  },
  cacheTTL: {
    weather: 15 * 60 * 1000, // 15 mins
    places: 60 * 60 * 1000,  // 1 hour
    search: 24 * 60 * 60 * 1000, // 24 hours
  },
  emergencyContacts: {
    national: '112',
    police: '100',
    ambulance: '108',
    fire: '101',
    womenHelpline: '1091',
  },
};
