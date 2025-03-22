import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50">
      {/* ヘッダー */}
      <div className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">AI-Podcaster</div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              ログイン
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              無料登録
            </Link>
          </div>
        </div>
      </div>

      {/* メインセクション */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            <span className="block">AIで音声・動画コンテンツを</span>
            <span className="block mt-2 text-blue-600">簡単に作成</span>
          </h1>
          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
            テキストを入力するだけで、プロフェッショナルな音声と動画を自動生成。煩わしい編集作業から解放されましょう。
          </p>
          <div className="mt-10">
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md text-lg font-medium inline-flex items-center"
            >
              無料ではじめる <span className="ml-2">→</span>
            </Link>
            <Link 
              href="/login" 
              className="ml-4 text-gray-600 hover:text-gray-900 px-8 py-4 rounded-md text-lg font-medium"
            >
              ログイン
            </Link>
          </div>
        </div>
      </div>

      {/* 機能セクション */}
      <div className="w-full bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">主な機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 機能1 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">高品質な音声生成</h3>
              <p className="text-gray-600">自然な抑揚と感情表現を持つ、プロフェッショナルな音声を自動生成します。</p>
            </div>

            {/* 機能2 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">動画コンテンツ作成</h3>
              <p className="text-gray-600">生成した音声に合わせて、テーマに沿った画像や動画を自動的に合成します。</p>
            </div>

            {/* 機能3 */}
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">スクリプト自動生成</h3>
              <p className="text-gray-600">URLやテキストからコンテンツを分析し、魅力的なスクリプトを自動作成します。</p>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="w-full bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2025 AI-Podcaster. All rights reserved.
        </div>
      </footer>
    </main>
  );
} 