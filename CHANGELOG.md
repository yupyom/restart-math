# 変更履歴 (Changelog)

このファイルは「完了した変更」の記録です。書式は [Keep a Changelog](https://keepachangelog.com/ja/1.1.0/) に準拠します。
未着手・進行中の作業は [TODO.md](TODO.md)、設計思想は [design/content-architecture.md](design/content-architecture.md)、
日々の作業手順は [CLAUDE.md](CLAUDE.md) を参照。日付は JST。

種別: `Added`（追加）/ `Changed`（変更）/ `Fixed`（修正）/ `Removed`（削除）/ `Docs`（文書）/ `Infra`（基盤）。

## [Unreleased]

### Infra
- 単元本文を1単元1ファイル `src/content/lessons/<id>.js` へ分割（`lessons.js` は目次＋表示順 `learningPath`＋メタデータ合成のみ）。旧・新の `units`/`learningPath` を `deepStrictEqual` で完全一致検証（95e0c0f）。
- `npm run units`（番号→id→ファイル）、`npm run unit -- <id|番号>`（1単元の本文を丸ごと出力＝Read の代替）を追加。
- 編集ガイド `CLAUDE.md` を運用の単一入口として整備。`CHANGELOG.md`（本ファイル）を新設し `TODO.md` をスリム化。

### Docs
- `design/content-architecture.md` §3「コンテンツの正本と公開物」を現況へ刷新。`build` が **検証付きの完全コピー（バンドルなし）** であること・`docs` は `src` の鏡像で結合ファイルは生成されないこと・構造ツリー（`lessons/<id>.js` 分割、全 content/scripts）を明記。§4.1（`lessons.js`＝目次）・§4.2（ラボ描画は `labs-view.js`）の陳腐化も是正。§3 を「構造・生成モデルの正本」、CLAUDE.md を「手順の正本」とし相互リンクで役割分担（二重管理による片側陳腐化の再発防止）。
- `CLAUDE.md`: `context` の型記述を実装に合わせ修正（`{title,body}` ではなく `why`/`definitions`/`connections` 必須・逆参照検査あり）。§2 冒頭に構造・生成モデルは design §3 が正本である旨のリンクを追加。

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
