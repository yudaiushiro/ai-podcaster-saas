'use client';

import { useState } from 'react';
import { runGraphAI } from '../api/ai-podcaster/action';

export default function AIPodcasterDemo() {
  const [inputText, setInputText] = useState('こんにちは、AiPodcaster');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prevLogs => [...prevLogs, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // デバッグ用のコンソールログを追加
    console.log('handleSubmit called at:', new Date().toISOString());
    
    setLoading(true);
    setError(null);
    setLogs([]);
    
    addLog(`処理開始: "${inputText}"`);
    
    try {
      addLog("サーバーアクション呼び出し");
      // サーバー上でAiPodcasterを実行
      const response = await runGraphAI(inputText);
      // レスポンスの詳細をログに追加
      console.log('Server response:', response);
      addLog("サーバーからレスポンス受信");
      
      if (response.success) {
        addLog("処理成功");
        setResult(response.data);
      } else {
        addLog(`エラー発生: ${response.error}`);
        setError(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      addLog(`例外発生: ${errorMessage}`);
      console.error('エラー:', err);
      setError(errorMessage);
    } finally {
      addLog("処理完了");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">AiPodcaster デモ</h1>
      <p className="mt-2 text-xl text-gray-600 mb-6">サーバーサイドでAiPodcasterを実行するデモ</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="inputText" className="block text-gray-700 mb-2">
            テキスト入力:
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="AiPodcasterで処理するテキスト"
            rows={10}
            maxLength={20000}
          />
          <div className="text-sm text-gray-500 mt-1">
            {inputText.length}/20000文字
          </div>
        </div>
        
        <button 
          type="submit"
          disabled={loading || !inputText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium disabled:opacity-50"
        >
          {loading ? 'AiPodcaster実行中...' : 'AiPodcasterで処理'}
        </button>
      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded w-full max-w-md">
          <h2 className="font-bold mb-2">エラー:</h2>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded w-full max-w-md">
          <h2 className="font-bold mb-2">AiPodcaster 処理結果:</h2>
          <pre className="whitespace-pre-wrap overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      {/* デバッグログ表示 */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-400 text-gray-800 rounded w-full max-w-md">
        <h2 className="font-bold mb-2">デバッグログ:</h2>
        <div className="h-40 overflow-y-auto bg-gray-800 text-green-400 p-2 rounded font-mono text-sm">
          {logs.length > 0 ? (
            logs.map((log, index) => <div key={index}>{log}</div>)
          ) : (
            <div>ログはまだありません</div>
          )}
        </div>
      </div>
    </div>
  );
}