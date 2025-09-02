import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { getDetails, getHybrid, getSimilar } from "../features/movies/moviesSlice";
import { getUserRating, rateMovie, removeRating } from "../features/ratings/ratingsSlice";
import RowCarousel from "../components/RowCarousel";
import Spinner from "../components/Spinner";
import { Calendar } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const movieId = Number(id);
  const dispatch = useAppDispatch();

  const details = useAppSelector((s) => s.movies.details[movieId]);
  const similar = useAppSelector((s) => s.movies.similar[movieId]) || [];
  const hybrid = useAppSelector((s) => s.movies.hybrid[movieId]) || [];
  const myRating = useAppSelector((s) => s.ratings.byMovie[movieId]) || null;
  const authed = useAppSelector((s) => s.auth.isAuthed);

  const [busy, setBusy] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(myRating?.rating || 0);
  const [review, setReview] = useState(myRating?.review || "");

useEffect(() => {
  dispatch(getDetails(movieId));
  dispatch(getSimilar(movieId));
  dispatch(getHybrid(movieId));
  if (authed) {
    dispatch(getUserRating(movieId)); // fetch user's rating
  }
}, [dispatch, movieId, authed]);


useEffect(() => {
  setSelectedRating(myRating?.rating || 0);
  setReview(myRating?.review || "");
}, [myRating]);

  const handleSubmit = async () => {
    if (!authed || selectedRating <= 0) return;
    setBusy(true);
    try {
      await dispatch(rateMovie({ movieId, rating: selectedRating, review })).unwrap();
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!myRating) return;
    setBusy(true);
    try {
      await dispatch(removeRating({ movieId })).unwrap();
      setSelectedRating(0);
      setReview("");
    } finally {
      setBusy(false);
    }
  };

  if (!details) return <Spinner />;

  const starSteps = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="pb-10">
      {/* Hero banner */}
      <div className="relative h-[35vh] md:h-[45vh] mb-6">
        <img
          src={details.backdrop_url || details.poster_url}
          alt={details.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/60 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4">
          <img
            src={details.poster_url}
            alt={details.title}
            className="rounded-2xl shadow-lg w-full"
          />
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-extrabold">{details.title}</h1>

          <p className="text-white/80 mt-3 leading-relaxed">{details.description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80">

            {/* Release Year */}
            {details.year && (
              <span className="flex items-center gap-1">
                <Calendar size={16} className="text-sky-400" />
                {details.year}
              </span>
            )}

            {/* Genres */}
            {details.genres?.length ? (
              <div className="flex flex-wrap gap-2">
                {details.genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-sky-900/40 rounded-full text-sm text-sky-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* Rating & Review */}
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Your rating & review</h3>

            <div className="flex flex-col gap-3">
              {/* Stars */}
              <div className="flex items-center gap-2">
                {starSteps.map((s) => (
                  <div
                    key={s}
                    className="cursor-pointer relative w-7 h-7"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setSelectedRating(s)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="gray"
                      className="absolute w-7 h-7"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.38 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.293z" />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill={
                        hoverRating >= s || (!hoverRating && selectedRating >= s)
                          ? "gold"
                          : "transparent"
                      }
                      className="absolute w-7 h-7"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.38 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.293z" />
                    </svg>
                  </div>
                ))}

                {/* Numeric display */}
                {selectedRating > 0 && (
                  <span className="ml-2 text-sm text-white/70">
                    {selectedRating} / 5
                  </span>
                )}
              </div>

              {/* Review */}
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                disabled={busy}
                placeholder="Add a review (optional)"
                className="px-3 py-2 rounded-xl bg-brand-card text-white focus:outline-none w-full"
              />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={busy || selectedRating <= 0}
                  className={`px-5 py-2 rounded-xl bg-brand-sky hover:bg-brand-sky-600 ${selectedRating <= 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  Submit
                </button>
                {myRating && (
                  <button
                    onClick={handleRemove}
                    disabled={busy}
                    className="px-5 py-2 rounded-xl bg-brand-card hover:bg-brand-card/70"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousels */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        {(!similar.length || !hybrid.length) ? (
          <div className="flex flex-col justify-center items-center py-10">
            <Spinner />
            It will take a few seconds to load recommendations for this movie...
          </div>
        ) : (
          <>
            <RowCarousel title="Similar Movies" items={similar} />
            <RowCarousel title="Recommended Movies" items={hybrid} />
          </>
        )}
      </div>
    </div>
  );
}
