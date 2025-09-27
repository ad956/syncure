import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
} from "@nextui-org/react";
import SpinnerLoader from "../SpinnerLoader";
import MessageComponent from "./Message";
import ChatInput from "./ChatInput";
import NoMessages from "./NoMessages";
import TypingIndicator from "./TypingIndicator";

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  selectedRoom,
  currentUser,
  messageList,
  messagesLoading,
  loadingMore,
  onSendMessage,
  onSendImage,
  onResend,
  onTyping,
  typingUsers,
}) => {
  const getOtherParticipant = (room: Room) => {
    return room.participants.find((p) => p.userId._id !== currentUser._id)
      ?.userId;
  };

  const otherUser = getOtherParticipant(selectedRoom);
  if (!otherUser) return null;

  // Typing indicator removed for better performance

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onClose}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex items-center gap-4">
              <Avatar
                src={otherUser.profile}
                className="ring-2 ring-primary/20"
                size="sm"
              />
              <div>
                <p className="font-semibold text-small">
                  {`${otherUser.firstname} ${otherUser.lastname}`}
                </p>
                {otherUser.specialty && (
                  <p className="text-tiny text-default-500">
                    {otherUser.specialty}
                  </p>
                )}
              </div>
            </ModalHeader>
            <ModalBody className="p-0">
              <div className="flex-1 overflow-y-auto space-y-4 min-h-[300px] max-h-[400px] p-4 relative scrollbar">
                {messagesLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-default-100/50">
                    <SpinnerLoader />
                  </div>
                ) : messageList.length === 0 ? (
                  <NoMessages />
                ) : (
                  <>
                    {loadingMore && (
                      <div className="flex justify-center py-2">
                        <SpinnerLoader />
                      </div>
                    )}
                    {messageList.map((msg) => (
                      <MessageComponent
                        key={msg._id}
                        message={msg}
                        currentUserId={currentUser._id}
                        onResend={() => onResend(selectedRoom._id, msg)}
                      />
                    ))}
                    {/* Typing indicator removed for better performance */}
                  </>
                )}
              </div>

              <ChatInput 
                onSend={onSendMessage} 
                onSendImage={onSendImage}
                onTyping={onTyping}
                disabled={messagesLoading} 
              />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};