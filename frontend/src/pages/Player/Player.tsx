import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  ArrowLeft,
  Maximize,
  Pause,
  Play as PlayIcon,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
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
  const [streamUrl, setStreamUrl] = useState("");
  const [streamError, setStreamError] = useState("");
  const [videoReady, setVideoReady] = useState(false);
  const [buffering, setBuffering] = useState(true);

  useEffect(() => {
    if (!driveFileId || !user?.accessToken || !("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;

    const prepareStream = async () => {
      try {
        await navigator.serviceWorker.register("/drive-stream-sw.js");
        await navigator.serviceWorker.ready;

        if (!navigator.serviceWorker.controller) {
          await new Promise<void>((resolve) => {
            navigator.serviceWorker.addEventListener(
              "controllerchange",
              () => resolve(),
              { once: true }
            );
          });
        }

        const controller = navigator.serviceWorker.controller;
        if (!controller) throw new Error("Drive stream service is unavailable");

        await new Promise<void>((resolve) => {
          const channel = new MessageChannel();
          channel.port1.onmessage = () => resolve();
          controller.postMessage(
            {
              type: "SET_DRIVE_ACCESS_TOKEN",
              accessToken: user.accessToken,
            },
            [channel.port2]
          );
        });

        if (!cancelled) {
          setStreamUrl(`/drive-stream/${encodeURIComponent(driveFileId)}`);
        }
      } catch (error) {
        if (!cancelled) {
          setStreamError(
            error instanceof Error ? error.message : "Unable to prepare video"
          );
        }
      }
    };

    prepareStream();

    return () => {
      cancelled = true;
    };
  }, [driveFileId, user?.accessToken]);

  useEffect(() => {
    const saveProgress = () => {
      const video = videoRef.current;

      if (video && video.currentTime > 0) {
        localStorage.setItem(
          progressKey,
          JSON.stringify({
            currentTime: video.currentTime,
            duration: Number.isFinite(video.duration) ? video.duration : 0,
          })
        );
      }
    };

    const interval = window.setInterval(() => {
      saveProgress();
    }, 10_000);

    return () => {
      window.clearInterval(interval);
      saveProgress();
    };
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

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const nextTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      Number.isFinite(video.duration) ? video.duration : video.currentTime
    );
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
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

  const handlePlayerKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement) return;

    if (event.key === " " || event.key.toLowerCase() === "k") {
      event.preventDefault();
      togglePlayback();
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      enterFullscreen();
    } else if (event.key.toLowerCase() === "j") {
      event.preventDefault();
      skip(-10);
    } else if (event.key.toLowerCase() === "l") {
      event.preventDefault();
      skip(20);
    } else if (event.key === "Escape") {
      navigate(-1);
    }
  };

  if (!driveFileId || !user?.accessToken || streamError) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white">
        <h1 className="text-3xl font-bold">Video unavailable</h1>
        <p className="text-zinc-400">
          {streamError ||
            "Sign in and select a movie from your Google Drive library."}
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
      data-tv-scope="active"
      onKeyDown={handlePlayerKeyDown}
      className="group fixed inset-0 z-50 flex h-screen w-full items-center justify-center overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        src={streamUrl || undefined}
        className="h-full w-full object-contain"
        onClick={togglePlayback}
        onLoadStart={() => {
          setVideoReady(false);
          setBuffering(true);
        }}
        onWaiting={() => setBuffering(true)}
        onSeeking={() => setBuffering(true)}
        onCanPlay={() => {
          setVideoReady(true);
          setBuffering(false);
        }}
        onSeeked={() => setBuffering(false)}
        onPlaying={() => {
          setIsPlaying(true);
          setBuffering(false);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onLoadedMetadata={(event) => {
          const saved = localStorage.getItem(progressKey);
          if (!saved) return;

          let savedProgress: number;
          try {
            const parsed = JSON.parse(saved) as
              | number
              | { currentTime?: number };
            savedProgress =
              typeof parsed === "number" ? parsed : parsed.currentTime ?? 0;
          } catch {
            savedProgress = Number(saved);
          }

          if (Number.isFinite(savedProgress) && savedProgress > 0) {
            event.currentTarget.currentTime = Math.min(
              savedProgress,
              event.currentTarget.duration
            );
          }
        }}
      />

      {(!videoReady || buffering) && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/50">
          <LoadingIndicator
            label={videoReady ? "Buffering video…" : "Preparing video…"}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Go back"
        data-tv-focus-key="player-back"
        className="absolute left-8 top-8 z-20 rounded-full bg-black/60 p-4 text-white backdrop-blur-sm transition hover:bg-black/90"
      >
        <ArrowLeft className="size-6" />
      </button>

      <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-5 pt-20 text-white sm:px-8 sm:pb-8">
        {movie && <h1 className="mb-4 text-lg font-semibold sm:text-2xl">{movie.title}</h1>}

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.target.value))}
          aria-label="Seek"
          data-tv-focus-key="player-seek"
          className="h-3 w-full cursor-pointer accent-red-600"
        />

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause" : "Play"}
            data-tv-focus-key="player-play"
            data-tv-autofocus
            className="rounded-full p-3"
          >
            {isPlaying ? (
              <Pause className="size-7 fill-current" />
            ) : (
              <PlayIcon className="size-7 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={() => skip(-10)}
            aria-label="Go back 10 seconds"
            data-tv-focus-key="player-back-10"
            className="flex min-h-14 items-center gap-1 rounded-full px-3"
          >
            <RotateCcw className="size-7" />
            <span className="text-sm font-semibold">10</span>
          </button>

          <button
            type="button"
            onClick={() => skip(20)}
            aria-label="Skip forward 20 seconds"
            data-tv-focus-key="player-forward-20"
            className="flex min-h-14 items-center gap-1 rounded-full px-3"
          >
            <RotateCw className="size-7" />
            <span className="text-sm font-semibold">20</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={volume > 0 ? "Mute" : "Unmute"}
            data-tv-focus-key="player-mute"
            className="rounded-full p-3"
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
            data-tv-focus-key="player-volume"
            className="hidden h-3 w-32 cursor-pointer accent-red-600 sm:block"
          />

          <span className="text-lg tabular-nums text-zinc-300">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button
            type="button"
            onClick={enterFullscreen}
            aria-label="Toggle fullscreen"
            data-tv-focus-key="player-fullscreen"
            className="ml-auto rounded-full p-3"
          >
            <Maximize className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
