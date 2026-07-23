import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <button
      type="button"
      data-tv-focusable
      data-tv-focus-key={`movie-${movie.id}`}
      aria-label={`Open ${movie.title}`}
      onClick={() => onClick?.(movie)}
      
      className="
        group
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        bg-zinc-900
        text-left
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-2xl
        focus-visible:outline-none
        focus-visible:scale-105
        group-hover:brightness-110
        
      "
    >
      <div className="relative aspect-[2/3] bg-zinc-800">
        {movie.isHevc && (
          <span className="absolute right-3 top-3 z-10 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-amber-400 backdrop-blur-sm">
            HEVC
          </span>
        )}
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
