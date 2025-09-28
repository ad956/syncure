import { Novu } from "@novu/node";

const novu = new Novu(process.env.NOVU_API_KEY || "");

export async function setupChatWorkflow() {
  if (!process.env.NOVU_API_KEY) {
    console.warn("NOVU_API_KEY not configured, skipping workflow setup");
    return;
  }

  try {
    // Create or update the chat-message workflow
    const workflow = await novu.notificationTemplates.create({
      name: "Chat Message Notification",
      notificationGroupId: process.env.NOVU_NOTIFICATION_GROUP_ID || "default",
      tags: ["chat"],
      description: "Notification for new chat messages",
      steps: [
        {
          template: {
            type: "in_app" as any,
            content: "{{senderName}} sent you a message: {{message}}",
            cta: {
              type: "redirect" as any,
              data: {
                url: "/chat",
              },
            },
          },
        },
        {
          template: {
            type: "push" as any,
            content: "{{senderName}}: {{message}}",
            title: "New Message",
          },
        },
      ],

    });

    console.log("Chat workflow created:", workflow.data);
    return workflow;
  } catch (error) {
    console.error("Failed to setup chat workflow:", error);
  }
}

export async function ensureSubscriber(userId: string, userEmail?: string, userName?: string) {
  if (!process.env.NOVU_API_KEY) return;

  try {
    await novu.subscribers.identify(userId, {
      email: userEmail,
      firstName: userName,
    });
  } catch (error) {
    console.error("Failed to ensure subscriber:", error);
  }
}