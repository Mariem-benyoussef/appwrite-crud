"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import Task from "./tasks/page";
import { setUserFromLocalStorage } from "./redux/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setUserFromLocalStorage({ token }));
    }
  }, [dispatch]);

  return <Task />;
}
