"use client";

import Link from "next/link";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

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
                  onClick={logout}
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
    </header>
  );
};
export default Navbar;

