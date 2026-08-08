import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/40 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md text-center space-y-6 z-10">
        {/* Animated Brand Icon */}
        <div className="flex justify-center gap-4 mb-2">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center
              justify-center animate-bounce [animation-duration:4s] shadow-inner border border-primary/20"
            >
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full ring-4 ring-base-100 animate-pulse" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight">Welcome to Chat Sapphire!</h2>
          <p className="text-sm text-base-content/60 font-light leading-relaxed">
            Select a contact from the sidebar to begin messaging in real time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
