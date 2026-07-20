# restart-math 作業ガイド

中高生の学び直し用・数学の静的サイト。`npm run build` で src/ → docs/ へコピーして GitHub Pages で公開。
コンテンツの中身（本文の質）の確認はユーザー本人が行う。ブラウザでの表示確認は「新しい表示部品を作ったとき」だけでよい。
作業の区切りごとに `npm run check` → `npm run build` → コミット＋プッシュ。

## 編集の絶対ルール（編集事故・マルチバイト事故の防止）

- 日本語を含むファイルの加工は Read / Write / Edit ツールか Node スクリプトだけで行う。
  sed / awk / perl のワンライナーで日本語を書き換えない。存在確認の grep は `-F`（固定文字列）を使う。
- **編集前に対象ファイル全体を Read し、Edit の old_string には直前に読んだ実物の文字列だけを使う**（記憶や推測から old_string を組み立てない）。
- 単元本文は 1単元1ファイル（下記）。大きなファイルを丸ごと Read する必要はもう無い。
- 内容を変えたら必ず `npm run check`。エラー時は自分の変更を疑い、通るまでコミットしない。

## 単元データ（いちばんよく編集する場所）

- `src/content/lessons/<id>.js` … 各単元の本文。`export const unit = {...}`（1ファイル約40〜90行）。
- `src/content/lessons.js` … 目次。import の列・表示順 `learningPath`・メタデータ（strand / practiceIds / lessonContexts）の合成。
  **ユーザーが言う「単元N」= learningPath の N 番目**（ファイル定義順ではない）。
- 番号→id→ファイルの対応は `npm run units`。絞り込みは `npm run units -- 26` や `npm run units -- 二次`。

単元オブジェクトの主な型:
`{ id, stage, range: [], title, summary, points: [], example, check, checkExample?, model?, connections?: [] }`

- `example` は文字列か walkthrough 型 `{ type: "walkthrough", intro, steps: [{ equation?|text?, note }], conclusion }`。
- 数式は必ず `\( ... \)` の TeX（素のテキストは組版されない）。`title` に TeX 禁止。`equation` にカンマ禁止。
- `connections` の storyId / labId は stories.js / labs.js に実在するものだけ（npm run check が検査）。
- ヒント・note は一般論でなく実際の数値で語る。その単元までに教えた道具だけを前提にする。
- 証明の例は、答案にそのまま書ける完全な文章を step の text で1行ずつ示し、赤の心の声（note）を添える。

## 新しい単元の追加手順

1. 既存の近い単元ファイルをひな型に `src/content/lessons/<id>.js` を作る
2. `src/content/lessons.js` で import 1行＋ rawUnits 配列 1行＋ learningPath の挿入位置 1行＋ lessonMetadata（strand / practiceIds）を追加
   （以降の単元番号がずれるのは仕様。learningPath は「使う概念が先に現れる順」）
3. 練習問題を付ける場合: `src/content/practice.js` のカタログに登録し、
   生成器を `src/assets/js/practice-generators.js`（追補は practice-extra.js）へ追加。
   step 型: `{ label, question, hint, check, answer, choices?, example?, accept? }`
4. `npm run check` → `npm run build` → コミット

## その他のファイル地図

- `src/content/` … stories.js（読み物）/ figures.js（数学者図鑑。JSON.stringify 生成なのでバックスラッシュ2重）/
  labs.js（図解ラボのカタログ）/ practice.js / glossary.js / topics.js
- `src/assets/js/` … 役割別16モジュール。単元ページ描画 = lessons-view.js（model 描画関数もここ）、
  図解ラボ = labs-view.js、問題生成 = practice-generators.js / practice-advanced.js / practice-extra.js、
  整形 = format.js、状態 = state.js、ナビ = nav.js / router.js
- `scripts/validate-content.mjs` + `scripts/test-practice.mjs` … `npm run check` の実体
- `topics.js` の levelForLesson は range 文字列（中1〜中3 / 数I / 数A / 数B）でレベル帯を決める。新しい range 値を導入したら要更新。
