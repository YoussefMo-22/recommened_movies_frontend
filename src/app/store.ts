import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import moviesReducer from "../features/movies/moviesSlice";
import recsReducer from "../features/recommendations/recsSlice";
import ratingsReducer from "../features/ratings/ratingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    recs: recsReducer,
    ratings: ratingsReducer,
  },
  middleware: (g) => g({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
