import { getDriveVideos } from "@/api/drive";

export async function fetchMovies(
  accessToken: string
) {
  return await getDriveVideos(accessToken);
}
