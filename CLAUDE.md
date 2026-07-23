# restart-math 作業ガイド（運用の単一入口）

中高生の学び直し用・数学の静的サイト。`src/` が正本、`docs/` は `npm run build` で生成する GitHub Pages 公開物。
このファイルは**日々の作業手順・ツール・データ構造の現況**をまとめた入口。役割の違う文書へは重複させずリンクする:

- 設計思想（なぜこの構造か）＋ リポジトリ構造・正本→公開物の生成モデル … [design/content-architecture.md](design/content-architecture.md)（§3 が構造・生成モデルの正本）
- 完了した変更の履歴 … [CHANGELOG.md](CHANGELOG.md)
- 未着手・進行中のタスク … [TODO.md](TODO.md)
- 継続作業トラッカー（ターン・セッションをまたぐ作業＝ブラッシュアップ・点検など。要約は完了時に CHANGELOG へ畳む） … [PROGRESS.md](PROGRESS.md)（現在アクティブな継続作業はなし。完了フェーズ A/B/C の詳細アーカイブとして残置。次の大きめ継続作業はここに新フェーズを足す）

> 内容が重複しそうになったら「作業手順・編集先＝ここ」「構造・生成モデル・設計意図＝architecture」「済んだこと＝CHANGELOG」「これからやること＝TODO」「継続作業の途中経過＝PROGRESS」で振り分ける。同じ事実を二重に持たない（片側だけ陳腐化する事故を防ぐ）。

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
| `npm run shot -- <ルート> [セレクタ]` | shot.mjs | **ヘッドレスの system Chrome で確実にスクショ**（要素単位・MathJax 組版待ち）。PNG を `.shots/` に保存し Read で確認 |
| `npm run overflow -- <ルート...> [--w 360]` | overflow-check.mjs | **モバイル幅で横はみ出し（横スクロール）を検査**。ページの scrollWidth と原因要素を数値報告。長い数式の版面割れの回帰確認に使う（複数ルート可・exit code 2 で NG） |

補足:
- 直接 `node scripts/<name>.mjs …` でも同じ（npm のヘッダ行が邪魔なときは node 直呼び）。
- `docs/` を配信して確認したいときは `python3 -m http.server 4173 --directory docs`。
- ブラウザ確認は**新しい表示部品を作ったときだけ**でよい。本文の質の確認はユーザーが行う。
- **表示部品の視覚確認は `npm run shot` が確実**（アプリ内ブラウザペインのスクショはスクロール同期ズレ・ペイン非表示でブレやすい）。例：`npm run shot -- lessons/quadratic-inequalities ".parabola-figure"` で図だけを切り出して保存。正しさの判定は `read_page`/DOM アサーション（要素構造・computed style・path データ）を主軸にし、`shot` は見た目の確認・共有に使う。`playwright-core`（devDependency）＋システム Chrome を使うので専用ブラウザの DL は不要。撮った PNG は `.shots/`（gitignore 済み）に出る。

---

## 2. データ構造の現況

> **リポジトリ全体の構造と「正本→公開物」の生成モデル（`src` が唯一の正本／`docs` は `build` による完全コピーでバンドルなし／編集は `src` だけ）は [design/content-architecture.md](design/content-architecture.md) §3 が正本。** 本節は「その構造を実際にどう編集するか」の対応表に徹する。迷ったら §3 に戻る。

### 単元（いちばんよく編集する）
- `src/content/lessons/<id>.js` … 各単元の本文。`export const unit = {...}`（1ファイル約30〜90行）。
- `src/content/lessons.js` … 目次。①import の列 ②`rawUnits` 配列（定義順・表示順ではない）③表示順 `learningPath` ④`lessonMetadata`（strand / practiceIds）⑤`lessonContexts` ⑥`units` 合成。
- **ユーザーが言う「単元N」= `learningPath` の N 番目**（ファイル定義順ではない）。番号は `npm run units` で引く。

