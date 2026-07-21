import type { Movie } from "@/types/movie";

export const featuredMovie: Movie = {
  id: "1",
  title: "Interstellar",
  poster: "",
  backdrop: "",
  description:
    "A team of explorers travel through a wormhole in space to ensure humanity's survival.",
  year: 2014,
  duration: "2h 49m",
};

export const trendingMovies: Movie[] = [
  featuredMovie,
  {
    id: "2",
    title: "Avatar",
    poster: "",
    year: 2009,
    duration: "2h 42m",
  },
  {
    id: "3",
    title: "John Wick",
    poster: "",
    year: 2014,
    duration: "1h 41m",
  },
  {
    id: "4",
    title: "Inception",
    poster: "",
    year: 2010,
    duration: "2h 28m",
  },
];
export const recentlyAddedMovies = [...trendingMovies];

export const actionMovies = [...trendingMovies];

export const sciFiMovies = [...trendingMovies];

export const comedyMovies = [...trendingMovies];