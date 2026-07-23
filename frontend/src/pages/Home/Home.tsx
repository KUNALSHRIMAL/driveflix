import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ContinueWatching from "@/components/home/ContinueWatching";
import HeroBanner from "@/components/home/HeroBanner";
import MovieRow from "@/components/home/MovieRow";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

import { getMovies } from "@/services/movieService";
import { useAuth } from "@/hooks/useAuth";

import type { Movie } from "@/types/movie";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [driveMovies, setDriveMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(() => Boolean(user));
  useEffect(() => {
    async function loadMovies() {
      if (!user) return;

      try {
        // console.log("User:", user);
        // console.log("Access Token:", user?.accessToken);
        const movies = await getMovies(user.accessToken);

        setDriveMovies(movies);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [user]);
  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };
  const featuredDriveMovie =
    driveMovies.find((movie) =>
      movie.backdrop?.startsWith("https://image.tmdb.org/")
    ) ?? driveMovies[0];

  if (loading) {
    return (
      <main className="px-8 py-10 lg:px-16 xl:px-20">
        <LoadingIndicator label="Loading your movie library…" />
      </main>
    );
  }

  return (
    <div className="space-y-16 px-8 py-10 lg:px-16 xl:px-20">
      {featuredDriveMovie && (
        <HeroBanner
          movie={featuredDriveMovie}
          onPlay={(movie) =>
            navigate(`/player/${movie.id}`, { state: { movie } })
          }
          onMoreInfo={handleMovieClick}
        />
      )}

      {/* <MovieRow
        title="Trending Movies"
        movies={trendingMovies}
        onMovieClick={handleMovieClick}
      /> */}
      <MovieRow
        title="My Google Drive"
        movies={driveMovies}
        onMovieClick={handleMovieClick}
      />
      <ContinueWatching
        movies={driveMovies}
        onContinue={(movie) =>
          navigate(`/player/${movie.id}`, { state: { movie } })
        }
      />

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
