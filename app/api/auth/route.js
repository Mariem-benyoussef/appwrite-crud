import { getAppwriteClient, getAccount } from "@/lib/appwrite_client";
import { NextResponse } from "next/server";

// export async function POST(request) {
//   const client = getAppwriteClient();
//   const account = getAccount(client, email, password);

//   try {
//     const body = await request.json();
//     const email = body.email.email;
//     const password = body.email.password;

//     // console.log("bodyyyyyyyyyyyyyy", body);
//     // console.log("emaillll", email);
//     // console.log("passworddddddddddd", password);

//     if (!email || !password) {
//       throw new Error("Email and password are required");
//     }

//     const session = await account.createSession(email, password);
//     // Validate the returned session
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
//     // Handle Appwrite specific errors
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

export async function POST(request) {
   try {
    
  const body = await request.json();

  const email = body.email;
  const password = body.password;
  console.log("email", email);
  console.log("password", password);
  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required" },
      { status: 400 }
    );
  }

    const client = getAppwriteClient();
    const account = getAccount(client, email, password);

    const session = await account;

    if (!session) {
      throw new Error(
        "Failed to create session: Invalid response from Appwrite"
      );
    }

    return NextResponse.json({
      success: true,
      session,
    });
  } catch (error) {
    const errorMessage =
      error.type === "user_invalid_credentials"
        ? "Invalid email or password"
        : error.message;

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: error.code || 400 }
    );
  }
}
export async function DELETE() {
  const client = getAppwriteClient();
  const account = getAccount(client, email, password);

  try {
    await account.deleteSession("current");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
