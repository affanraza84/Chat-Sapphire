"use client";
import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image as ImageIcon, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full bg-base-100/30 border-t border-base-content/10 backdrop-blur-sm">
      {imagePreview && (
        <div className="mb-4 flex items-center gap-3">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-2xl border border-primary/20 shadow-md transition-transform duration-300 hover:scale-102"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-base-300 border border-base-content/10
              flex items-center justify-center hover:bg-error hover:text-white transition-all shadow-sm active:scale-90"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex gap-2 items-center bg-base-200/50 hover:bg-base-200 focus-within:bg-base-100 focus-within:ring-1 focus-within:ring-primary/20 border border-base-content/10 focus-within:border-primary rounded-2xl px-3 py-1.5 transition-all duration-300">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none focus:outline-none py-1.5 px-2 text-sm text-base-content placeholder-base-content/40 h-10 w-full"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`btn btn-ghost btn-circle btn-sm rounded-xl transition-all duration-300 hover:bg-base-content/10 ${
              imagePreview ? "text-emerald-500" : "text-base-content/50 hover:text-primary"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-circle w-12 h-12 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center text-white"
          disabled={!text.trim() && !imagePreview}
        >
          <Send className="w-5 h-5 translate-x-[1px] -translate-y-[0.5px]" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;

