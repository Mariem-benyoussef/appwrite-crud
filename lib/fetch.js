const API_URL = "http://127.0.0.1:8000";

export async function fetchAPI(endpoint, options = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    credentials: "include",
    // headers: {
    //   "X-XSRF-TOKEN": csrfToken,
    // },
  };

  const finalOptions = {
    method: "POST",
    headers: defaultHeaders,
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, finalOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return response.json();
  } catch (error) {
    throw new Error(error.message || "Failed to fetch data");
  }
}
