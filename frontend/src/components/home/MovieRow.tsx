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
  console.log("MovieRow", title, movies.length);
  return (
    <section className="space-y-5">
      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <div className="flex
          gap-8
          overflow-x-auto
          pb-4
          scroll-smooth
          snap-x
          snap-mandatory">
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
