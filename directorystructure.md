# ディレクトリ構成

以下のディレクトリ構造に従って実装を行ってください：

```
/
├── app/                                # Next.jsのアプリケーションディレクトリ
│   ├── api/                            # APIエンドポイント
│   │   ├── auth/                       # 認証関連API (Supabase Auth)
│   │   │   └── route.ts
│   │   ├── content/                    # コンテンツ生成API
│   │   │   ├── audio/                  # 音声生成API
│   │   │   │   └── route.ts
│   │   │   ├── video/                  # 動画生成API
│   │   │   │   └── route.ts
│   │   │   └── script/                 # スクリプト生成API
│   │   │       └── route.ts
│   │   └── admin/                      # 管理者用API
│   │       └── route.ts
│   ├── (auth)/                         # 認証関連ページ
│   │   ├── login/                      # ログインページ
│   │   │   └── page.tsx
│   │   └── register/                   # 登録ページ
│   │       └── page.tsx
│   ├── (dashboard)/                    # ログイン後のダッシュボード
│   │   ├── layout.tsx                  # ダッシュボードレイアウト
│   │   ├── page.tsx                    # メインダッシュボード
│   │   ├── new/                        # 新規コンテンツ作成
│   │   │   └── page.tsx
│   │   ├── content/                    # コンテンツ詳細・編集
│   │   │   └── [id]/                   # コンテンツID
│   │   │       └── page.tsx
│   │   └── settings/                   # ユーザー設定
│   │       └── page.tsx
│   ├── admin/                          # 管理者用画面
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # 管理ダッシュボード
│   │   └── content/                    # コンテンツ承認・管理
│   │       └── page.tsx
│   ├── components/                     # アプリケーションコンポーネント
│   │   ├── ui/                         # 基本UI（button, card等）
│   │   ├── layout/                     # レイアウト関連
│   │   ├── auth/                       # 認証関連
│   │   ├── content/                    # コンテンツ生成フォーム
│   │   │   ├── AudioGenerationForm.tsx # 音声生成フォーム
│   │   │   ├── VideoGenerationForm.tsx # 動画生成フォーム
│   │   │   ├── ScriptEditor.tsx        # スクリプト編集
│   │   │   └── PreviewPlayer.tsx       # プレビューコンポーネント
│   │   └── admin/                      # 管理者用コンポーネント
│   ├── hooks/                          # カスタムフック
│   │   ├── useAuth.ts                  # 認証フック
│   │   ├── useContent.ts               # コンテンツ管理フック
│   │   └── useMediaGeneration.ts       # メディア生成フック
│   ├── lib/                            # ユーティリティ
│   │   ├── api/                        # API関連処理
│   │   │   ├── client.ts               # API クライアント (変更禁止)
│   │   │   ├── types.ts                # 型定義 (変更禁止)
│   │   │   └── config.ts               # 環境設定 (変更禁止)
│   │   ├── auth/                       # 認証処理 (Supabase Auth)
│   │   │   └── auth-utils.ts           # 認証ユーティリティ
│   │   ├── db/                         # データベース
│   │   │   ├── schema/                 # Supabase スキーマ定義
│   │   │   │   ├── content.ts          # コンテンツテーブル
│   │   │   │   └── users.ts            # ユーザーテーブル
│   │   │   ├── client.ts               # Supabaseクライアント
│   │   │   └── queries.ts              # データベースクエリ
│   │   ├── storage/                    # ストレージ処理 (Supabase Storage)
│   │   └── utils/                      # 共通関数
│   ├── actions/                        # Server Actions
│   │   ├── auth.ts                     # 認証アクション
│   │   ├── content.ts                  # コンテンツ管理アクション
│   │   └── admin.ts                    # 管理アクション
│   ├── styles/                         # スタイル定義
│   ├── favicon.ico                     # ファビコン
│   ├── globals.css                     # グローバルスタイル
│   ├── layout.tsx                      # ルートレイアウト
│   └── page.tsx                        # ホームページ (ランディング)
├── ai-podcaster/src/                   # AIポッドキャスト生成コア
│   ├── agents/                         # GraphAI エージェント
│   │   ├── tts_nijivoice_agent.ts      # にじボイスTTSエージェント
│   │   ├── tts_openai_agent.ts         # OpenAI TTSエージェント
│   │   ├── add_bgm_agent.ts            # BGM追加エージェント
│   │   └── combine_files_agent.ts      # ファイル結合エージェント
│   ├── main.ts                         # 音声ファイル生成メイン処理
│   ├── movie.ts                        # 動画ファイル生成処理
│   ├── images.ts                       # 画像ファイル生成処理
│   ├── imagep.ts                       # imagePrompt追加処理
│   ├── split.ts                        # セリフ分割処理
│   ├── fixtext.ts                      # セリフ修正処理
│   ├── translate.ts                    # 翻訳処理
│   ├── type.ts                         # 型定義
│   └── sharp.ts                        # 画像処理ユーティリティ
├── public/                             # 静的ファイル
│   ├── images/                         # 画像ファイル
│   └── sounds/                         # デフォルトサウンドファイル (BGM等)
├── scripts/                            # スクリプトサンプル
├── output/                             # 生成ファイル出力先
├── music/                              # BGM音楽ファイル
├── middleware.ts                       # Next.js ミドルウェア (認証など)
├── node_modules/                       # 依存パッケージ
├── .git/                               # Gitリポジトリ
├── .cursor/                            # Cursor設定
├── package.json                        # プロジェクト設定
├── package-lock.json                   # 依存関係ロックファイル
├── tsconfig.json                       # TypeScript設定
├── next-env.d.ts                       # Next.js型定義
├── next.config.mjs                     # Next.js設定
├── postcss.config.mjs                  # PostCSS設定
├── tailwind.config.mjs                 # Tailwind設定
├── eslint.config.mjs                   # ESLint設定
├── .env                                # 環境変数 (ローカル開発用)
├── .env.example                        # 環境変数サンプル
└── .gitignore                          # Git除外設定
```

### 配置ルール

#### コンポーネント配置
- 共通UIコンポーネント → `app/components/ui/`
- レイアウト関連 → `app/components/layout/`
- 認証関連 → `app/components/auth/`
- コンテンツ生成フォーム → `app/components/content/`
- 管理者用コンポーネント → `app/components/admin/`

#### API・バックエンド処理
- APIエンドポイント → `app/api/[endpoint]/route.ts`
- Server Actions → `app/actions/`
- データベース処理 → `app/lib/db/`
- ストレージ処理 → `app/lib/storage/`

#### 認証
- 認証ページ → `app/(auth)/`
- 認証処理 → `app/lib/auth/`
- 認証API → `app/api/auth/`

#### コンテンツ生成コア
- GraphAIエージェント → `ai-podcaster/src/agents/` から直接参照
- 音声生成処理 → `ai-podcaster/src/main.ts` から直接参照
- 画像生成処理 → `ai-podcaster/src/images.ts` から直接参照
- 動画生成処理 → `ai-podcaster/src/movie.ts` から直接参照
- スクリプト加工 → `ai-podcaster/src/fixtext.ts`, `ai-podcaster/src/imagep.ts`, `ai-podcaster/src/split.ts` から直接参照

#### ルーティング
- ダッシュボード → `app/(dashboard)/`
- 管理者ページ → `app/admin/`
- ランディングページ → `app/page.tsx`

この構造は、Next.js App RouterとServer Actions、Supabase、既存のGraphAIコードを最適に組み合わせ、コンテンツ生成システムに対応したものです。