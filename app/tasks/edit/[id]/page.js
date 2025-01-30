"use client";

import { fetchTask, updateTask } from "@/app/redux/slices/taskSlice";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function EditPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();

  const task = useSelector((state) => state.tasks.selectedTask);
  const { isLoading, error } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
  });

  // Fetch task when the component mounts
  useEffect(() => {
    if (id) {
      dispatch(fetchTask(id));
    }
  }, [id, dispatch]);

  // Set form data when task is available
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "",
        priority: task.priority || "",
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
      await dispatch(updateTask({ id, updates: formData })).unwrap();
      router.push("/"); // Redirect after success
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold my-8 text-center">Modifier tâche</h2>

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
          Modifier tâche
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
