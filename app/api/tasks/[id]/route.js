import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Fetch a specific task
async function fetchTask(id) {
  try {
    const task = await database.getDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      "Tasks",
      id
    );
    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw new Error("Failed to fetch task");
  }
}

// Delete a specific task
async function deleteTask(id) {
  try {
    const response = await database.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      "Tasks",
      id
    );
    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Failed to delete task");
  }
}

// Update a specific task
async function updateTask(id, data) {
  try {
    const response = await database.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      "Tasks",
      id,
      data
    );
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Failed to update task");
  }
}

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const task = await fetchTask(id);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await deleteTask(id);
    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const task = await req.json();
    await updateTask(id, task);
    return NextResponse.json({ message: "Task updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}
