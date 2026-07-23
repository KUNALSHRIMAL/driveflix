import MovieCard from "@/components/movie/MovieCard";
import type { Movie } from "@/types/movie";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
}

const MovieRow = ({
  title,
  movies,
  onMovieClick,
}: MovieRowProps) => {
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <div className="
          grid
          grid-cols-2
          gap-6
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={onMovieClick}
          />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
