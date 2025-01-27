// // Managing task lists.
// // POST (create task), GET (fetch all tasks).

import { fetchAPI } from "@/lib/fetch";
import { NextResponse } from "next/server";

export async function fetchTasks() {
  return fetchAPI("/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
  });
}

export async function GET() {
  // console.log("Backend")
  try {
    const tasks = await fetchTasks();
    return NextResponse.json(tasks);
  } catch (error) {
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
      credentials: "include",
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
