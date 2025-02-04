"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoute({
  children,
  allowedRoles = ["ADMIN", "USER"],
}) {
  const router = useRouter();
  const { token, role } = useSelector((state) => state.auth); // Récupère le token et le rôle

  console.log("token", token);
  console.log("role", role);
  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      router.push("/unauthorized"); // Redirection si le rôle n'est pas autorisé
    }
  }, [token, role, router, allowedRoles]);

  return children;
}
