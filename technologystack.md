# 技術スタック

## コア技術
- TypeScript: ^5.3.0
- Node.js: ^20.0.0
- **AIモデル: claude-3-7-sonnet-20250219 (Anthropic Messages API 2023-06-01) ← バージョン変更禁止**
- GraphAI: ^1.0.0 ← AI Agent管理のコアライブラリ

## フロントエンド
- Next.js: ^15.1.3
- React: ^19.0.0
- Tailwind CSS: ^3.4.17
- shadcn/ui: ^2.1.8
- Uppy: ^3.7.0 ← ファイルアップロード用
- React Media Player: ^0.8.0 ← オーディオ/ビデオプレビュー用

## バックエンド
- Next.js App Router (Server Components & Server Actions)
- Supabase: ^2.38.0 ← データベース・認証・ストレージ
- NextAuth.js: ^4.24.5 ← Supabaseと連携した認証
- Zod: ^3.22.2 ← バリデーション

## AI/メディア処理
- Anthropic SDK: ^0.18.0 ← Claude APIの利用
- FFmpeg-wasm: ^0.12.0 ← ブラウザ内でのメディア処理
- ElevenLabs API: ^1.0.0 ← 音声合成 (TTS)
- StabilityAI API: ^0.1.0 ← 画像生成

## 開発ツール
- npm: ^10.0.0
- ESLint: ^9.0.0
- TypeScript: ^5.3.0
- Prettier: ^3.2.4
- Husky: ^9.0.5 ← Git Hooks

---

# API バージョン管理
## 重要な制約事項
- APIクライアントは `app/lib/api/client.ts` で一元管理
- AI モデルのバージョンは client.ts 内で厳密に管理
- これらのファイルは変更禁止（変更が必要な場合は承認が必要）：
  - client.ts  - AIモデルとAPI設定の中核
  - types.ts   - 型定義の一元管理
  - config.ts  - 環境設定の一元管理

## GraphAI 実装規則
- GraphAI エージェント定義は `app/lib/graphai/agents/` に配置
- GraphAI グラフ定義は `app/lib/graphai/graphs/` に配置
- メディア生成パイプラインは GraphAI を使用して実装

## Supabase 実装規則
- Supabaseクライアントは `app/lib/db/client.ts` で一元管理
- データベーススキーマ定義は `app/lib/db/schema/` で管理
- ストレージ操作は `app/lib/storage/` で一元管理

## Server Actions 利用ルール
- データベース操作は基本的に Server Actions 経由で実行
- ファイル生成・処理も Server Actions を活用
- フォーム処理は React の use クライアントフックと連携