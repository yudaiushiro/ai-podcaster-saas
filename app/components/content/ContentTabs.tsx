import { useState } from "react";

interface ContentTabsProps {
  audioContent: React.ReactNode;
  videoContent: React.ReactNode;
}

export function ContentTabs({ audioContent, videoContent }: ContentTabsProps) {
  const [activeTab, setActiveTab] = useState<"audio" | "video">("audio");

  return (
    <div className="w-full">
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="flex -mb-px" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("audio")}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === "audio"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            音声生成
          </button>
          <button
            onClick={() => setActiveTab("video")}
            className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
              activeTab === "video"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            動画生成
          </button>
        </nav>
      </div>
      <div className="mt-4">
        {activeTab === "audio" ? audioContent : videoContent}
      </div>
    </div>
  );
} 