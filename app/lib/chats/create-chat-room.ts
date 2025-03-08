export default async function createChatRoom(receiverId: string): Promise<any> {
  const endpoint = `/api/chat/room`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receiverId }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error creating chat room");
    }

    return result;
  } catch (error) {
    console.error("An error occurred while creating chat room:", error);
    throw error;
  }
}
