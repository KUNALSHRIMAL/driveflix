import axios from "axios";
import { TMDB_READ_TOKEN } from "@/config/tmdb";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",

  headers: {
    Authorization: `Bearer ${TMDB_READ_TOKEN}`,
    accept: "application/json",
  },
});

interface TmdbSearchMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
}

export interface TmdbMovieDetails extends TmdbSearchMovie {
  runtime: number | null;
  genres: Array<{
    id: number;
    name: string;
  }>;
}

export async function searchMovie(
  title: string,
  year?: number
) {
  const response = await api.get<{ results: TmdbSearchMovie[] }>("/search/movie", {
    params: {
      query: title,
      year,
    },
  });

  return response.data.results[0] ?? null;
}

export async function getMovieDetails(movieId: number) {
  const response = await api.get<TmdbMovieDetails>(`/movie/${movieId}`, {
    params: {
      language: "en-US",
    },
  });

  return response.data;
}
