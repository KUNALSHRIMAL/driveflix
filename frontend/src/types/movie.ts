export interface Movie {
  id: string;

  title: string;

  year: number;

  duration: string;

  poster: string;

  backdrop?: string;

  description?: string;

  genres?: string[];

  rating?: number;

  progress?: number;

  driveFileId?: string;
}