const API_URL = "http://127.0.0.1:8000";

export async function fetchAPI(endpoint, options = {}) {
  const defaultOptions = {
    //credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }

  return response.json();
}
