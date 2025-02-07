import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

// Utility to safely get cookies in the browser
const getCookie = (key) =>
  typeof window !== "undefined" ? Cookies.get(key) : null;

// Async login action
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Login failed! Please check your credentials.");
      }

      const data = await response.json();
      return { token: data.token, user: data.user };
    } catch (error) {
      console.error("Login request error:", error);
      return rejectWithValue(
        error.message || "An error occurred during login."
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
    error: null,
    loading: false,
  },

  reducers: {
    setLogin: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.role = user.role;
      state.isAuthenticated = true;

      Cookies.set("token", token);
      Cookies.set("user", JSON.stringify(user));
      Cookies.set("role", user.role);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;

      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("role");
    },

    setUserFromCookies: (state) => {
      if (typeof window !== "undefined") {
        // Ensuring this runs only on client
        const token = Cookies.get("token");
        const user = Cookies.get("user");
        const role = Cookies.get("role");

        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.role = role;
          state.isAuthenticated = true;
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { token, user } = action.payload;
        state.loading = false;
        state.isAuthenticated = true;
        state.user = user;
        state.token = token;
        state.role = user.role;
        state.error = null;

        Cookies.set("token", token);
        Cookies.set("user", JSON.stringify(user));
        Cookies.set("role", user.role);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.role;

// Actions
export const { setLogin, logout, setUserFromCookies } = authSlice.actions;

export default authSlice.reducer;
