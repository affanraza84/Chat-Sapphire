export interface User {
  _id: string;
  fullName: string;
  email: string;
  profilePic: string;
}

export interface Message {
  _id: string;
  senderId: string | User;
  receiverId: string | User;
  text?: string;
  image?: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  [key: string]: unknown;
}
