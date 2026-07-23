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

async function loadMovies(
  accessToken: string,
  limit: number
): Promise<Movie[]> {
  const driveVideos = (await getDriveVideos(accessToken, limit)) as DriveVideo[];

  return promisePool(driveVideos, 10, async (driveVideo) => {
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
      title: metadata?.title ?? parsed.title,
      year:
        metadata?.year ??
        parsed.year ??
        new Date(driveVideo.modifiedTime).getFullYear(),
      duration: "--:--",
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
      genres: metadata?.genres?.map(String) ?? [],
      rating: metadata?.rating,
      progress: 0,
    };
  });
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
