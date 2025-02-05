// Gestion des listes de tâches.
// POST (créer une tâche), GET (récupérer toutes les tâches).

import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;
const API_URL = `${API_BASE_URL}/api/tasks`;
export async function fetchTasks(token) {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    throw error;
  }
}

// Gestionnaire GET pour récupérer les tâches.
export async function GET(req) {
  try {
    // Extraire token des en-têtes de la requête.

    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new Error("Authorization token not found");
    }

    const tasks = await fetchTasks(token); // Passer token pour récupérer les tâches.

    // console.log("Fetched tasks:", tasks);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);

    return NextResponse.json(
      { error: "Failed to fetch tasks", details: error.message },
      { status: 500 }
    );
  }
}
async function createTask(token, data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token not found" },
        { status: 401 }
      );
    }

    const { title, description, status, priority } = await req.json();
    const task = await createTask(token, {
      title,
      description,
      status,
      priority,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error creating task:", error);

    return NextResponse.json(
      { error: "Failed to create task", details: error.message },
      { status: 500 }
    );
  }
}
