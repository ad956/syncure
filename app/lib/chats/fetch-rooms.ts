export default async function fetchRooms(): Promise<any> {
  const endpoint = `/api/chat/room`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error fetching chat rooms");
    }

    if (Array.isArray(result)) return result;
  } catch (error) {
    console.error("An error occurred while fetching rooms:", error);
    throw error;
  }
}
