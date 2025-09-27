import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_API_KEY || "");

export async function sendChatNotification({
  recipientId,
  senderName,
  message,
  messageType = "text",
}: {
  recipientId: string;
  senderName: string;
  message: string;
  messageType?: "text" | "image";
}) {
  try {
    await novu.trigger("chat-message", {
      to: {
        subscriberId: recipientId,
      },
      payload: {
        senderName,
        message: messageType === "image" ? "📷 Sent an image" : message,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to send chat notification:", error);
  }
}

export function playNotificationSound() {
  if (typeof window !== "undefined") {
    const audio = new Audio("/sounds/message-notification.mp3");
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.log("Could not play notification sound:", error);
    });
  }
}