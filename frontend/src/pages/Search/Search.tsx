import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import MovieRow from "@/components/home/MovieRow";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import { useAuth } from "@/hooks/useAuth";
import { searchMovies } from "@/services/movieService";
import type { Movie } from "@/types/movie";

const Search = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchResult, setSearchResult] = useState<{
    query: string;
    movies: Movie[];
  }>({ query: "__not_loaded__", movies: [] });
  const query = searchParams.get("q") ?? "";
  const loading = Boolean(user) && searchResult.query !== query;
  const movies = searchResult.query === query ? searchResult.movies : [];

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    searchMovies(user.accessToken, query)
      .then((results) => {
        if (!cancelled) setSearchResult({ query, movies: results });
      })
      .catch((error) => console.error("Search library failed:", error))

    return () => {
      cancelled = true;
    };
  }, [query, user]);

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
        ) : movies.length ? (
          <MovieRow
            title={`${movies.length} ${movies.length === 1 ? "Movie" : "Movies"}`}
            movies={movies}
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
