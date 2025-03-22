import { useState, FormEvent } from "react";

interface VideoGenerationFormProps {
  onSubmit: (data: {
    prompt: string;
    aspectRatio: "16:9" | "9:16";
  }) => void;
  isProcessing?: boolean;
  hasAudio?: boolean;
}

export function VideoGenerationForm({
  onSubmit,
  isProcessing = false,
  hasAudio = false,
}: VideoGenerationFormProps) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      prompt,
      aspectRatio,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!hasAudio && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                先に音声を生成してから、動画を作成してください。
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="prompt"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            画像生成プロンプト
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="画像のスタイルや内容を詳細に記述してください"
            required
          ></textarea>
          <p className="mt-1 text-xs text-gray-500">
            例: 「青空の下での東京の風景、写真風、明るい光、高解像度」
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            アスペクト比
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="aspectRatio"
                value="16:9"
                checked={aspectRatio === "16:9"}
                onChange={() => setAspectRatio("16:9")}
              />
              <span className="ml-2">横向き (16:9)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="aspectRatio"
                value="9:16"
                checked={aspectRatio === "9:16"}
                onChange={() => setAspectRatio("9:16")}
              />
              <span className="ml-2">縦向き (9:16)</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isProcessing || !prompt || !hasAudio}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "生成中..." : "動画生成"}
        </button>
      </div>
    </form>
  );
} 