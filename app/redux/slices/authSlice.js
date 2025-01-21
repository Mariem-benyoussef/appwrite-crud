import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.isLoading = false;
      state.user = null;
      state.session = null;
      state.error = null;
    },
    logoutFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  setUser,
} = authSlice.actions;

// Create thunks for async operations
export const login = (email, password) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    dispatch(
      loginSuccess({
        session: data.session,
        user: data.user,
      })
    );
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logout = () => async (dispatch) => {
  dispatch(logoutStart());
  try {
    const response = await fetch("/api/auth", {
      method: "DELETE",
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFailure(error.message));
  }
};

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectSession = (state) => state.auth.session;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.session;

export default authSlice.reducer;
