# 継続作業トラッカー（ターン・セッションをまたぐ作業）

ターンをまたぐ継続作業を、**1単位ごとに1コミット**して実ハッシュとともに残す台帳。次ターンはまずここを読めば続きが分かる。
**A. 開発ドキュメント整備**は D1〜D6 完了（2026-07-21）。**B. 単元ブラッシュアップ**は ⏸ 次セッション以降。**C. ドキュメント完備性の点検**を起票（下記・状態=未点検）。
単元番号はユーザーの言う「単元N」= `npm run units` の N 番目（learningPath 順）。詳しい手順は [CLAUDE.md](CLAUDE.md)。

> **状態の正本は git（`git log` の実ハッシュ）とディスク（`grep -cF` で実在確認）。** 表がgitと食い違うときはgitを信じる。

## A. 開発ドキュメント整備（実装との矛盾解消）✅ 完了（D1〜D6）

実装を正本に、開発ドキュメントの記述を現況へ合わせる。棚卸しで確認した**実装の事実（＝正本）**を先に固定し、次ターンで再調査せず直せるようにする:

- **model type**（`unitModelMarkup` @ `assets/js/lessons-view.js`）= `circle-angle` / `right-triangle` / `line-graph` / `area` の**4種**。`inscribed-angle` は実装にも使用単元にも無い。
- **example type**（`workedExampleMarkup` @ `assets/js/format.js`）= 文字列 / `aligned-steps` / `walkthrough` / `word-problem` / `narrative` の**5系統**（単元実使用: walkthrough 49・narrative 5・word-problem 3・aligned-steps 2）。
- **css** = `src/assets/css/styles.css` **1本のみ**（分割されていない）。
- **js** = 役割別に分割（`app.js`=初期化、`lessons-view`/`labs-view`/`practice-view`/`router`/`nav`/`state`…）。単元本文=`content/lessons/<id>.js`（62本）、`lessons.js`=目次。
- **npm scripts** = build / check / units / unit / preview（CLAUDE.md §1 の表と一致・修正不要）。

| 単位 | 内容 | 状態 | コミット | 対象 |
|---|---|---|---|---|
| D1 | CLAUDE.md §2 の型記述を実装へ一致（model type 4種／example 5系統／css 1本） | ✅ | 57da479 | CLAUDE.md |
| D2 | design §4.1・§4.1.1 の example 型表に `walkthrough` 追加＋初版コード例の是正 | ✅ | a0c7bf9 | design/content-architecture.md |
| D3 | README.md「教材データの編集場所」を現況化（`lessons/<id>.js`・分割モジュール） | ✅ | c550ea7 | README.md |
| D4 | design §6 ルート・§7 検査リストを router / validate-content と突き合わせ（figures・search 追加、検査項目を実体へ） | ✅ | 7a3321d | design/content-architecture.md |
| D5 | （D2着手中に発見）CLAUDE.md §2 の型記述の残課題：`context` は本文でなく `lessonContexts`（lessons.js）に登録する点を明示／トップレベル `connections?` は実使用ゼロの疑い（要確認のうえ訂正 or 削除） | ✅ | 7f21db0 | CLAUDE.md |
| D6 | （D5着手中に発見）文脈データ例を実体へ：design §11.2 の `context` を `lessonContexts` 登録形に書換＋`definitions` に `example` 補い。あわせて `connections` の実体は `kind` 付き（全57件・描画未使用）と判明し CLAUDE.md §2 の `kind` 欠落も是正 | ✅ | 06bcfb4 | design/content-architecture.md, CLAUDE.md |

済んだ関連: design §3 の刷新（6881911）、`context` 型記述の修正（2918ede）。

## B. 単元ブラッシュアップ（依頼11項目）⏸ 次セッション以降

| # | 内容 | 状態 | コミット | 対象 |
|---|---|---|---|---|
| 1 | 単元3 符号と計算順序: 同レベルは左から順（3÷6×2の誤り明示） | ✅ | 24e9de4 | lessons/integer-rules.js |
| 3 | 単元4 数の分類: ⊂のTeX化＋部分集合の読み方＋集合単元参照 | ✅ | 24e9de4 | lessons/number-classification.js |
| 6 | 単元42 証明とは何か: 命題との関係＋証明の三型（直接法・反例・対偶） | ✅ | 24e9de4 | lessons/what-is-proof.js |
| 9 | 単元28 図形の基本量: 角度・面積・円の公式おさらい＋三平方接続 | ✅ | 24e9de4 | lessons/geometry.js |
| 10 | 単元31 三角比: 有名角の復元法＋数表→関数電卓＋近似と正確な形 | ✅ | 24e9de4 | lessons/trig-ratios.js |
| 8 | 二次方程式: 判別式が負→複素数（虚数単位i）への入口（数II） | ✅ | 8bdb14b | lessons/quadratic-equations.js |
| 11 | 学び直し総合の拡充（重み付け評価・成長率予測・グラフにだまされない） | ⬜ 未 | - | lessons/exam-review.js |
| 4 | 新単元: 円周率と近似（記号のまま計算→最後に近似、記号/小数の見分け） | ⬜ 未 | - | 新規 lessons/<id>.js ＋ lessons.js |
| 7 | 二次不等式にtitle特化＋両単元に放物線と解の図（新model type: parabola） | ⬜ 未 | - | lessons/quadratic-*.js, lessons-view.js, css/styles.css |
| 2 | 新単元: 分数の四則演算＋練習問題（比率・概算も） | ⬜ 未 | - | 新規 ＋ practice.js ＋ 生成器 |
| 5 | 新単元: 有効数字＋練習問題（定義・計算・途中丸めで精度低下） | ⬜ 未 | - | 新規 ＋ practice.js ＋ 生成器 |

