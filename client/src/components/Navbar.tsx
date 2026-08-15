"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-base-content/10 bg-base-100/70 backdrop-blur-md transition-all duration-300 shadow-sm"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform active:scale-95"
            >
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300 shadow-inner">
                <MessageSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-focus bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                Chat Sapphire
              </h1>
            </Link>
          </div>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            <Link
              href="/setting-page"
              className="btn btn-ghost btn-sm gap-2 rounded-xl hover:bg-base-content/10 hover:text-primary transition-all duration-300"
            >
              <Settings className="w-4 h-4 animate-spin-hover" />
              <span className="hidden sm:inline font-medium">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  href="/profile"
                  className="btn btn-ghost btn-sm gap-2 rounded-xl hover:bg-base-content/10 hover:text-primary transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Profile</span>
                </Link>

                <button
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="btn btn-ghost btn-sm gap-2 rounded-xl text-error/85 hover:text-error hover:bg-error/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-base-300/40 animate-modal-backdrop"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          
          {/* Modal Card */}
          <div className="relative bg-base-200 border border-base-content/10 rounded-2xl shadow-2xl p-6 max-w-sm w-full flex flex-col items-center text-center gap-4 animate-modal-content">
            {/* Glowing warning icon */}
            <div className="size-16 rounded-full bg-error/15 flex items-center justify-center border border-error/25 shadow-inner">
              <LogOut className="w-8 h-8 text-error animate-pulse" />
            </div>
            
            {/* Cool words */}
            <div className="space-y-1">
              <h3 className="text-xl font-black text-base-content tracking-tight">
                Leaving the grid? ⚡
              </h3>
              <p className="text-sm text-base-content/70 px-2 leading-relaxed">
                Are you sure you want to pull the plug? The chat will miss your presence.
              </p>
            </div>
            
            {/* Action buttons */}
            <div className="flex gap-3 w-full mt-2">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 btn btn-ghost border border-base-content/15 rounded-xl hover:bg-base-content/10 active:scale-95 transition-all duration-200 font-semibold text-sm cursor-pointer"
              >
                Abort
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  logout();
                }}
                className="flex-1 btn btn-error text-error-content rounded-xl shadow-lg shadow-error/20 hover:shadow-error/35 hover:scale-[1.02] active:scale-95 transition-all duration-200 font-semibold text-sm cursor-pointer"
              >
                Peace Out ✌️
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;

