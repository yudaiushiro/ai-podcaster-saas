import { PodcastScript } from "@/ai-podcaster/src/type";

export interface Content {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  reference: string | null;
  script: PodcastScript | null;
  status: 'draft' | 'processing' | 'completed' | 'approved' | 'rejected';
  is_audio_generated: boolean;
  is_video_generated: boolean;
  audio_url: string | null;
  video_url: string | null;
  created_at: string;
  updated_at: string;
  score: number | null;
  tags: string[] | null;
} 