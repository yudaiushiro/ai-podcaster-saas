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
    console.log("Audio Generation Form Data:", data);
    setIsProcessing(true);

    // 実際のアプリでは、APIを呼び出してスクリプトを生成し、音声ファイルを作成
    // MVPではダミーデータでデモ
    setTimeout(() => {
      // ダミースクリプト
      const dummyScript: PodcastScript = {
        title: data.title,
        description: "自動生成された説明",
        reference: data.type === "url" ? data.content : "",
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
        voicemap: new Map(),
        ttsAgent: "openai",
        images: [],
      };

      setScript(dummyScript);
      setAudioUrl("/sample-audio.mp3"); // 実際のアプリではSupabase Storageから取得したURLを設定
      setIsProcessing(false);
    }, 3000);
  };

  const handleVideoSubmit = (data: {
    prompt: string;
    aspectRatio: "16:9" | "9:16";
  }) => {
    console.log("Video Generation Form Data:", data);
    setIsProcessing(true);

    // 実際のアプリでは、APIを呼び出して画像を生成し、音声と合成して動画を作成
    // MVPではダミーデータでデモ
    setTimeout(() => {
      setVideoUrl("/sample-video.mp4"); // 実際のアプリではSupabase Storageから取得したURLを設定
      setIsProcessing(false);
    }, 3000);
  };

  const handleScriptChange = (updatedScript: PodcastScript) => {
    setScript(updatedScript);
    // 実際のアプリでは、更新されたスクリプトを保存するAPIを呼び出し
  };

  const handleAudioDownload = () => {
    // 実際のアプリでは、音声ファイルをダウンロードする処理
    console.log("Downloading audio");
  };

  const handleVideoDownload = () => {
    // 実際のアプリでは、動画ファイルをダウンロードする処理
    console.log("Downloading video");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">新規コンテンツ作成</h1>

      <ContentTabs
        audioContent={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <AudioGenerationForm
                onSubmit={handleAudioSubmit}
                isProcessing={isProcessing}
              />
            </div>
            <div className="space-y-6">
              <ScriptEditor
                script={script}
                onScriptChange={handleScriptChange}
                isEditable={!isProcessing}
              />
              <PreviewPlayer
                audioUrl={audioUrl}
                type="audio"
                onDownload={handleAudioDownload}
              />
            </div>
          </div>
        }
        videoContent={
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <VideoGenerationForm
                onSubmit={handleVideoSubmit}
                isProcessing={isProcessing}
                hasAudio={!!audioUrl}
              />
            </div>
            <div className="space-y-6">
              <PreviewPlayer
                videoUrl={videoUrl}
                type="video"
                onDownload={handleVideoDownload}
              />
            </div>
          </div>
        }
      />
    </div>
  );
} 