# restart-math 作業ガイド（運用の単一入口）

中高生の学び直し用・数学の静的サイト。`src/` が正本、`docs/` は `npm run build` で生成する GitHub Pages 公開物。
このファイルは**日々の作業手順・ツール・データ構造の現況**をまとめた入口。役割の違う文書へは重複させずリンクする:

- 設計思想（なぜこの構造か）… [design/content-architecture.md](design/content-architecture.md)
- 完了した変更の履歴 … [CHANGELOG.md](CHANGELOG.md)
- 未着手・進行中のタスク … [TODO.md](TODO.md)
- 進行中のブラッシュアップ詳細 … [PROGRESS.md](PROGRESS.md)（完了後 CHANGELOG へ畳んで削除）

> 内容が重複しそうになったら「実装の現況＝ここ」「設計意図＝architecture」「済んだこと＝CHANGELOG」「これからやること＝TODO」で振り分ける。

---

## 0. 編集の絶対ルール（事故防止・最優先）

1. **既存ツールを迂回した一括生成・一括改変をしない。** 迷ったら小さく `Read → Edit`。
   スクリプトでファイルを書き換えるのは「移行など明確に設計した一度きりの作業」に限り、必ず旧内容を退避（git commit 済み or バックアップ）してから実行し、実行後に `git diff` で結果を自分の目で確認する。
   （2026-07-21: 検証系を通さずスクリプトでデータを一括生成しかけ、git 復旧で難を逃れたインシデントあり。→ [[restart-math-edit-safety]]）
2. **Edit の `old_string` は「直前に Read / `npm run unit` で取得した実物」だけを使う。** 記憶・推測・行番号から組み立てない。
3. **行番号を信用しない。** grep の行番号や過去の Read の行番号はズレる。編集は必ず**固定文字列（ユニークな1行）をアンカー**にする。
4. **日本語・TeX を含むファイルを sed / awk / perl のワンライナーで書き換えない。** 加工は Read/Write/Edit か Node スクリプトで。存在確認の grep は必ず `-F`（固定文字列）。
5. **数式は必ず `\( ... \)` の TeX。** 素のテキストは組版されない。`title` に TeX を入れない（前後移動ナビで生TeXが出る）。`example` の `equation` にカンマを入れない。
6. **内容を変えたら必ず `npm run check`。** 通るまでコミットしない。エラーはまず自分の変更を疑う。
7. **判断に迷ったら手を止めてユーザーに確認する。** 長く作業を続けることより、方針の取り違えを防ぐことを優先。新単元の配置・番号がずれる変更・破壊的変更・設計に関わる選択は特に。

### ツール出力が乱れるときの心得
このリポジトリでの作業中、Bash や Read の**長い出力の後半が欠落・重複・捏造**することがある。対策:
- 事実確認は**単一の決定的な出力**で行う（`grep -cF`（件数）、`git diff --numstat`、`md5`、`git rev-parse` など）。複数行の grep や cat の結果を鵜呑みにしない。
- 単元本文は `npm run unit -- <id>`（短い＝乱れにくい）で全文を取り、Edit の直前に確認する。
- コミット前に必ず `git status --porcelain` と `git -c core.pager=cat diff --numstat` を数値で確認する。

---

## 1. スクリプトの使い分け（`package.json` の scripts）

| コマンド | 実体 | 用途 |
|---|---|---|
| `npm run check` | validate-content.mjs + test-practice.mjs | **内容変更後に必ず**。ID重複・リンク逆参照・数式・練習の自己受理を検査 |
| `npm run build` | build.mjs | `src/` → `docs/` を全コピー生成。**コミット前に実行**（docs も一緒に add） |
| `npm run units` | list-units.mjs | 全単元を learningPath 順で一覧（番号→id→タイトル） |
| `npm run units -- 26` / `-- 二次` | 〃 | 番号 or 部分一致で単元を特定（ファイルパスも表示） |
| `npm run unit -- <id\|番号>` | show-unit.mjs | **1単元の本文 .js を丸ごと出力**（Read の代替・行ズレ対策） |
| `npm run preview` | dev-server.mjs | `src/` を no-store 配信（`http://localhost:4319/`）。新しい表示部品の確認用 |

補足:
- 直接 `node scripts/<name>.mjs …` でも同じ（npm のヘッダ行が邪魔なときは node 直呼び）。
- `docs/` を配信して確認したいときは `python3 -m http.server 4173 --directory docs`。
- ブラウザ確認は**新しい表示部品を作ったときだけ**でよい。本文の質の確認はユーザーが行う。

---

## 2. データ構造の現況

### 単元（いちばんよく編集する）
- `src/content/lessons/<id>.js` … 各単元の本文。`export const unit = {...}`（1ファイル約30〜90行）。
- `src/content/lessons.js` … 目次。①import の列 ②`rawUnits` 配列（定義順・表示順ではない）③表示順 `learningPath` ④`lessonMetadata`（strand / practiceIds）⑤`lessonContexts` ⑥`units` 合成。
- **ユーザーが言う「単元N」= `learningPath` の N 番目**（ファイル定義順ではない）。番号は `npm run units` で引く。

