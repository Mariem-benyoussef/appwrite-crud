// import { getAppwriteClient, getAccount } from "@/lib/appwrite_client";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const body = await request.json();

//     const email = body.email;
//     const password = body.password;
//     console.log("email", email);
//     console.log("password", password);
//     if (!email || !password) {
//       return NextResponse.json(
//         { success: false, error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     const client = getAppwriteClient();
//     const account = getAccount(client, email, password);

//     const session = await account;

//     if (!session) {
//       throw new Error(
//         "Failed to create session: Invalid response from Appwrite"
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       session,
//     });
//   } catch (error) {
//     const errorMessage =
//       error.type === "user_invalid_credentials"
//         ? "Invalid email or password"
//         : error.message;

//     return NextResponse.json(
//       {
//         success: false,
//         error: errorMessage,
//       },
//       { status: error.code || 400 }
//     );
//   }
// }
// export async function DELETE() {
//   const client = getAppwriteClient();
//   const account = getAccount(client, email, password);

//   try {
//     await account.deleteSession("current");
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 400 }
//     );
//   }
// }

import { NextResponse } from 'next/server';

const API_URL = 'http://127.0.0.1:8000';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    // Send login request to Laravel API
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ success: false, error: errorData.message || 'Login failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, user: data.user, token: data.token });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
