"use client";

import { THEMES } from "@/constants";
import { useThemeStore } from "@/store/useThemeStore";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

interface PreviewMessage {
  id: number;
  content: string;
  isSent: boolean;
}

const PREVIEW_MESSAGES: PreviewMessage[] = [
  { id: 1, content: "What are you thinking about?", isSent: false },
  {
    id: 2,
    content: "Depends. The safe answer or the honest one?",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 bg-base-100 relative overflow-hidden transition-all duration-300">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl z-10 relative">
        <div className="glass-panel p-6 sm:p-10 rounded-3xl shadow-xl space-y-8">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Theme Settings
            </h2>
            <p className="text-sm text-base-content/65 font-light">
              Choose a theme for your Chat Sapphire interface
            </p>
          </div>

          {/* Theme Selector Grid */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/70">Select Theme</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {THEMES.map((t) => {
                const isActive = mounted && theme === t;

                return (
                  <button
                    key={t}
                    className={`
                      group flex flex-col items-center gap-2 p-2.5 rounded-2xl transition-all duration-300 border hover:scale-[1.03] active:scale-[0.98]
                      ${isActive 
                        ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/20" 
                        : "bg-base-200/40 border-base-content/5 hover:bg-base-200 hover:border-base-content/10"
                      }
                    `}
                    onClick={() => setTheme(t)}
                  >
                    <div
                      className="relative h-9 w-full rounded-xl overflow-hidden shadow-inner border border-base-content/5"
                      data-theme={t}
                    >
                      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1.5 bg-base-100">
                        <div className="rounded bg-primary"></div>
                        <div className="rounded bg-secondary"></div>
                        <div className="rounded bg-accent"></div>
                        <div className="rounded bg-neutral"></div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold truncate w-full text-center tracking-tight text-base-content/85 group-hover:text-base-content transition-colors">
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4 pt-4 border-t border-base-content/10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/70">Interface Preview</h3>
            
            <div className="rounded-2xl border border-base-content/10 overflow-hidden bg-base-200/50 p-4 sm:p-8 shadow-inner">
              <div className="max-w-lg mx-auto shadow-2xl rounded-2xl overflow-hidden border border-base-content/10" data-theme={theme}>
                {/* Mock Chat UI */}
                <div className="bg-base-100 flex flex-col h-85">
                  
                  {/* Chat Header */}
                  <div className="px-4 py-3.5 border-b border-base-content/10 bg-base-100/80 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold text-sm shadow-sm">
                      JD
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-base-content leading-tight">Affan</h4>
                      <p className="text-[10px] text-green-500 font-medium mt-0.5">Online</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-base-100/30 flex flex-col justify-end">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`
                            max-w-[80%] rounded-2xl p-3 shadow-sm text-xs leading-relaxed
                            ${message.isSent 
                              ? "bg-primary text-white rounded-tr-none" 
                              : "bg-base-200 text-base-content rounded-tl-none border border-base-content/5"
                            }
                          `}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`
                              text-[8px] mt-1 text-right font-light uppercase tracking-wider
                              ${message.isSent ? "text-white/60" : "text-base-content/40"}
                            `}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-base-content/10 bg-base-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="input input-bordered flex-1 text-xs h-10 rounded-xl bg-base-200/50 hover:bg-base-200 border-base-content/10 focus:outline-none focus:border-primary pl-3.5"
                        placeholder="Type a message..."
                        defaultValue="Got something to say?"
                        readOnly
                      />
                      <button className="btn btn-primary h-10 min-h-0 w-10 flex items-center justify-center p-0 rounded-xl text-white shadow-md shadow-primary/20">
                        <Send size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default SettingsPage;

