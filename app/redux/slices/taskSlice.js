import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
// Async thunk pour récupérer une tâche par son ID
export const fetchTask = createAsyncThunk(
  "fetchTask",
  async (id, { rejectWithValue, getState }) => {
    try {
      const token = Cookies.get("token");
      // const token = getState().auth.token;
      // if (!token) {
      //   throw new Error("Veuillez vous reconnecter!");
      // }

      const response = await fetch(`/api/tasks/${id}`, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Error fetching task: ${response.statusText}`);
      }

      // console.log("responseeeeee", response);
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk pour récupérer toutes les tâches
export const fetchTasks = createAsyncThunk(
  "fetchTasks",
  async (_, { rejectWithValue, getState }) => {
    try {
      // const token = getState().auth.token;
      const token = Cookies.get("token");
      // if (!token) {
      //   throw new Error("Veuillez vous reconnecter!");
      // }
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          //Authorization: `Bearer ${token}`,
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
export const addTask = createAsyncThunk(
  "addTask",
  async (task, { getState, rejectWithValue }) => {
    try {
      // const token = getState().auth.token;
      const token = Cookies.get("token");
      // if (!token) {
      //   throw new Error("Veuillez vous reconnecter!");
      // }
      const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error(`Error adding task: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk pour mettre à jour une tâche
export const updateTask = createAsyncThunk(
  "updateTask",
  async ({ id, updates }, { getState, rejectWithValue }) => {
    try {
      // const token = getState().auth.token;
      const token = Cookies.get("token");
      // if (!token) {
      //   throw new Error("Veuillez vous reconnecter!");
      // }
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`Error updating task: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk pour supprimer une tâche
export const deleteTask = createAsyncThunk(
  "deleteTask",
  async (id, { getState, rejectWithValue }) => {
    try {
      // const token = getState().auth.token;
      const token = Cookies.get("token");
      console.log("Début suppression tâche", id);
      console.log("Token:", token);

      // if (!token) {
      //   throw new Error("Veuillez vous reconnecter!");
      // }

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          //Authorization: `Bearer ${token}`,
        },
      });

      console.log("Réponse API:", response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        throw new Error(`Error deleting task: ${errorText}`);
      }

      console.log("Tâche supprimée avec succès:", id);
      return id;
    } catch (error) {
      console.error("Erreur dans deleteTask:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Définition du slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    selectedTask: null,
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
        if (!Array.isArray(state.items)) {
          state.items = [];
        }
        state.items.push(action.payload);
        state.status = "succeeded";
        console.log("Tâche ajoutée:", action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
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
        state.error = action.payload;
      })

      // Suppression d'une tâche
      .addCase(deleteTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        console.log("Réduction deleteTask.fulfilled exécutée", action.payload);
        state.status = "succeeded";
        state.items = state.items.filter((task) => task.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        console.error("deleteTask a échoué:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      })

      // Récupération d'une tâche par son ID
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default tasksSlice.reducer;
