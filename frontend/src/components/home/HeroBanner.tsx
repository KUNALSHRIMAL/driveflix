import { Play, Info } from "lucide-react";
import type { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";

interface HeroBannerProps {
  movie: Movie;
}

const HeroBanner = ({ movie }: HeroBannerProps) => {
  return (
    <section className="relative mb-12 h-[440px] overflow-hidden rounded-3xl bg-zinc-900">
      {movie.backdrop ? (
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-zinc-800" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />

      <div className="relative flex h-full max-w-2xl flex-col justify-center px-12">
        <span className="mb-2 text-sm uppercase tracking-[0.3em] text-red-500">
          Featured Movie
        </span>

        <h1 className="mb-6 text-6xl font-bold text-white">
          {movie.title}
        </h1>

        <p className="mb-8 text-lg leading-8 text-zinc-300 max-w-lg">
          {movie.description}
        </p>

        <div className="flex gap-4">
          <Button size="tv"  className="focus-visible:ring-red-600">
            <Play className="size-5" />
            Play
          </Button>

          <Button variant="outline" size="tv" className={'text-black hover:bg-black hover:text-white focus-visible:ring-red-600'} >
            <Info className="size-5 " />
            More Info
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;