単元**本文ファイル**（`lessons/<id>.js`）に書くキー（表示側 `lessons-view.js` が参照。未対応キーを足しても出ない）:
```
{ id, stage, range: [], title, summary, points: [],
  example, check, checkExample?, model? }
```
これに `lessons.js` が合成して付与する（**本文には書かない**）: `order` / `nextLessonId` / `labIds` / `strand` / `practiceIds` / `context`（`lessonContexts` から）/ `recommendedLabId`・`recommendedPracticeId`・`recommendedNextLessonId`（＝「次の一手」）。
- `example`: 文字列 または オブジェクト（型は `assets/js/format.js` の `workedExampleMarkup` が判定）。5系統: 文字列（`=`・`\Rightarrow` を含むと自動で式に整形、無ければ本文表示） / `{ type:"aligned-steps", intro?, rows:[], conclusion? }` / `{ type:"walkthrough", intro?, steps:[{ equation?|text?, note? }], conclusion? }` / `{ type:"word-problem", prompt, explanation, equation }` / `{ type:"narrative", body, equation? }`。
- `context`: 補足カード群（**本文ではなく `lessons.js` の `lessonContexts` に単元idで登録する**。本文に書いても合成時に上書きされる。`lessons-view.js` の `contextCardsMarkup` が描画。現状 約25単元で使用中）。**入れるなら3キー必須**：`why`（オブジェクト・必須）＋ `definitions`・`connections`（配列・必須。使わなければ空配列可）。`npm run check` がこの3つを要求する（`{ title, body }` ではない）。
  - `why`: `{ question, answer, tryIt }` →「なぜこの約束？」カード。
  - `definitions`: `[{ term, meaning, example, boundary }]` →「言葉をほどく」カード（空配列ならカード非表示）。
  - `connections`: `[{ kind, title, summary, labId?|storyId?|practiceId? }]` →「どこで役立つ？」カード。`kind` は分類ラベル（history/model/notation… 現状は描画に未使用だが全エントリに付ける慣習）。`labId`→単元の `labIds`、`storyId`→`context.storyIds`、`practiceId`→`practiceIds` に**登録必須（逆参照検査あり）**。`context.storyIds` は読み物ボタンの列で、`connections.storyId` の登録先も兼ねる。
  - ※ ここでの `connections`（＝`context.connections`）は「どこで役立つ？」カード用で、「次の一手」（下記 `recommended*`）とは別物。
- `model`: 図。dispatcher は `lessons-view.js` の `unitModelMarkup`。現行の `type` は5種（`inscribed-angle` は無い）。共通キー＝`title`（生TeX不可・`escapeHtml`）・`description`・`formula?`（式。`workedExampleMarkup` で描画）。type 別の追加キー: `circle-angle`／`right-triangle`＝図は固定でラベルも SVG 埋め込み（追加キー無し）、`line-graph`＝`a`・`b`（`y=ax+b` を描画）、`area`＝`height`・`firstWidth`・`secondWidth`、`parabola`＝`a`（開きの符号。正で下に凸）・`roots`（x切片＝解の配列 `[r1,r2]`）・`highlight?`（`"outside"`／`"between"` で二次不等式の解の範囲を塗る。省略で交点のみ）。各 type のデータ形の正本は `lessons-view.js` の描画関数。**新しい type を足すときは dispatcher に分岐＋描画関数＋（必要なら）CSS＋ブラウザ確認**、という順で行う。
- 「次の一手」＝ `lessons.js` が合成する `recommendedLabId` / `recommendedPracticeId` / `recommendedNextLessonId`（本文に書かない）。`npm run check` が各単元に最低1つあるか検査する。**トップレベルの `connections` フィールドは存在しない**（関連リンクは `context.connections` に置く）。
- ヒント・note は一般論でなく実際の数値で語り、その単元までに教えた道具だけを前提にする。証明例は答案にそのまま書ける文章を step の `text` に1行ずつ、赤の心の声を `note` に。

