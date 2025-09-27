"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { pusherClient } from "@lib/pusher";
import { Button, Image, useDisclosure } from "@nextui-org/react";
import { readMessage } from "@lib/chats";
import { Toaster } from "react-hot-toast";
import useChat from "@hooks/useChat";
import SpinnerLoader from "../SpinnerLoader";
import StartNewChat from "./StartNewChat";
import ChatRoomList from "./ChatRoomList";
import EmptyState from "./EmptyState";
import { ChatModal } from "./ChatModal";
import { LuPlus } from "react-icons/lu";
import { playNotificationSound } from "@lib/notifications/chat-notifications";

const ChatScreen: React.FC<ChatScreenProps> = ({ currentUser }) => {
  const {
    rooms,
    receivedMessages,
    sentMessages,
    loadingChats,
    messagesLoading,
    loadingMore,
    hasMore,
    resendMessage,
    roomsError,
    fetchRoomsData,
    loadMessagesData,
    sendMsg,
    sendImageMsg,
    handleNewMessage,
  } = useChat(currentUser);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Array<{userId: string, userName: string}>>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [refreshKey, setRefreshKey] = useState(0);

  const messageList = useMemo(() => {
    if (!selectedRoom) return [];

    const sent = sentMessages[selectedRoom._id] || [];
    const received = receivedMessages[selectedRoom._id] || [];

    return [...sent, ...received].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [selectedRoom, sentMessages, receivedMessages]);

  const refreshChatList = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setShowNewChat(false);
  };

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    onOpen();
  };

  // Typing indicator removed for better performance

  const handleNewMessageWithNotification = useCallback((data: Message) => {
    handleNewMessage(data);
    
    // Only play sound for received messages (not own messages)
    if (data.senderId._id !== currentUser._id) {
      playNotificationSound();
    }
  }, [handleNewMessage, currentUser._id]);

  useEffect(() => {
    fetchRoomsData();
    
    // Setup Novu subscriber
    fetch('/api/novu/subscriber', { method: 'POST' })
      .catch(error => console.error('Failed to setup Novu subscriber:', error));
  }, [currentUser, refreshKey]);

  useEffect(() => {
    if (!selectedRoom) return;

    loadMessagesData(selectedRoom._id, true);
    readMessage(selectedRoom._id);

    const channelName = `chat-${selectedRoom._id}`;
    const channel = pusherClient.subscribe(channelName);
    
    // Bind events
    channel.bind("new-message", handleNewMessageWithNotification);
    // Typing indicator removed for better performance
    
    // Handle connection state
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('Successfully subscribed to', channelName);
    });
    
    channel.bind('pusher:subscription_error', (error: any) => {
      console.error('Subscription error for', channelName, error);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(channelName);
      // Typing cleanup removed
    };
  }, [selectedRoom, currentUser._id]);

  if (loadingChats) {
    return <SpinnerLoader />;
  }

  if (rooms.length === 0 && !showNewChat) {
    return (
      <EmptyState
        roomsError={roomsError}
        fetchRoomsData={fetchRoomsData}
        setShowNewChatModal={() => setShowNewChat(true)}
      />
    );
  }

  return (
    <div className="relative h-full">
      {showNewChat ? (
        <div className="h-full">
          <StartNewChat
            currentUserRole={currentUser.role}
            onChatRoomCreated={refreshChatList}
          />
        </div>
      ) : (
        <div className="h-full border-2 rounded-xl p-2 overflow-y-auto scrollbar">
          <div className="px-4 py-2 flex justify-between items-center border-b">
            <h2 className="text-sm font-semibold text-gray-700">
              Recent Chats
            </h2>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {rooms.length} Chats
            </span>
          </div>

          <ChatRoomList
            rooms={rooms}
            currentUser={currentUser}
            onRoomSelect={handleRoomSelect}
          />
        </div>
      )}

      <button
        onClick={() => setShowNewChat(!showNewChat)}
        className={`fixed bottom-14 right-14 p-0 transition-all duration-300 hover:scale-105 flex items-center justify-center rounded-full`}
        aria-label={showNewChat ? "Close new chat" : "Start new chat"}
      >
        {showNewChat ? (
          <div className="rounded-full h-10 w-10 flex items-center justify-center">
            <LuPlus className="h-6 w-6 text-blue-600 transition-transform duration-300 rotate-45" />
          </div>
        ) : (
          <div className="relative w-8 h-8">
            <Image
              src="/icons/message.png"
              alt="Chat Icon"
              className="object-contain"
            />
          </div>
        )}
      </button>

      {selectedRoom && (
        <ChatModal
          isOpen={isOpen}
          onClose={onClose}
          selectedRoom={selectedRoom}
          currentUser={currentUser}
          messageList={messageList}
          messagesLoading={messagesLoading}
          loadingMore={loadingMore}
          onSendMessage={(message) => sendMsg(selectedRoom._id, message)}
          onSendImage={(imageUrl) => sendImageMsg(selectedRoom._id, imageUrl)}
          onResend={resendMessage}
          onTyping={() => {}} // Typing disabled
          typingUsers={[]}
        />
      )}
      <Toaster />
    </div>
  );
};

export default ChatScreen;