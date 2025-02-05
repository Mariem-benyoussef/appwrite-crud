// Import the required modules
import { cookies } from "next/headers"; // For server-side cookie handling
import { redirect } from "next/navigation"; // For redirecting users
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value; // Access the token cookie value

  if (token) {
    redirect("/");
  }

  return (
    <div>
      <h1>Se connecter</h1>
      <LoginForm initialErrors={{}} />
    </div>
  );
}
