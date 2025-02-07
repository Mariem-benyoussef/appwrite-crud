import { fetchAPI } from "@/lib/fetch";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function fetchTask(id, token) {
  return fetchAPI(`/api/tasks/${id}`, {
    method: "GET",
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

async function deleteTask(id, token) {
  const response = await fetchAPI(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  //console.log("responseeeeee", response);
  return response;
}

async function updateTask(id, data, token) {
  return fetchAPI(`/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      // Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export async function GET(req, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token not found" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await fetchTask(id, token);
    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: "Failed to fetch task", details: error.message },
      { status: 500 }
    );
  }
}

// Gestionnaire DELETE pour supprimer une tâche
export async function DELETE(req, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token not found" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await deleteTask(id, token);
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    // console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task", details: error.message },
      { status: 500 }
    );
  }
}

// Gestionnaire PUT pour mettre à jour une tâche
export async function PUT(req, { params }) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token not found" },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    const task = await req.json();
    const updatedTask = await updateTask(id, task, token);

    return NextResponse.json({
      message: "Task updated successfully",
      updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task", details: error.message },
      { status: 500 }
    );
  }
}
