"use client";

import { useChatStore } from "@/store/useChatStore";
import Sidebar from "@/components/Sidebar";
import NoChatSelected from "@/components/NoChatSelected";
import ChatContainer from "@/components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-base-200/50 flex items-center justify-center pt-20 pb-6 px-4 sm:px-6 relative overflow-hidden transition-all duration-300">
      {/* Dynamic background lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-125 h-125 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Dashboard Card */}
      <div className="glass-panel rounded-3xl shadow-2xl w-full max-w-6xl h-[calc(100vh-7rem)] overflow-hidden z-10 relative">
        <div className="flex h-full">
          <Sidebar />

          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </div>
      </div>
    </div>
  );
};
export default HomePage;

