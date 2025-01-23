// // Managing task lists.
// // POST (create task), GET (fetch all tasks).

import { fetchAPI } from "@/lib/fetch";
import { NextResponse } from "next/server";

// import { getAppwriteClient } from "@/lib/appwrite_client";
// import { Databases, ID, Query } from "appwrite";
// import { NextResponse } from "next/server";

// const database = new Databases(getAppwriteClient());

// // Create Task
// async function createTask(data) {
//   try {
//     const response = await database.createDocument(
//       process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
//       "Tasks",
//       ID.unique(),
//       data
//     );

//     return response;
//   } catch (error) {
//     console.error("Error creating task", error);
//     throw new Error("Failed to create task");
//   }
// }

// // Fetch tasks
// async function fetchTasks() {
//   try {
//     const response = await database.listDocuments(
//       process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
//       "Tasks",
//       [Query.orderDesc("$createdAt")]
//     );

//     return response.documents;
//   } catch (error) {
//     console.error("Error fetching tasks", error);
//     throw new Error("Failed to fetch tasks");
//   }
// }

// export async function POST(req) {
//   try {
//     const { name, description } = await req.json();
//     const data = { name, description };
//     const response = await createTask(data);
//     return NextResponse.json({ message: "TaskcreateTask created" });
//   } catch (error) {
//     return NextResponse.json(
//       {
//         error: "Failed to create task",
//       },
//       { status: 500 }
//     );
//   }
// }

export async function fetchTasks() {
  return fetchAPI("/api/tasks", { method: "GET" });
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
