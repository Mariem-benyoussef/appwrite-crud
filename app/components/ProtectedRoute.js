"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function ProtectedRoute({
  children,
  allowedRoles = ["ADMIN", "USER"],
}) {
  const router = useRouter();
  const { token, role, isAuthenticated } = useSelector((state) => state.auth); // Ajout de la vérification de l'authentification

  console.log("token", token);
  console.log("role", role);
  console.log("isAuthenticated", isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login"); // Si pas authentifié, redirection vers login
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      router.push("/unauthorized"); // Si rôle non autorisé, redirection vers unauthorized
    }
  }, [isAuthenticated, token, role, router, allowedRoles]);

  return children;
}
