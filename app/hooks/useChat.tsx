"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "react-hot-toast";

interface ChatUser {
  _id: string;
  firstname: string;
  lastname: string;
  profile?: string;
  role: "Patient" | "Doctor";
}

interface Message {
  _id: string;
  message: string;
  messageType?: "text" | "image";
  imageUrl?: string;
  senderId: ChatUser;
  senderRole: "Patient" | "Doctor";
  createdAt: string;
  isRead: boolean;
  status?: "sending" | "sent" | "failed";
  roomId?: string;
}

interface Room {
  _id: string;
  participants: {
    userId: ChatUser;
    role: "Patient" | "Doctor";
  }[];
  lastMessage?: Message;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const useChat = (currentUser: ChatUser) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState({
    rooms: true,
    messages: false,
    sending: false,
  });
  const [pagination, setPagination] = useState<Record<string, { page: number; hasMore: boolean }>>({});

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, rooms: true }));
      const response = await fetch('/api/chat/rooms?page=1&limit=20');
      const result: ApiResponse<{ rooms: Room[]; pagination: any }> = await response.json();
      
      if (result.success && result.data) {
        setRooms(result.data?.rooms || []);
      } else {
        throw new Error(result.error || 'Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load chat rooms');
    } finally {
      setLoading(prev => ({ ...prev, rooms: false }));
    }
  }, []);

  const fetchMessages = useCallback(async (roomId: string, page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(prev => ({ ...prev, messages: true }));
      }
      
      const response = await fetch(`/api/chat/messages?roomId=${roomId}&page=${page}&limit=50`);
      const result: ApiResponse<{ messages: Message[]; pagination: any }> = await response.json();
      
      if (result.success && result.data) {
        const newMessages = result.data.messages;
        
        setMessages(prev => ({
          ...prev,
          [roomId]: reset ? newMessages : [...(prev[roomId] || []), ...newMessages]
        }));
        
        setPagination(prev => ({
          ...prev,
          [roomId]: {
            page: result.data?.pagination?.page || 1,
            hasMore: result.data?.pagination?.hasMore || false
          }
        }));
      } else {
        throw new Error(result.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  }, []);

  const sendMessage = useCallback(async (roomId: string, message: string, messageType: "text" | "image" = "text", imageUrl?: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      _id: tempId,
      message,
      messageType,
      imageUrl,
      senderId: currentUser,
      senderRole: currentUser.role,
      createdAt: new Date().toISOString(),
      isRead: false,
      status: "sending",
      roomId,
    };

    // Add optimistic message
    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), optimisticMessage]
    }));

    try {
      setLoading(prev => ({ ...prev, sending: true }));
      
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          message,
          messageType,
          imageUrl,
        }),
      });

      const result: ApiResponse<Message> = await response.json();
      
      if (result.success && result.data) {
        // Replace optimistic message with real one
        setMessages(prev => ({
          ...prev,
          [roomId]: prev[roomId].map(msg => 
            msg._id === tempId ? { ...result.data!, status: "sent" } : msg
          )
        }));
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Mark message as failed
      setMessages(prev => ({
        ...prev,
        [roomId]: prev[roomId].map(msg => 
          msg._id === tempId ? { ...msg, status: "failed" } : msg
        )
      }));
      
      toast.error('Failed to send message');
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  }, [currentUser]);

  const resendMessage = useCallback(async (roomId: string, failedMessage: Message) => {
    setMessages(prev => ({
      ...prev,
      [roomId]: prev[roomId].map(msg => 
        msg._id === failedMessage._id ? { ...msg, status: "sending" } : msg
      )
    }));

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          message: failedMessage.message,
          messageType: failedMessage.messageType,
          imageUrl: failedMessage.imageUrl,
        }),
      });

      const result: ApiResponse<Message> = await response.json();
      
      if (result.success && result.data) {
        setMessages(prev => ({
          ...prev,
          [roomId]: prev[roomId].map(msg => 
            msg._id === failedMessage._id ? { ...result.data!, status: "sent" } : msg
          )
        }));
        toast.success('Message sent successfully');
      } else {
        throw new Error(result.error || 'Failed to resend message');
      }
    } catch (error) {
      console.error('Error resending message:', error);
      
      setMessages(prev => ({
        ...prev,
        [roomId]: prev[roomId].map(msg => 
          msg._id === failedMessage._id ? { ...msg, status: "failed" } : msg
        )
      }));
      
      toast.error('Failed to resend message');
    }
  }, []);

  const handleNewMessage = useCallback((newMessage: Message) => {
    if (!newMessage.roomId) return;
    
    const roomId = newMessage.roomId;
    
    setMessages(prev => {
      const existingMessages = prev[roomId] || [];
      const messageExists = existingMessages.some(msg => msg._id === newMessage._id);
      
      if (messageExists) return prev;
      
      return {
        ...prev,
        [roomId]: [...existingMessages, newMessage]
      };
    });
  }, []);

  return {
    rooms,
    messages,
    loading,
    pagination,
    fetchRooms,
    fetchMessages,
    sendMessage,
    resendMessage,
    handleNewMessage,
  };
};