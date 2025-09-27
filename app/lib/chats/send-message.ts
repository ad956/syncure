export default async function sendMessage({
  roomId,
  message,
  messageType = "text",
  imageUrl,
}: {
  roomId: string;
  message: string;
  messageType?: "text" | "image";
  imageUrl?: string;
}): Promise<any> {
  const endpoint = `/api/chat/messages`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, message, messageType, imageUrl }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error sending message");
    }

    if (Array.isArray(result)) return result;
  } catch (error) {
    console.error("An error occurred while sending message:", error);
    throw error;
  }
}