# AI Podcaster SaaS - アーキテクチャ設計書

## 1. 概要

本文書では、既存の AI Podcaster コア実装を Next.js アプリケーションに統合し、SaaS プラットフォームとして拡張する方法について説明します。主要技術スタックとして Next.js App Router、Server Actions、Supabase、GraphAI を活用します。

## 2. 全体アーキテクチャ

### 2.1 システム構成図

```
+-------------------------------------------+
|               ブラウザ                     |
|  +-----------------------------------+    |
|  |          Next.js Frontend         |    |
|  | (React Components, Client Hooks)  |    |
|  +-----------------------------------+    |
+-------------------|-------------------+
                    |
+-------------------|-------------------+
|  +-----------------------------------+    |
|  |         Next.js Backend          |    |
|  | (Server Components, API Routes)   |    |
|  +-----------------------------------+    |
|                   |                       |
|  +------------+   |   +---------------+   |
|  | Supabase   |<--|-->| GraphAI Agents|   |
|  | (DB/Auth)  |   |   | (Content Gen) |   |
|  +------------+   |   +---------------+   |
|                   |                       |
|  +-----------------------------------+    |
|  |           Storage                |    |
|  | (Supabase Storage / File System) |    |
|  +-----------------------------------+    |
|                                           |
|              サーバー                      |
+-------------------------------------------+
```

### 2.2 データフロー

1. ユーザー → フロントエンド：テキスト/URL入力
2. フロントエンド → バックエンド：Server Action/API経由でリクエスト
3. バックエンド → GraphAI：コンテンツ生成処理開始
4. GraphAI → 外部API：必要に応じてLLM/TTS/画像生成APIを呼び出し
5. GraphAI → ストレージ：生成ファイルを保存
6. バックエンド → Supabase：メタデータを保存
7. バックエンド → フロントエンド：生成ステータス・結果を返却
8. 運営者 → 管理画面：コンテンツ承認・配信

## 3. 既存コードの分析と再利用

### 3.1 既存コア実装の構造

既存の AI Podcaster コア実装は以下の主要コンポーネントで構成されています：

- **GraphAI エージェント**:
  - `tts_nijivoice_agent.ts`：にじボイスTTS処理
  - `tts_openai_agent.ts`：OpenAI TTS処理
  - `add_bgm_agent.ts`：BGM追加処理
  - `combine_files_agent.ts`：音声ファイル結合

- **処理パイプライン**:
  - `main.ts`：メイン処理フロー（スクリプト → 音声生成）
  - `movie.ts`：動画生成処理
  - `images.ts`：画像生成処理

- **型定義**:
  - `type.ts`：`ScriptData`、`PodcastScript`などの型定義

### 3.2 再利用方針

既存コードは以下の方針で再利用・移行します：

1. **GraphAI エージェント**: `app/lib/graphai/agents/` に移行・拡張
2. **処理グラフ定義**: `app/lib/graphai/graphs/` に移行・拡張
3. **型定義**: `app/lib/api/types.ts` に統合
4. **ユーティリティ関数**: 必要に応じて `app/lib/utils/` に移行

## 4. Supabase データモデル

### 4.1 テーブル設計

#### `users` テーブル
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  full_name TEXT,
  avatar_url TEXT,
  monthly_quota INTEGER DEFAULT 5
);
```

#### `contents` テーブル
```sql
CREATE TABLE contents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reference TEXT,
  script JSONB,
  status TEXT DEFAULT 'draft', -- draft, processing, completed, approved, rejected
  is_audio_generated BOOLEAN DEFAULT FALSE,
  is_video_generated BOOLEAN DEFAULT FALSE,
  audio_url TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  score NUMERIC,
  tags TEXT[]
);
```

#### `approvals` テーブル
```sql
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID REFERENCES contents(id) ON DELETE CASCADE,
  admin_id UUID REFERENCES users(id),
  status TEXT NOT NULL, -- pending, approved, rejected
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4.2 RLS (Row Level Security) 設定

