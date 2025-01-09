"use client";
import { deleteTask, fetchTasks } from "@/app/redux/slices/taskSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Task() {
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const dispatch = useDispatch();

  // Get tasks and status from Redux store
  const { items: tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTasks());
  }, [dispatch]);

  // const handleDelete = (id) => {
  //   dispatch(deleteTask(id))
  //     .unwrap()
  //     .then(() => {
  //       // Mettre à jour les tâches localement sans recharger la page
  //       dispatch(fetchTasks()); // Relance la récupération des tâches
  //     })
  //     .catch((err) => {
  //       console.error("Erreur lors de la suppression :", err);
  //     });
  // };

  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId); // Enregistrez l'ID de la tâche à supprimer
    setShowConfirmPopup(true); // Affichez la modale de confirmation
  };

  const handleDelete = async (id) => {
    try {
      // Appelez le thunk pour supprimer la tâche
      await dispatch(deleteTask(id)).unwrap();

      // Mettre à jour les tâches localement sans recharger la page
      dispatch(fetchTasks()); // Relance la récupération des tâches

      setShowConfirmPopup(false); // Masquez la modale
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
    }
  };

  const handleCancel = () => {
    setShowConfirmPopup(false); // Masquer la modale sans supprimer
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}

      {status === "loading" ? (
        <p>Chargement des tâches...</p>
      ) : tasks?.length > 0 ? (
        <div>
          {tasks.map((task, index) => (
            // console.log("task", task),
            <div key={index} className="p-4 my-2 rounded-md border-b leading-8">
              <div className="font-bold">{task.name}</div>
              <div>{task.description}</div>

              <div className="flex gap-4 mt-4 justify-end">
                <Link
                  className="bg-slate-200 px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                  href={`/edit/${task.$id}`}
                >
                  Modifier
                </Link>

                <button
                  onClick={() => handleDeleteClick(task.$id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  Supprimer
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
            href="/create"
          >
            <span className="text-2xl mr-2">+</span>
          </Link>
        </div>
      )}
    </div>
  );
}
