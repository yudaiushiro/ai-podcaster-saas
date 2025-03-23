# 技術スタック

AIポッドキャストSaaSでは、以下の技術スタックを採用します。

## コア技術

- **TypeScript**: 静的型付けによる安全性と開発効率の向上
- **Node.js**: サーバーサイドJavaScript実行環境
- **GraphAI**: AIエージェントの管理と調整

## フロントエンド

- **Next.js**: Reactフレームワーク（App Router採用）
- **React**: UIコンポーネントライブラリ
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク
- **shadcn/ui**: 再利用可能なUIコンポーネント

## バックエンド

- **Next.js App Router + Server Actions**: バックエンド処理の統合
- **Supabase**: データベース、認証、ストレージの統合プラットフォーム
  - **PostgreSQL**: リレーショナルデータベース
  - **Supabase Auth**: 認証システム
  - **Supabase Storage**: ファイルストレージ

## AI/ML サービス

- **OpenAI**: スクリプト生成とTTS（音声合成）
- **Nijivoice**: 日本語TTS（音声合成）の選択肢
- **Google Imagen**: 画像生成

## メディア処理

- **FFmpeg-wasm**: ブラウザ上での動画処理

## デプロイ・インフラ

- **Vercel**: Next.jsアプリケーションのホスティング
- **Supabase**: バックエンドサービスのホスティング

## 開発ツール

- **ESLint**: コード品質チェック
- **Prettier**: コードフォーマッティング
- **Cursor**: AI支援開発環境

## テスト

- **Jest**: JavaScriptテストフレームワーク
- **React Testing Library**: Reactコンポーネントテスト
- **Playwright**: E2Eテスト

## モニタリング・ロギング

- **Vercel Analytics**: 利用状況モニタリング
- **Supabase Monitoring**: データベースパフォーマンス監視
- **Sentry**: エラートラッキング

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
- GraphAI エージェントは `ai-podcaster/src/agents/` から直接参照
- GraphAI グラフ定義は `ai-podcaster/src/` の各ファイル内部で定義されたものを参照
- メディア生成パイプラインは GraphAI を使用して実装

## Supabase 実装規則
- Supabaseクライアントは `app/lib/db/client.ts` で一元管理
- データベーススキーマ定義は `app/lib/db/schema/` で管理
- ストレージ操作は `app/lib/storage/` で一元管理

## Server Actions 利用ルール
- データベース操作は基本的に Server Actions 経由で実行
- ファイル生成・処理も Server Actions を活用
- フォーム処理は React の use クライアントフックと連携