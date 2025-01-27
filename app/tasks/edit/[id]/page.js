"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function EditPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { isLoading, error } = useSelector((state) => state.tasks);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }

        const { task } = await response.json();
        console.log("task", task);
        setFormData({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
        });
      } catch (error) {
        console.error(error);
      }
    };
    // fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.status ||
      !formData.priority
    ) {
      // setError("Veuillez remplir tous les champs");
      return;
    }

    // setError(null);
    // setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      router.push("/");
    } catch (error) {
      console.log(error);
      // setError("Something went wrong. Please try again.");
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8">Modifier tâche</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 flex-col">
        <input
          type="text"
          name="title"
          placeholder="Nom"
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
          placeholder="Statut"
          value={formData.status}
          className="py-1 px-4 border rounded-md"
          onChange={handleInputChange}
        />

        <input
          type="text"
          name="priority"
          placeholder="Priorité"
          value={formData.priority}
          className="py-1 px-4 border rounded-md"
          onChange={handleInputChange}
        />

        <button
          className="bg-black text-white mt-5 px-4 py-1 rounded-md cursor-pointer"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Ajouter..." : "Modifier tâche"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
