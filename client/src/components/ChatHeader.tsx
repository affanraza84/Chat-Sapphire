"use client";

import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import Image from "next/image";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  if (!selectedUser) {
    return null;
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-4 border-b border-base-content/10 bg-base-100/50 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with status outline */}
          <div className="relative">
            <div className={`p-[2px] rounded-full border transition-colors duration-300 ${isOnline ? "border-green-500" : "border-base-content/10"}`}>
              <Image
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover bg-base-200"
              />
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-base-100 animate-pulse" />
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-semibold text-sm leading-tight text-base-content">{selectedUser.fullName}</h3>
            <p className="text-xs font-light text-base-content/50 mt-0.5 flex items-center gap-1.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOnline ? "bg-green-500" : "bg-base-content/30"}`} />
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-circle btn-sm rounded-full text-base-content/60 hover:text-base-content hover:bg-base-content/10 transition-all duration-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;

