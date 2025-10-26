"use client";

import React from "react";
import { Button, Avatar } from "@nextui-org/react";
import { LuRotateCcw, LuCheck, LuCheckCheck } from "react-icons/lu";

interface MessageUser {
  _id: string;
  firstname: string;
  lastname: string;
  profile?: string;
}

interface MessageBubbleProps {
  message: {
    _id: string;
    message: string;
    messageType?: "text" | "image";
    imageUrl?: string;
    senderId: MessageUser;
    senderRole: "Patient" | "Doctor";
    createdAt: string;
    isRead: boolean;
    status?: "sending" | "sent" | "failed";
    roomId?: string;
  };
  currentUserId: string;
  onResend: () => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  currentUserId,
  onResend,
}) => {
  const isOwn = message.senderId._id === currentUserId;
  const isImage = message.messageType === "image";

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (message.status) {
      case "sending":
        return <div className="w-3 h-3 border border-white/50 border-t-transparent rounded-full animate-spin" />;
      case "sent":
        return <LuCheck className="w-3 h-3 text-white/70" />;
      case "failed":
        return <LuRotateCcw className="w-3 h-3 text-red-300" />;
      default:
        return message.isRead ? 
          <LuCheckCheck className="w-3 h-3 text-white/70" /> : 
          <LuCheck className="w-3 h-3 text-white/70" />;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isOwn && (
          <Avatar
            src={message.senderId.profile}
            name={`${message.senderId.firstname} ${message.senderId.lastname}`}
            size="sm"
            className="mt-1"
          />
        )}
        
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-900 shadow-sm border'
            } ${
              message.status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' : ''
            }`}
          >
            {isImage && message.imageUrl ? (
              <div>
                <img
                  src={message.imageUrl}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg mb-2"
                />
                {message.message && (
                  <p className="text-sm">{message.message}</p>
                )}
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{message.message}</p>
            )}
          </div>
          
          <div className={`flex items-center gap-1 mt-1 px-1 ${
            isOwn ? 'justify-end' : 'justify-start'
          }`}>
            <span className="text-xs text-gray-500">
              {formatTime(message.createdAt)}
            </span>
            {getStatusIcon()}
          </div>
          
          {message.status === 'failed' && (
            <Button
              size="sm"
              variant="light"
              onPress={onResend}
              startContent={<LuRotateCcw className="w-3 h-3" />}
              className="text-xs text-red-600 mt-1"
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;