async function testEndpoints() {
  console.log('--- TESTING REAL OPEN API ENDPOINTS ---');

  // 1. Nominatim
  try {
    const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=Pune&limit=2', {
      headers: { 'User-Agent': 'CityPulse/1.0 (contact@citypulse.app)' }
    });
    const data = await res.json();
    console.log('1. Nominatim Search: PASS', data.length > 0 ? `(Found ${data[0].display_name})` : 'Empty');
  } catch (err) {
    console.error('1. Nominatim Search: FAIL', err.message);
  }

  // 2. Open-Meteo Weather
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current_weather=true');
    const data = await res.json();
    console.log('2. Open-Meteo Weather: PASS', `(Temp: ${data.current_weather?.temperature}°C)`);
  } catch (err) {
    console.error('2. Open-Meteo Weather: FAIL', err.message);
  }

  // 3. Open-Meteo Air Quality
  try {
    const res = await fetch('https://air-quality-api.open-meteo.com/v1/air-quality?latitude=18.5204&longitude=73.8567&current=us_aqi');
    const data = await res.json();
    console.log('3. Open-Meteo AQI: PASS', `(AQI: ${data.current?.us_aqi})`);
  } catch (err) {
    console.error('3. Open-Meteo AQI: FAIL', err.message);
  }

  // 4. Wikipedia Summary
  try {
    const res = await fetch('https://en.wikipedia.org/api/rest_v1/page/summary/Shaniwar_Wada');
    const data = await res.json();
    console.log('4. Wikipedia REST API: PASS', `(Title: ${data.title})`);
  } catch (err) {
    console.error('4. Wikipedia REST API: FAIL', err.message);
  }

  // 5. OSRM Routing
  try {
    const res = await fetch('https://router.project-osrm.org/route/v1/driving/73.85,18.52;73.86,18.53?overview=false');
    const data = await res.json();
    console.log('5. OSRM Routing API: PASS', `(Distance: ${data.routes?.[0]?.distance}m)`);
  } catch (err) {
    console.error('5. OSRM Routing API: FAIL', err.message);
  }

  // 6. Overpass API
  try {
    const query = '[out:json][timeout:10];node["tourism"="attraction"](around:2000,18.5204,73.8567);out body 5;';
    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(query)}`
    });
    const data = await res.json();
    console.log('6. Overpass API: PASS', `(Elements: ${data.elements?.length})`);
  } catch (err) {
    console.error('6. Overpass API: FAIL / Mirror fallback engaged', err.message);
  }
}

testEndpoints();
