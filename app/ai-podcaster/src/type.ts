export interface ScriptData {
  speaker: string;
  text: string;
  caption?: string;
  duration?: number;
  filename?: string;
  imagePrompt?: string;
  imageIndex?: number;
}

export interface PodcastScript {
  title: string;
  description: string;
  reference: string;
  tts: string;
  voices: string[];
  speakers: string[];
  padding: number;
  script: ScriptData[];
  filename: string;
  voicemap: Record<string, string>;
  ttsAgent: string;
  images: string[];
  aspectRatio: string;
} 