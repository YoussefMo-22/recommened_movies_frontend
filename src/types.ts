export type ID = number;

export type Movie = {
  id: ID;
  title: string;
  year?: number | null;
  // backend may serve genres as array of strings or nested objects:
  genres?: string[] | { id: number; name: string }[] | string | null;
  synopsis?: string | null;
  avg_rating?: number | null;
  ratings_count?: number | null;
  poster_url?: string | null;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type User = {
  id?: number;
  username: string;
  email?: string;
};

export type Rating = {
  id: ID;
  movie: ID | Movie;
  rating: number;
  review?: string | null;
};
