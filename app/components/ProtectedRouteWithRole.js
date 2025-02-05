"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function ProtectedRouteWithRole({ children, allowedRoles = ["ADMIN"] }) {
  const router = useRouter();
  const { token, role, isAuthenticated } = useSelector((state) => state.auth); // Vérification de l'authentification et du rôle

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login"); // Si non authentifié, redirection vers login
    } else if (!allowedRoles.includes(role)) {
      router.push("/unauthorized"); // Redirection vers la page unauthorized si le rôle n'est pas autorisé
    }
  }, [isAuthenticated, role, router, allowedRoles]);

  return isAuthenticated && allowedRoles.includes(role) ? children : null; // Affiche les enfants si authentifié et rôle autorisé
}
