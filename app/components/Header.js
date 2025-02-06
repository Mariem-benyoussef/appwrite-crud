"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  logout,
  selectIsAuthenticated,
  setUserFromCookies,
  selectUser,
} from "../redux/slices/authSlice";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = Cookies.get("user");
    console.log("Stored Token:", storedToken);
    console.log("Stored User:", storedUser);
    if (storedToken && storedUser) {
      dispatch(
        setUserFromCookies({
          token: storedToken,
          user: JSON.parse(storedUser),
        })
      );
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    Cookies.remove("token");
    Cookies.remove("user");
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
