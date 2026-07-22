import { searchMovie } from "@/api/tmdb";
import { parseMovieName } from "@/utils/parseMovieName";

import {
  createCacheKey,
  getMetadataCache,
  saveMetadataCache,
} from "./metadataCache";

export async function getMovieMetadata(fileName: string) {
  const parsed = parseMovieName(fileName);

  const key = createCacheKey(parsed.title, parsed.year);

  const cache = getMetadataCache();

  const cached = cache[key];

  const isValidCache =
    cached && cached.poster && cached.backdrop && cached.overview;

  if (isValidCache) {
    console.log("✅ Cache Hit:", parsed.title);
    return cached;
  }

  console.log("🌐 TMDB:", parsed.title);

  const movie = await searchMovie(parsed.title, parsed.year);
  console.log("TMDB Response:", movie);
  if (!movie) return null;

  cache[key] = {
    title: movie.title,
    year: parsed.year,

    poster: movie.poster_path,
    backdrop: movie.backdrop_path,

    overview: movie.overview,

    rating: movie.vote_average,

    releaseDate: movie.release_date,

    genres: movie.genre_ids,

    cachedAt: Date.now(),
  };

  saveMetadataCache(cache);

  return cache[key];
}
