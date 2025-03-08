export default async function readMessage(roomId: string): Promise<any> {
  const endpoint = `/api/chat/messages/read`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error marking messages as read");
    }

    if (Array.isArray(result)) return result;
  } catch (error) {
    console.error("An error occurred while marking message as read:", error);
    throw error;
  }
}
