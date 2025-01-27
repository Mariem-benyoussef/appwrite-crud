"use client";
import { deleteTask, fetchTasks } from "@/app/redux/slices/taskSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Task() {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const dispatch = useDispatch();

  const { items: tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId); 
    setShowConfirmPopup(true); 
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteTask(id));
      dispatch(fetchTasks()); 

      setShowConfirmPopup(false); 
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmPopup(false); 
  };

  return (
    <div>
      <div className="flex justify-center items-center h-full">
        <Link
          className={`
      text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
      hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
      dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 
      font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4
    `}
          href="/tasks/create"
        >
          <span className="text-2xl mr-2">+</span>
        </Link>
      </div>

      {error && <p className="py-4 text-red-500">{error}</p>}

      {status === "loading" ? (
        <p>Chargement des tâches...</p>
      ) : tasks?.length > 0 ? (
        <div>
          {tasks.map((task, index) => (
            // console.log("task", task),
            <div key={index} className="p-4 my-2 rounded-md border-b leading-8">
              <div className="font-bold">{task.title}</div>
              <div>{task.description}</div>
              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={`/tasks/edit/${task.id}`}
                >
                  <EditIcon className="text-gray-700" />

                  {/* Modifier */}
                </Link>

                <button
                  onClick={() => handleDeleteClick(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  <DeleteIcon className="mr-2" />
                  {/* Supprimer */}
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
        </div>
      )}
    </div>
  );
}
