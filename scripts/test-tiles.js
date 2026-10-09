async function testTileUrls() {
  const maptilerKey = '9klkbJS6CnSQwYezzIQ3';
  const cartoKey = 'cb1_4f0r_1_0b93d5b8f1e4b20459859d1c';

  const urls = [
    `https://api.maptiler.com/maps/dataviz-dark/256/13/5769/3545.png?key=${maptilerKey}`,
    `https://api.maptiler.com/maps/dataviz-dark/13/5769/3545.png?key=${maptilerKey}`,
    `https://a.basemaps.cartocdn.com/dark_all/13/5769/3545.png?key=${cartoKey}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`URL: ${url} -> Status: ${res.status}`);
    } catch (err) {
      console.error(`URL: ${url} -> Error: ${err.message}`);
    }
  }
}

testTileUrls();
