import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContinueWatching = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-white">
        Continue Watching
      </h2>

      <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-lg">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-white">
            Interstellar
          </h3>

          <p className="text-sm text-zinc-400">
            Sci-Fi • 2014 • 2h 49m
          </p>
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
            <span>42% Watched</span>
            <span>01:18:25 / 02:49:00</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
            <div className="h-full w-[42%] rounded-full bg-red-600 transition-all duration-500" />
          </div>
        </div>

        <div className="mt-8">
          <Button size="tv">
            <Play className="size-5" />
            Continue Watching
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContinueWatching;