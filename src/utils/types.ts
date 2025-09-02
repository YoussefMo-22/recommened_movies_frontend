export type Movie = {
  id: number;
  title: string;
  poster_url?: string;
  backdrop_url?: string;
  description?: string;
  genres?: { id: number; name: string }[];
  year?: number;
  avg_rating?: number; // avg
};
