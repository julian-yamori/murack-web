# CLAUDE.md

このファイルは Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

# アーキテクチャ概要

楽曲ライブラリ管理システムのフルスタック Web アプリケーション：
- **バックエンド**: Rust + Axum フレームワーク、SQLx による PostgreSQL、utoipa による OpenAPI ドキュメント
- **フロントエンド**: Deno + React + TypeScript + Material UI、データ取得に SWR を使用

フロントエンドは Orval を使用してバックエンドの OpenAPI 仕様から API クライアントを自動生成します。

# 開発コマンド

## バックエンド (Rust)
```bash
cd backend
cargo run                      # 開発サーバーを起動 (ポート 3000)
cargo build                    # プロジェクトをビルド
cargo fmt                      # コードをフォーマット
cargo test                     # テストを実行
```

## フロントエンド (Deno + React)
```bash
cd frontend
deno task dev                  # Vite 開発サーバーを起動
deno task build               # 本番用ビルド
deno task preview             # 本番ビルドをプレビュー
deno task lint                # 型チェックとリント
deno task serve               # ビルドファイルを配信
deno task gen-api             # バックエンドの OpenAPI 仕様から API クライアントを生成
```

# API コード生成ワークフロー

フロントエンドは Orval を使って TypeScript API クライアントを生成：
1. バックエンドサーバーを起動 (backend/ で `cargo run`)
2. frontend/ で `deno task gen-api` を実行 - http://0.0.0.0:3000/api/docs/openapi.json から OpenAPI 仕様を取得
3. `src/gen/` に生成ファイルが作成される (SWR フックと Zod スキーマの両方)
4. React コンポーネントで `useGetTagGroups` などの生成されたフックをインポート

# データベース設定

バックエンドは PostgreSQL 接続が必要です。`backend/.env` で `DATABASE_URL` 環境変数を設定：
```
DATABASE_URL=postgresql://user:password@localhost/murack_web
```

# プロジェクト構造メモ

- バックエンドはハンドラー、モデル、データベースモジュールを分離したモジュラー構造
  - 機能別のモジュール構造に変更するかも
- バックエンド用に生成された API コードは `src/gen/`
- Material UI テーマは `src/theme.ts` で設定
- API 呼び出し用のカスタム fetch 設定は `src/custom_fetch.ts`

# 開発のコツ

- バックエンドのスキーマ変更後は必ず API クライアントを再生成
- バックエンドは `/api/docs/openapi.json` で OpenAPI 仕様を自動配信
- フロントエンドは生成ファイルをリント対象から除外 (deno.jsonc の lint 設定参照)
- 一貫したコードフォーマットのため `cargo fmt` と `deno fmt` を使用