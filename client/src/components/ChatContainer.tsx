"use client";

import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import Image from "next/image";

interface Message {
  _id: string;
  senderId: string;
  text?: string;
  image?: string;
  createdAt: string;
}

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100/50">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!selectedUser || !authUser) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-base-100/30">
      <ChatHeader />

      {/* Message History area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.map((message: Message) => {
          const isSelf = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat ${isSelf ? "chat-end" : "chat-start"} animate-message-in`}
              ref={messageEndRef}
            >
              {/* Profile Image with subtle avatar frame */}
              <div className="chat-image avatar">
                <div className="w-9 h-9 rounded-full ring-1 ring-base-content/10 shadow-sm">
                  <Image
                    src={
                      isSelf
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                    width={36}
                    height={36}
                    className="rounded-full object-cover bg-base-200"
                  />
                </div>
              </div>

              {/* Chat Bubble Message Body */}
              <div
                className={`chat-bubble flex flex-col max-w-[75%] p-3.5 shadow-sm rounded-2xl leading-relaxed text-sm ${
                  isSelf
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-base-200 text-base-content rounded-tl-none border border-base-content/5"
                }`}
              >
                {message.image && (
                  <div className="relative rounded-lg overflow-hidden mb-2 border border-base-content/10 bg-base-300">
                    <Image
                      src={message.image}
                      alt="Attachment"
                      width={240}
                      height={240}
                      className="object-contain max-h-60 w-auto rounded-lg"
                    />
                  </div>
                )}
                {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
                
                {/* Tiny absolute/aligned timestamp inside bubble */}
                <span
                  className={`text-[9px] mt-1.5 self-end font-light tracking-wide uppercase select-none ${
                    isSelf ? "text-white/65" : "text-base-content/40"
                  }`}
                >
                  {formatMessageTime(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;

