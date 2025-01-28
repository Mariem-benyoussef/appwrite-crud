"use client";

import { deleteTask, fetchTasks } from "@/app/redux/slices/taskSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { logout, setUserFromLocalStorage } from "../redux/slices/authSlice";

export default function Task() {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Permet d'envoyer des actions au store Redux
  const dispatch = useDispatch();

  // Get tasks and status from Redux store
  const { items: tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    // Dispatch the action to set user and token from localStorage on initial load
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        dispatch(
          setUserFromLocalStorage({ token: storedToken, user: storedUser })
        );
      }
    }
    // Fetch tasks when the component mounts
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
    setShowConfirmPopup(true);
  };
  const handleDelete = async (id) => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        dispatch(
          setUserFromLocalStorage({ token: storedToken, user: storedUser })
        );
      }
      const deleteResult = await dispatch(deleteTask(id));
      console.log("Delete result:", deleteResult);

      if (deleteTask.rejected.match(deleteResult)) {
        // Log the full error message for better debugging
        console.error("Error deleting task:", deleteResult.payload);

        if (
          deleteResult.payload &&
          deleteResult.payload.includes("Unauthenticated")
        ) {
          console.error("User is unauthenticated. Redirecting to login...");
          //dispatch(logout());
        }
        return;
      }

      console.log("Task deleted successfully, fetching tasks again...");
      await dispatch(fetchTasks());
      setShowConfirmPopup(false);
    } catch (error) {
      // Log the entire error object to check its structure
      console.error("Error during delete:", error);

      if (error.message.includes("Unauthenticated")) {
        console.error("User is unauthenticated. Redirecting to login...");
        dispatch(logout());
      }
    }
  };

  const handleCancel = () => {
    setShowConfirmPopup(false); // Close the confirmation popup without deleting
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}

      {status === "loading" ? (
        <p>Chargement des tâches...</p>
      ) : tasks?.length > 0 ? (
        <div>
          {tasks.map((task, index) => (
            <div key={index} className="p-4 my-2 rounded-md border-b leading-8">
              <div className="font-bold">{task.title}</div>
              <div>{task.description}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={`/tasks/edit/${task.id}`}
                >
                  <EditIcon className="text-gray-700" />
                </Link>

                <button
                  onClick={() => handleDeleteClick(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  <DeleteIcon className="mr-2" />
                </button>

                {showConfirmPopup && (
                  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                      <p>Êtes-vous sûr de vouloir supprimer cette tâche ?</p>
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => handleDelete(taskToDelete)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          Confirmer
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <p>Aucune tâche trouvée.</p>
          <Link
            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4"
            href="/tasks/create"
          >
            <span className="text-2xl mr-2">+</span>
          </Link>
        </div>
      )}
    </div>
  );
}
