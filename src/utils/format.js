export const formatTimeAgo = (dateInput) => {
  if (!dateInput) return 'Recently';
  const date = new Date(dateInput);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
};

export const formatRatingStars = (rating) => {
  return `${Number(rating).toFixed(1)} ★`;
};

export const formatApproxPrice = (place) => {
  if (!place) return '(₹100 - ₹300)';
  if (place.approxPrice) {
    const raw = String(place.approxPrice).trim();
    if (raw.startsWith('(') && raw.endsWith(')')) return raw;
    return `(${raw})`;
  }

  const level = place.priceLevel || '₹';
  const category = (place.category || '').toLowerCase();

  if (category === 'hotel') {
    if (level === '₹₹₹') return '(₹5,000 - ₹15,000)';
    if (level === '₹₹') return '(₹2,000 - ₹5,000)';
    return '(₹1,000 - ₹2,500)';
  }
  if (category === 'budget') {
    return '(₹400 - ₹800)';
  }
  if (category === 'food' || category === 'cafe') {
    if (level === '₹₹₹') return '(₹800 - ₹2,000)';
    if (level === '₹₹') return '(₹200 - ₹500)';
    return '(₹100 - ₹300)';
  }
  if (category === 'attraction') {
    if (level === '₹₹') return '(₹100 - ₹300)';
    return '(₹25 - ₹100)';
  }
  if (category === 'park') {
    return '(₹20 - ₹50)';
  }
  if (category === 'hospital') {
    return '(₹0 - ₹100)';
  }

  if (level === '₹₹₹') return '(₹1,000 - ₹3,000)';
  if (level === '₹₹') return '(₹300 - ₹800)';
  return '(₹100 - ₹300)';
};
