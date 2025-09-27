import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@nextui-org/react";
import { FaImage } from "react-icons/fa6";

const MessageComponent = React.memo(
  ({ message, currentUserId, onResend }: MessageComponentProps) => {
    const [imageError, setImageError] = useState(false);
    const isOwn = message.senderId._id === currentUserId;
    const isPending = message.status === "sending";
    const isFailed = message.status === "failed";
    const isImage = message.messageType === "image";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`rounded-lg p-3 max-w-[80%] ${
            isOwn ? "bg-primary/10 ml-auto" : "bg-default-100 mr-auto"
          } ${isFailed ? "opacity-50" : ""}`}
        >
          {isImage && message.imageUrl ? (
            <div className="space-y-2">
              {imageError ? (
                <div className="flex items-center gap-2 p-3 bg-default-100 rounded-lg max-w-[200px]">
                  <FaImage className="text-default-400" />
                  <span className="text-small text-default-500">Image failed to load</span>
                </div>
              ) : (
                <Image
                  src={message.imageUrl}
                  alt="Shared image"
                  className="max-w-[200px] max-h-[200px] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(message.imageUrl, '_blank')}
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              )}
              {message.message && message.message.trim() && (
                <p className="text-small">{message.message}</p>
              )}
            </div>
          ) : (
            message.message && message.message.trim() && (
              <p className="text-small whitespace-pre-wrap">{message.message}</p>
            )
          )}
          
          <div className="flex items-center justify-end gap-2 mt-1">
            <span className="text-tiny text-default-400">
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isPending && (
              <span className="text-tiny text-primary">Sending...</span>
            )}
            {isFailed && (
              <button
                onClick={onResend}
                className="text-tiny text-red-500 hover:text-red-600"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

MessageComponent.displayName = "MessageComponent";

export default MessageComponent;