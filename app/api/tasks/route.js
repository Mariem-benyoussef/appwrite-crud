// Managing task lists.
// POST (create task), GET (fetch all tasks).
// (list-level operations).

import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

// Create Task
async function createTask(data) {
  try {
    const response = await database.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      "Tasks",
      ID.unique(),
      data
    );

    return response;
  } catch (error) {
    console.error("Error creating task", error);
    throw new Error("Failed to create task");
  }
}

// Fetch tasks
async function fetchTasks() {
  try {
    const response = await database.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      "Tasks",
      [Query.orderDesc("$createdAt")]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching tasks", error);
    throw new Error("Failed to fetch tasks");
  }
}

export async function POST(req) {
  try {
    const { name, description } = await req.json();
    const data = { name, description };
    const response = await createTask(data);
    return NextResponse.json({ message: "TaskcreateTask created" });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create task",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const tasks = await fetchTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}
