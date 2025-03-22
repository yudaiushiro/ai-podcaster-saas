# AI Podcaster SaaS

AIを活用して記事やテキストからポッドキャストや動画コンテンツを自動生成するSaaSプラットフォーム。

## 📑 概要

AI Podcaster SaaSは、ユーザーがURLまたはテキストを貼り付けるだけで、AIが自動的にポッドキャスト（音声のみ）や動画コンテンツを生成し、運営側がキュレーションして複数の自社チャンネル（PodcastプラットフォームやYouTubeなど）で配信できるサービスです。

## ✨ 主な機能

- **コンテンツ自動生成**: 
  - URL/テキスト入力 → スクリプト生成 → 音声合成 → 画像生成 → 動画生成
  - 各ステップはGraphAIを活用した非同期処理で実行

- **直感的なUI/UX**:
  - シンプルなインターフェースで簡単にコンテンツ作成
  - スクリプト編集やプレビュー機能

- **コンテンツ管理**:
  - 生成したコンテンツの履歴保存・編集
  - 音声/動画のダウンロード

- **運営側機能**:
  - コンテンツの承認/却下フロー
  - 承認されたコンテンツの自動配信
  - ユーザー管理とアナリティクス

## 🛠 技術スタック

- **フロントエンド**: Next.js, React, Tailwind CSS, shadcn/ui
- **バックエンド**: Next.js App Router + Server Actions
- **データベース**: Supabase (PostgreSQL)
- **認証**: NextAuth.js + Supabase Auth
- **ストレージ**: Supabase Storage
- **AI/ML**:
  - GraphAI: AIエージェント管理と調整
  - Claude (Anthropic): スクリプト生成
  - ElevenLabs: 音声合成
  - StabilityAI: 画像生成
- **メディア処理**: FFmpeg

## 🚀 セットアップ手順

### 前提条件

- Node.js v20.0.0以上
- npm または Yarn
- Supabaseアカウント
- 各種AI API キー (Anthropic, ElevenLabs, StabilityAI など)

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/yourusername/ai-podcaster-saas.git
cd ai-podcaster-saas
```

2. 依存パッケージをインストール
```bash
npm install
# または
yarn install
```

3. 環境変数の設定
`.env.example`をコピーして`.env`ファイルを作成し、必要な環境変数を設定します。

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
STABILITY_API_KEY=your-stability-key
ELEVENLABS_API_KEY=your-elevenlabs-key

# Other
# ...
```

4. Supabaseのセットアップ
`/setup/supabase.sql`を使用してSupabaseでデータベーステーブルとRLSポリシーを設定します。

5. 開発サーバーの起動
```bash
npm run dev
# または
yarn dev
```

アプリケーションは http://localhost:3000 で実行されます。

## 📖 使い方

### ユーザー向け

1. **アカウント作成/ログイン**
   - メールアドレスとパスワードでアカウントを作成
   - 利用規約と配信許諾に同意

2. **コンテンツ生成**
   - ダッシュボードから「New Content」をクリック
   - URL/テキストを入力フォームに貼り付け
   - 「音声生成」または「動画生成」ボタンをクリック
   - 生成処理の進行状況を確認
   - 完了したらプレビューで確認

3. **コンテンツ編集**
   - 生成されたスクリプトを編集可能
   - 再生成ボタンで内容を更新
   - 音声や動画をダウンロード

4. **コンテンツ履歴**
   - 左サイドバーから過去の作品を選択して編集

### 管理者向け

1. **コンテンツ承認**
   - 管理者ダッシュボードから新規コンテンツを確認
   - 品質チェック後、承認または却下

2. **配信管理**
   - 承認済みコンテンツの配信設定
   - 配信先チャンネルの選択

3. **ユーザー管理**
   - ユーザーリストの閲覧・管理
   - 権限設定

## 💻 開発ガイド

### プロジェクト構造

```
/
├── app/                                # Next.jsのアプリケーションディレクトリ
│   ├── api/                            # APIエンドポイント
│   ├── (auth)/                         # 認証関連ページ
│   ├── (dashboard)/                    # ログイン後のダッシュボード
│   ├── admin/                          # 管理者用画面
│   ├── components/                     # コンポーネント
│   ├── hooks/                          # カスタムフック
│   ├── lib/                            # ユーティリティ
│   │   ├── api/                        # API関連処理
│   │   ├── auth/                       # 認証処理
│   │   ├── db/                         # データベース
│   │   ├── graphai/                    # GraphAI関連処理
│   │   ├── storage/                    # ストレージ処理
│   │   └── utils/                      # 共通関数
│   ├── actions/                        # Server Actions
│   └── ...
├── public/                             # 静的ファイル
├── setup/                              # セットアップスクリプト
└── ...
```

### 開発フロー

1. 新機能のブランチを作成
```bash
git checkout -b feature/your-feature-name
```

2. 実装とテスト
3. プルリクエスト作成
4. コードレビュー
5. マージ

## 🤝 貢献ガイドライン

1. フォークしてプルリクエストを送信
2. コーディング規約に従う
   - ESLintとPrettierを使用
   - コンポーネント命名規則を遵守
3. テストを追加

## 📄 ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) のもとで公開されています。

## 📞 サポート

質問やサポートが必要な場合は、Issueを作成するか、以下の連絡先までお問い合わせください：

- Email: support@example.com

---

© 2025 AI Podcaster SaaS Team 