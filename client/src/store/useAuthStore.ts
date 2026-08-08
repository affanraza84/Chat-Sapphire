import { create } from "zustand";
import { AxiosError } from "axios";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
  [key: string]: unknown;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  [key: string]: unknown;
}

interface LoginData {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface UpdateProfileData {
  profilePic?: File | string;
  [key: string]: unknown;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

type ApiError = AxiosError<ApiErrorResponse>;

interface AuthStore {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const NODE_ENV: string = process.env.NODE_ENV as string;

const BASE_URL = (() => {
  let url = "http://localhost:5001";
  if (NODE_ENV === "development") {
    url = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
  } else {
    url = (
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://chatty-backend-hap2.onrender.com"
    );
  }
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
})();

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    console.log("[AUTH] Checking authentication status...");

    try {
      const res = await axiosInstance.get("/auth/check");

      console.log("[AUTH] Authentication check successful");
      set({ authUser: res.data.user });

      // Store user info in localStorage for token persistence
      if (res.data.user) {
        localStorage.setItem("chat-user", JSON.stringify(res.data.user));
      }

      get().connectSocket();
    } catch (error) {
      const err = error as ApiError;

      if (err.response?.status === 401) {
        console.log(
          "[AUTH] User not authenticated:",
          err.response?.data?.message || err.message,
        );
      } else {
        console.error(
          "[AUTH] Authentication check failed:",
          err.response?.data?.message || err.message,
        );
        console.error("[AUTH] Unexpected error during auth check:", err);
      }

      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    console.log("[AUTH] Starting signup process...");
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/signup", data);

      console.log("[AUTH] Signup successful");

      // Store token if provided
      if (res.data.token) {
        localStorage.setItem("chat-token", res.data.token);
        console.log("[AUTH] Token stored in localStorage");
      }

      set({ authUser: res.data.user });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || "Signup failed";
      const errorCode = err.response?.data?.error;

      console.error(
        "[AUTH] Signup failed:",
        errorMessage,
        errorCode ? `(${errorCode})` : "",
      );

      // Show user-friendly error messages
      if (errorCode === "EMAIL_EXISTS") {
        toast.error("An account with this email already exists");
      } else if (errorCode === "PASSWORD_TOO_SHORT") {
        toast.error("Password must be at least 6 characters long");
      } else if (errorCode === "MISSING_FIELDS") {
        toast.error("Please fill in all required fields");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    console.log("[AUTH] Starting login process...");
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);

      console.log("[AUTH] Login successful");

      // Store token if provided
      if (res.data.token) {
        localStorage.setItem("chat-token", res.data.token);
        console.log("[AUTH] Token stored in localStorage");
      }

      set({ authUser: res.data.user });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || "Login failed";
      const errorCode = err.response?.data?.error;

      console.error(
        "[AUTH] Login failed:",
        errorMessage,
        errorCode ? `(${errorCode})` : "",
      );

      // Show user-friendly error messages
      if (errorCode === "INVALID_CREDENTIALS") {
        toast.error("Invalid email or password");
      } else if (errorCode === "MISSING_FIELDS") {
        toast.error("Please enter both email and password");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    console.log("[AUTH] Starting logout process...");

    try {
      await axiosInstance.post("/auth/logout");

      console.log("[AUTH] Logout successful");

      // Clear stored token and user data
      localStorage.removeItem("chat-token");
      localStorage.removeItem("chat-user");
      console.log("[AUTH] Cleared stored token and user data");

      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      const err = error as ApiError;
      const errorMessage = err.response?.data?.message || "Logout failed";

      console.error("[AUTH] Logout failed:", errorMessage);
      toast.error(errorMessage);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const formData = new FormData();

      // If data contains a file, append it as a file
      if (data.profilePic instanceof File) {
        formData.append("profilePic", data.profilePic);
      }

      const res = await axiosInstance.put("/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
    } catch (error) {
      const err = error as ApiError;
      console.log("error in update profile:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser) {
      console.log("[SOCKET] Cannot connect socket - no authenticated user");
      return;
    }

    if (get().socket?.connected) {
      console.log("[SOCKET] Socket already connected");
      return;
    }

    console.log(`[SOCKET] Connecting socket for user: ${authUser._id}`);
    console.log(`[SOCKET] Socket URL: ${BASE_URL}`);
    console.log(`[SOCKET] Environment variables:`, {
      NODE_ENV: NODE_ENV,
      NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    });

    try {
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
        transports: ["websocket", "polling"], // Fallback to polling if websocket fails
        timeout: 20000, // 20 second timeout
        forceNew: true, // Force new connection
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      set({ socket: socket });

      socket.on("connect", () => {
        console.log("[SOCKET] Socket connected successfully");
        console.log(`[SOCKET] Socket ID: ${socket.id}`);
      });

      socket.on("disconnect", (reason) => {
        console.log("[SOCKET] Socket disconnected:", reason);
      });

      socket.on("connect_error", (error) => {
        console.error("[SOCKET] Socket connection error:", error.message);
        console.error("[SOCKET] Error details:", error);

        // Don't show error toast for every connection attempt
        if (error.message !== "server error") {
          toast.error("Connection failed - some features may not work");
        }
      });

      socket.on("reconnect", (attemptNumber: number) => {
        console.log(
          `[SOCKET] Socket reconnected after ${attemptNumber} attempts`,
        );
      });

      socket.on("reconnect_error", (error: Error) => {
        console.error("[SOCKET] Socket reconnection error:", error.message);
      });

      socket.on("reconnect_failed", () => {
        console.error("[SOCKET] Socket reconnection failed - giving up");
        toast.error("Connection lost - please refresh the page");
      });

      socket.on("getOnlineUsers", (userIds: string[]) => {
        // Ensure userIds is an array
        const onlineUsers = Array.isArray(userIds) ? userIds : [];
        console.log(
          `[SOCKET] Received online users: [${onlineUsers.join(", ")}]`,
        );
        set({ onlineUsers });
      });
    } catch (error) {
      console.error("[SOCKET] Error creating socket connection:", error);
      toast.error("Failed to establish real-time connection");
    }
  },
  disconnectSocket: () => {
    const socket = get().socket;

    if (socket) {
      console.log("[SOCKET] Disconnecting socket...");

      try {
        // Remove all listeners
        socket.removeAllListeners();

        // Disconnect if connected
        if (socket.connected) {
          socket.disconnect();
        }

        // Clear socket from state
        set({ socket: null, onlineUsers: [] });

        console.log("[SOCKET] Socket disconnected successfully");
      } catch (error) {
        console.error("[SOCKET] Error disconnecting socket:", error);
      }
    }
  },
}));
