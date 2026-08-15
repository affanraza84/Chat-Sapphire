import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";
import UserProfileModal from "@/components/UserProfileModal";

export const metadata: Metadata = {
  title: "Chat-Sapphire",
  description: "Real-time chat app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <UserProfileModal />
        </Providers>
      </body>
    </html>
  );
}
