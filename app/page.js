"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.log("Error: ", error);
        setError("Échec du chargement des tâches. Veuillez essayer de recharger la page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks((prevTasks) => prevTasks?.filter((i) => i.$id !== id));
    } catch (error) {
      setError("Failed to delete task. Please try again.");
    }
  };

  return (
    <div>
      {error && <p className="py-4 text-red-500">{error}</p>}
      {isLoading ? (
        <p>Chargement des tâches...</p>
      ) : tasks?.length > 0 ? (
        <div>
          {tasks?.map((task) => (
            <div
              key={task.$id}
              className="p-4 my-2 rounded-md border-b leading-8"
            >
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