### その他のコンテンツ（`src/content/`）
**単元と同じく「1テーマ1ファイル＋index が合成」の型**（2026-07-22 に分割）。各 index は import と一覧・カタログの合成だけを持ち、**本体データは per-file を編集する**:
- `figures.js`（index）＋ `figures/<id>.js`（数学者1人1ファイル。`export const figure`。数式はソース上 `\\(` の2重バックスラッシュ）。index が `figures` 配列・`figureCatalog` を合成。
- `stories.js`（index。`storySourcePolicy` はここに原文保持）＋ `stories/<id>.js`（読み物1件。`export const story`）。index が `stories`・`storyCatalog` を合成。
- `labs.js`（index。単元→図解の対応表 `unitLabRefs` はここに原文保持）＋ `labs/<id>.js`（図解1件。`export const lab`）。index が `labs`・`labCatalog` を合成。
- `practice.js`（index。発展設定 `advancedPolicies` と learningPath 順の並べ替えはここ）＋ `practice/<id>.js`（出題設定1モード。`export const practice`）。index が `rawPracticeCatalog` を組み立て `practiceCatalog` を合成。

その他（分割していない）: `glossary.js` / `topics.js`（学習マップ。**`units` から自動生成するので手で足さない**。`category`＝`categoryForLesson(unit)`＝キー〔number/algebra/function/geometry/data/logic/sequence〕、`level`＝`levelForLesson(range)`＝1〜5。未知の strand は algebra・未知の range は level 1 に落ちるので、新しい strand 値→`categoryForLesson`、新しい range 値→`levelForLesson` を要更新。**注意**：`categoryForLesson` は単純な strand→category ではない。strand が `数と式`／`数学と人間の活動`／`総合` の単元は、`categoryForLesson` 内の**固定 id リストに載っているものだけ `number`**、残りは `algebra` に落ちる。数と式系の新単元を「数と計算(number)」に入れたいなら、この id リストに新 id を足す〔→ §4-2 の注記〕）/ `search-synonyms.js`。

### 表示・ロジック（`src/assets/`）
- `js/` … 役割別モジュール（エントリは `app.js`＝init のみ）。単元描画＝`lessons-view.js`（model 描画関数もここ）、図解ラボ＝`labs-view.js`、問題＝`practice-view.js`＋生成器 `practice-generators.js`/`practice-advanced.js`/`practice-extra.js`、読み物＝`stories-view.js`、図鑑＝`figures-view.js`、学習マップ＝`map-view.js`、検索＝`search-view.js`、用語リンク＝`glossary-links.js`、ページ送り＝`pager.js`、整形＝`format.js`/`math-utils.js`、状態＝`state.js`、ナビ＝`nav.js`/`router.js`、雑多＝`utils.js`。
- 検索の索引（`search-view.js`）が対象にするのは units・labs・practice・stories・figures の**5種**。新しい種別を検索に含めるには import＋forEach を既存パターンで追加する。
- `css/` … `styles.css` は**役割ごとの部分ファイルを記述順（＝カスケード順）に読み込む `@import` 集約ファイル**（2026-07-22 に分割）。`index.html` は従来どおり `styles.css` だけを `<link>` する。**個々のスタイルの編集は部分ファイルへ**（`base.css`／`home.css`／`shell.css`／`lessons.css`／`labs.css`／`lab-diagrams.css`〔ラボ用SVG図〕／`practice.css`／`stories-map.css`／`responsive.css`〔横断メディアクエリ〕／`figures.css`）。**読み込み順を変えると見た目が変わる**ので `styles.css` の `@import` の順序は保つ。分割は原本の連続バイトスライス（連結＝原本 md5一致）で、labs/practice/検索の規則は現状の並びのまま一部混在する（例: 練習の操作UIは `labs.css` にある）。

