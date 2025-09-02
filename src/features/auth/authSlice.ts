import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

type User = { id: number; username: string; email?: string };
type AuthState = {
  loading: boolean;
  user: User | null;
  status: "idle" | "loading" | "failed";
  error?: string | null;
  isAuthed: boolean;
};

const access = localStorage.getItem("access");
const initialState: AuthState = {
  loading: false,
  user: null,
  status: "idle",
  error: null,
  isAuthed: !!access,
};

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: {
    username: string;
    email: string;
    password: string;
    password2: string;
  }) => {
    await api.post("auth/register/", payload);
  }
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: { username: string; password: string }, { dispatch }) => {
    const { data } = await api.post("auth/login/", payload);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    const me = await dispatch(meThunk()).unwrap();

    return { tokens: data, user: me };
  }
);

export const meThunk = createAsyncThunk("auth/me", async () => {
  const { data } = await api.get("auth/me/");
  return data as User;
});

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      state.isAuthed = false;
      state.user = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loginThunk.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(loginThunk.fulfilled, (s, a) => {
      s.isAuthed = true;
      s.status = "idle";
      s.user = a.payload.user;
    });
    b.addCase(loginThunk.rejected, (s, a) => {
      s.status = "failed";
      s.error = String(a.error.message);
    });

    b.addCase(registerThunk.pending, (s) => {
      s.status = "loading";
      s.error = null;
    });
    b.addCase(registerThunk.fulfilled, (s) => {
      s.status = "idle";
    });
    b.addCase(registerThunk.rejected, (s, a) => {
      s.status = "failed";
      s.error = String(a.error.message);
    });

    b.addCase(meThunk.fulfilled, (s, a) => {
      s.user = a.payload;
    });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
