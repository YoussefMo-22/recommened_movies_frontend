import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPersonalRecs } from "../features/recommendations/recsSlice";
import { fetchTrending } from "../features/movies/moviesSlice";
import PosterCard from "../components/PosterCard";
import Spinner from "../components/Spinner";

export default function ForYou() {
  const dispatch = useAppDispatch();
  const { personal, status } = useAppSelector((s) => s.recs);
  const trending = useAppSelector((s) => s.movies.trending);
  const authed = useAppSelector((s) => s.auth.isAuthed);
  const userId = useAppSelector((s) => s.auth.user?.id);

  useEffect(() => {
    if (authed && userId) {
      dispatch(fetchPersonalRecs(userId));
    } else if (!trending.length) {
      dispatch(fetchTrending(1));
    }
  }, [dispatch, authed, userId, trending.length]);

  // show spinner until recommendation request is done
  if (status === "loading") {
    return (
      <div className="py-20 flex justify-center">
        <Spinner />
      </div>
    );
  }

  const cold = personal.length === 0;

  return (
    <div className="py-6">
      <h1 className="text-4xl font-bold mb-10">Movies For You</h1>

      <h2 className="text-xl font-semibold mb-2">Recommended Movies For You</h2>
      {!cold ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {personal.map((m) => (
            <PosterCard key={m.id} m={m} />
          ))}
        </div>
      ) : (
        <p className="mb-4 text-white/80">
          <span className="text-brand-sky">Rate some movies</span> to get
          personalized recommendations!
        </p>
      )}

      <h2 className="text-xl mt-10 font-semibold mb-2">Popular right now</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
        {trending.map((m) => (
          <div key={m.id} className="flex justify-center">
            <PosterCard m={m} />
          </div>
        ))}
      </div>
    </div>
  );
}