単元オブジェクトの型（表示側 `lessons-view.js` が参照するキーだけが表示される。未対応キーを足しても出ない）:
```
{ id, stage, range: [], title, summary, points: [],
  example, check, checkExample?, context?, model?, connections?: [] }
```
- `example`: 文字列 / `{ type:"walkthrough", intro, steps:[{ equation?|text?, note }], conclusion }` / `{ type:"narrative", body, equation }`。
- `context`: 補足カード群（`lessons-view.js` の `contextCardsMarkup` が描画）。**入れるなら3キー必須**：`why`（オブジェクト・必須）＋ `definitions`・`connections`（配列・必須。使わなければ空配列可）。`npm run check` がこの3つを要求する（`{ title, body }` ではない）。
  - `why`: `{ question, answer, tryIt }` →「なぜこの約束？」カード。
  - `definitions`: `[{ term, meaning, example, boundary }]` →「言葉をほどく」カード（空配列ならカード非表示）。
  - `connections`: `[{ title, summary, labId?|storyId?|practiceId? }]` →「どこで役立つ？」カード。`labId`→単元の `labIds`、`storyId`→`context.storyIds`、`practiceId`→`practiceIds` に**登録必須（逆参照検査あり）**。`context.storyIds` は読み物ボタンの列で、`connections.storyId` の登録先も兼ねる。
  - ※これは下の単元直下 `connections`（「次の一手」）とは別物。現状どの単元も未使用なので、初採用時はブラウザ確認推奨。
- `model`: 図。現行の `type` は `line-graph` / `area` / `circle-angle` / `right-triangle` / `inscribed-angle`。dispatcher は `lessons-view.js` の `unitModelMarkup`。**新しい type を足すときは dispatcher に分岐＋描画関数＋（必要なら）CSS＋ブラウザ確認**、という順で行う。
- `connections`: `[{ kind, title, summary, storyId|labId }]`。`storyId`/`labId` は実在必須（`npm run check` が逆参照検査）。
- ヒント・note は一般論でなく実際の数値で語り、その単元までに教えた道具だけを前提にする。証明例は答案にそのまま書ける文章を step の `text` に1行ずつ、赤の心の声を `note` に。

### その他のコンテンツ（`src/content/`）
`stories.js`（読み物）/ `figures.js`（数学者図鑑。`JSON.stringify` 生成なのでソース上は `\\(` と2重バックスラッシュ）/ `labs.js`（図解ラボのカタログ）/ `practice.js`（問題モード設定）/ `glossary.js` / `topics.js`（学習マップ＝単元の入口。本文を複製しない）/ `search-synonyms.js`。

### 表示・ロジック（`src/assets/`）
- `js/` … 役割別モジュール。単元描画＝`lessons-view.js`（model 描画関数もここ）、図解ラボ＝`labs-view.js`、問題生成＝`practice-generators.js`/`practice-advanced.js`/`practice-extra.js`、整形＝`format.js`、状態＝`state.js`、ナビ＝`nav.js`/`router.js`。エントリは `app.js`（init のみ）。
- `css/` … 分割済み（`styles.css` に図の `.series`/`.axis` など、他に base/layout/components/lesson/practice/figures/… ）。

### 検証（`npm run check` の実体）
- `scripts/validate-content.mjs` … ID重複・`lessonId`/`labId`/`practiceId`/`storyId` 逆参照・数式に生HTMLが混ざらないか・全単元に「次の一手」があるか。`validateMathText` の対象は units/labs/stories（figures は対象外なので図鑑は目視）。
- `scripts/test-practice.mjs` … 全練習モードを多数生成し自己受理などを検査。

---

## 3. 単元本文を編集する手順（安全版）

1. `npm run units -- <キーワード>` で id と番号を確認。
2. `npm run unit -- <id>` で本文を全文取得（または Read）。**この実物から** Edit の `old_string` を作る。
3. ユニークな1行をアンカーに Edit（複数行アンカーでも、記憶でなく実物をコピー）。
4. `node --check src/content/lessons/<id>.js` → `npm run check`。
5. 表示部品を新設したときのみ `npm run preview` でブラウザ確認。
6. `npm run build` → `git add -A src docs …` → コミット（区切りごと）。

## 4. 新しい単元を追加する手順

1. 近い既存単元を `npm run unit -- <近いid>` で写し、`src/content/lessons/<newid>.js` を作る。
2. `src/content/lessons.js` の4か所を編集（各 Edit 前に該当行を Read）:
   - import 1行、`rawUnits` 配列に1行、`learningPath` の挿入位置に1行、`lessonMetadata` に `{ strand, practiceIds }` を1行。
   - `learningPath` は「使う概念が先に現れる順」。挿入で以降の単元番号がずれるのは仕様。
   - `strand` は topics.js の `categoryForLesson`/`levelForLesson` が参照。新しい `range` 値を導入したら `levelForLesson` も要更新。
3. 練習を付けるなら `practice.js` に登録し、生成器を `practice-generators.js`（追補は `practice-extra.js`）へ。step 型は `{ label, question, hint, check, answer, choices?, example?, accept? }`。
4. `npm run check`（`learningPath` と単元IDの一致もここで検査）→ `npm run build` → `npm run units` で番号を確認 → 表示に関わるので `npm run preview` で1回確認 → コミット。

## 5. コミット/ドキュメント運用

- 区切りごとに `npm run check` → `npm run build` → コミット＋プッシュ（`main` 直運用）。
- 完了した変更は [CHANGELOG.md](CHANGELOG.md) に追記（種別ごと）。未着手は [TODO.md](TODO.md) に。
- 大きめの継続作業は [PROGRESS.md](PROGRESS.md) にチェックリスト＋コミットハッシュを残し、ターンをまたいでも引き継げるようにする。