## 実施順の方針
残りは**予想作業量の軽い順**に着手する（上の表も未着手行をこの順に並べ替え済み）：**11 → 4 → 7 → 2 → 5**。
- 11: 既存1単元 exam-review.js の点編集のみ＝最軽。
- 4: 新単元だが練習なし（新規ファイル＋lessons.js 配線のみ、新しい表示部品なし）。
- 7: 既存2単元の編集に加え新しい model type「parabola」を作る（dispatcher 分岐＋SVG 描画関数＋CSS＋ブラウザ確認）ぶん重い。
- 2・5: 新単元＋練習＋生成器で最も重い。5（有効数字）は丸め・精度で採点/生成が繊細なぶん最後。
新単元は learningPath 挿入・lessonMetadata・（練習を付けるなら）practice.js と生成器まで揃えてから check（CLAUDE.md「4. 新しい単元を追加する手順」）。

## 完了後
11項目すべて済んだら、このファイルの内容を [CHANGELOG.md](CHANGELOG.md) の該当リリースへ畳んで、本ファイルは削除する。

## 済んだ基盤
- 62単元を `src/content/lessons/<id>.js` に分割（deepStrictEqual で完全一致検証済み）＝コミット 95e0c0f
- `npm run units`（番号→id→ファイル）、`npm run unit`（1単元の本文を丸ごと出力）、CLAUDE.md（編集ルール・型・地図）、CHANGELOG.md、TODO.md スリム化。

## C. ドキュメント完備性の点検（発生しうる作業カタログ）

「あるタスクを頼まれたとき、**ドキュメントを辿るだけで何を・どうやるかが全部分かるか**」を確かめる点検リスト。いまは発生しうる作業を洗い出して起票した段階（**状態＝未点検**）。次段階で各項目をドキュメントで実際に辿り、`✅ 完備` か `⚠ 不足（何がどこに足りない）` を記入し、不足は補う。

**各項目の「完備」判定＝次の4点が「どの文書のどこ」を見れば辿れること:**
(a) 対象の探し方（既存・重複の見つけ方） / (b) やり方（作成・編集の手順） / (c) 必須の関連作業（波及先とそのやり方） / (d) 検証・反映（`check` / `build` / 表示確認・公開）。

### C0 横断の下地 — 点検済み（2026-07-21）
- [x] C0-1 変更の基本フロー（Read→Edit→`check`→`build`→commit）と事故防止ルール → ✅ **完備**（CLAUDE.md §0 事故防止・§3 編集手順・§1 スクリプト表・§5 コミット/運用）
- [x] C0-2 正本と生成物（`src`＝正本／`docs`＝完全コピー／触るのは `src` だけ） → ✅ **完備**（design §3・README「フォルダ構成」・CLAUDE.md L3＋§2冒頭リンク）
- [x] C0-3 文書の役割分担（CLAUDE.md=手順／design=構造・思想／CHANGELOG=済/TODO=これから/PROGRESS=継続） → ⚠ **不足（→ F1）**：CLAUDE.md 冒頭ナビ（L6/L9/L11）で design が「設計思想」限定で構造・生成モデル(§3)を含まず、PROGRESS が「進行中のブラッシュアップ詳細」限定で実態の継続作業トラッカー(A/B/C)とズレる

