import { Header } from "@/app/components/layout/Header";
import { Sidebar } from "@/app/components/layout/Sidebar";

// このレイアウトは実際のアプリでは認証が必要です
// MVPではモックデータで表示
const mockUser = {
  name: "テストユーザー",
  email: "test@example.com",
};

const mockContents = [
  {
    id: "1",
    title: "テストコンテンツ1",
    createdAt: "2024-03-22T12:00:00Z",
  },
  {
    id: "2",
    title: "テストコンテンツ2",
    createdAt: "2024-03-21T14:30:00Z",
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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