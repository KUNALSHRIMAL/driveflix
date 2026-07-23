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
    cached && Date.now() - cached.cachedAt < 7 * 24 * 60 * 60 * 1000;

  if (isValidCache) {
    return cached;
  }

  const movie = await searchMovie(parsed.title, parsed.year);
  if (!movie) {
    cache[key] = {
      title: parsed.title,
      year: parsed.year,
      cachedAt: Date.now(),
    };
    saveMetadataCache(cache);
    return null;
  }

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
