import fs from 'fs';
import path from 'path';

function createSvgPlaceholder(title, icon, color1, color2) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 337" width="100%" height="100%">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${color1}" />
          <stop offset="100%" stop-color="${color2}" />
        </linearGradient>
      </defs>
      <rect width="600" height="337" fill="url(#g)" />
      <circle cx="300" cy="140" r="60" fill="rgba(255,255,255,0.15)" />
      <text x="300" y="155" font-size="60" text-anchor="middle" dominant-baseline="middle">${icon}</text>
      <text x="300" y="240" font-size="24" font-family="sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle">${title}</text>
      <text x="300" y="275" font-size="14" font-family="sans-serif" fill="rgba(255,255,255,0.8)" text-anchor="middle">Curated Local Fallback • CityPulse Pune</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const dir = path.resolve('src/assets/places');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const fallbacks = {
  'shaniwar-wada': createSvgPlaceholder('Shaniwar Wada Palace', '🏛️', '#8B5CF6', '#4C1D95'),
  'aga-khan-palace': createSvgPlaceholder('Aga Khan Palace', '🏛️', '#6366F1', '#312E81'),
  'goodluck-cafe': createSvgPlaceholder('Goodluck Cafe', '☕', '#D97706', '#78350F'),
  'vaishali': createSvgPlaceholder('Vaishali Restaurant', '🍜', '#F59E0B', '#B45309'),
  'jw-marriott': createSvgPlaceholder('JW Marriott Pune', '🏨', '#3B82F6', '#1E3A8A'),
  'backpacker-panda': createSvgPlaceholder('Backpacker Panda', '🏷️', '#10B981', '#064E3B'),
  'empress-garden': createSvgPlaceholder('Empress Botanical Garden', '🌳', '#22C55E', '#14532D'),
  'sassoon-hospital': createSvgPlaceholder('Sassoon General Hospital', '🏥', '#EC4899', '#831843'),
};

fs.writeFileSync(path.join(dir, 'fallbacks.json'), JSON.stringify(fallbacks, null, 2));
console.log('Created local fallback images catalog!');
