"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Camera, Mail, User, Shield, Calendar, Edit2, Check, X } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImg(reader.result as string);
    };

    // Upload the actual file
    await updateProfile({ profilePic: file });
  };

  const handleNameSave = async () => {
    if (!editedName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    if (editedName === authUser?.fullName) {
      setIsEditingName(false);
      return;
    }
    await updateProfile({ fullName: editedName });
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-base-100 relative overflow-hidden transition-all duration-300">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto p-4 z-10 relative">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-sm text-base-content/65 font-light">Your personal account details</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-base-100 shadow-md ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40">
                <img
                  src={selectedImg || authUser?.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover bg-base-200"
                />
              </div>
              
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-primary text-white border border-base-100 shadow-lg hover:scale-110 active:scale-95
                  p-2.5 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none bg-base-300" : ""}
                `}
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            
            <p className="text-xs text-base-content/50 font-light">
              {isUpdatingProfile
                ? "Uploading your new avatar..."
                : "Click the camera icon to select a new image"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div className="space-y-1.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary/70" />
                  Full Name
                </div>
                {!isEditingName ? (
                  <button 
                    onClick={() => { setIsEditingName(true); setEditedName(authUser?.fullName as string); }} 
                    className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleNameSave} 
                      className="text-success hover:text-success/80 transition-colors cursor-pointer" 
                      disabled={isUpdatingProfile}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setIsEditingName(false)} 
                      className="text-error hover:text-error/80 transition-colors cursor-pointer" 
                      disabled={isUpdatingProfile}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {!isEditingName ? (
                <div className="px-4 py-3.5 bg-base-200/50 rounded-xl border border-base-content/5 text-sm font-medium text-base-content select-all">
                  {authUser?.fullName as string}
                </div>
              ) : (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full px-4 py-3 bg-base-200/50 rounded-xl border border-primary/50 text-sm font-medium text-base-content focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={isUpdatingProfile}
                  autoFocus
                />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-base-content/60 flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary/70" />
                Email Address
              </div>
              <div className="px-4 py-3.5 bg-base-200/50 rounded-xl border border-base-content/5 text-sm font-medium text-base-content select-all">
                {authUser?.email as string}
              </div>
            </div>
          </div>

          {/* Account Meta Info Card */}
          <div className="mt-8 bg-base-200/40 rounded-2xl p-6 border border-base-content/5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-base-content/75 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Account Details
            </h2>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-base-content/10">
                <span className="text-base-content/60 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Member Since
                </span>
                <span className="font-semibold text-base-content/85">
                  {(authUser?.createdAt as string | undefined)?.split("T")[0]}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2.5">
                <span className="text-base-content/60 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Account Status
                </span>
                <span className="text-green-500 font-semibold uppercase tracking-wider text-[10px]">Active</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default ProfilePage;