### C1 単元（lessons） — 点検済み（2026-07-21）
- [x] C1-1 単元を探す（番号・キーワード→id→ファイル） → ✅ **完備**（§1 `npm run units`／`unit`、§2「単元N=learningPath のN番目・番号は units で引く」）
- [x] C1-2 新規前に同種単元がないか検索して重複回避 → ✅ **概ね完備**（検索手段は §1 `units -- 語`／アプリ検索で辿れる。ただし §4 に「新規前の重複確認」の明示ステップは無い→ F2 で補強）
- [x] C1-3 単元本文を編集する（安全手順） → ✅ **完備**（§3 の6ステップ）
- [x] C1-4 新規単元を作成する → ⚠ **不足（→ F2）**：§4 に骨子（本文＋`lessons.js` 4か所＋strand＋learningPath＋練習）はあるが、必須関連作業のうち検索ワード整備（search-synonyms/glossary）・問題未作成時のTODO化・context/図解リンクの案内が欠落
- [x] C1-5 表示順（learningPath）を変える／挿入で番号ずれ → ✅ **完備**（§4「使う概念が先／番号ずれは仕様」、`check` が learningPath と id の一致を検査）
- [x] C1-6 単元 id をリネーム・削除する（全逆参照の波及と直し方） → ⚠ **不足（→ F3）**：削除・リネームの手順と逆参照先一覧が未文書化（`check` で dangling は落ちるが「どこを直すか」の案内が無い）
- [x] C1-7 単元に図（model）を付ける／新しい model type を作る → ⚠ **部分不足（→ F4）**：新 type 作成手順は §2 にあるが、既存 type を使うためのデータ形（各 type の必要キー）が未文書化
- [x] C1-8 単元に補足カード（context）を付ける → ✅ **完備**（§2 context 行＋design §11.2：lessonContexts 登録・3キー・逆参照・kind。D5/D6 で整備済み）
- [x] C1-9 「次の一手」を成立させる → ✅ **完備**（§2：recommended* は labIds〔unitLabRefs〕/practiceIds〔lessonMetadata〕/nextLessonId から合成、`check` が最低1つを検査）

### C2 練習問題（practice） — 点検済み（2026-07-21）
- [x] C2-1 練習モードを探す → ✅ **概ね完備**（場所は §2、`practice.js` を読めば全モード一覧可。※`practice.js` 冒頭コメントが生成コードを app.js と誤記→ F6 で是正）
- [x] C2-2 単元に練習を追加・紐付ける → ⚠ **不足（→ F5）**：`practice.js` 登録・生成器・step型は §4-3 にあるが、単元⇄練習の**両方向リンク**（`practice.lessonIds` ＋ `lessonMetadata.practiceIds`）を揃える点が明示されていない
- [x] C2-3 新しい問題生成器を作る → ⚠ **不足（→ F5・F6）**：生成器の返り値形（modeLabel/title/prompt/steps）・**mode→生成器の対応表の所在**・step 各フィールドの意味（`check` は関数等）が未文書化。design §4.3 は `generator` フィールドを示すが実体は対応表方式（F6）
- [x] C2-4 難度・上限・前提を調整する（level / numberPolicy） → ⚠ **部分不足（→ F5・F6）**：`numberPolicy` は実体では説明文（例「答えが2桁以内」）だが design §4.3 は policy コード（`radicand-under-100`）と誤記。取りうる値・生成器での効き方も未文書化

### C3 図解ラボ（labs） — 点検済み（2026-07-21）
- [x] C3-1 図解を探す → ✅ **概ね完備**（場所は §2、`labs.js` を読めば一覧可・アプリ検索も対象）
- [x] C3-2 図解を追加する → ⚠ **不足（→ F7・F8）**：新規追加手順が未文書化。実フィールドは id/title/short/category/lessonIds〔必須〕/practiceIds〔必須〕/objectIntro/observe/starterExample〔必須〕で、描画は `labs-view.js` に追加。design §4.2 の例は必須の practiceIds・starterExample を欠き、**実在しない `hostId`** を載せている（→F8）
- [x] C3-3 図解の操作コードを編集する（labs-view.js） → ✅ **概ね完備**（場所は §2、編集の一般フロー〔§0/§3/§5〕＋`preview` 確認〔§3-5〕で辿れる）
- [x] C3-4 単元⇄図解の相互リンク → ✅ **概ね完備**（§2 D5「labIds＝unitLabRefs＝図解側 lessonIds の逆参照」＋design §4.2/§5 で向きが辿れる）

### C4 読み物（stories）
- [ ] C4-1 読み物を探す
- [ ] C4-2 読み物を追加する（type/title/lead/sections/factCheck=checked、history・society は出典 HTTPS 必須、肖像 src/alt/caption 実在、相互リンク）

### C5 数学者図鑑（figures）
- [ ] C5-1 図鑑を探す
- [ ] C5-2 図鑑を追加する（本文キー・`\(` の2重バックスラッシュ・肖像画像の配置と参照・related の逆参照）

### C6 学習マップ・範囲・分野
- [ ] C6-1 学習マップに単元を反映する（`topics.js`／categoryForLesson・levelForLesson）
- [ ] C6-2 新しい range 値を導入したときの更新（levelForLesson）
- [ ] C6-3 strand の割り当て（lessonMetadata／topics の分類）

