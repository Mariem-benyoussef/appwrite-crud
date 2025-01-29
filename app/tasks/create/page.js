// page.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "@/app/redux/slices/taskSlice";

export default function CreatePage() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });
  const router = useRouter();

  // Récupérez l'état depuis Redux
  const { isLoading, error } = useSelector((state) => state.tasks);

  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.status ||
      !formData.priority
    ) {
      return; // Gestion des erreurs côté Redux
    }

    // Dispatcher l'action pour créer une tâche
    dispatch(addTask(formData))
      .unwrap() // Permet de gérer les résultats de la thunk action
      .then(() => {
        router.push("/"); // Redirection après succès
      })
      .catch((err) => {
        console.error("Erreur lors de la création :", err);
      });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8 text-center">Ajouter une tâche</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="title"
          placeholder="Titre de la tâche"
          value={formData.title}
          className="py-1 px-4 border rounded-md"
          onChange={handleInputChange}
        />

        <textarea
          name="description"
          rows={4}
          placeholder="Description"
          value={formData.description}
          className="py-1 px-4 border rounded-md resize-none"
          onChange={handleInputChange}
        ></textarea>

        <input
          type="text"
          name="status"
          placeholder="Statut de la tâche"
          value={formData.status}
          className="py-1 px-4 border rounded-md"
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="priority"
          placeholder="Priorité de la tâche"
          value={formData.priority}
          className="py-1 px-4 border rounded-md"
          onChange={handleInputChange}
        />

        <button
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {"Ajouter tâche"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
