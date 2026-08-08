"use client";

import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    checkAuth();
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  // Apply theme to document element
  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  // Avoid flash of unstyled content during hydration
  if (!mounted || isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  );
}

