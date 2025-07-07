# 体重管理アプリ

個人用の体重管理WebアプリケーションをNext.js + Vercel KVで構築したものです。

## 機能

- 体重・筋肉量・体脂肪率の記録
- BMI自動計算
- グラフによるデータ可視化
- 目標設定と達成状況の表示
- レスポンシブ対応

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript
- **バックエンド**: Next.js API Routes + Vercel KV
- **UIライブラリ**: shadcn/ui + Tailwind CSS
- **グラフライブラリ**: Recharts
- **開発環境**: Docker
- **本番環境**: Vercel

## 開発環境セットアップ

### 前提条件

- Docker Desktop がインストールされていること
- Git がインストールされていること

### セットアップ手順

1. リポジトリをクローン
```bash
git clone <repository-url>
cd weight-management-app2
```

2. 環境変数の設定
```bash
cp .env.local.example .env.local
```
`.env.local` ファイルを編集し、Vercel KVの接続情報を設定してください。

3. Dockerコンテナの起動
```bash
docker-compose up -d
```

4. ブラウザでアクセス
```
http://localhost:3000
```

### 開発コマンド

```bash
# コンテナの起動
docker-compose up -d

# コンテナの停止
docker-compose down

# ログの確認
docker-compose logs -f

# コンテナ内でコマンド実行
docker-compose exec app npm run <command>

# コンテナの再ビルド
docker-compose build
```

## Vercel KV設定

### 本番環境での設定

1. Vercelダッシュボードでプロジェクトを作成
2. Storage > KV > Create Databaseで新しいKVデータベースを作成
3. 環境変数タブから接続情報をコピー
4. `.env.local` に以下の環境変数を設定：
   - `KV_URL`: KVデータベースのURL
   - `KV_REST_API_URL`: REST APIのURL
   - `KV_REST_API_TOKEN`: REST APIのトークン
   - `KV_REST_API_READ_ONLY_TOKEN`: 読み取り専用トークン

### ローカル開発での設定

ローカル開発では、実際のVercel KVに接続するか、モックKVクライアントを使用できます。

1. **実際のVercel KVに接続する場合**：
   - 上記の環境変数を`.env.local`に設定
   - Dockerコンテナ内でVercel CLIを使用してログイン：
     ```bash
     docker-compose exec app vercel login
     ```

2. **モックKVクライアントを使用する場合**：
   - 環境変数を空のままにしておく
   - アプリケーションが自動的にモックモードで動作

## 本番環境へのデプロイ

1. GitHubにコードをプッシュ
2. VercelでGitHubリポジトリを連携
3. 環境変数を設定
4. デプロイ実行

## 開発フロー

開発の詳細なフェーズについては、[CLAUDE.md](./CLAUDE.md)を参照してください。

## ライセンス

個人用プロジェクト