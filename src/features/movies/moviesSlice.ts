import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Movie } from "../../utils/types";

type State = {
  trending: Movie[];
  byGenre: Record<string, Movie[]>;
  search: { query: string; results: Movie[]; page: number; hasMore: boolean; };
  details: Record<number, Movie>;
  similar: Record<number, Movie[]>;
  hybrid: Record<number, Movie[]>;
  status: "idle"|"loading"|"failed";
  error?: string|null;
};
const initialState: State = {
  trending: [],
  byGenre: {},
  search: { query: "", results: [], page: 1, hasMore: true },
  details: {},
  similar: {},
  hybrid: {},
  status: "idle",
  error: null
};

export const fetchTrending = createAsyncThunk(
  "movies/trending",
  async (page: number = 1) => {
    const { data } = await api.get(`movies/?page=${page}`);
    return { results: data.results as Movie[], page };
  }
);

export const fetchByGenre = createAsyncThunk(
  "movies/byGenre",
  async ({ genre, page = 1 }: { genre: string; page?: number }) => {
    const { data } = await api.get(`movies/by-genre/${genre}?page=${page}`);
    return { genre, results: data.results as Movie[], page };
  }
);

export const searchMovies = createAsyncThunk("movies/search",
  async ({ q, page=1 }: { q: string; page?: number }) => {
    const { data } = await api.get(`movies/?title=${encodeURIComponent(q)}`);
    return { q, page, results: data.results as Movie[], hasMore: !!data.next };
  });

export const getDetails = createAsyncThunk("movies/details",
  async (id: number) => {
    const { data } = await api.get(`movies/${id}/`);
    return data as Movie;
  });

export const getSimilar = createAsyncThunk("movies/similar",
  async (id: number) => {
    const { data } = await api.get(`movies/${id}/recommendations/`);
    return { id, results: data as Movie[] };
  });

export const getHybrid = createAsyncThunk("movies/hybrid",
  async (id: number) => {
    const { data } = await api.get(`movies/${id}/hybrid/`);
    return { id, results: data.recommendations as Movie[] };
  });

const slice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    resetSearch(s) { s.search = { query:"", results:[], page:1, hasMore:true }; }
  },
  extraReducers: (b) => {
    b.addCase(fetchTrending.fulfilled, (s, a) => {
    if (a.payload.page === 1) s.trending = a.payload.results;
    else s.trending.push(...a.payload.results);
  })
       .addCase(fetchByGenre.fulfilled, (s, a) => {
    const prev = s.byGenre[a.payload.genre] ?? [];
    if (a.payload.page === 1) s.byGenre[a.payload.genre] = a.payload.results;
    else s.byGenre[a.payload.genre] = [...prev, ...a.payload.results];
  })
     .addCase(searchMovies.fulfilled, (s,a)=>{
        s.search.query = a.payload.q;
        s.search.page = a.payload.page;
        s.search.hasMore = a.payload.hasMore;
        s.search.results = a.payload.page===1 ? a.payload.results : [...s.search.results, ...a.payload.results];
     })
     .addCase(getDetails.fulfilled, (s,a)=>{ s.details[a.payload.id] = a.payload; })
     .addCase(getSimilar.fulfilled, (s,a)=>{ s.similar[a.payload.id] = a.payload.results; })
     .addCase(getHybrid.fulfilled, (s,a)=>{ s.hybrid[a.payload.id] = a.payload.results; });
  }
});
export const { resetSearch } = slice.actions;
export default slice.reducer;
