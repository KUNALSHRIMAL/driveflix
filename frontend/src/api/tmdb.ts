import axios from "axios";
import { TMDB_READ_TOKEN } from "@/config/tmdb";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",

  headers: {
    Authorization: `Bearer ${TMDB_READ_TOKEN}`,
    accept: "application/json",
  },
});

export async function searchMovie(
  title: string,
  year?: number
) {
  const response = await api.get("/search/movie", {
    params: {
      query: title,
      year,
    },
  });

  return response.data.results[0] ?? null;
}