### 検証（`npm run check` の実体）
- `scripts/validate-content.mjs` … ID重複・`lessonId`/`labId`/`practiceId`/`storyId` 逆参照・`example` の型と構造・`context` の3キーと逆参照・読み物の出典/事実確認・肖像ファイルの実在・数式の区切り漏れや生HTML混入・全単元に「次の一手」があるか。`validateMathText` の対象は **units/labs/stories/figures**（figures も対象。`achievement`/`profile`/`contributions` を検査）。検査項目の網羅は design §7 を参照。
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

1. 新規前に `npm run units -- <キーワード>`（またはアプリ内検索）で**同種単元が無いか確認**する。近い既存単元を `npm run unit -- <近いid>` で写し、`src/content/lessons/<newid>.js` を作る。
2. `src/content/lessons.js` の4か所を編集（各 Edit 前に該当行を Read）:
   - import 1行、`rawUnits` 配列に1行、`learningPath` の挿入位置に1行、`lessonMetadata` に `{ strand, practiceIds }` を1行。
   - `learningPath` は「使う概念が先に現れる順」。挿入で以降の単元番号がずれるのは仕様。
   - `strand` は topics.js の `categoryForLesson`/`levelForLesson` が参照。新しい `strand` 値は `categoryForLesson`、新しい `range` 値は `levelForLesson` も要更新（未対応だと algebra／level 1 に落ちる）。学習マップは units から自動生成なので手当ては不要。
   - **数と式系の新単元を「数と計算(number)」カテゴリに入れたいときは追加作業が要る**：strand が `数と式`／`数学と人間の活動`／`総合` の単元は、`topics.js` の `categoryForLesson` にある**固定 id リストに載っているものだけ `number`**、残りは `algebra` に落ちる。number に入れたい新 id をこのリストに足す（strand だけ合わせても number にはならない）。
3. **新単元には対の練習を付けるのが原則**（学び直しは「読む→自分で解く」で定着する。単元だけ足して練習を空けない）。§4.6「練習」の手順で `practice/<id>.js`＋`practice.js` 登録＋生成器＋`lessonMetadata.practiceIds` を揃える。**同じ push で練習まで作れないときは、必ず [TODO.md](TODO.md) に「〈単元名〉の練習を作る」を起票してからコミットする**（練習も TODO もない単元を残さない）。証明・読み物系など練習になじまない単元は、その旨をコミットメッセージか TODO に一言残して「意図的に練習なし」と分かるようにする（黙って空けない）。
4. **必須の関連作業**：検索で見つかるよう `search-synonyms.js`／`glossary.js` にこの単元の語を必要に応じて足す。（任意）補足カードは `lessonContexts`、図解リンクは `labs.js` 側の `lessonIds` に単元 id を足す。
5. `npm run check`（`learningPath` と単元IDの一致もここで検査）→ `npm run build` → `npm run units` で番号を確認 → 表示に関わるので `npm run preview` で1回確認 → コミット。

## 4.5 id のリネーム・削除（波及チェックリスト）

id（単元・図解・問題・読み物・数学者）を変える／消すときは、**その id を参照している箇所をすべて直してから** `npm run check` を通す。check は逆参照の欠落（dangling）を検出するので、**残参照ゼロ＝check が通る**ことを完了条件にする（記憶で数えず check に確認させる）。まず `grep -rF -- "<old-id>" src/` で洗い出すと速い。

参照される側の一覧（種別ごとの直し先）。※コンテンツは per-file 分割済み（figures/stories/labs/practice も 1件1ファイル）。**id 自体は index（`<type>.js`）の import 行・配列にも出る**ので、リネーム／削除ではそこも直す:

- **単元 `lessonId`** … `lessons.js`（import 行・`rawUnits`・`learningPath`・`lessonMetadata`・`lessonContexts` のキー）／`labs/<id>.js` の `lessonIds`／`practice/<id>.js` の `lessonIds`（＋`labs.js`・`practice.js` の `unitLabRefs`）／`stories/<id>.js` の `lessonIds`／`figures/<id>.js` の `related.lessons`／`glossary.js` の `lessonId`。※`topics.js` は units から自動生成なので追随（手当て不要）。
- **図解 `labId`** … `labs/<id>.js` の `id`（＋`labs.js` index の import・`labs` 配列）／`labs.js` の `unitLabRefs`／`practice/<id>.js` の `labIds`／`stories/<id>.js` の `labIds`／`figures/<id>.js` の `related.labs`／`lessonContexts`（lessons.js）の `connections.labId`。※単元の `labIds`・`recommendedLabId` は `unitLabRefs`（labs.js）由来で自動追随。
- **問題 `practiceId`** … `practice/<id>.js` の `id`（＋`practice.js` index の import・`rawPracticeCatalog`・`advancedPolicies` のキー）／`lessonMetadata`（lessons.js）の `practiceIds`／`labs/<id>.js` の `practiceIds`／`stories/<id>.js` の `practiceIds`／`lessonContexts` の `connections.practiceId`。
- **読み物 `storyId`** … `stories/<id>.js` の `id`（＋`stories.js` index の import・`stories` 配列）／`lessonContexts` の `storyIds` と `connections.storyId`／`figures/<id>.js` の `related.stories`。
- **数学者 `figureId`** … `figures/<id>.js` の `id`（＋`figures.js` index の import・`figures` 配列）／他 `figures/<id>.js` の `related.figures`。

削除は上の参照を消してから本体エントリを消す。リネームは新旧を漏れなく置換する。仕上げに `npm run check` →（通れば）`npm run build`。

## 4.6 練習・図解・読み物・図鑑を追加する

各種別の**データ型の例**は [design/content-architecture.md](design/content-architecture.md) §4.2〜§4.5、ここは**手順**。基本は「近い既存を1つ写して差し替える」。内容を変えたら必ず `npm run check`（＋表示物は `npm run preview`）→ `npm run build` → コミット。

### 練習（practice）
- `practice/<id>.js` を作る：`export const practice = { id, label, lessonIds, labIds, level, numberPolicy }`（近い既存の `practice/<id>.js` を写す）。`numberPolicy` は説明テキスト（例「答えが2桁以内」。コード値ではない）。そのうえで `practice.js`（index）の**import 行**と **`rawPracticeCatalog` 配列**に1行ずつ足す。
- 生成器を純関数で書き、**モード id をキーにした対応表**に登録する（`practice.js` に `generator` フィールドは無い。`practice-view.js` が `practiceGenerators[mode.id]`／`advancedPracticeGenerators[mode.id]` で引く）:
  - **基本問題** … `practice-generators.js` の `practiceGenerators`（キー＝mode id）。関数を `practice-extra.js` に置く場合は `extraPracticeGenerators` に登録すれば `practiceGenerators` に spread で合流する。
  - **発展問題（少し進んだ問題）** … `practice-advanced.js` の `advancedPracticeGenerators`（同上、追補は `practice-extra.js` の `extraAdvancedGenerators`）。あわせて `practice.js` に `advancedLevel`（ラベル）と `advancedPolicy`（説明文。`advancedPolicies[practice.id]`）を足すと発展タブが出る。
  - 生成器は `{ modeLabel, title, prompt, steps: [...] }` を返す。step 型は `{ label, question, hint, check, answer, choices?, example?, accept? }`（`check` は入力を受け取り真偽を返す関数）。
- **単元⇄練習の両方向**を揃える：`practice.lessonIds` に単元 id、`lessonMetadata`（lessons.js）の `practiceIds` にこの practiceId。片方だけだと単元からの「次の一手」に出ない。
- `npm run check`（`test-practice.mjs` が全モードの自己受理を検査）。