### C7 用語集（glossary）
- [ ] C7-1 用語を追加する（term / lessonId、重複・長さ）

### C8 検索（search）
- [ ] C8-1 検索できるようワードを整備する（`search-synonyms.js`・表記揺れ）
- [ ] C8-2 検索対象に新しい種別を含める（search-view の索引範囲）

### C9 表示・仕組みの拡張
- [ ] C9-1 新しいページ／ルートを追加する（nav `pageIds`・router・index.html・design §6）
- [ ] C9-2 新しい example 型を追加する（`format.js` の workedExampleMarkup＋`validateExample`＋design §4.1.1）
- [ ] C9-3 新しい検証ルールを `validate-content.mjs` に足す

### C10 削除・リネーム・移動の波及
- [ ] C10-1 id 変更・削除時に、全逆参照をどう洗い出して直すか（チェックリスト）

### C11 運用
- [ ] C11-1 変更後の検証・ビルド・プレビュー（check / build / preview）
- [ ] C11-2 公開（GitHub Pages・main/docs）
- [ ] C11-3 コミット粒度と CHANGELOG/TODO/PROGRESS の更新
- [ ] C11-4 ドキュメント自体を更新する（矛盾発見時の直し方・役割分担）

### C 修正項目（点検で判明・修正ターンで対応）

点検で見つかった不足を修正項目として登録する。各修正が**どの点検項目を解決するか**を明記し、修正前に過不足を見直せるようにする。修正は点検と別ターンで行う。

| 修正ID | 内容 | 対象 | 解決する点検項目 | 状態 |
|---|---|---|---|---|
| F1 | CLAUDE.md 冒頭の文書ナビを実態へ：design を「設計思想＋リポジトリ構造・生成モデル(§3)」に拡張、PROGRESS を「継続作業トラッカー（A/B/C…）」に一般化、L11 の振り分けにも PROGRESS の役割を追記 | CLAUDE.md | C0-3 | ⬜ 未 |
| F2 | §4「新しい単元を追加する手順」に必須の関連作業を追記：①新規前の重複検索（`npm run units -- 語`）②検索ワード整備（`search-synonyms.js`／`glossary.js` に語を追加）③対の問題を作らない場合は TODO 化 ④（任意）context 追加・図解リンク | CLAUDE.md（§4） | C1-4（＋C1-2 補強・C8-1 の新単元分） | ⬜ 未 |
| F3 | 単元 id のリネーム・削除の波及チェックリストを新設（逆参照先＝`lessons.js`〔import/rawUnits/learningPath/lessonMetadata/lessonContexts〕・`labs.js`〔lessonIds〕・`practice.js`・`stories.js`・`figures.js`〔related.lessons〕・`glossary.js`・`topics.js`・`context.connections`。直す順＋`check` で残参照ゼロ確認） | CLAUDE.md（新§） | C1-6, C10-1 | ⬜ 未 |
| F4 | model type のデータ形を文書化（各 type=circle-angle/right-triangle/line-graph/area が必要とするキー、または既存 model 例の見つけ方）。現状は `lessons-view.js` の描画関数を読むしかない | CLAUDE.md §2／design §4 | C1-7 | ⬜ 未 |
| F5 | 練習問題の追加ガイドを補強：①単元⇄練習の両方向リンク（`practice.lessonIds`＋`lessonMetadata.practiceIds`）②mode→生成器の対応表の所在（`practice-generators.js`）③生成器の返り値形（modeLabel/title/prompt/steps）④step 各フィールドの意味（`check`=関数, answer, hint, choices?, example?, accept?）⑤`level`/`numberPolicy` は説明テキストである旨 | CLAUDE.md §4／design §4.3 | C2-2, C2-3, C2-4 | ⬜ 未 |
| F6 | 実態と食い違う練習の既存記述を是正：(i) `practice.js` 冒頭コメント「生成・採点コードは app.js」→ `practice-generators.js` 等へ (ii) design §4.3 の practice 例を実体へ（`label`／`generator` フィールド無し・mode→生成器は対応表／`numberPolicy` は説明文） | practice.js, design §4.3 | C2-3, C2-4（＋C2-1 補強） | ⬜ 未 |
| F7 | 図解ラボの追加手順を新設：実フィールド（id/title/short/category/lessonIds〔必須・逆参照〕/practiceIds〔必須・逆参照〕/objectIntro/observe/starterExample〔必須〕）と、描画は近い既存図解を写して `labs-view.js` に追加＋`preview` 確認（lab.id で描画対応） | CLAUDE.md（新§） | C3-2（＋C3-3 補強） | ⬜ 未 |
| F8 | design §4.2 の labs 例を実体へ：必須の `practiceIds`・`starterExample`（と `short`）を追加、実在しない `hostId` を削除 | design/content-architecture.md §4.2 | C3-2 補強 | ⬜ 未 |
