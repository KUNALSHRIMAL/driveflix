import { ArrowLeft, Play } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";

interface MovieDetailsState {
  movie?: Movie;
}

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const movie = (location.state as MovieDetailsState | null)?.movie;

  if (!movie || movie.id !== id) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-3xl font-bold">Movie unavailable</h1>
        <p className="max-w-md text-zinc-400">
          Return to your library and select the movie again.
        </p>
        <Button onClick={() => navigate("/")}>Back to Home</Button>
      </section>
    );
  }

  return (
    <article className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-zinc-950">
      {movie.backdrop && (
        <img
          src={movie.backdrop}
          alt=""
          className="absolute inset-0 h-[70vh] w-full object-cover object-center"
        />
      )}
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-gradient-to-r from-black via-black/70 to-black/10" />
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-gradient-to-t from-zinc-950 via-transparent to-black/30" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-end px-6 py-12 sm:px-10 lg:items-center lg:px-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          data-tv-focus-key="details-back"
          className="absolute left-10 top-10 rounded-full bg-black/50 p-4 text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          <ArrowLeft className="size-6" />
        </button>

        <div className="flex w-full flex-col gap-8 pt-24 md:flex-row md:items-end lg:items-center">
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            className="hidden w-56 shrink-0 rounded-xl object-cover shadow-2xl md:block lg:w-64"
          />

          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-7xl">
              {movie.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-medium text-zinc-200">
              <span>{movie.year}</span>
              {movie.rating !== undefined && (
                <span className="text-amber-400">
                  ★ {movie.rating.toFixed(1)}
                </span>
              )}
              {movie.genres?.map((genre) => (
                <span key={genre}>{genre}</span>
              ))}
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg sm:leading-8">
              {movie.description || "No overview is available for this movie."}
            </p>

            <Button
              size="tv"
              className="mt-8 focus-visible:ring-violet-400"
              data-tv-focus-key="details-play"
              data-tv-autofocus
              onClick={() =>
                navigate(`/player/${movie.id}`, { state: { movie } })
              }
            >
              <Play className="size-5" />
              Play
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MovieDetails;