```sql
-- Users can read/update only their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_policy ON users
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Content policies
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
-- Users can read their own content
CREATE POLICY content_select_policy ON contents
  FOR SELECT USING (auth.uid() = user_id);
-- Users can create/update their own content
CREATE POLICY content_insert_policy ON contents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY content_update_policy ON contents
  FOR UPDATE USING (auth.uid() = user_id);
-- Admin can read all content
CREATE POLICY admin_content_policy ON contents
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = true));
```

## 5. GraphAI 統合

### 5.1 エージェント構成

既存の GraphAI エージェントを拡張し、Next.js アプリケーションに統合します：

```typescript
// app/lib/graphai/agents/scriptGenerator.ts
import { AgentFunction } from "graphai";

export const scriptGeneratorAgent: AgentFunction = async ({ namedInputs }) => {
  const { text, url } = namedInputs;
  // LLM を使用してスクリプトを生成
  // ...
  return { script };
};

// app/lib/graphai/graphs/audio-generation.ts
export const audioGenerationGraph = {
  version: 0.5,
  concurrency: 8,
  nodes: {
    script: {
      value: {},
    },
    // ... 既存の graph_data を拡張
  },
};
```

### 5.2 Server Actions との連携

GraphAI エージェントを Server Actions から呼び出し、非同期処理を管理します：

```typescript
// app/actions/content.ts
'use server'

import { createClient } from '@/lib/db/client';
import { audioGenerationGraph } from '@/lib/graphai/graphs/audio-generation';
import { GraphAI } from 'graphai';
import * as agents from '@/lib/graphai/agents';

export async function generateAudioContent(contentId: string) {
  const supabase = createClient();
  
  // コンテンツ情報を取得
  const { data: content } = await supabase
    .from('contents')
    .select('*')
    .eq('id', contentId)
    .single();
    
  // ステータス更新
  await supabase
    .from('contents')
    .update({ status: 'processing' })
    .eq('id', contentId);
  
  try {
    // GraphAI 初期化
    const graph = new GraphAI(audioGenerationGraph, agents);
    
    // スクリプト注入
    graph.injectValue('script', content.script);
    
    // 非同期実行
    const results = await graph.run();
    
    // 結果をDBに保存
    await supabase
      .from('contents')
      .update({
        status: 'completed',
        is_audio_generated: true,
        audio_url: results.addBGM,
      })
      .eq('id', contentId);
      
    return { success: true, results };
  } catch (error) {
    // エラー処理
    await supabase
      .from('contents')
      .update({ status: 'error' })
      .eq('id', contentId);
      
    return { success: false, error };
  }
}
```

## 6. ユーザーインターフェース

### 6.1 コンポーネント構成

UI.md に基づき、以下のコンポーネント構成を実装します：

```
app/components/content/
├── AudioGenerationForm.tsx  # 音声生成フォーム
├── VideoGenerationForm.tsx  # 動画生成フォーム
├── ScriptEditor.tsx         # スクリプト編集
└── PreviewPlayer.tsx        # プレビューコンポーネント
```

### 6.2 状態管理

React の useState と useReducer を使用した状態管理：

```typescript
// app/hooks/useContent.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/db/client';

export function useContent(contentId: string) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('contents')
          .select('*')
          .eq('id', contentId)
          .single();
          
        if (error) throw error;
        setContent(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [contentId]);
  
  return { content, loading, error };
}
```

## 7. 非同期処理・バックグラウンドジョブ

コンテンツ生成には時間がかかるため、以下の方法で非同期処理を実装します：

### 7.1 Server Actions と useTransition

```typescript
// app/components/content/AudioGenerationForm.tsx
'use client'

import { useState, useTransition } from 'react';
import { generateAudioContent } from '@/app/actions/content';

export function AudioGenerationForm({ contentId }) {
  const [isPending, startTransition] = useTransition();
  
  const handleGenerate = () => {
    startTransition(async () => {
      await generateAudioContent(contentId);
    });
  };
  
  return (
    <div>
      <button 
        onClick={handleGenerate} 
        disabled={isPending}
      >
        {isPending ? '生成中...' : '音声生成'}
      </button>
    </div>
  );
}
```

