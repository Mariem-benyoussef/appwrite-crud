"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export function ProtectedRouteWithRole({ children, allowedRoles = ["ADMIN"] }) {
  const router = useRouter();
  const { token, role, isAuthenticated } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push("/auth/login");
    } else if (!allowedRoles.includes(role)) {
      router.push("/unauthorized");
    } else {
      setLoading(false); 
    }
  }, [isAuthenticated, token, role, router, allowedRoles]);

  if (loading) {
    return null;
  }

  return children;
}
