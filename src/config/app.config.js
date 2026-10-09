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
  mapTiles: {
    cartoDark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    cartoLight: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    osmFallback: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
