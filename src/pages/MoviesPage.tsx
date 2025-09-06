import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchByGenre, fetchTrending } from "../features/movies/moviesSlice";
import PosterCard from "../components/PosterCard";
import Spinner from "../components/Spinner";
import { useSearchParams } from "react-router-dom";

export default function MoviesPage() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre");
  const query = searchParams.get("query");

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const movies = useAppSelector(s => {
    if (genre) return s.movies.byGenre[genre] ?? [];
    if (query) return s.movies.search.results;
    return s.movies.trending;
  });

  const containerRef = useRef<HTMLDivElement>(null);

const loadMore = async () => {
  if (loading) return;
  setLoading(true);
  try {
    if (genre) await dispatch(fetchByGenre({ genre, page }));
    else if (query) await dispatch(fetchByGenre({ genre: query, page })); // or search thunk if you add one
    else await dispatch(fetchTrending(page));
    setPage(p => p + 1);
  } finally {
    setLoading(false);
  }
};


  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 200) loadMore();
    };
    const el = containerRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, [containerRef, loading]);

  return (
    <div ref={containerRef} className="h-[calc(100vh-64px)] overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {movies.map(m => <PosterCard key={m.id} m={m} />)}
      {loading && <div className="col-span-full flex justify-center"><Spinner /></div>}
    </div>
  );
}
