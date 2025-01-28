import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk pour récupérer toutes les tâches
export const fetchTasks = createAsyncThunk(
  "fetchTasks",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        throw new Error("No token found, please log in again.");
      }
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk pour ajouter une nouvelle tâche
export const addTask = createAsyncThunk("addTask", async (task) => {
  try {
    const token = getState().auth.token;

    if (!token) {
      throw new Error("No token found, please log in again.");
    }
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      // credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`Error adding task: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Async thunk pour mettre à jour une tâche
export const updateTask = createAsyncThunk(
  "updateTask",
  async ({ id, updates }) => {
    try {
      const token = getState().auth.token;

      if (!token) {
        throw new Error("No token found, please log in again.");
      }
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        // credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`Error updating task: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Async thunk pour supprimer une tâche
export const deleteTask = createAsyncThunk(
  "deleteTask",
  async (id, { getState, rejectWithValue, dispatch }) => {
    try {
      const token = getState().auth.token;
      console.log("Token from Redux state:", token);

      if (!token) {
        throw new Error("No token found, please log in again.");
      }

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(`Error deleting task: ${errorText}`);
      }

      return id;
    } catch (error) {
      console.error("Error in deleteTask thunk:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Définition du slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Récupération des tâches
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
        // console.log("Tâches récupérées:", action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("Error fetching tasks:", state.error);
      })

      // Ajout d'une nouvelle tâche
      .addCase(addTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload); // Ajouter la nouvelle tâche à la liste
        state.status = "succeeded";
        console.log("Tâche ajoutée:", action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Mise à jour d'une tâche
      .addCase(updateTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload; // Remplacer la tâche mise à jour
        }
        console.log("Tâche mise à jour:", action.payload);
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Suppression d'une tâche
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((task) => task.id !== action.payload); // Retirer la tâche supprimée
        console.log("Tâche supprimée, ID:", action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;
