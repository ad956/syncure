export default async function sendMessage({
  roomId,
  message,
}: {
  roomId: string;
  message: string;
}): Promise<any> {
  const endpoint = `/api/chat/messages`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId, message }),
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
