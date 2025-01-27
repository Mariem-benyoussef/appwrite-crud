// // Managing task lists.
// // POST (create task), GET (fetch all tasks).

import { fetchAPI } from "@/lib/fetch";
import { NextResponse } from "next/server";

export async function fetchTasks(token) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/tasks", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching tasks: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in fetchTasks:", error);
    throw error;
  }
}

// GET handler for fetching tasks
export async function GET(req) {
  try {
    // Extract token from the request headers
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      throw new Error("Authorization token not found");
    }

    const tasks = await fetchTasks(token); // Pass the token to fetch tasks
    console.log("Fetched tasks:", tasks);

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);

    return NextResponse.json(
      { error: "Failed to fetch tasks", details: error.message },
      { status: 500 }
    );
  }
}
async function createTask(data) {
  try {
    const response = await fetchAPI("/api/tasks", {
      method: "POST",
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
    const { title, description, status, priority } = await req.json();
    const task = await createTask({
      title,
      description,
      status,
      priority,
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create task",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
