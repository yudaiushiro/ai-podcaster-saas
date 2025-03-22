'use client';

import { useState } from 'react';
import { processOnServer } from '../api/graphai-server/action';

export default function ServerTest() {
  const [inputText, setInputText] = useState('こんにちは、サーバー');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // サーバーアクションを呼び出す
      const response = await processOnServer(inputText);
      
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.error || 'エラーが発生しました');
      }
    } catch (err) {
      console.error('エラー:', err);
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">サーバー通信テスト</h1>
      <p className="mt-2 text-xl text-gray-600 mb-6">クライアントからサーバーへのシンプルな通信テスト</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="inputText" className="block text-gray-700 mb-2">
            テキスト入力:
          </label>
          <input
            type="text"
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="サーバーに送信するテキスト"
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading || !inputText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-lg font-medium disabled:opacity-50"
        >
          {loading ? '処理中...' : 'サーバーに送信'}
        </button>
      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded w-full max-w-md">
          エラー: {error}
        </div>
      )}
      
      {result && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded w-full max-w-md">
          <h2 className="font-bold mb-2">サーバーからの応答:</h2>
          <div className="mb-2">
            <span className="font-semibold">処理結果:</span> {result.processedText}
          </div>
          <div className="mb-2">
            <span className="font-semibold">タイムスタンプ:</span> {result.timestamp}
          </div>
          <div className="mb-2">
            <span className="font-semibold">メッセージ:</span> {result.serverMessage}
          </div>
        </div>
      )}
    </div>
  );
}