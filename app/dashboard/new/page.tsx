"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ContentTabs } from "@/app/components/content/ContentTabs";
import { AudioGenerationForm } from "@/app/components/content/AudioGenerationForm";
import { VideoGenerationForm } from "@/app/components/content/VideoGenerationForm";
import { ScriptEditor } from "@/app/components/content/ScriptEditor";
import { PreviewPlayer } from "@/app/components/content/PreviewPlayer";
import { PodcastScript } from "@/ai-podcaster/src/type";

export default function NewContentPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("type") === "video" ? "video" : "audio";

  const [isProcessing, setIsProcessing] = useState(false);
  const [script, setScript] = useState<PodcastScript | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleAudioSubmit = (data: {
    type: "url" | "text";
    content: string;
    title: string;
    useBgm: boolean;
  }) => {
    setIsProcessing(true);

    // 実際のアプリでは、APIリクエストを送信してAI処理を開始
    // MVPではモックデータでデモ
    setTimeout(() => {
      // モックスクリプト
      const mockScript: PodcastScript = {
        title: data.title || "テストポッドキャスト",
        description: "テスト用に自動生成されたポッドキャスト",
        reference: data.type === "url" ? data.content : undefined,
        tts: "openai",
        voices: ["nova", "onyx"],
        script: [
          {
            speaker: "Host",
            text: "こんにちは、AIポッドキャスターです。今日は興味深いトピックについて話していきます。",
          },
          {
            speaker: "Guest",
            text: "初めまして。お招きいただきありがとうございます。私もこのトピックについて話すのを楽しみにしていました。",
          },
          {
            speaker: "Host",
            text: "それでは早速ですが、このトピックの背景から説明していただけますか？",
          },
          {
            speaker: "Guest",
            text: "もちろんです。このトピックは非常に興味深い歴史があります。まず最初に...",
          },
        ],
      };

      setScript(mockScript);
      
      // モック音声URL
      setAudioUrl("/sounds/sample-podcast.mp3");
      
      setIsProcessing(false);
    }, 2000);
  };

  const handleVideoSubmit = (data: {
    prompt: string;
    aspectRatio: "16:9" | "9:16";
  }) => {
    setIsProcessing(true);

    // 実際のアプリでは、APIリクエストを送信してAI処理を開始
    // MVPではモックデータでデモ
    setTimeout(() => {
      // モック動画URL
      setVideoUrl("/videos/sample-podcast-video.mp4");
      setIsProcessing(false);
    }, 2000);
  };

  const handleScriptChange = (updatedScript: PodcastScript) => {
    setScript(updatedScript);
  };

  const handleAudioDownload = () => {
    // 実際のアプリでは、ファイルダウンロード処理
  };

  const handleVideoDownload = () => {
    // 実際のアプリでは、ファイルダウンロード処理
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">新規コンテンツ作成</h1>
      </div>

      <ContentTabs initialTab={initialTab}>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              {initialTab === "audio" ? (
                <AudioGenerationForm
                  onSubmit={handleAudioSubmit}
                  isLoading={isProcessing}
                />
              ) : (
                <VideoGenerationForm
                  onSubmit={handleVideoSubmit}
                  isLoading={isProcessing}
                  hasAudio={!!audioUrl}
                />
              )}

              {script && (
                <div className="mt-6">
                  <ScriptEditor
                    script={script}
                    onChange={handleScriptChange}
                    readOnly={isProcessing}
                  />
                </div>
              )}
            </div>

            <div>
              {(audioUrl || videoUrl) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">プレビュー</h2>
                  <PreviewPlayer
                    audioUrl={audioUrl}
                    videoUrl={videoUrl}
                    onDownloadAudio={handleAudioDownload}
                    onDownloadVideo={handleVideoDownload}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </ContentTabs>
    </div>
  );
} 