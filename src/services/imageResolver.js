import { fetchWikipediaSummary } from './wikipedia';
import localFallbacks from '../assets/places/fallbacks.json';
import { getCategoryPlaceholderSvg } from '../utils/categoryPlaceholders';

// Cache for resolved place images to avoid repeated network calls
const imageCache = new Map();

export const resolvePlaceImage = async (place) => {
  if (!place) return { src: '', source: 'none' };
  if (imageCache.has(place.id)) return imageCache.get(place.id);

  const cleanName = (place.name || '')
    .replace(/\(.*?\)/g, '')
    .replace(/Restaurant|Hotel|Cafe|Hostel|General Hospital|Station/gi, '')
    .trim();

  // 1a. Try Wikipedia REST API thumbnail by clean name
  if (cleanName.length > 2) {
    try {
      const wikiSummary = await fetchWikipediaSummary(cleanName);
      if (wikiSummary && wikiSummary.thumbnail) {
        const res = { src: wikiSummary.thumbnail, source: 'wikipedia' };
        imageCache.set(place.id, res);
        return res;
      }
    } catch (err) {
      // Continue to next tier
    }

    // 1b. Try "Name, Pune" on Wikipedia
    try {
      const wikiSummaryPune = await fetchWikipediaSummary(`${cleanName}_Pune`);
      if (wikiSummaryPune && wikiSummaryPune.thumbnail) {
        const res = { src: wikiSummaryPune.thumbnail, source: 'wikipedia' };
        imageCache.set(place.id, res);
        return res;
      }
    } catch (err) {
      // Continue to next tier
    }
  }

  // 1c. Try Wikimedia Commons search by query
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanName)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const cRes = await fetch(commonsUrl);
    if (cRes.ok) {
      const cData = await cRes.json();
      const pages = cData.query?.pages;
      if (pages) {
        const firstPageKey = Object.keys(pages)[0];
        const imgUrl = pages[firstPageKey]?.imageinfo?.[0]?.url;
        if (imgUrl) {
          const res = { src: imgUrl, source: 'commons' };
          imageCache.set(place.id, res);
          return res;
        }
      }
    }
  } catch (err) {
    // Continue to next tier
  }

  // 1d. Curated Local Fallback matching slug
  const slug = (place.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  if (localFallbacks[slug]) {
    const res = { src: localFallbacks[slug], source: 'local' };
    imageCache.set(place.id, res);
    return res;
  }

  // Also check if place.image is valid URL from places.json
  if (place.image && place.image.startsWith('http')) {
    const res = { src: place.image, source: 'curated_url' };
    imageCache.set(place.id, res);
    return res;
  }

  // 1e. Category-Specific Placeholder SVG (clean vector icon + gradient)
  const placeholderSvg = getCategoryPlaceholderSvg(place.category, place.name);
  const res = { src: placeholderSvg, source: 'category_placeholder' };
  imageCache.set(place.id, res);
  return res;
};
