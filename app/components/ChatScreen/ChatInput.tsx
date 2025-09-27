import { Button, Input } from "@nextui-org/react";
import React from "react";
import { useState, useRef, useCallback } from "react";
import { FaPaperPlane, FaImage } from "react-icons/fa6";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const ChatInput = React.memo(
  ({
    onSend,
    onSendImage,
    onTyping,
    disabled,
  }: {
    onSend: (message: string) => void;
    onSendImage: (imageUrl: string) => void;
    onTyping: (isTyping: boolean) => void;
    disabled: boolean;
  }) => {
    const [newMessage, setNewMessage] = useState("");
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setNewMessage(value);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (value.trim()) {
        onTyping(true);
      } else {
        onTyping(false);
      }
    }, [onTyping]);

    const handleSend = () => {
      if (newMessage.trim() && !disabled) {
        onSend(newMessage);
        setNewMessage("");
        onTyping(false);
        
        // Clear typing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    };

    return (
      <div className="p-4 border-t">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          startContent={
            <CldUploadWidget
              signatureEndpoint="/api/cloudinary/sign-image"
              onSuccess={(result) => {
                const info = result.info as CloudinaryUploadWidgetInfo;
                onSendImage(info.secure_url);
              }}
            >
              {({ open }) => (
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="secondary"
                  onClick={() => open()}
                  disabled={disabled}
                >
                  <FaImage className="h-4 w-4" />
                </Button>
              )}
            </CldUploadWidget>
          }
          endContent={
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              color="primary"
              onClick={handleSend}
              disabled={disabled}
            >
              <FaPaperPlane className="h-4 w-4" />
            </Button>
          }
        />
      </div>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;