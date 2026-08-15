"use client";

import { useProfileModalStore } from "../store/useProfileModalStore";
import { X, User as UserIcon, Loader2, Info } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function UserProfileModal() {
  const { isOpen, profile, loading, error, closeModal } = useProfileModalStore();
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-base-100 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-white/10 animate-in zoom-in-95 duration-200"
      >
        {/* Header section with cover gradient */}
        <div className="h-32 bg-gradient-to-br from-primary/80 to-secondary/80 relative">
          <button
            onClick={() => {
              setIsImageEnlarged(false);
              closeModal();
            }}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* Profile Picture overlapping the header */}
          <div className="relative -mt-16 mb-4 flex justify-center">
            <div className="rounded-full p-1.5 bg-base-100 shadow-xl border border-white/5">
              {loading ? (
                <div className="w-28 h-28 rounded-full bg-base-200 animate-pulse flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
              ) : profile?.profilePic ? (
                <Image
                  src={profile.profilePic}
                  alt={profile.fullName || "User"}
                  width={112}
                  height={112}
                  className="w-28 h-28 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setIsImageEnlarged(true)}
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-base-200 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-base-content/40" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4 py-4">
              <div className="h-6 w-1/2 bg-base-200 rounded animate-pulse mx-auto"></div>
              <div className="h-4 w-3/4 bg-base-200 rounded animate-pulse mx-auto"></div>
            </div>
          ) : error ? (
            <div className="text-center text-error py-4">
              <Info className="w-8 h-8 mx-auto mb-2 opacity-80" />
              <p>{error}</p>
            </div>
          ) : profile ? (
            <div className="text-center space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-base-content">{profile.fullName}</h2>
              </div>
              
              <div className="bg-base-200/50 rounded-2xl p-4 text-left space-y-4 mt-6">
                <div>
                  <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-1">Status</h3>
                  <p className="text-base-content">{profile.status || "Hey there! I am using Chat Sapphire."}</p>
                </div>
                
                <div className="h-px bg-base-content/10"></div>
                
                <div>
                  <h3 className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-1">Bio</h3>
                  <p className="text-base-content whitespace-pre-wrap">{profile.bio || "No bio provided."}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Enlarged Image Overlay */}
      {isImageEnlarged && profile?.profilePic && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageEnlarged(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsImageEnlarged(false);
            }}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
          <div 
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={profile.profilePic}
              alt={profile.fullName || "User"}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
