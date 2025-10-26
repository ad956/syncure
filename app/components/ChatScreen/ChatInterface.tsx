"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Input, Avatar, Card, CardBody, CardHeader, Chip, Badge } from "@nextui-org/react";
import { pusherClient } from "@lib/pusher";
import { useChat } from "@hooks/useChat";
import { Toaster } from "react-hot-toast";
import { LuSend, LuSearch, LuMessageCircle, LuStethoscope, LuShield, LuClock, LuPhone, LuVideo, LuMoreVertical } from "react-icons/lu";
import { BsChatDots, BsShieldCheck } from "react-icons/bs";
import { FaUserMd, FaHeartbeat } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import MessageBubble from "./MessageBubble";

interface ChatUser {
  _id: string;
  firstname: string;
  lastname: string;
  profile?: string;
  role: "Patient" | "Doctor";
}

interface ChatInterfaceProps {
  currentUser: ChatUser;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentUser }) => {
  const {
    rooms,
    messages,
    loading,
    fetchRooms,
    fetchMessages,
    sendMessage,
    resendMessage,
    handleNewMessage,
  } = useChat(currentUser);

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedRoomData = rooms.find(room => room._id === selectedRoom);
  const currentMessages = selectedRoom ? (messages[selectedRoom] || []) : [];
  const otherParticipant = selectedRoomData?.participants.find(p => p.userId._id !== currentUser._id)?.userId;

  const filteredRooms = rooms.filter(room => {
    const participant = room.participants.find(p => p.userId._id !== currentUser._id)?.userId;
    if (!participant) return false;
    const doctorName = `${participant.firstname} ${participant.lastname}`.toLowerCase();
    return doctorName.includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    if (!selectedRoom) return;
    fetchMessages(selectedRoom, 1, true);
    const channel = pusherClient.subscribe(`chat-${selectedRoom}`);
    channel.bind("new-message", handleNewMessage);
    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`chat-${selectedRoom}`);
    };
  }, [selectedRoom, fetchMessages, handleNewMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = async () => {
    if (!selectedRoom || !messageInput.trim() || loading.sending) return;
    const message = messageInput.trim();
    setMessageInput("");
    await sendMessage(selectedRoom, message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <BsChatDots className="w-6 h-6 text-blue-600" />
                </div>
                Healthcare Chat
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <IoShieldCheckmark className="text-green-500" />
                Secure messaging with your healthcare providers
              </p>
            </div>

          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid grid-cols-12 gap-6 h-[450px]">
          
          {/* Left Sidebar - Doctors List */}
          <div className="col-span-4">
            <Card className="shadow-lg border-0 bg-white h-full flex flex-col">
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Your Doctors</h3>
                    <Chip size="sm" color="primary" variant="flat" className="bg-blue-50 text-blue-700">
                      {rooms.length} Active
                    </Chip>
                  </div>
                  
                  <Input
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={<LuSearch className="w-4 h-4 text-gray-400" />}
                    size="sm"
                    variant="bordered"
                    className="mb-4"
                  />
                  

                </div>
              </CardHeader>
              
              <CardBody className="pt-0 flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                  {loading.rooms ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                      <p className="text-sm text-gray-500">Loading doctors...</p>
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaUserMd className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-sm font-semibold text-gray-600 mb-2">
                        {searchQuery ? 'No doctors found' : 'No assigned doctors'}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {searchQuery ? 'Try different search terms' : 'Complete an appointment to start chatting with doctors'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredRooms.map((room) => {
                        const participant = room.participants.find(p => p.userId._id !== currentUser._id)?.userId;
                        if (!participant) return null;

                        return (
                          <div
                            key={room._id}
                            onClick={() => setSelectedRoom(room._id)}
                            className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                              selectedRoom === room._id 
                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-md' 
                                : 'bg-white hover:bg-gray-50 border-gray-100 hover:border-gray-200 hover:shadow-sm'
                            }`}
                          >
                                    <div className="flex items-center gap-3">
                              <Avatar
                                src={participant.profile}
                                name={`${participant.firstname} ${participant.lastname}`}
                                size="md"
                              />
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  Dr. {participant.firstname} {participant.lastname}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1 truncate">
                                  {room.lastMessage?.message || 'Start conversation'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="col-span-8">
            <Card className="shadow-lg border-0 bg-white overflow-hidden h-[450px]">
              {selectedRoom && otherParticipant ? (
                <div className="h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={otherParticipant.profile}
                        name={`${otherParticipant.firstname} ${otherParticipant.lastname}`}
                        size="md"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Dr. {otherParticipant.firstname} {otherParticipant.lastname}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                      {loading.messages ? (
                        <div className="flex flex-col items-center justify-center py-16">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                          <p className="text-sm text-gray-500">Loading conversation...</p>
                        </div>
                      ) : currentMessages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                            <BsChatDots className="w-10 h-10 text-blue-600" />
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 mb-3">Start Your Conversation</h4>
                          <p className="text-gray-600 text-sm mb-4 max-w-sm">
                            Send a message to Dr. {otherParticipant.firstname} to begin your secure healthcare conversation.
                          </p>
                          <div className="bg-blue-50 rounded-xl p-4 max-w-md">
                            <p className="text-sm text-blue-800 flex items-center gap-2">
                              <LuShield className="w-4 h-4" />
                              All messages are encrypted and HIPAA compliant
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {currentMessages.map((message) => (
                            <MessageBubble
                              key={message._id}
                              message={message}
                              currentUserId={currentUser._id}
                              onResend={() => selectedRoom && resendMessage(selectedRoom, message)}
                            />
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 bg-white border-t">
                      <div className="flex gap-3">
                        <Input
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1"
                          disabled={loading.sending}
                          variant="bordered"
                          size="md"
                        />
                        <Button
                          color="primary"
                          onPress={handleSendMessage}
                          isLoading={loading.sending}
                          disabled={!messageInput.trim()}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <LuSend className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <CardBody className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <BsChatDots className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Select a Doctor</h3>
                    <p className="text-gray-600">
                      Click on a doctor to start chatting
                    </p>
                  </div>
                </CardBody>
              )}
            </Card>
          </div>
        </div>
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default ChatInterface;