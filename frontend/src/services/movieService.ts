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

function buildImageUrl(
  path: string | undefined,
  baseUrl: string,
  fallback: string
) {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;

  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getMovies(accessToken: string): Promise<Movie[]> {
  const driveVideos = (await getDriveVideos(accessToken)) as DriveVideo[];
  console.log("movieService driveVideos count", driveVideos.length);

  const movies = await promisePool(driveVideos, 5, async (driveVideo) => {
    const parsed = parseMovieName(driveVideo.name);
    console.log("worker start", driveVideo.name);
    const metadata = await getMovieMetadata(driveVideo.name).catch((error) => {
      console.error(`TMDB metadata failed for ${driveVideo.name}:`, error);
      return null;
    });
    console.log("metadata received", driveVideo.name, metadata);
    const driveThumbnail =
      driveVideo.thumbnailLink ??
      `https://drive.google.com/thumbnail?id=${driveVideo.id}&sz=w400`;
    const driveBackdrop =
      `https://drive.google.com/thumbnail?id=${driveVideo.id}&sz=w1000`;

    console.log("worker return", driveVideo.name);
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

  console.log("movieService movies count", movies.length);
  console.log("getMovies returning", movies.length);
  return movies;
}
