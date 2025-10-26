import { Novu } from "@novu/node";

export default async function sendNotification(
  subscriberId: string,
  message: string,
  type: string
) {
  try {
    const novu = new Novu(process.env.NOVU_API_KEY || "");

    await novu.subscribers.identify(subscriberId, {});

    await novu.trigger("syncure", {
      to: {
        subscriberId,
      },
      payload: {
        msg: message,
        type,
        title: "Syncure Notification",
        body: message,
      },
    });

    return subscriberId;
  } catch (error) {
    console.error("Error sending notification :", error);
    throw error;
  }
}
