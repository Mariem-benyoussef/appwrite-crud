"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth); // Vérification de l'authentification

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login"); // Si non authentifié, redirection vers login
    }
  }, [isAuthenticated, router]);

  return isAuthenticated ? children : null; // Rendu des enfants si authentifié
}
