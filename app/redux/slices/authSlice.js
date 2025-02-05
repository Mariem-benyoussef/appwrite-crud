import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fonction utilitaire pour accéder en toute sécurité à localStorage.
const getLocalStorageItem = (key) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

// Action de connexion asynchrone.
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

      // S'assurer que la réponse est réussie.
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
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.isAuthenticated = true;

      // Stocker dans localStorage si exécuté dans un navigateur.
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.user.role);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;

      // Supprimer de localStorage si exécuté dans un navigateur.
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
      }
    },
    setUserFromLocalStorage: (state) => {
      // Récupérer depuis localStorage uniquement si exécuté dans un navigateur.
      if (typeof window !== "undefined") {
        const token = getLocalStorageItem("token");
        const user = getLocalStorageItem("user");
        const role = getLocalStorageItem("role");

        // S'assurer que le token et l'utilisateur existent pour l'authentification.
        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.role = role;
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
        state.role = action.payload.user.role;
        state.error = null;

        // Stocker dans localStorage si exécuté dans le navigateur.
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          localStorage.setItem("role", action.payload.user.role);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Sélecteurs
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.role;

export const { setLogin, logout, setUserFromLocalStorage } = authSlice.actions;

export default authSlice.reducer;
