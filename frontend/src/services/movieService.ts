import { getDriveVideos } from "@/api/drive";
import { TMDB_IMAGE_BASE, TMDB_POSTER_BASE } from "@/config/tmdb";
import { getMovieMetadata } from "@/services/metadataService";
import type { Movie } from "@/types/movie";
import { parseMovieName } from "@/utils/parseMovieName";
import { promisePool } from "@/utils/promisePool";

interface DriveVideo {
  id: string;
  name: string;
  thumbnailLink?: string;
  modifiedTime: string;
}

let cachedAccessToken: string | undefined;
const movieLibraryPromises = new Map<number, Promise<Movie[]>>();

function buildImageUrl(
  path: string | undefined,
  baseUrl: string,
  fallback: string
) {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function formatRuntime(runtime: number | undefined) {
  if (!runtime || runtime <= 0) return "--:--";

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (!hours) return `${minutes}m`;
  return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
}

function isHevcFile(fileName: string) {
  return /(?:^|[^a-z0-9])(?:hevc|x265|h[.\s_-]?265)(?:[^a-z0-9]|$)/i.test(
    fileName
  );
}

async function loadMovies(
  accessToken: string,
  limit: number
): Promise<Movie[]> {
  const driveVideos = (await getDriveVideos(accessToken, limit)) as DriveVideo[];

  const movies = await promisePool(driveVideos, 10, async (driveVideo) => {
    const parsed = parseMovieName(driveVideo.name);
    const metadata = await getMovieMetadata(driveVideo.name).catch((error) => {
      console.error(`TMDB metadata failed for ${driveVideo.name}:`, error);
      return null;
    });
    const driveThumbnail =
      driveVideo.thumbnailLink ??
      `https://drive.google.com/thumbnail?id=${driveVideo.id}&sz=w400`;
    const driveBackdrop =
      `https://drive.google.com/thumbnail?id=${driveVideo.id}&sz=w1000`;

    return {
      id: driveVideo.id,
      driveFileId: driveVideo.id,
      isHevc: isHevcFile(driveVideo.name),
      title: metadata?.title ?? parsed.title,
      year:
        metadata?.year ??
        parsed.year ??
        new Date(driveVideo.modifiedTime).getFullYear(),
      duration: formatRuntime(metadata?.runtime),
      poster: buildImageUrl(
        metadata?.poster,
        TMDB_POSTER_BASE,
        driveThumbnail
      ),
      backdrop: buildImageUrl(
        metadata?.backdrop,
        TMDB_IMAGE_BASE,
        driveBackdrop
      ),
      description: metadata?.overview ?? "",
      genres: metadata?.genres ?? [],
      rating: metadata?.rating,
      progress: 0,
    };
  });

  return movies.sort(
    (first, second) => Number(first.isHevc) - Number(second.isHevc)
  );
}

export function getMovies(
  accessToken: string,
  limit = 50
): Promise<Movie[]> {
  if (cachedAccessToken !== accessToken) {
    movieLibraryPromises.clear();
    cachedAccessToken = accessToken;
  }

  const existing = movieLibraryPromises.get(limit);
  if (existing) return existing;

  const request = loadMovies(accessToken, limit).catch((error) => {
    movieLibraryPromises.delete(limit);
    throw error;
  });

  movieLibraryPromises.set(limit, request);
  return request;
}
