import { useState, useCallback } from "react";
import { fetchRooms, loadMessages, sendMessage } from "@lib/chats";
import toast from "react-hot-toast";

const useChat = (currentUser: ChatUser) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<
    Record<string, Message[]>
  >({});
  const [sentMessages, setSentMessages] = useState<Record<string, Message[]>>(
    {}
  );
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [page, setPage] = useState(1);
  const [roomsError, setRoomsError] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchRoomsData = async () => {
    setLoadingChats(true);
    setRoomsError("");
    try {
      const data = await fetchRooms();
      setLoadingChats(false);
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setRoomsError("Failed to fetch chats");
      setLoadingChats(false);
    }
  };

  const loadMessagesData = async (roomId: string, reset = false) => {
    try {
      if (reset) {
        setMessagesLoading(true);
      } else {
        setLoadingMore(true);
      }
      const currentPage: any = reset ? 1 : page;

      const data = await loadMessages(roomId, currentPage);

      if (Array.isArray(data)) {
        if (data.length < 50) {
          setHasMore(false);
        }

        const sent: Message[] = [];
        const received: Message[] = [];

        data.forEach((msg) => {
          if (msg.senderId._id === currentUser._id) {
            sent.push({ ...msg, status: "sent" });
          } else {
            received.push(msg);
          }
        });

        if (reset) {
          setSentMessages((prev) => ({ ...prev, [roomId]: sent }));
          setReceivedMessages((prev) => ({ ...prev, [roomId]: received }));
        } else {
          setSentMessages((prev) => ({
            ...prev,
            [roomId]: [...sent, ...(prev[roomId] || [])],
          }));
          setReceivedMessages((prev) => ({
            ...prev,
            [roomId]: [...received, ...(prev[roomId] || [])],
          }));
        }

        if (!reset) {
          setPage((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast.error("Error loading messages");
    } finally {
      setMessagesLoading(false);
      setLoadingMore(false);
    }
  };

  const sendMsg = async (roomId: string, messageText: string) => {
    const messageId = Date.now().toString();
    const optimisticMessage = {
      _id: messageId,
      message: messageText,
      messageType: "text" as const,
      senderId: {
        _id: currentUser._id,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        profile: currentUser.profile,
      },
      createdAt: new Date().toISOString(),
      roomId: roomId,
      status: "sending",
    };

    setSentMessages((prev: any) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), optimisticMessage],
    }));

    try {
      await sendMessage({
        roomId: roomId,
        message: messageText,
        messageType: "text",
      });

      setSentMessages((prev: any) => ({
        ...prev,
        [roomId]: prev[roomId].map((msg: any) =>
          msg._id === messageId ? { ...msg, status: "sent" } : msg
        ),
      }));
    } catch (error) {
      console.error("Failed to send message:", error);
      setSentMessages((prev) => ({
        ...prev,
        [roomId]: prev[roomId].map((msg: any) =>
          msg._id === messageId ? { ...msg, status: "failed" } : msg
        ),
      }));
      toast.error("Failed to send message");
    }
  };

  const sendImageMsg = async (roomId: string, imageUrl: string) => {
    const messageId = Date.now().toString();
    const optimisticMessage = {
      _id: messageId,
      message: "📷 Image",
      messageType: "image" as const,
      imageUrl: imageUrl,
      senderId: {
        _id: currentUser._id,
        firstname: currentUser.firstname,
        lastname: currentUser.lastname,
        profile: currentUser.profile,
      },
      createdAt: new Date().toISOString(),
      roomId: roomId,
      status: "sending",
    };

    setSentMessages((prev: any) => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), optimisticMessage],
    }));

    try {
      await sendMessage({
        roomId: roomId,
        message: "📷 Image",
        messageType: "image",
        imageUrl: imageUrl,
      });

      setSentMessages((prev: any) => ({
        ...prev,
        [roomId]: prev[roomId].map((msg: any) =>
          msg._id === messageId ? { ...msg, status: "sent" } : msg
        ),
      }));
    } catch (error) {
      console.error("Failed to send image:", error);
      setSentMessages((prev) => ({
        ...prev,
        [roomId]: prev[roomId].map((msg: any) =>
          msg._id === messageId ? { ...msg, status: "failed" } : msg
        ),
      }));
      toast.error("Failed to send image");
    }
  };

  const resendMessage = async (roomId: string, failedMessage: Message) => {
    const messageId = failedMessage._id;

    setSentMessages((prev) => ({
      ...prev,
      [roomId]: prev[roomId].map((msg) =>
        msg._id === messageId ? { ...msg, status: "sending" } : msg
      ),
    }));

    try {
      await sendMessage({
        roomId: roomId,
        message: failedMessage.message,
        messageType: failedMessage.messageType || "text",
        imageUrl: failedMessage.imageUrl,
      });

      setSentMessages((prev: any) => ({
        ...prev,
        [roomId]: prev[roomId].map((msg: any) =>
          msg._id === messageId ? { ...msg, status: "sent" } : msg
        ),
      }));

      toast.success("Message sent successfully");
    } catch (error) {
      setSentMessages((prev: any) => ({
        ...prev,
        [roomId]: prev[roomId].map((msg: any) =>
          msg._id === messageId ? { ...msg, status: "failed" } : msg
        ),
      }));

      toast.error("Message failed to send");
    }
  };

  const handleNewMessage = useCallback(
    (data: Message) => {
      if (!selectedRoom) return;

      if ((data.senderId as unknown as string) === currentUser._id) {
        return;
      }
      setReceivedMessages((prev: any) => ({
        ...prev,
        [selectedRoom._id]: [...(prev[selectedRoom._id] || []), data],
      }));
    },
    [selectedRoom, currentUser._id]
  );

  return {
    rooms,
    receivedMessages,
    sentMessages,
    page,
    roomsError,
    loadingChats,
    messagesLoading,
    loadingMore,
    hasMore,
    fetchRoomsData,
    loadMessagesData,
    sendMsg,
    sendImageMsg,
    resendMessage,
    handleNewMessage,
    setPage,
  };
};

export default useChat;