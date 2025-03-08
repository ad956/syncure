export async function getSession() {
  const endpoint = `/api/auth/session`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Failed to fetch session data");
    }

    return result;
  } catch (error) {
    console.error("An error occurred while fetching session data:", error);
    throw error;
  }
}
