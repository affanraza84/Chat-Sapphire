"use client";

import { useEffect, useState } from "react";
import { useChatStore} from "../store/useChatStore";
import type { ChatUser } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileModalStore } from "../store/useProfileModalStore";
import SidebarSkeleton from "./skeletons/SidebarSekeleton";
import { Users } from "lucide-react";
import Image from "next/image";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const { openModal } = useProfileModalStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState<boolean>(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Ensure users and onlineUsers are arrays
  const safeUsers: ChatUser[] = Array.isArray(users) ? users : [];
  const safeOnlineUsers: string[] = Array.isArray(onlineUsers)
    ? onlineUsers
    : [];

  const filteredUsers = showOnlineOnly
    ? safeUsers.filter((user) => safeOnlineUsers.includes(user._id))
    : safeUsers;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-76 border-r border-base-content/10 bg-base-100/40 backdrop-blur-md flex flex-col transition-all duration-300">
      {/* Sidebar Header */}
      <div className="border-b border-base-content/10 w-full p-5 bg-base-100/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Users className="size-5" />
          </div>
          <span className="font-semibold text-base hidden lg:block tracking-tight">Contacts</span>
        </div>
        
        {/* Online Toggle filter */}
        <div className="mt-4 hidden lg:flex items-center justify-between gap-2">
          <label className="cursor-pointer flex items-center gap-2.5 group">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="toggle toggle-primary toggle-sm rounded-full transition-all"
            />
            <span className="text-sm font-medium text-base-content/70 group-hover:text-base-content transition-colors">Online Only</span>
          </label>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-base-content/10 text-base-content/65">
            {Math.max(0, safeOnlineUsers.length - 1)} online
          </span>
        </div>
      </div>

      {/* Users List Container */}
      <div className="overflow-y-auto w-full py-3 flex-1 space-y-1.5 px-2">
        {filteredUsers.map((user, index) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = safeOnlineUsers.includes(user._id);
          const delayClass = `animate-fade-in-${Math.min(index + 1, 5)}`;

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 rounded-2xl flex items-center gap-3.5
                transition-all duration-300 group relative ${delayClass}
                ${isSelected 
                  ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20" 
                  : "hover:bg-base-content/5 text-base-content/85 hover:text-base-content"
                }
              `}
            >
              {/* Left active accent bar */}
              <div 
                className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full bg-primary transition-all duration-300 ${
                  isSelected ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50 group-hover:opacity-40"
                }`}
              />

              {/* Avatar Section */}
              <div className="relative mx-auto lg:mx-0 shrink-0">
                <div 
                  className={`p-0.5 rounded-full border transition-colors duration-300 ${isSelected ? "border-primary" : "border-base-content/10"} ${user.profilePic ? "cursor-pointer hover:border-primary/50" : ""}`}
                  onClick={(e) => {
                    if (user.profilePic) {
                      e.stopPropagation();
                      openModal(user._id);
                    }
                  }}
                >
                  <Image
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="w-11 h-11 object-cover rounded-full bg-base-200"
                    width={44}
                    height={44}
                  />
                </div>
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500
                    rounded-full ring-2 ring-base-100 animate-pulse"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-semibold text-sm truncate">{user.fullName}</div>
                <div className={`text-xs font-light mt-0.5 ${isSelected ? "text-primary/80" : "text-base-content/50"}`}>
                  {isOnline ? "Active now" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-8 flex flex-col items-center gap-2">
            <span className="text-sm font-light">No users found</span>
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

