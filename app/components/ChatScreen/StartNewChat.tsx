import React from "react";
import { motion } from "framer-motion";
import { Avatar, Button } from "@nextui-org/react";
import useQuery from "@hooks/useQuery";
import { createChatRoom } from "@lib/chats";
import SpinnerLoader from "../SpinnerLoader";
import toast from "react-hot-toast";

const StartNewChat = ({
  currentUserRole,
  onChatRoomCreated,
}: StartNewChatProps) => {
  const {
    data: chatlist,
    isLoading,
    error,
    refetch,
  } = useQuery<ChatListUser[]>("/api/chat/start-newchat-list");

  if (isLoading) return <SpinnerLoader />;

  if (error || chatlist?.length == 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error?.message || "No Active doctors found"}

        <Button onClick={() => refetch()}>Try Again</Button>
      </motion.div>
    );
  }

  const handleChatRoomCreation = async (userId: string) => {
    try {
      const response = await createChatRoom(userId);

      if (response.participants.length === 2) {
        toast.success("Chat Room Created");
        onChatRoomCreated();
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error creating a chat room");
    }
  };

  return (
    <div className="h-full border-2 rounded-xl p-2 overflow-y-auto scrollbar">
      <div className="px-4 py-2 flex justify-between items-center border-b">
        <h2 className="text-sm font-semibold text-gray-700">Start a chat</h2>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          Available {chatlist?.length}{" "}
          {currentUserRole !== "patient" ? "Doctor" : "Patient"}
        </span>
      </div>

      {chatlist?.map((user) => (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-primary/10 border-b border-gray-300 rounded-md"
          onClick={() => handleChatRoomCreation(user._id)}
        >
          <Avatar
            src={user.profile}
            className="ring-2 ring-primary/20"
            size="sm"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {`${user.firstname} ${user.lastname}`}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StartNewChat;
