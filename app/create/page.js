// page.js
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "@/app/redux/slices/taskSlice";

export default function CreatePage() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ name: "", description: "" });
  const router = useRouter();

  // Récupérez l'état depuis Redux
  const { isLoading, error } = useSelector((state) => state.tasks);

  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!formData.name || !formData.description) {
  //     setError("Veuillez remplir tous les champs");
  //     return;
  //   }

  //   setError(null);
  //   setIsLoading(true);

  //   try {
  //     const response = await fetch(`/api/tasks/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to create description");
  //     }

  //     router.push("/");
  //   } catch (error) {
  //     console.log(error);
  //     setError("Something went wrong. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
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
      <h2 className="text-2xl font-bold my-8">Ajouter une tâche</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={formData.name}
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

        <button
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {/* {isLoading ? "Ajouter..." : "Modifier tâche"} */}
          {"Ajouter tâche"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
