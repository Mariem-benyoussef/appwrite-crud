import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to safely access localStorage
const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

// Async login action
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // Ensure the response is successful
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
    isAuthenticated: false,
    error: null,
    loading: false,
  },

  reducers: {
    setLogin: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // Store in localStorage if running in browser
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      // Remove from localStorage if running in browser
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    setUserFromLocalStorage: (state) => {
      // Retrieve from localStorage only if running in the browser
      if (typeof window !== "undefined") {
        const token = getLocalStorageItem("token");
        const user = getLocalStorageItem("user");

        // Ensure both token and user exist for authentication
        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }

        state.error = null;
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
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;

        // Store in localStorage if running in browser
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
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

export const { setLogin, logout, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