### 図解ラボ（labs）
- `labs/<id>.js` を作る：`export const lab = { id, title, short, category, lessonIds, practiceIds, objectIntro, observe, starterExample }`（近い既存の `labs/<id>.js` を写す）。`lessonIds`・`practiceIds`・`starterExample` は必須（`check` が逆参照と存在を検査）。`hostId` フィールドは無い。そのうえで `labs.js`（index）の**import 行**と **`labs` 配列**に1行ずつ足す。単元との対応（次の一手）を付けるなら `labs.js` の `unitLabRefs` にも単元 id→lab id を足す。
- 描画・操作コードは `labs-view.js` に `id` 対応で追加（近い既存図解を写す）。表示物なので `npm run preview` で確認。

### 読み物（stories）
- `stories/<id>.js` を作る：`export const story = { id, type, menuTitle, title, lead, lessonIds, labIds, practiceIds, sections: [{ heading, body }], sources, factCheck }`（近い既存の `stories/<id>.js` を写す）。`type` は `rule`／`history`／`society`。`factCheck.status` は `"checked"` 必須。そのうえで `stories.js`（index）の**import 行**と **`stories` 配列**に1行ずつ足す。
- `history`／`society` は `sources` に HTTPS 出典を1つ以上（`{ title, url }`）。肖像を使うなら `portraits: [{ src, alt, caption }]`（画像は `src/` 配下に実在）。
- `npm run check`（出典・事実確認・肖像実在・相互リンクを検査）。

### 数学者図鑑（figures）
- `figures.js`（index）の先頭コメントが構造を説明している（まず読む）。`figures/<id>.js` を作る：`export const figure = { id, name, reading, era, region, achievement, profile: [...], contributions: [...], portrait: { src, alt, caption }, related: { stories, figures, lessons, labs } }`（近い既存の `figures/<id>.js` を写す）。本文の数式はソース上 `\\(` の2重バックスラッシュ。そのうえで `figures.js` の**import 行**と **`figures` 配列**に1行ずつ足す。
- 肖像画像は `src/assets/img/portraits/<id>.webp` に置く（実在必須）。`related.*` は実在必須（`check` が逆参照検査）。
- `npm run check`（`figures` も数式区切り・肖像実在・related を検査）。

## 4.7 表示・仕組みを拡張する

いずれも表示に関わるので最後に `npm run preview` で確認。既存を1つ写すのが基本。**CSS を足すときは集約ファイル `styles.css` ではなく役割に合う部分ファイル**（`lessons.css`／`labs.css`／`practice.css`… §2 css 参照）へ書く。

### 新しいページ／ルート
1. `nav.js` の `pageIds` に id を足す。
2. `index.html` に `data-page="<id>"` のセクションを追加し、ナビに `data-page-link="<id>"` のリンクを足す。
3. `router.js` の `handleRoute` に `route.page === "<id>"` の分岐を足す（id 付きで開くなら `route.id` を使う。リンクは `routeHash("<id>", …)`）。
4. [design/content-architecture.md](design/content-architecture.md) §6 のルート表を更新。
5. `npm run preview` で確認。

### 新しい example 型
1. `format.js` の `workedExampleMarkup` に `value.type === "<新型>"` の分岐と描画を足す。
2. **`scripts/validate-content.mjs` の `validateExample` の許可リスト**（`["aligned-steps","word-problem","narrative","walkthrough"]`）に新型を加える（**忘れると check が「不正な型」で弾く**）。必要なら型ごとの構造検査も足す。
3. design §4.1.1 の型表と CLAUDE.md §2 の `example` 行に新型を追記。
4. `npm run check` → `npm run preview`。

### 新しい model 型 / 検証ルール
- model 型は §2「`model`」の手順（dispatcher に分岐＋描画関数＋（必要なら）CSS＋preview）。データ形の正本は `lessons-view.js` の描画関数。
- 検証ルールは `scripts/validate-content.mjs` に `assert(...)` を足す（既存パターンを写す。検査項目の網羅は design §7）。

## 5. コミット/ドキュメント運用

