import { getDriveVideos } from "@/api/drive";
import type { Movie } from "@/types/movie";

export async function fetchMovies(
  accessToken: string
): Promise<Movie[]> {
  return await getDriveVideos(accessToken);
}