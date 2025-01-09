"use client";
import { deleteTask, fetchTasks } from "@/app/redux/slices/taskSlice";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Task() {
  const dispatch = useDispatch();

  // Get tasks and status from Redux store
  const { items: tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    // Fetch tasks when the component mounts
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteTask(id))
      .unwrap()
      .then(() => {
        // Mettre à jour les tâches localement sans recharger la page
        dispatch(fetchTasks()); // Relance la récupération des tâches
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression :", err);
      });
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
                  onClick={() => handleDelete(task.$id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md uppercase text-sm font-bold tracking-widest"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune tâche trouvée.</p>
      )}
    </div>
  );
}
