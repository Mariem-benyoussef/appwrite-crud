"use client";

import { ProtectedRouteWithRole } from "@/app/components/ProtectedRouteWithRole";
import { fetchTask } from "@/app/redux/slices/taskSlice";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TaskDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const task = useSelector((state) => state.tasks.selectedTask);
  const { isLoading, error } = useSelector((state) => state.tasks);

  // Récupérer la tâche lorsque le composant est monté.
  useEffect(() => {
    if (id) {
      dispatch(fetchTask(id));
    }
  }, [id, dispatch]);

  if (isLoading)
    return <p className="text-center">Chargement des détails...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!task) return <p className="text-center">Aucune tâche trouvée.</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="mt-2 text-gray-700">{task.description}</p>

      <div className="mt-4">
        <span className="font-semibold">Statut :</span> {task.status}
      </div>
      <div className="mt-1">
        <span className="font-semibold">Priorité :</span> {task.priority}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push("/tasks")}
          className="bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Retour
        </button>
      </div>
    </div>
  );
}
