import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { Movie } from "../../utils/types";

type State = {
  personal: Movie[];
  status: "idle"|"loading"|"failed";
  error?: string|null;
};
const initialState: State = { personal: [], status: "idle", error: null };

export const fetchPersonalRecs = createAsyncThunk(
  "recs/personal",
  async (userId: number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`recommend/${userId}/`);
      return data as Movie[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);



const slice = createSlice({
  name: "recs",
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchPersonalRecs.pending, (s)=>{ s.status="loading"; s.error=null; })
     .addCase(fetchPersonalRecs.fulfilled, (s,a)=>{ s.status="idle"; s.personal = a.payload; })
     .addCase(fetchPersonalRecs.rejected, (s,a)=>{ s.status="failed"; s.error=String(a.error.message); });
  }
});
export default slice.reducer;
