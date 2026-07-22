import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ContinueWatching from "@/components/home/ContinueWatching";
import HeroBanner from "@/components/home/HeroBanner";
import MovieRow from "@/components/home/MovieRow";

import { getMovies } from "@/services/movieService";
import { useAuth } from "@/hooks/useAuth";

import {
  trendingMovies,
} from "@/constants/movies";

import type { Movie } from "@/types/movie";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [driveMovies, setDriveMovies] = useState<Movie[]>([]);
  useEffect(() => {
    async function loadMovies() {
      if (!user) return;

      try {
        // console.log("User:", user);
        // console.log("Access Token:", user?.accessToken);
        const movies = await getMovies(user.accessToken);

        console.log("movies before setState", movies.length);
        setDriveMovies(movies);
      } catch (error) {
        console.error(error);
      }
    }

    loadMovies();
  }, [user]);
  useEffect(() => {
    console.log("driveMovies state", driveMovies.length);
  }, [driveMovies]);
  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };
  const featuredDriveMovie =
    driveMovies.find((movie) =>
      movie.backdrop?.startsWith("https://image.tmdb.org/")
    ) ?? driveMovies[0];
console.log("Drive Movies:", driveMovies.length);
console.log(driveMovies);
  console.log("Passing to MovieRow", driveMovies.length);
  return (
    <div className="space-y-16 px-10 py-10">
      {featuredDriveMovie && (
        <HeroBanner
          movie={featuredDriveMovie}
          onPlay={(movie) =>
            navigate(`/player/${movie.id}`, { state: { movie } })
          }
          onMoreInfo={handleMovieClick}
        />
      )}

      <MovieRow
        title="Trending Movies"
        movies={trendingMovies}
        onMovieClick={handleMovieClick}
      />
      <MovieRow
        title="My Google Drive"
        movies={driveMovies}
        onMovieClick={handleMovieClick}
      />
      <ContinueWatching />

      {/* <MovieRow
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
      /> */}
    </div>
  );
};

export default Home;
