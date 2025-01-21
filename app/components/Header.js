"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logout, selectIsAuthenticated } from "../redux/slices/authSlice";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const handleLogout = () => {
    dispatch(logout());
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
          <span className="text-white">Welcome, {user?.name}</span>
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
