const CACHE_KEY = "driveflix-metadata-cache";

export interface CachedMetadata {
  version?: number;
  tmdbId?: number;
  title: string;
  year?: number;

  poster?: string;
 backdrop?: string;

  overview?: string;

  rating?: number;
  genres?: string[];
  releaseDate?: string;
  runtime?: number;

  cachedAt: number;
}

export function getMetadataCache(): Record<string, CachedMetadata> {
  const cache = localStorage.getItem(CACHE_KEY);

  if (!cache) return {};

  try {
    return JSON.parse(cache);
  } catch {
    return {};
  }
}

export function saveMetadataCache(
  cache: Record<string, CachedMetadata>
) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function createCacheKey(
  title: string,
  year?: number
) {
  return `${title}_${year ?? "unknown"}`
    .toLowerCase()
    .trim();
}
