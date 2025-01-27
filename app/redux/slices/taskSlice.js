import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAPI } from "@/lib/fetch";

const getCsrfToken = () => {
  console.log("document.cookie", document.cookie);

  const matches = document.cookie.match(/(^| )XSRF-TOKEN=([^;]+)/);
  console.log("matches", matches);
  if (matches) {
    console.log("matches2", matches[2]);

    return matches[2]; // CSRF token value
  }

  return null; // No CSRF token available
};

function isAdmin(state) {
  const user = selectUser(state);
  return user?.role === "Admin";
}

// Async thunk for fetching tasks
// Exemple de fonction fetch pour obtenir les tâches
export const fetchTasks = createAsyncThunk(
  "fetchTasks",
  async (_, { getState }) => {
    try {
      const user = getState().auth.user;
      // if (!user || !user.token) {
      //   throw new Error("User is not authenticated");
      // }
      // console.log("getState()", getState());

      // console.log("getState().auth", getState().auth);

      // console.log("getState().auth.user", getState().auth.user);
      console.log("useeeeeer", user);

      // if (!csrfToken) {
      //   throw new Error("CSRF token is missing");
      // }
      // console.log("csrfTokennnnnnnnn", getCsrfToken());
      const csrfToken = getCsrfToken();
      const response = await fetchAPI(`/api/tasks`, {
        method: "GET",
        credentials: "include", // Inclure les cookies
        headers: {
          "X-XSRF-TOKEN": csrfToken, // Ajouter le token CSRF dans les en-têtes
          // Authorization: `Bearer ${getState().auth.user.token}`, // Si vous utilisez un JWT
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching tasks: ${response.statusText}`);
      }
      return await response.json(); // Retourner les tâches récupérées
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Async thunk for adding a task (admin only)
export const addTask = createAsyncThunk(
  "addTask",
  async (task, { getState }) => {
    if (!isAdmin(getState())) {
      throw new Error("Unauthorized: Admin privileges required");
    }

    try {
      const response = await fetchAPI(`/api/tasks`, {
        method: "POST",
        credentials: "include", // Sends cookies (including CSRF token)
        body: JSON.stringify(task),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error adding task: ${response.statusText}`
        );
      }
      return await response.json(); // Return the created task data
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Async thunk for updating a task (admin only)
export const updateTask = createAsyncThunk(
  "updateTask",
  async ({ id, updates }, { getState }) => {
    if (!isAdmin(getState())) {
      throw new Error("Unauthorized: Admin privileges required");
    }

    try {
      const response = await fetchAPI(`/api/tasks/${id}`, {
        method: "PUT",
        credentials: "include", // Sends cookies (including CSRF token)
        body: JSON.stringify(updates),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error updating task: ${response.statusText}`
        );
      }
      return await response.json(); // Return the updated task data
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

// Async thunk for deleting a task (admin only)
export const deleteTask = createAsyncThunk(
  "deleteTask",
  async (id, { getState }) => {
    if (!isAdmin(getState())) {
      throw new Error("Unauthorized: Admin privileges required");
    }

    try {
      const response = await fetchAPI(`/api/tasks/${id}`, {
        method: "DELETE",
        credentials: "include", // Sends cookies (including CSRF token)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error deleting task: ${response.statusText}`
        );
      }
      return id; // Return the ID of the deleted task
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

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
        // console.log("Tâches récupérées:", action.payload);
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
        // console.log("Tâche ajoutée:", action.payload);
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
        // console.log("Tâche mise à jour:", action.payload);
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
        // console.log("Tâche supprimée, ID:", action.payload);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default tasksSlice.reducer;
