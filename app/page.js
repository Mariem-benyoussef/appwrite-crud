"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Task from "./tasks/page";
import {
  selectIsAuthenticated,
  setUserFromLocalStorage,
} from "./redux/slices/authSlice";

export default function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      dispatch(setUserFromLocalStorage({ token, user }));
    }
  }, [dispatch]);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="text-center text-red-500">
  //       <h2>Veuillez vous reconnecter!</h2>
  //     </div>
  //   );
  // }

  return <Task />; // Only show Task component if the user is authenticated
}
