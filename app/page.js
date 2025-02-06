"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Task from "./tasks/page";
import { setUserFromCookies } from "./redux/slices/authSlice";
import Cookies from "js-cookie";

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");

    if (token && user) {
      dispatch(setUserFromCookies({ token, user }));
    }
  }, [dispatch]);

  return <Task />; // Afficher le composant Tâche uniquement si l'utilisateur est authentifié
}
