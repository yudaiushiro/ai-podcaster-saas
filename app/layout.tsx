import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./components/ClientBody";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Podcaster SaaS",
  description: "AIを活用してポッドキャストや動画コンテンツを自動生成するプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <ClientBody className={inter.className}>
        <Toaster position="top-center" richColors />
        {children}
      </ClientBody>
    </html>
  );
} 