import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download } from "lucide-react";

interface PreviewPlayerProps {
  audioUrl?: string | null;
  videoUrl?: string | null;
  type: "audio" | "video";
  onDownload?: () => void;
}

export function PreviewPlayer({
  audioUrl,
  videoUrl,
  type,
  onDownload,
}: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null);

  const url = type === "audio" ? audioUrl : videoUrl;

  useEffect(() => {
    if (!mediaRef.current) return;

    const handleTimeUpdate = () => {
      if (!mediaRef.current) return;
      const currentProgress =
        (mediaRef.current.currentTime / mediaRef.current.duration) * 100;
      setProgress(currentProgress);
    };

    const handleLoadedMetadata = () => {
      if (!mediaRef.current) return;
      setDuration(mediaRef.current.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      if (mediaRef.current) {
        mediaRef.current.currentTime = 0;
      }
    };

    mediaRef.current.addEventListener("timeupdate", handleTimeUpdate);
    mediaRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    mediaRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (!mediaRef.current) return;
      mediaRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      mediaRef.current.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
      mediaRef.current.removeEventListener("ended", handleEnded);
    };
  }, [url]);

  const togglePlayPause = () => {
    if (!mediaRef.current) return;

    if (isPlaying) {
      mediaRef.current.pause();
    } else {
      mediaRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!mediaRef.current) return;
    const newProgress = Number(e.target.value);
    const newTime = (newProgress / 100) * mediaRef.current.duration;
    mediaRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  if (!url) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-gray-900 min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          {type === "audio" ? "音声" : "動画"}がまだ生成されていません
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium">
          {type === "audio" ? "音声プレビュー" : "動画プレビュー"}
        </h3>
      </div>

      <div className="p-4">
        {type === "audio" ? (
          <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={url} />
        ) : (
          <div className="relative aspect-video mb-4">
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={url}
              className="w-full h-full rounded-md"
            />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlayPause}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className="text-sm text-gray-500">
              {duration > 0
                ? `${formatTime((progress / 100) * duration)} / ${formatTime(
                    duration
                  )}`
                : "0:00 / 0:00"}
            </div>
            <button
              onClick={onDownload}
              className="ml-auto text-indigo-600 hover:text-indigo-700"
            >
              <Download size={18} />
            </button>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}