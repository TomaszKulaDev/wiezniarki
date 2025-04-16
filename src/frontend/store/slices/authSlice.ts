import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../index";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    id: string | null;
    email: string | null;
    role: "prisoner" | "partner" | "admin" | "moderator" | null;
  };
  status: "idle" | "loading" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: {
    id: null,
    email: null,
    role: null,
  },
  status: "idle",
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        role: AuthState["user"]["role"];
      }>
    ) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.status = "idle";
      state.error = null;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.isLoggedIn = false;
      state.user = initialState.user;
      state.status = "failed";
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = initialState.user;
      state.status = "idle";
      state.error = null;
    },
    setAuthLoading: (state) => {
      state.status = "loading";
    },
  },
});

export const { loginSuccess, loginFailed, logout, setAuthLoading } =
  authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectCurrentUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
