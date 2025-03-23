"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/app/components/layout/Header";
import { Sidebar } from "@/app/components/layout/Sidebar";
import { useAuth } from "@/app/hooks/useAuth";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証状態のチェック
    if (!isLoading && !user) {
      // ログインしていない場合はログインページにリダイレクト
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // ローディング中または未認証の場合はローディング表示
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  );
} 