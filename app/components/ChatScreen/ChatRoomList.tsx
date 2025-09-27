import React from "react";
import { motion } from "framer-motion";
import { Avatar } from "@nextui-org/react";
import { FaImage } from "react-icons/fa6";

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  rooms,
  currentUser,
  onRoomSelect,
}) => {
  const getOtherParticipant = (room: Room) => {
    return room.participants.find((p) => p.userId._id !== currentUser._id)
      ?.userId;
  };

  return (
    <div className="grid grid-cols-1 gap-2">
      {rooms.map((room) => {
        const otherUser = getOtherParticipant(room);
        if (!otherUser) return null;

        return (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            className="p-4 hover:bg-default-100/50 cursor-pointer rounded-lg transition-colors"
            onClick={() => onRoomSelect(room)}
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={otherUser.profile || "/placeholder-avatar.png"}
                className="ring-2 ring-primary/20"
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-small truncate">
                  {`${otherUser.firstname} ${otherUser.lastname}`}
                </p>
                {otherUser.specialty && (
                  <p className="text-tiny text-default-500">
                    {otherUser.specialty}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  {room.lastMessage?.messageType === "image" && (
                    <FaImage className="text-tiny text-default-400" />
                  )}
                  <p className="text-tiny text-default-400 truncate">
                    {room.lastMessage
                      ? room.lastMessage.messageType === "image"
                        ? "Image"
                        : room.lastMessage.message
                      : "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ChatRoomList;
