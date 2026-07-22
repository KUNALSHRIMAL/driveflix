import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Maximize,
  Pause,
  Play as PlayIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import type { Movie } from "@/types/movie";

interface PlayerState {
  movie?: Movie;
}

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`
    : `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const Player = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const movie = (location.state as PlayerState | null)?.movie;
  const driveFileId = movie?.driveFileId ?? id;
  const progressKey = `driveflix-progress-${driveFileId}`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const videoUrl =
    driveFileId && user?.accessToken
      ? `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(
          driveFileId
        )}?alt=media&access_token=${encodeURIComponent(user.accessToken)}`
      : "";

  useEffect(() => {
    const interval = window.setInterval(() => {
      const video = videoRef.current;

      if (video && video.currentTime > 0) {
        localStorage.setItem(progressKey, String(video.currentTime));
      }
    }, 10_000);

    return () => window.clearInterval(interval);
  }, [progressKey]);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      await video.play();
    } else {
      video.pause();
    }
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value;
    setCurrentTime(value);
  };

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = value;
    setVolume(value);
  };

  const toggleMute = () => changeVolume(volume > 0 ? 0 : 1);

  const enterFullscreen = async () => {
    if (!document.fullscreenElement) {
      await playerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  if (!videoUrl) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white">
        <h1 className="text-3xl font-bold">Video unavailable</h1>
        <p className="text-zinc-400">
          Sign in and select a movie from your Google Drive library.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-lg bg-white px-5 py-3 font-semibold text-black"
        >
          Back to Home
        </button>
      </section>
    );
  }

  return (
    <div
      ref={playerRef}
      className="group fixed inset-0 z-50 flex h-screen w-full items-center justify-center overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-contain"
        onClick={togglePlayback}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onLoadedMetadata={(event) => {
          const savedProgress = Number(localStorage.getItem(progressKey));
          if (Number.isFinite(savedProgress) && savedProgress > 0) {
            event.currentTarget.currentTime = Math.min(
              savedProgress,
              event.currentTarget.duration
            );
          }
        }}
      />

      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="absolute left-5 top-5 rounded-full bg-black/60 p-3 text-white backdrop-blur-sm transition hover:bg-black/90"
      >
        <ArrowLeft className="size-6" />
      </button>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-20 text-white sm:px-8 sm:pb-8">
        {movie && <h1 className="mb-4 text-lg font-semibold sm:text-2xl">{movie.title}</h1>}

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Seek"
          className="h-1.5 w-full cursor-pointer accent-red-600"
        />

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="size-7 fill-current" />
            ) : (
              <PlayIcon className="size-7 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={volume > 0 ? "Mute" : "Unmute"}
          >
            {volume > 0 ? (
              <Volume2 className="size-6" />
            ) : (
              <VolumeX className="size-6" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => changeVolume(Number(event.target.value))}
            aria-label="Volume"
            className="hidden w-24 cursor-pointer accent-red-600 sm:block"
          />

          <span className="text-sm tabular-nums text-zinc-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={enterFullscreen}
            aria-label="Toggle fullscreen"
            className="ml-auto"
          >
            <Maximize className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
