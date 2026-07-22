# 変更履歴 (Changelog)

このファイルは「完了した変更」の記録です。書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠します。
未着手・進行中の作業は [TODO.md](TODO.md)、設計思想は [design/content-architecture.md](design/content-architecture.md)、
日々の作業手順は [CLAUDE.md](CLAUDE.md) を参照。日付は JST。

種別: `Added`（追加）/ `Changed`（変更）/ `Fixed`（修正）/ `Removed`（削除）/ `Docs`（文書）/ `Infra`（基盤）。

## [Unreleased]

_（作業中でまだ push していない変更だけをここに書く。push する区切りで下の `## YYYY-MM-DD`（JST・コミット実日時）セクションへ畳み、`[Unreleased]` には未 push 分だけを残す。→ 運用ルールは [CLAUDE.md](CLAUDE.md) §5。）_

現在なし。

## 2026-07-23

### Added — 単元ブラッシュアップ 第2弾のつづき（新単元。詳細と実ハッシュは [PROGRESS.md](PROGRESS.md)）
- 単元39 有効数字（新単元。四分位数・箱ひげ図〔38〕と分散・標準偏差・相関〔40〕の間に挿入、以降の番号が1つずれる）: 有効数字の数え方・かけ算/たし算での桁合わせ・途中丸めによる精度低下（円周率と近似と同じ作法）を walkthrough と context（有効数字・測定値の幅・科学的記数法の定義）で構成。対の練習モード `significant-figures`（桁数を数える・指定桁に丸める・積の桁合わせ・途中で丸めない、正解を precompute した curated 設定で採点）を追加。検索語「有効数字」「科学的記数法」も整備 (fd61529)
- 単元5 分数の四則演算（新単元。数の分類〔4〕の直後に挿入、以降の番号が1つずれる）: 通分のたし引き・分子分母のかけ算・逆数のわり算に、比の約分と概算まで含めた walkthrough と context（通分・約分・逆数の定義）で構成。対の練習モード `fraction-arithmetic`（比の約分・概算を含む5ステップ、`sameRational`/`fractionText` で採点）を追加。学習マップは「数と計算」カテゴリ (59b2e78)
- 単元30 円周率と近似（新単元。図形の基本量〔29〕の直後に挿入、以降の番号が1つずれる）: 「記号のまま計算し、必要なときだけ最後に近似する」作法と、正確な形（`25π`）と近似値（`78.5`）の見分けを主題に、walkthrough 例と context（円周率 π・近似値・誤差の定義）で構成。学習マップは「数と計算」カテゴリ、archimedes 図鑑と相互リンク、検索語「近似」・用語「円周率」も整備 (4f59cbc)

### Changed — 単元ブラッシュアップ 第2弾のつづき（依頼11項目の残り。詳細と実ハッシュは [PROGRESS.md](PROGRESS.md)）
- 単元26 二次方程式・単元27 二次不等式: 新しい図の型 `parabola`（放物線と `x` 軸の交点＝解を描く SVG 部品）を追加し、両単元に放物線図を掲載。二次方程式は交点 `x=2, 3` を解として塗り丸で、二次不等式は解の範囲（グラフが `x` 軸より上／下）を塗り＋境界を白抜きで提示。二次不等式のタイトルを「二次不等式：グラフで解の範囲を読む」に特化（方程式は単元25が担うため）。CLAUDE.md §2 の model type 記述を5種へ更新 (45c6743)
- 単元65 学び直し総合: 「数の見せ方を鵜呑みにしない」観点を追加——重み付き平均（`割合 × 値` の和）・成長率（`×(1+r)` の繰り返しで足し算ではない）・グラフの軸のトリック（縦軸の起点・目盛り幅）を points と context（why/definitions/connections）で拡充。context を新規登録し、会計ラボ・混合出題の練習へ接続 (3f02aa8)

## 2026-07-21〜22