- 区切りごとに `npm run check` → `npm run build` → コミット＋プッシュ（`main` 直運用）。
- 完了した変更は [CHANGELOG.md](CHANGELOG.md) に追記（種別ごと）。未着手は [TODO.md](TODO.md) に。
- 大きめの継続作業は [PROGRESS.md](PROGRESS.md) にチェックリスト＋コミットハッシュを残し、ターンをまたいでも引き継げるようにする。

### 着想・気づきを TODO に残す（完了条件の一部）
頼まれたタスクを終えることだけを完了条件にしない。**作業中に気づいた拡充案・関連トピック・改善点・引っかかりは、その場で対応しないなら必ず [TODO.md](TODO.md) に一文起票し、ターン終了時にユーザーへ「提案」として報告する。** 起票は後から単独で着手できるだけの文脈（対象単元・何を・なぜ）を書く。
- リンクを1本張って満足せず、**その一歩先を推論して起票する**：例＝円周率の単元でアルキメデスへリンクしたら、「近似値の記述をアルキメデスの内接・外接多角形による近似計算まで拡充してはどうか」まで提案する。関連トピック（円周・おうぎ形・円弧など）や、それらの理解を確認する練習の追加も、気づいた時点で TODO に残す。
- 「タスクは確実にこなせる」段階の次は、**気づきを取りこぼさず提案に変える**ことを仕事に含める（下記「新単元⇄練習」の TODO 起票もこの一種）。

### ドキュメント更新のタイミング（実態との差を残さない）
`main` 直運用では **commit ≒ push ≒ 公開**。だから「実装を push したのにドキュメントが古い」状態を残さないことを原則にする。**この区切りが済んだ＝ドキュメントも同じ push で整合している**、を毎回の完了条件にする:

1. **実装とドキュメントは同じ push に含める**（実装コミットとドキュメントコミットは分けてよいが、`git push` する前に必ず整合させる）。ドキュメント更新を「次回まわし」にしない。
2. **CHANGELOG**: push する区切りの完了分を、その場で `## YYYY-MM-DD`（**JST・コミット実日時**。`TZ=Asia/Tokyo git log --date=…` で確認）の日付セクションに書く。`[Unreleased]` は「コミット済みだが**まだ push していない**作業中」専用にし、**push したら日付セクションへ畳んで空にする**（次セッションが `[Unreleased]` を見れば未反映分だけが分かる）。日をまたぐ束は `## 2026-07-21〜22` のようにレンジ見出しにしてよい。
3. **TODO / PROGRESS**: 完了したものは「進行中／未着手」から消して CHANGELOG へ（TODO は"これからやること"だけ）。PROGRESS は複数フェーズの継続トラッカーで、各フェーズの要約は CHANGELOG にも残し、**継続作業が全部済んだら要約を CHANGELOG へ畳んだうえで、本ファイルは削除するか、完了フェーズの詳細対応表を残す「詳細アーカイブ」として保持するかを選ぶ**（残す場合はヘッダに「アクティブな継続作業なし」と明記し、CHANGELOG/design/CLAUDE の参照を切らさない）。
4. **CLAUDE / README / design**: 構造・手順・編集先が変わったら同じ push で直す（どこを直すかは下の「ドキュメント保守」の役割分担に従う）。

### ドキュメント保守（実装が正本）
- **ドキュメントが実装とズレたら、実装を正本にドキュメントを書き換える**（初版の記述として残さない。過去は git が保持）。
- 役割分担を守り、同じ事実を二重に持たない：リポジトリ構造・正本→公開物の生成モデルは [design/content-architecture.md](design/content-architecture.md) §3、作業別の編集先・手順は本ファイル。
- 矛盾を見つけたら、まず**決定的な確認**（`grep -cF`・実ファイルの Read）で事実を固定してから書き換える（記憶・推測で直さない）。内容を変えたら `npm run check`、区切りごとにコミット。
