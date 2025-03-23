import { useState, FormEvent } from "react";
import { PodcastScript } from "@/ai-podcaster/src/type";

interface AudioGenerationFormProps {
  onSubmit: (data: {
    type: "url" | "text";
    content: string;
    title: string;
    useBgm: boolean;
  }) => void;
  isProcessing?: boolean;
  onScriptGenerate?: (script: PodcastScript) => void;
}

export function AudioGenerationForm({
  onSubmit,
  isProcessing = false,
  onScriptGenerate,
}: AudioGenerationFormProps) {
  const [inputType, setInputType] = useState<"url" | "text">("url");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [useBgm, setUseBgm] = useState(true);
  const [isScriptGenerated, setIsScriptGenerated] = useState(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: inputType,
      content,
      title,
      useBgm,
    });
  };

  const handleGenerateScript = async () => {
    setIsGeneratingScript(true);
    
    try {
      // 実際の実装では、ここでAPIを呼び出してスクリプトを生成します
      // デモ目的で遅延を追加（実際の実装では削除してください）
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // サンプルスクリプト（実際の実装では、APIレスポンスからスクリプトを設定します）
      const dummyScript: PodcastScript = {
        title: title,
        description: "自動生成された説明",
        reference: inputType === "url" ? content : "",
        tts: "openAI",
        voices: ["nova", "onyx"],
        speakers: ["Host", "Guest"],
        padding: 0,
        aspectRatio: "16:9",
        script: [
          {
            speaker: "Host",
            text: "こんにちは、AIポッドキャスターへようこそ。今日は興味深いトピックについて話していきます。",
            caption: undefined,
            duration: 5,
            filename: "host_1.mp3",
            imagePrompt: undefined,
            imageIndex: 0,
          },
          {
            speaker: "Guest",
            text: "お招きいただきありがとうございます。このトピックについてお話しできることを嬉しく思います。",
            caption: undefined,
            duration: 4,
            filename: "guest_1.mp3",
            imagePrompt: undefined,
            imageIndex: 1,
          },
        ],
        filename: "dummy.mp3",
        voicemap: { "Host": "nova", "Guest": "onyx" },
        ttsAgent: "openai",
        images: [],
      };
      
      // 親コンポーネントのスクリプト状態を更新
      if (onScriptGenerate) {
        onScriptGenerate(dummyScript);
      }
      
      setIsScriptGenerated(true);
    } catch (error) {
      console.error("スクリプト生成中にエラーが発生しました", error);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            入力タイプ
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="inputType"
                value="url"
                checked={inputType === "url"}
                onChange={() => setInputType("url")}
              />
              <span className="ml-2">URL</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="inputType"
                value="text"
                checked={inputType === "text"}
                onChange={() => setInputType("text")}
              />
              <span className="ml-2">テキスト</span>
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="コンテンツのタイトル"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {inputType === "url" ? "URL" : "テキスト"}
          </label>
          {inputType === "url" ? (
            <input
              type="url"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com/article"
              required
            />
          ) : (
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="テキストを入力してください"
              required
            ></textarea>
          )}
        </div>

        <div className="flex items-center">
          <input
            id="useBgm"
            type="checkbox"
            checked={useBgm}
            onChange={(e) => setUseBgm(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="useBgm"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            BGMを追加する
          </label>
        </div>
        
        {/* スクリプト生成ボタン */}
        <div>
          <button
            type="button"
            onClick={handleGenerateScript}
            disabled={isGeneratingScript || !content || !title}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingScript ? "スクリプト生成中..." : "スクリプト生成"}
          </button>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isProcessing || !content || !title || !isScriptGenerated}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "生成中..." : "音声生成"}
        </button>
      </div>
    </form>
  );
} 