export default async function loadMessages(
  roomId: string,
  currentPage: any
): Promise<any> {
  const endpoint = `/api/chat/messages?roomId=${roomId}&page=${currentPage}&limit=50`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error loading messages");
    }

    return result;
  } catch (error) {
    console.error("An error occurred while loading messages:", error);
    throw error;
  }
}
