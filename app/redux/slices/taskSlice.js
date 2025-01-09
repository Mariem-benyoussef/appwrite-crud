import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk pour récupérer toutes les tâches
export const fetchTasks = createAsyncThunk("fetchTasks", async () => {
  try {
    const response = await fetch(`/api/tasks`);
    if (!response.ok) {
      throw new Error(`Error fetching tasks: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
});

// Async thunk pour ajouter une nouvelle tâche
export const addTask = createAsyncThunk("addTask", async (task) => {
  try {
    const response = await fetch(`/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
export const deleteTask = createAsyncThunk("deleteTask", async (id) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error deleting task: ${response.statusText}`);
    }
    return id; // Retourne simplement l'ID de la tâche supprimée
  } catch (error) {
    throw new Error(error.message);
  }
});

// Définition du slice
const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [], // Liste des tâches
    status: "idle", // Pour suivre l'état de la récupération, ajout, mise à jour, ou suppression
    error: null, // Stocke les messages d'erreur
  },
  reducers: {}, // Pas de reducers supplémentaires pour l'instant
  extraReducers: (builder) => {
    builder
      // Récupération des tâches
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Stocker les tâches récupérées
        console.log("Tâches récupérées:", action.payload);
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        console.error(
          "Erreur de récupération des tâches:",
          action.error.message
        );
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
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;
