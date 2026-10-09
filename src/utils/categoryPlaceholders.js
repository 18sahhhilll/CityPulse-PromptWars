export const getCategoryPlaceholderSvg = (category, placeName = '') => {
  const configs = {
    attraction: { bg1: '#8B5CF6', bg2: '#4C1D95', icon: '🏛️', label: 'Attraction' },
    food: { bg1: '#F59E0B', bg2: '#B45309', icon: '🍜', label: 'Food & Dining' },
    cafe: { bg1: '#D97706', bg2: '#78350F', icon: '☕', label: 'Cafe' },
    hotel: { bg1: '#3B82F6', bg2: '#1E3A8A', icon: '🏨', label: 'Hotel & Stays' },
    budget: { bg1: '#10B981', bg2: '#064E3B', icon: '🏷️', label: 'Budget Spot' },
    park: { bg1: '#22C55E', bg2: '#14532D', icon: '🌳', label: 'Park & Nature' },
    hospital: { bg1: '#EC4899', bg2: '#831843', icon: '🏥', label: 'Medical Facility' },
    police: { bg1: '#6366F1', bg2: '#312E81', icon: '👮', label: 'Police Station' },
  };

  const cfg = configs[category] || configs.attraction;
  const titleText = placeName.length > 25 ? `${placeName.substring(0, 25)}...` : placeName;

  const svgStr = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 225" width="100%" height="100%">
      <defs>
        <linearGradient id="grad_${category}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${cfg.bg1}" />
          <stop offset="100%" stop-color="${cfg.bg2}" />
        </linearGradient>
      </defs>
      <rect width="400" height="225" fill="url(#grad_${category})" />
      <circle cx="200" cy="95" r="45" fill="rgba(255,255,255,0.15)" />
      <text x="200" y="110" font-size="44" text-anchor="middle" dominant-baseline="middle">${cfg.icon}</text>
      <text x="200" y="170" font-size="16" font-family="sans-serif" font-weight="bold" fill="#FFFFFF" text-anchor="middle" opacity="0.95">${titleText || cfg.label}</text>
      <text x="200" y="195" font-size="12" font-family="sans-serif" fill="rgba(255,255,255,0.7)" text-anchor="middle">${cfg.label}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgStr)}`;
};