### Infra
- **コンテンツを1テーマ1ファイルへ分割**（単元と同じ「per-file＋index が合成」の型）: 数学者図鑑 `figures/<id>.js`（b11a6b2）・読み物 `stories/<id>.js`（b4d0129）・図解ラボ `labs/<id>.js`（f3273f3）・出題設定 `practice/<id>.js`（48ce5e5）。各エントリの原文をそのまま per-file へ移し、index（`figures.js`/`stories.js`/`labs.js`/`practice.js`）は import と一覧・カタログ合成だけを持つ。`storySourcePolicy`・`unitLabRefs`・`advancedPolicies`＋並べ替えは index に原文保持。分割前後で `figures`/`figureCatalog`・`stories`/`storyCatalog`/`storySourcePolicy`・`labs`/`labCatalog`/`unitLabRefs`・`practiceCatalog` が `deepStrictEqual` で完全一致することを確認。
- **`styles.css`（3785行）を役割ごとの部分ファイルへ分割**（79f0280）: base/home/shell/lessons/labs/lab-diagrams/practice/stories-map/responsive/figures の10ファイルにカスケード順を保って分け、`styles.css` は `@import` 集約に。各部分は原本の連続バイトスライスで、連結が原本と md5 一致（描画は完全に不変）。`index.html` は従来どおり `styles.css` だけを link。ブラウザで全リクエスト200・エラーゼロ・主要ページ描画一致を確認。
- 単元本文を1単元1ファイル `src/content/lessons/<id>.js` へ分割（`lessons.js` は目次＋表示順 `learningPath`＋メタデータ合成のみ）。旧・新の `units`/`learningPath` を `deepStrictEqual` で完全一致検証（95e0c0f）。
- `npm run units`（番号→id→ファイル）、`npm run unit -- <id|番号>`（1単元の本文を丸ごと出力＝Read の代替）を追加。
- 編集ガイド `CLAUDE.md` を運用の単一入口として整備。`CHANGELOG.md`（本ファイル）を新設し `TODO.md` をスリム化。

### Docs
- **ドキュメント更新のタイミングを明文化**（CLAUDE.md §5）: 実装とドキュメントは同じ push に含めて整合させる／CHANGELOG は push する区切りの内容を `## YYYY-MM-DD`（JST）へ直接書き、`[Unreleased]` は未 push 分だけに使う／TODO・PROGRESS の完了分は「進行中」から落とす。あわせて (1) 滞留していた 07-21〜22 の `[Unreleased]` を日付セクションへ畳み、(2) 完了済みの開発ドキュメント整備（D1–D6）・完備性点検/修正（C0–C11／F1–F20）を TODO「進行中」から外して**残る継続作業を単元ブラッシュアップのみ**に整理、PROGRESS ヘッダの状態表記も現況へ更新。
- コンテンツ／CSS 分割に合わせ開発ドキュメントを現況化: CLAUDE.md §2（その他コンテンツ＝per-file＋index／css＝`@import` 集約の部分ファイル）・§4.5 波及チェックリスト（逆参照先を per-file へ）・§4.6 追加手順（`<type>/<id>.js` を作り index の import・配列に足す）・§4.7（CSS は部分ファイルへ）、design §3.2 構造ツリー・§4.2/§4.3/§4.5 の場所表記を更新（d89b8f4 で先行の F19/F20 補完済み）。
- **手順の軽微な欠落 F19・F20 を補完**（d89b8f4）: 数と式系の新単元を「数と計算(number)」に入れるには `topics.js` の `categoryForLesson` の固定 id リストに新 id が要る点（§2/§4-2）、練習の生成器対応表名 `practiceGenerators`／`advancedPracticeGenerators`（§4.6）を実装で裏取りのうえ明記。
- `design/content-architecture.md` §3「コンテンツの正本と公開物」を現況へ刷新。`build` が **検証付きの完全コピー（バンドルなし）** であること・`docs` は `src` の鏡像で結合ファイルは生成されないこと・構造ツリー（`lessons/<id>.js` 分割、全 content/scripts）を明記。§4.1（`lessons.js`＝目次）・§4.2（ラボ描画は `labs-view.js`）の陳腐化も是正。§3 を「構造・生成モデルの正本」、CLAUDE.md を「手順の正本」とし相互リンクで役割分担（二重管理による片側陳腐化の再発防止）。
- `CLAUDE.md`: `context` の型記述を実装に合わせ修正（`{title,body}` ではなく `why`/`definitions`/`connections` 必須・逆参照検査あり）。§2 冒頭に構造・生成モデルは design §3 が正本である旨のリンクを追加。
- **ドキュメント×実装の矛盾解消（D1〜D6）**: 実装を正本に開発ドキュメントを現況化。CLAUDE.md §2 の型記述（model type=4種／example=5系統／css=1本／`context` は `lessonContexts` 登録／トップレベル `connections` は不在で「次の一手」は `recommended*`／`connections` に `kind`）、design §4.1・§4.1.1（本文キーと example 5型）・§11.2（文脈データは `lessonContexts` 登録）・§6（`figures`・`search` ルート追加）・§7（検査項目を `validate-content.mjs` の実体へ）、README「教材データの編集場所」を修正。
- **ドキュメント完備性の点検と補完（点検 C0〜C11／修正 F1〜F18）**: 「タスクを頼まれたとき、ドキュメント参照だけで何を・どうやるかが辿れるか」を発生しうる作業カタログ（全38項目）で点検し、不足を補完。design §4.2〜§4.5 のデータ例を実体化、CLAUDE.md §2 の型/検証行/学習マップ自動生成/検索索引/js モジュール一覧を是正・補完、冒頭ナビと「ドキュメント保守（実装が正本）」原則を明文化、id リネーム・削除の波及チェックリスト（§4.5）・練習/図解/読み物/図鑑の追加手順（§4.6）・表示や仕組みの拡張手順（§4.7）を新設。`practice.js` 冒頭コメントの誤記も是正。詳細と点検↔修正の対応は [PROGRESS.md](PROGRESS.md)「C」。

