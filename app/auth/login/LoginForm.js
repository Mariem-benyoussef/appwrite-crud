"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/slices/authSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const LoginForm = ({ initialErrors }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState(initialErrors || {});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      const resultAction = await dispatch(
        login({
          email: formData.email.trim(),
          password: formData.password,
        })
      );

      const data = unwrapResult(resultAction);
      // Handle success (e.g., redirect or show success message)
    } catch (error) {
      setValidationErrors({
        general: error?.message || "Login failed. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        {validationErrors.email && <p>{validationErrors.email}</p>}
      </div>

      <div>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />
        {validationErrors.password && <p>{validationErrors.password}</p>}
      </div>

      {validationErrors.general && <p>{validationErrors.general}</p>}

      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginForm;