### 7.2 ポーリングによる進捗状況確認

```typescript
// app/hooks/useContentStatus.ts
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/db/client';

export function useContentStatus(contentId: string) {
  const [status, setStatus] = useState('');
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('contents')
        .select('status')
        .eq('id', contentId)
        .single();
      
      if (data) {
        setStatus(data.status);
        if (['completed', 'error'].includes(data.status)) {
          clearInterval(interval);
        }
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [contentId]);
  
  return status;
}
```

## 8. デプロイメント戦略

### 8.1 インフラストラクチャ

- **フロントエンド/バックエンド**: Vercel 
- **データベース/認証/ストレージ**: Supabase
- **コンテンツ生成処理**: 
  - 軽量処理: Server Actions (Vercel)
  - 重い処理: 専用サーバー（AWS/GCP）

### 8.2 環境変数

```
# Next.js
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (サーバーサイドのみ)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
STABILITY_API_KEY=your-stability-key
ELEVENLABS_API_KEY=your-elevenlabs-key

# Storage
STORAGE_BUCKET=your-bucket-name
```

## 9. 開発ロードマップ

### フェーズ 1: 基盤構築 (1-2週間)
- Next.js プロジェクト設定
- Supabase 設定とテーブル作成
- 認証フロー実装
- GraphAI 基本統合

### フェーズ 2: コア機能開発 (3-4週間)
- 音声生成機能実装
- 動画生成機能実装
- ユーザーダッシュボード実装
- コンテンツ管理基本機能

### フェーズ 3: 管理機能開発 (2-3週間)
- 管理者ダッシュボード
- コンテンツ承認フロー
- アナリティクス基本機能
- デプロイメント準備

### フェーズ 4: ポリッシュと拡張 (2-3週間)
- UI/UX 改善
- パフォーマンス最適化
- テスト自動化
- 本番環境デプロイ

## 10. 統合ポイント

### 10.1 既存コードとの統合

既存の AI Podcaster コードは移動せず、そのまま参照して使用します：

1. **GraphAI エージェント**:
   - `ai-podcaster/src/agents/*.ts` のエージェントを直接参照して使用

2. **グラフ定義**:
   - `ai-podcaster/src/main.ts` の graph_data を参考に処理を実装
   - `ai-podcaster/src/movie.ts` の graph_data を参考に処理を実装 

3. **型定義**:
   - `ai-podcaster/src/type.ts` の型を `app/lib/api/types.ts` から参照

4. **ユーティリティ関数**:
   - `ai-podcaster/src/` のユーティリティ関数を必要に応じて直接参照

### 10.2 Supabase との統合

1. **認証**:
   - NextAuth.js + Supabase Auth プロバイダー

2. **ストレージ**:
   - 生成ファイルを Supabase Storage に保存
   - ファイルパスを contents テーブルに記録

3. **RLS**:
   - 適切なアクセス制御でセキュリティを確保

## 11. セキュリティ考慮事項

1. **認証・認可**:
   - Supabase Auth + RLS によるデータアクセス制御
   - 管理者ロールの適切な分離

2. **API キー管理**:
   - サーバーサイドでのみ API キーを使用
   - 環境変数による安全な管理

3. **入力バリデーション**:
   - Zod による厳格な入力検証
   - XSS/CSRF 対策

4. **コンテンツポリシー**:
   - 生成コンテンツの適切なフィルタリング
   - 著作権侵害防止の仕組み

## 12. まとめ

本アーキテクチャは、既存の AI Podcaster コア実装を活用しながら、最新の Next.js、GraphAI、Supabase を組み合わせた SaaS プラットフォームの構築を実現します。ユーザーフレンドリーな UI と強力なバックエンド処理を組み合わせ、高品質なポッドキャスト・動画コンテンツを自動生成する基盤を提供します。

フェーズ別の開発アプローチにより、段階的に機能を拡張しながら、安定したサービス提供を目指します。 