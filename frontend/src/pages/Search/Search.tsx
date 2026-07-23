import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import MovieRow from "@/components/home/MovieRow";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { useAuth } from "@/hooks/useAuth";
import { getMovies } from "@/services/movieService";
import type { Movie } from "@/types/movie";

const normalizeTitle = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const editDistance = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex++) {
    const current = [leftIndex];

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex++) {
      current[rightIndex] = Math.min(
        current[rightIndex - 1] + 1,
        previous[rightIndex] + 1,
        previous[rightIndex - 1] +
          (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1)
      );
    }

    previous.splice(0, previous.length, ...current);
  }

  return previous[right.length];
};

const matchesTitle = (title: string, query: string) => {
  const normalizedTitle = normalizeTitle(title);
  const normalizedQuery = normalizeTitle(query);
  if (!normalizedQuery || normalizedTitle.includes(normalizedQuery)) return true;

  const queryWords = normalizedQuery.split(" ");
  const titleWords = normalizedTitle.split(" ");

  return queryWords.every((queryWord) =>
    titleWords.some((titleWord) => {
      const allowedDistance =
        queryWord.length >= 8 ? 2 : queryWord.length >= 4 ? 1 : 0;
      return editDistance(titleWord, queryWord) <= allowedDistance;
    })
  );
};

const Search = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(() => Boolean(user));
  const query = searchParams.get("q") ?? "";

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    getMovies(user.accessToken, Number.POSITIVE_INFINITY)
      .then((library) => {
        if (!cancelled) setMovies(library);
      })
      .catch((error) => console.error("Search library failed:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const results = useMemo(() => {
    if (!query.trim()) return movies;

    return movies.filter((movie) => matchesTitle(movie.title, query));
  }, [movies, query]);

  return (
    <main className="min-h-[calc(100vh-5rem)] px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center gap-4">
          <SearchIcon className="size-8 text-red-600" />
          <div>
            <h1 className="text-3xl font-bold text-white">Search</h1>
            {query && <p className="mt-1 text-zinc-400">Results for “{query}”</p>}
          </div>
        </div>

        {!user ? (
          <button
            type="button"
            onClick={() => navigate("/login")}
            data-tv-focus-key="search-login"
            className="min-h-14 rounded-lg bg-red-600 px-8 py-3 text-lg font-semibold text-white hover:bg-red-500"
          >
            Login to search your Drive
          </button>
        ) : loading ? (
          <LoadingIndicator label="Searching your full Drive library…" />
        ) : results.length ? (
          <MovieRow
            title={`${results.length} ${results.length === 1 ? "Movie" : "Movies"}`}
            movies={results}
            onMovieClick={(movie) =>
              navigate(`/movie/${movie.id}`, { state: { movie } })
            }
          />
        ) : (
          <p className="text-zinc-400">No movies found.</p>
        )}
      </div>
    </main>
  );
};

export default Search;
