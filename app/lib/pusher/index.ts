import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    enabledTransports: ['ws', 'wss'],
    forceTLS: true,
  }
);

// Add connection event listeners for debugging
if (typeof window !== 'undefined') {
  pusherClient.connection.bind('connected', () => {
    console.log('Pusher connected');
  });
  
  pusherClient.connection.bind('disconnected', () => {
    console.log('Pusher disconnected');
  });
  
  pusherClient.connection.bind('error', (error: any) => {
    console.error('Pusher connection error:', error);
  });
}
