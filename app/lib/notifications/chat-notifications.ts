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
  if (!process.env.NOVU_API_KEY) {
    console.warn("NOVU_API_KEY not configured, skipping notification");
    return;
  }

  try {
    const result = await novu.trigger("chat-message", {
      to: {
        subscriberId: recipientId,
      },
      payload: {
        senderName,
        message: messageType === "image" ? "📷 Sent an image" : message,
        timestamp: new Date().toISOString(),
      },
    });
    console.log("Notification sent successfully:", result.data?.transactionId);
  } catch (error) {
    console.error("Failed to send chat notification:", error);
  }
}

export function playNotificationSound() {
  if (typeof window !== "undefined") {
    try {
      // Create a simple beep sound using Web Audio API as fallback
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log("Could not play notification sound:", error);
    }
  }
}