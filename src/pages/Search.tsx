import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { resetSearch, searchMovies } from "../features/movies/moviesSlice";
import PosterCard from "../components/PosterCard";
import Spinner from "../components/Spinner";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("query") || "";
  const dispatch = useAppDispatch();
  const { results, page, hasMore } = useAppSelector(s=>s.movies.search);
  const loading = useAppSelector(s=>s.movies.status)==="loading";

  useEffect(()=>{ dispatch(resetSearch()); if (q) dispatch(searchMovies({ q, page:1 })); }, [q, dispatch]);

  const loadMore = () => { if (hasMore) dispatch(searchMovies({ q, page: page+1 })); };

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Search results for “{q}”</h1>
      {loading && !results.length ? <Spinner/> : null}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {results.map(m => <PosterCard key={m.id} m={m} />)}
      </div>
      {hasMore && (
        <div className="flex justify-center py-8">
          <button onClick={loadMore} className="px-6 py-2 rounded-xl bg-brand-sky hover:bg-brand-sky-600">Load more</button>
        </div>
      )}
    </div>
  );
}
