import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
  roomId: mongoose.Schema.Types.ObjectId;
  senderId: mongoose.Schema.Types.ObjectId;
  senderRole: "Patient" | "Doctor";
  message: string;
  messageType: "text" | "image";
  imageUrl?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "senderRole",
      required: true,
    },
    senderRole: {
      type: String,
      required: true,
      enum: ["Patient", "Doctor"],
    },
    message: {
      type: String,
      required: function(this: any) {
        return this.messageType === 'text';
      },
      default: "",
    },
    messageType: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
    imageUrl: {
      type: String,
      required: function(this: any) {
        return this.messageType === 'image';
      },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export interface IRoom extends mongoose.Document {
  participants: {
    userId: mongoose.Schema.Types.ObjectId;
    role: "Patient" | "Doctor";
  }[];
  lastMessage?: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const roomSchema = new mongoose.Schema(
  {
    participants: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "participants.role",
          required: true,
        },
        role: {
          type: String,
          required: true,
          enum: ["Patient", "Doctor"],
        },
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

// unique compound index for participants
roomSchema.index({ "participants.userId": 1 }, { unique: true });

// pre-save middleware to ensure exactly one patient and one doctor per room
roomSchema.pre("save", function (next) {
  const roles = this.participants.map((p) => p.role);
  const hasOnePatient = roles.filter((r) => r === "Patient").length === 1;
  const hasOneDoctor = roles.filter((r) => r === "Doctor").length === 1;

  if (!hasOnePatient || !hasOneDoctor) {
    next(new Error("Each room must have exactly one patient and one doctor"));
  } else {
    next();
  }
});

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", messageSchema);
export const Room =
  mongoose.models.Room || mongoose.model<IRoom>("Room", roomSchema);