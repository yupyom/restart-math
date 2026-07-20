# 単元ブラッシュアップ進捗（依頼11項目・継続作業）

ユーザー依頼の11項目のトラッカー。ターンをまたぐので、**1項目ごとに `npm run check` → `npm run build` → コミット**し、
このファイルの状態と実コミットハッシュを同じコミットで更新する。次ターンはまずここを読めば続きが分かる。
番号はユーザーの言う「単元N」= `npm run units` の N 番目（learningPath 順）。詳しい手順は [CLAUDE.md](CLAUDE.md)。

> **状態の正本は git（`git log` の実ハッシュ）とディスク（`grep -cF` で実在確認）。** 表がgitと食い違うときはgitを信じる。

| # | 内容 | 状態 | コミット | 対象 |
|---|---|---|---|---|
| 1 | 単元3 符号と計算順序: 同レベルは左から順（3÷6×2の誤り明示） | ✅ | 24e9de4 | lessons/integer-rules.js |
| 3 | 単元4 数の分類: ⊂のTeX化＋部分集合の読み方＋集合単元参照 | ✅ | 24e9de4 | lessons/number-classification.js |
| 6 | 単元42 証明とは何か: 命題との関係＋証明の三型（直接法・反例・対偶） | ✅ | 24e9de4 | lessons/what-is-proof.js |
| 9 | 単元28 図形の基本量: 角度・面積・円の公式おさらい＋三平方接続 | ✅ | 24e9de4 | lessons/geometry.js |
| 10 | 単元31 三角比: 有名角の復元法＋数表→関数電卓＋近似と正確な形 | ✅ | 24e9de4 | lessons/trig-ratios.js |
| 8 | 二次方程式: 判別式が負→複素数（虚数単位i）への入口（数II） | ✅ | 8bdb14b | lessons/quadratic-equations.js |
| 7 | 二次不等式にtitle特化＋両単元に放物線と解の図（新model type: parabola） | ⬜ 未 | - | lessons/quadratic-*.js, lessons-view.js, css/styles.css |
| 11 | 学び直し総合の拡充（重み付け評価・成長率予測・グラフにだまされない） | ⬜ 未 | - | lessons/exam-review.js |
| 4 | 新単元: 円周率と近似（記号のまま計算→最後に近似、記号/小数の見分け） | ⬜ 未 | - | 新規 lessons/<id>.js ＋ lessons.js |
| 2 | 新単元: 分数の四則演算＋練習問題（比率・概算も） | ⬜ 未 | - | 新規 ＋ practice.js ＋ 生成器 |
| 5 | 新単元: 有効数字＋練習問題（定義・計算・途中丸めで精度低下） | ⬜ 未 | - | 新規 ＋ practice.js ＋ 生成器 |

## 実施順の方針
既存単元の点編集（8→7→11）を先に片付け、新単元（4→2→5）は最後にまとめる。
新単元は learningPath 挿入・lessonMetadata・（練習を付けるなら）practice.js と生成器まで揃えてから check（CLAUDE.md「4. 新しい単元を追加する手順」）。

## 完了後
11項目すべて済んだら、このファイルの内容を [CHANGELOG.md](CHANGELOG.md) の該当リリースへ畳んで、本ファイルは削除する。

## 済んだ基盤
- 62単元を `src/content/lessons/<id>.js` に分割（deepStrictEqual で完全一致検証済み）＝コミット 95e0c0f
- `npm run units`（番号→id→ファイル）、`npm run unit`（1単元の本文を丸ごと出力）、CLAUDE.md（編集ルール・型・地図）、CHANGELOG.md、TODO.md スリム化。
