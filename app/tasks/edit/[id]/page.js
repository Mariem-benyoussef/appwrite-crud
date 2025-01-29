"use client";

import {
  fetchTask,
  fetchTasks,
  updateTask,
} from "@/app/redux/slices/taskSlice";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditPage() {
  const { id } = useParams();
  const task = useSelector((state) => state.tasks.selectedTask);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });

  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(null);

  const { isLoading, error } = useSelector((state) => state.tasks);

  const dispatch = useDispatch();

  const router = useRouter();

  useEffect(() => {
    if (id) {
      dispatch(fetchTask(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
      });
    }
  }, [task]);

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
      return;
    }

    try {
      await dispatch(updateTask({ id, updates: formData }))
        .unwrap() // Allows handling results directly from the action (success or failure)
        .then(() => {
          router.push("/"); // Redirect after success
        })
        .catch((err) => {
          console.error("Error updating task:", err);
        });
    } catch (error) {
      console.error("Error updating task:", error);
    }
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
          {"Modifier tâche"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
