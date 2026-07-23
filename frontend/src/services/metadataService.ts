import { getMovieDetails, searchMovie } from "@/api/tmdb";
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
    cached &&
    cached.version === 2 &&
    Date.now() - cached.cachedAt < 7 * 24 * 60 * 60 * 1000;

  if (isValidCache) {
    return cached;
  }

  const movie = await searchMovie(parsed.title, parsed.year);
  if (!movie) {
    cache[key] = {
      version: 2,
      title: parsed.title,
      year: parsed.year,
      cachedAt: Date.now(),
    };
    saveMetadataCache(cache);
    return null;
  }

  const details = await getMovieDetails(movie.id).catch(() => null);
  const releaseDate = details?.release_date || movie.release_date;
  const releaseYear = releaseDate
    ? Number(releaseDate.slice(0, 4))
    : parsed.year;

  cache[key] = {
    version: 2,
    tmdbId: movie.id,
    title: details?.title ?? movie.title,
    year: releaseYear,

    poster: details?.poster_path ?? movie.poster_path ?? undefined,
    backdrop: details?.backdrop_path ?? movie.backdrop_path ?? undefined,

    overview: details?.overview ?? movie.overview,

    rating: details?.vote_average ?? movie.vote_average,

    releaseDate,
    runtime: details?.runtime ?? undefined,

    genres: details?.genres.map((genre) => genre.name) ?? [],

    cachedAt: Date.now(),
  };

  saveMetadataCache(cache);

  return cache[key];
}
