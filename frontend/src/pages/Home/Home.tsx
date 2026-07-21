

import ContinueWatching from "@/components/home/ContinueWatching";
import HeroBanner from "@/components/home/HeroBanner";
import MovieRow from "@/components/home/MovieRow";
import {comedyMovies,sciFiMovies,actionMovies, recentlyAddedMovies,featuredMovie, trendingMovies } from "@/constants/movies";
import type { Movie } from "@/types/movie";

const Home = () => {
  const handleMovieClick = (movie: Movie) => {
    console.log(movie.title);
  };

  return (
    <div className="space-y-16 px-10 py-10">
      <HeroBanner movie={featuredMovie} />

<MovieRow
  title="Trending Movies"
  movies={trendingMovies}
  onMovieClick={handleMovieClick}
/>

<ContinueWatching />

<MovieRow
  title="Recently Added"
  movies={recentlyAddedMovies}
  onMovieClick={handleMovieClick}
/>

<MovieRow
  title="Action Movies"
  movies={actionMovies}
  onMovieClick={handleMovieClick}
/>

<MovieRow
  title="Sci-Fi"
  movies={sciFiMovies}
  onMovieClick={handleMovieClick}
/>

<MovieRow
  title="Comedy"
  movies={comedyMovies}
  onMovieClick={handleMovieClick}
/>
    </div>
  );
};

export default Home;