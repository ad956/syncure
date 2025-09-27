type ChatUser = {
  _id: string;
  firstname: string;
  lastname: string;
  specialty?: string;
  profile?: string;
  role: "Patient" | "Doctor";
};

type Message = {
  _id: string;
  message: string;
  messageType?: "text" | "image";
  imageUrl?: string;
  senderId: User;
  senderRole: "Patient" | "Doctor";
  createdAt: string;
  isRead: boolean;
  status?: "sending" | "sent" | "failed";
  roomId?: string;
};

type Room = {
  _id: string;
  participants: {
    userId: ChatUser;
    role: "Patient" | "Doctor";
  }[];
  lastMessage?: Message;
};

type ChatScreenProps = {
  currentUser: ChatUser;
};

type ChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: Room;
  currentUser: ChatUser;
  messageList: Message[];
  messagesLoading: boolean;
  loadingMore: boolean;
  onSendMessage: (message: string) => void;
  onSendImage: (imageUrl: string) => void;
  onResend: (roomId: string, failedMessage: Message) => void;
  onTyping: (isTyping: boolean) => void;
  typingUsers: Array<{userId: string, userName: string}>;
};

type ChatRoomListProps = {
  rooms: Room[];
  currentUser: ChatUser;
  onRoomSelect: (room: Room) => void;
};

type EmptyStateProps = {
  roomsError: string;
  fetchRoomsData: () => void;
  setShowNewChatModal: () => void;
};

type MessageComponentProps = {
  message: Message;
  currentUserId: string;
  onResend: () => void;
};

type ChatListUser = {
  _id: string;
  firstname: string;
  lastname: string;
  profile: string;
};

type StartNewChatProps = {
  currentUserRole: string;
  onChatRoomCreated: () => void;
};
