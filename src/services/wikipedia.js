import { APP_CONFIG } from '../config/app.config';
import { getCachedData, setCachedData } from '../utils/cache';

export const fetchWikipediaSummary = async (title) => {
  if (!title) return null;

  const cacheKey = `wiki_${title}`;
  const cached = getCachedData(cacheKey);
  if (cached !== null && cached !== undefined) return cached;

  try {
    const url = `${APP_CONFIG.apiEndpoints.wikipediaSummary}${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (res.status === 404) {
      setCachedData(cacheKey, null, 24 * 60 * 60 * 1000); // Cache negative hit for 24h
      return null;
    }
    if (!res.ok) throw new Error(`Wikipedia response ${res.status}`);

    const data = await res.json();
    const result = {
      title: data.title,
      extract: data.extract,
      thumbnail: data.thumbnail?.source || null,
      pageUrl: data.content_urls?.desktop?.page || null,
    };

    setCachedData(cacheKey, result, 7 * 24 * 60 * 60 * 1000); // Cache 7 days
    return result;
  } catch (err) {
    return null;
  }
};
