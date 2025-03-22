import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "@/app/components/ClientBody";
import ToasterProvider from "@/app/components/ToasterProvider";

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
        <ToasterProvider />
        {children}
      </ClientBody>
    </html>
  );
} 