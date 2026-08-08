import { create } from "zustand";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export interface ChatUser {
  _id: string;
  fullName: string;
  email?: string;
  profilePic?: string;
  [key: string]: unknown;
}

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId?: string;
  text?: string;
  image?: string;
  createdAt: string;
  [key: string]: unknown;
}

interface SendMessageData {
  text?: string;
  image?: string | null;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

type ApiError = AxiosError<ApiErrorResponse>;

interface ChatStore {
  messages: ChatMessage[];
  users: ChatUser[];
  selectedUser: ChatUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessageData) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelectedUser: (selectedUser: ChatUser | null) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    console.log("[CHAT] Fetching users for sidebar...");
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/message/users");

      // Ensure we have valid data and it's an array
      const users = Array.isArray(res.data.users) ? res.data.users : [];

      console.log(`[CHAT] Fetched ${users.length} users successfully`);
      console.log("[CHAT] Users data:", users);

      set({ users });
    } catch (error) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch users";

      console.error("[CHAT] Error fetching users:", errorMessage);
      console.error("[CHAT] Full error:", err);

      // Set empty array on error
      set({ users: [] });
      if (err.response?.status !== 401) {
        toast.error(errorMessage);
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    console.log(`[CHAT] Fetching messages for user: ${userId}`);
    set({ isMessagesLoading: true });

    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const res = await axiosInstance.get(`/message/${userId}`);

      // Ensure we have valid data and it's an array
      const messages = Array.isArray(res.data.messages) ? res.data.messages : [];

      console.log(`[CHAT] Fetched ${messages.length} messages successfully`);
      console.log("[CHAT] Messages data:", messages);

      set({ messages });
    } catch (error) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch messages";

      console.error("[CHAT] Error fetching messages:", errorMessage);
      console.error("[CHAT] Full error:", err);

      // Clear messages on error
      set({ messages: [] });
      if (err.response?.status !== 401) {
        toast.error(errorMessage);
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    console.log(`[CHAT] Sending message to user: ${selectedUser?._id}`);

    try {
      if (!selectedUser) {
        throw new Error("No user selected");
      }

      if (!messageData.text && !messageData.image) {
        throw new Error("Message content is required");
      }

      const res = await axiosInstance.post(
        `/message/send/${selectedUser._id}`,
        messageData,
      );

      console.log("[CHAT] Message sent successfully");
      set({ messages: [...messages, res.data.message] });
    } catch (error) {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to send message";

      console.error("[CHAT] Error sending message:", errorMessage);
      toast.error(errorMessage);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();

    if (!selectedUser) {
      console.log("[CHAT] Cannot subscribe to messages - no user selected");
      return;
    }

    const socket = useAuthStore.getState().socket;

    if (!socket) {
      console.log("[CHAT] Cannot subscribe to messages - no socket connection");
      return;
    }

    console.log(`[CHAT] Subscribing to messages for user: ${selectedUser._id}`);

    socket.on("newMessage", (newMessage: ChatMessage) => {
      console.log("[CHAT] Received new message via socket:", newMessage._id);

      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) {
        console.log("[CHAT] Message not from selected user, ignoring");
        return;
      }

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    console.log("[CHAT] Unsubscribing from messages");

    const socket = useAuthStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
