"use client";

import Link from "next/link";
import { PlusCircle, LayoutDashboard, Settings } from "lucide-react";

// モックコンテンツデータ
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

export function Sidebar() {
  // 実際のアプリでは、API呼び出しでコンテンツリストを取得
  return (
    <div className="w-64 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <Link
            href="/new"
            className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-md font-medium text-sm"
          >
            <PlusCircle size={18} />
            <span>New Content</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">作品履歴</h3>
          </div>
          <ul className="space-y-1 px-2">
            {mockContents.length > 0 ? (
              mockContents.map((content) => (
                <li key={content.id}>
                  <Link
                    href={`/content/${content.id}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                  >
                    <span className="truncate">{content.title}</span>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                コンテンツがありません
              </li>
            )}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <ul className="space-y-1">
            <li>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
              >
                <Settings size={18} />
                <span>設定</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 