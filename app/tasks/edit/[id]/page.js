"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function EditPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState({ name: "", description: "" });
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);
  const { isLoading, error } = useSelector((state) => state.tasks);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }

        const data = await response.json();
        console.log(data);
        setFormData({
          name: data.task.name,
          description: data.task.description,
        });
      } catch (error) {
        setError("Échec du chargement de la tâche.");
      }
    };

    fetchData();
  }, []);
  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      setError("Veuillez remplir tous les champs");
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
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      router.push("/");
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
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
          {isLoading ? "Ajouter..." : "Modifier tâche"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
