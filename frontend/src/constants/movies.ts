import type { Movie } from "@/types/movie";

export const featuredMovie: Movie = {
  id: "1",
  title: "Interstellar",
  poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
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
    poster: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    year: 2009,
    duration: "2h 42m",
  },
  {
    id: "3",
    title: "John Wick",
    poster: "https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg",
    year: 2014,
    duration: "1h 41m",
  },
  {
    id: "4",
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    year: 2010,
    duration: "2h 28m",
  },
];
export const recentlyAddedMovies = [...trendingMovies];

export const actionMovies = [...trendingMovies];

export const sciFiMovies = [...trendingMovies];

export const comedyMovies = [...trendingMovies];
