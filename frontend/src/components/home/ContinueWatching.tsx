import { useState } from "react";
import { Play, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/movie";

interface ContinueWatchingProps {
  movies: Movie[];
  onContinue: (movie: Movie) => void;
}

interface SavedProgress {
  currentTime: number;
  duration: number;
}

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`
    : `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const getSavedProgress = (movie: Movie): SavedProgress | null => {
  const fileId = movie.driveFileId ?? movie.id;
  const saved = localStorage.getItem(`driveflix-progress-${fileId}`);
  if (!saved) return null;

  try {
    const parsed = JSON.parse(saved) as SavedProgress | number;

    if (typeof parsed === "number") {
      return { currentTime: parsed, duration: 0 };
    }

    return parsed;
  } catch {
    const legacyTime = Number(saved);
    return Number.isFinite(legacyTime)
      ? { currentTime: legacyTime, duration: 0 }
      : null;
  }
};

const ContinueWatching = ({ movies, onContinue }: ContinueWatchingProps) => {
  const [clearedMovieIds, setClearedMovieIds] = useState<Set<string>>(
    () => new Set()
  );
  const entries = movies.flatMap((movie) => {
    if (clearedMovieIds.has(movie.id)) return [];

    const progress = getSavedProgress(movie);

    if (!progress || progress.currentTime <= 0) return [];

    const percentage = progress.duration
      ? Math.min((progress.currentTime / progress.duration) * 100, 100)
      : 0;

    if (percentage >= 95) return [];

    return [{ movie, progress, percentage }];
  });

  const clearProgress = (movie: Movie) => {
    const fileId = movie.driveFileId ?? movie.id;
    localStorage.removeItem(`driveflix-progress-${fileId}`);
    setClearedMovieIds((current) => new Set(current).add(movie.id));
  };

  if (!entries.length) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-white">Continue Watching</h2>

      <div className="flex snap-x gap-6 overflow-x-auto pb-4">
        {entries.map(({ movie, progress, percentage }) => (
          <article
            key={movie.id}
            className="w-[360px] shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-lg"
          >
            <div className="relative aspect-video bg-zinc-800">
              {movie.backdrop && (
                <img
                  src={movie.backdrop}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <h3 className="absolute bottom-4 left-5 right-5 truncate text-xl font-bold text-white">
                {movie.title}
              </h3>
            </div>

            <div className="p-5">
              <div className="mb-2 flex justify-between text-sm text-zinc-400">
                <span>{percentage ? `${Math.round(percentage)}% watched` : "In progress"}</span>
                <span>
                  {formatTime(progress.currentTime)}
                  {progress.duration ? ` / ${formatTime(progress.duration)}` : ""}
                </span>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-700">
                <div
                  className="h-full rounded-full bg-red-600"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  size="tv"
                  className="flex-1 px-4"
                  onClick={() => onContinue(movie)}
                  data-tv-focus-key={`continue-${movie.id}`}
                >
                  <Play className="size-5" />
                  Continue
                </Button>
                <Button
                  size="tv"
                  variant="outline"
                  className="border-white/40 bg-black/30 text-white backdrop-blur-sm hover:bg-white hover:text-black focus-visible:ring-red-600"
                  onClick={() => clearProgress(movie)}
                  data-tv-focus-key={`clear-progress-${movie.id}`}
                  aria-label={`Clear ${movie.title} from Continue Watching`}
                >
                  <Trash2 className="size-5" />
                  Clear
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatching;
