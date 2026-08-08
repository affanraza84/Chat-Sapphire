"use client";

import { useState } from "react";

interface EnvVars {
  MODE: string;
  NEXT_PUBLIC_API_URL: string | undefined;
  NEXT_PUBLIC_SOCKET_URL: string | undefined;
  DEV: boolean;
  PROD: boolean;
}

const EnvDebugger = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Cast to `string` so TS doesn't narrow NODE_ENV to a literal union
  // that can exclude "development" during production builds.
  const mode: string = process.env.NODE_ENV as string;

  if (mode === "development") {
    return null;
  }

  const envVars: EnvVars = {
    MODE: mode,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    DEV: mode === "development",
    PROD: mode === "production",
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
      >
        🔧 Debug
      </button>
      {isVisible && (
        <div className="absolute bottom-10 right-0 bg-black text-green-400 p-4 rounded shadow-lg text-xs font-mono w-80 max-h-60 overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-white font-bold">Environment Variables</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-red-400 hover:text-red-300"
            >
              ✕
            </button>
          </div>
          <div className="space-y-1">
            {Object.entries(envVars).map(([key, value]) => (
              <div key={key} className="flex">
                <span className="text-yellow-400 w-32 shrink-0">{key}:</span>
                <span className="text-green-400 break-all">
                  {String(value) || "<undefined>"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-600">
            <div className="text-yellow-400 text-xs">Expected URLs:</div>
            <div className="text-green-400 text-xs">
              API: https://chatty-real-time-chat-app-ciu4.onrender.com/api
            </div>
            <div className="text-green-400 text-xs">
              Socket: wss://chatty-real-time-chat-app-ciu4.onrender.com
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvDebugger;
