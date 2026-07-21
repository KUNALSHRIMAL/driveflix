import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <button
      type="button"
      aria-label={`Open ${movie.title}`}
      onClick={() => onClick?.(movie)}
      snap-start
      className="
        group
        w-[220px]
        overflow-hidden
        rounded-2xl
        bg-zinc-900
        text-left
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-2xl
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-red-600
        focus-visible:ring-offset-2
        focus-visible:ring-offset-zinc-black
        focus-visible:scale-105
        group-hover:brightness-110
        
      "
    >
      <div className="aspect-[2/3] bg-zinc-800">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-500">
            <span className="text-4xl">🎬</span>
            <span>No Poster</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="truncate text-lg font-semibold text-white">
          {movie.title}
        </h3>

        <p className="mt-1 text-sm text-zinc-400">
          {movie.year} • {movie.duration}
        </p>
      </div>
    </button>
  );
};

export default MovieCard;
