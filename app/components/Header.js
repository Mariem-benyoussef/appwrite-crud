"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  logout,
  selectIsAuthenticated,
  setUserFromLocalStorage,
  selectUser,
} from "../redux/slices/authSlice";
import { useEffect } from "react";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        dispatch(
          setUserFromLocalStorage({
            token: storedToken,
            user: JSON.parse(storedUser),
          })
        );
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    router.push("/auth/login");
  };

  return (
    <header className="p-6 border-b flex items-center justify-between bg-blue-500 rounded-bl-lg rounded-br-lg">
      <Link className="text-2xl font-bold text-white" href={"/"}>
        Tâches
      </Link>

      {!isAuthenticated ? (
        <Link
          href="/auth/login"
          className="text-white bg-blue-600 px-4 py-2 rounded-full"
        >
          Se connecter
        </Link>
      ) : (
        <>
          <span className="text-white">Bienvenue, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-500 px-4 py-2 rounded-full"
          >
            Logout
          </button>
        </>
      )}
    </header>
  );
};

export default Header;
