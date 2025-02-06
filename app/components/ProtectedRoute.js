"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function ProtectedRoute({ children }) {
  const router = useRouter();
  const { isAuthenticated, token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true); // To prevent UI flickering

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/auth/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, router]);

  if (loading) {
    return null;
  }

  return children;
}