### Added — 単元ブラッシュアップ 第1弾（コミット 24e9de4。依頼11項目のうち5項目。残りと詳細は [PROGRESS.md](PROGRESS.md)）
- 単元3 符号と計算順序: 同レベルの計算は左から順（`3÷6×2` の誤答例つき）
- 単元4 数の分類: `⊂` を TeX 化し部分集合の読み方と集合単元への参照を追加
- 単元42 証明とは何か: 命題との関係と証明の三型（直接法・反例・対偶）
- 単元28 図形の基本量: 角度・面積・円の主要公式のおさらいと三平方への接続
- 単元31 三角比: 有名角の値の復元法・数表→関数電卓・近似と正確な形

### Added — 単元ブラッシュアップ 第2弾（依頼11項目の残り。詳細と実ハッシュは [PROGRESS.md](PROGRESS.md)）
- 単元25 二次方程式: 判別式が負のときの「実数解なし」は“実数の範囲では”の但し書き付き——数IIの虚数単位 i（i²=-1）と複素数への入口を point と walkthrough conclusion に追記 (8bdb14b)

## 2026-07-20

### Added
- 詳細ページに前後移動ナビを新設、単元番号を検索窓風UIに (9ca8064)
### Changed
- 見出しを縦積みに変更、リード文を一覧ページだけに表示 (3647a7a)
- 問題モード切替時に難易度を「はじめの一問」へ戻す (7ae403f)
- モバイルの数式表示改善（横スクロールの気づき・インライン数式のはみ出し対策）(ba18938)
### Fixed
- 単元 connection の指す先が登録配列にあるかの逆参照検査を追加 (ed46507)
### Changed
- 検索改良: 数学者図鑑を索引に追加、表記揺れ（全角/漢数字/同義語）対応 (1243a8d)

## 2026-07-18〜19

### Added
- 練習問題の大改修: ヒント/ギブアップ・書式に寛容な採点・21単元へ問題追補・検証ハーネス `test-practice` 常設 (56ca1a7)
### Changed
- ヒント・模範解説の総点検（未定義の文字を排し、実際の数値と単元で教えた方法で語る）(ddf305a)
- 改良候補16項目のチェックリスト化、練習問題関係をクローズ (f3978ad)

## それ以前（要約）

- `app.js`（約5000行）を役割別16モジュールへ分割（`src/assets/js/`）。
- コンテンツの正本を `src/content/`（lessons/labs/practice/stories/topics/figures/glossary）へ構造化。
- 数学者図鑑（figures）28名、読み物（stories）17本、図解ラボ23本を整備。
- ビルド `src/`→`docs/`（GitHub Pages）と内容検証 `validate-content` を確立。
