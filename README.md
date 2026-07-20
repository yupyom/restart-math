# Math Re:Start

中高生向けの数学おさらいサイトです。整数・平方根・文字式・方程式を丁寧に復習し、中学数学から数学 I / 数学 A の入口につなげます。短い単元ノート、具体物から入る動く図解、手順ごとに解く問題を分けて表示します。

教材と画面の設計方針は [design/content-architecture.md](design/content-architecture.md) にまとめています。単元・図解・問題の対応関係を変えるときは、こちらを先に確認してください。
継続中の実装と公開前チェックは [TODO.md](TODO.md) で管理します。

## フォルダ構成

```text
.
├── src/                 # 編集する正本
│   ├── index.html        # 画面の骨組み
│   ├── assets/           # CSS と画面の動き
│   └── content/          # 単元(lessons/<id>.js)・図解・問題・マップの教材データ
├── scripts/              # 内容検査と公開用ファイル生成
├── docs/                 # GitHub Pages が配信する生成済みファイル
├── design/               # 設計文書（公開用ではない）
├── TODO.md               # セッション引継ぎ用の作業台帳
└── package.json
```

`docs/` は `src/` から生成する公開用ファイルです。直接編集せず、必ず `src/` を編集してください。

## 編集と確認

Node.js が使える環境で、次を実行します。

```bash
npm run check
npm run build
```

`npm run check` は、単元・図解・問題・学習マップのリンク切れ、ID の重複、初期問題の難度設定、ローカル参照ファイルを確認します。`npm run build` は検査後に `docs/` を更新します。

ローカルで見るときは、ビルド後に `docs/` を静的サーバーで開きます。

```bash
python3 -m http.server 8000 --directory docs
```

ブラウザで `http://localhost:8000/` を開いてください。

## GitHub Pages

このリポジトリでは、GitHub Pages の配信元を `main` ブランチの `/docs` にします。

1. `npm run build` を実行し、`docs/` の更新をコミットします。
2. GitHub のリポジトリで `Settings` → `Pages` を開きます。
3. `Build and deployment` の `Source` を `Deploy from a branch` にします。
4. `Branch` は `main`、フォルダは `/docs` を選び、保存します。

設定の切替は、`docs/` を含むコミットを GitHub へ送った後に行ってください。先に切り替えると、公開中のページが一時的に見つからなくなります。

## 教材データの編集場所

- 単元の本文（範囲・要点・例・確認）: `src/content/lessons/<id>.js`（1単元1ファイル）。表示順・分野・関連づけの合成は目次の `src/content/lessons.js`
- 図解の説明と対応単元: `src/content/labs.js`
- 問題の初期難度・対応単元・対応図解: `src/content/practice.js`（出題の生成ロジックは `src/assets/js/practice-generators.js` ほか）
- 読み物、出典、事実確認の状態: `src/content/stories.js`
- 学習マップ: `src/content/topics.js`（単元データから入口を生成）
- 見た目: `src/assets/css/styles.css`
- 図解の動き・採点・画面遷移: `src/assets/js/` の役割別モジュール（図解 `labs-view.js`、採点/問題 `practice-view.js`・`practice-*.js`、遷移 `router.js`・`nav.js` など。`app.js` は初期化のみ）

数式は MathJax の TeX 記法で書きます。教材データを画面へ出すときは HTML エスケープを通すため、不等号などが HTML として誤解されず、教科書に近い数式表示を保てます。
