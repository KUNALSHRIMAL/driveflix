import { Play, Info } from "lucide-react";
import type { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
}

const HeroBanner = ({ movie, onPlay, onMoreInfo }: HeroBannerProps) => {
  return (
    <section className="relative min-h-[520px] h-[70vh] overflow-hidden rounded-3xl bg-zinc-950">
      {movie.backdrop ? (
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-800" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

      <div className="relative flex h-full max-w-3xl flex-col justify-end px-6 py-10 sm:px-10 sm:py-14 lg:justify-center lg:px-16">
        <span className="mb-2 text-sm uppercase tracking-[0.3em] text-red-500">
          Featured Movie
        </span>

        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-7xl">
          {movie.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-zinc-200 sm:text-base">
          <span>{movie.year}</span>
          {movie.rating !== undefined && (
            <span className="text-amber-400">★ {movie.rating.toFixed(1)}</span>
          )}
          {movie.genres?.map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>

        <p className="mt-5 max-w-2xl line-clamp-4 text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
          {movie.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
          <Button
            size="tv"
            onClick={() => onPlay?.(movie)}
            className="focus-visible:ring-red-600"
          >
            <Play className="size-5" />
            Play
          </Button>

          <Button
            variant="outline"
            size="tv"
            onClick={() => onMoreInfo?.(movie)}
            className="border-white/40 bg-black/30 text-white backdrop-blur-sm hover:bg-white hover:text-black focus-visible:ring-red-600"
          >
            <Info className="size-5 " />
            More Info
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
