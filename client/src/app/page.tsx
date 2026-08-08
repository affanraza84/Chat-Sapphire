"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import HomePage from "./home/page";

export default function Home() {
  const router = useRouter();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      router.push("/login");
    }
  }, [isCheckingAuth, authUser, router]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  if (!authUser) {
    return null;
  }

  return <HomePage />;
}
