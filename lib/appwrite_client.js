import { Account, Client, ID } from "appwrite";
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

export function getAppwriteClient(session) {
  if (session) {
    client.setJWT(session);
  }
  return client;
}

// export function getAccount(client) {
//   return new Account(client);
// }

export async function getAccount(client, email, password) {
  const account = new Account(client);

  try {
    const result = await account.createEmailPasswordSession(email, password);
    console.log("User created successfully:", result);
    return result; 
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error; 
  }
}
