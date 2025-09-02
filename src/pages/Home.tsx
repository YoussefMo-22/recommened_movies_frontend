import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchTrending, fetchByGenre } from "../features/movies/moviesSlice";
import Hero from "../components/Hero";
import HomeRowCarousel from "../components/HomeRowCarousel";
import Spinner from "../components/Spinner";

const GENRES = [
  "Action", "Adventure", "Animation", "Children", "Comedy",
  "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir",
  "Horror", "Musical", "Mystery", "Romance", "Sci-Fi",
  "Thriller", "War", "Western",
];

export default function Home() {
  const dispatch = useAppDispatch();
  const { trending, byGenre } = useAppSelector((s) => s.movies);

  useEffect(() => {
    dispatch(fetchTrending(1));
    GENRES.forEach((g) => dispatch(fetchByGenre({ genre: g, page: 1 })));
  }, [dispatch]);

  const allGenresLoaded = useMemo(() => {
    return GENRES.every((g) => Array.isArray(byGenre[g]) && byGenre[g].length > 0);
  }, [byGenre]);

  const isLoading = !trending.length || !allGenresLoaded;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <HomeRowCarousel title="Trending Now" items={trending} />
      {GENRES.map((g) => (
        <HomeRowCarousel key={g} title={g} items={byGenre[g]} genre={g} />
      ))}
    </div>
  );
}
