// // Managing specific tasks by id.
// // GET (fetch by id), DELETE, PUT.

import { fetchAPI } from "@/lib/fetch";
import { NextResponse } from "next/server";


export async function fetchTask(id) {
  return fetchAPI(`/api/tasks/${id}`, { method: "GET" });
}

async function deleteTask(id) {
  return fetchAPI(`/api/tasks/${id}`, { method: "DELETE" });
}
async function updateTask(id, data) {
  return fetchAPI(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await deleteTask(id);
    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete task",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const task = await req.json();
    const updatedTask = await updateTask(id, task);

    return NextResponse.json({ message: "Task updated", updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
