import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export type Rating = { id: number; rating: number; review?: string };
type State = {
  byMovie: Record<number, Rating>;
  status: "idle" | "loading" | "failed";
  error?: string | null;
};

const initialState: State = { byMovie: {}, status: "idle", error: null };

// Fetch user's rating for a specific movie
export const getUserRating = createAsyncThunk(
  "ratings/getUserRating",
  async (movieId: number) => {
    const { data } = await api.get(`/ratings/movie/${movieId}/`);
    // returns null if no rating exists
    if (!data) return { movieId, rating: null, id: null, review: null };
    return {
      movieId,
      id: data.id,
      rating: parseFloat(data.rating),
      review: data.review,
    };
  }
);

// Create or update rating
export const rateMovie = createAsyncThunk(
  "ratings/rate",
  async ({
    movieId,
    rating,
    review,
  }: {
    movieId: number;
    rating: number;
    review?: string;
  }) => {
    const { data } = await api.post("/ratings/", {
      movie_id: movieId,
      rating: rating.toString(),
      review,
    });
    return {
      movieId,
      id: data.id,
      rating: parseFloat(data.rating),
      review: data.review,
    };
  }
);

// Remove rating
export const removeRating = createAsyncThunk(
  "ratings/remove",
  async ({ movieId }: { movieId: number }, { getState }) => {
    const state = getState() as { ratings: State };
    const rating = state.ratings.byMovie[movieId];
    if (!rating) throw new Error("Rating not found");
    await api.delete(`/ratings/${rating.id}/`);
    return { movieId };
  }
);

const slice = createSlice({
  name: "ratings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET USER RATING
      .addCase(getUserRating.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(getUserRating.fulfilled, (s, a) => {
        if (a.payload.rating !== null) {
          s.byMovie[a.payload.movieId] = {
            id: a.payload.id!,
            rating: a.payload.rating!,
            review: a.payload.review!,
          };
        }
        s.status = "idle";
      })
      .addCase(getUserRating.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message || "Failed to fetch rating";
      })
      // RATE MOVIE
      .addCase(rateMovie.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(rateMovie.fulfilled, (s, a) => {
        s.byMovie[a.payload.movieId] = {
          id: a.payload.id,
          rating: a.payload.rating,
          review: a.payload.review,
        };
        s.status = "idle";
      })
      .addCase(rateMovie.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message || "Failed to rate movie";
      })
      // REMOVE RATING
      .addCase(removeRating.pending, (s) => {
        s.status = "loading";
        s.error = null;
      })
      .addCase(removeRating.fulfilled, (s, a) => {
        delete s.byMovie[a.payload.movieId];
        s.status = "idle";
      })
      .addCase(removeRating.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message || "Failed to remove rating";
      });
  },
});

export default slice.reducer;
