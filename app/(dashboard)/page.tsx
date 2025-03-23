export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">今月の使用状況</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">音声生成</div>
                <div className="text-sm text-gray-500">2 / 5</div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">動画生成</div>
                <div className="text-sm text-gray-500">1 / 3</div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "33%" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">最近の更新</h2>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">テストコンテンツ1</span>
                <span className="text-xs text-gray-500">30分前</span>
              </div>
              <p className="text-xs text-gray-500">音声生成完了</p>
            </li>
            <li className="py-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">テストコンテンツ2</span>
                <span className="text-xs text-gray-500">2時間前</span>
              </div>
              <p className="text-xs text-gray-500">動画生成中</p>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">クイックスタート</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/new" className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <h3 className="text-md font-medium mb-1">新規音声作成</h3>
            <p className="text-sm text-gray-500">テキストやURLから音声コンテンツを生成します。</p>
          </a>
          <a href="/new?type=video" className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <h3 className="text-md font-medium mb-1">新規動画作成</h3>
            <p className="text-sm text-gray-500">音声コンテンツに画像を追加して動画を作成します。</p>
          </a>
        </div>
      </div>
    </div>
  )
} 