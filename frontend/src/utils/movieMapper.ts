import type { Movie } from "@/types/movie";

interface DriveMovie {
  id: string;
  name: string;
  thumbnailLink?: string;
  modifiedTime: string;
}

export function mapDriveMovieToMovie(
  driveMovie: DriveMovie
): Movie {
  return {
    id: driveMovie.id,

    driveFileId: driveMovie.id,

    title: driveMovie.name.replace(/\.[^/.]+$/, ""),

    year: new Date(driveMovie.modifiedTime).getFullYear(),

    duration: "--:--",

    // poster: driveMovie.thumbnailLink ?? "",
    poster: `https://drive.google.com/thumbnail?id=${driveMovie.id}&sz=w400`,

    // backdrop: driveMovie.thumbnailLink ?? "",
    backdrop: `https://drive.google.com/thumbnail?id=${driveMovie.id}&sz=w1000`,

    description: "",

    genres: [],

    rating: undefined,

    progress: 0,
  };
}