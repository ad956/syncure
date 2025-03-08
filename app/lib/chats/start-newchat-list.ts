export default async function startNewChatList(): Promise<any> {
  const endpoint = `/api/chat/start-newchat-list`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error fetching new chat list");
    }

    if (Array.isArray(result)) return result;
  } catch (error) {
    console.error("An error occurred while fetching new chat list:", error);
    throw error;
  }
}
