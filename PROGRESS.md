# 継続作業トラッカー（ターン・セッションをまたぐ作業）

ターンをまたぐ継続作業を、**1単位ごとに1コミット**して実ハッシュとともに残す台帳。次ターンはまずここを読めば続きが分かる。
いま進めているのは **A. 開発ドキュメント整備**。**B. 単元ブラッシュアップ**は ⏸ 次セッション以降。
単元番号はユーザーの言う「単元N」= `npm run units` の N 番目（learningPath 順）。詳しい手順は [CLAUDE.md](CLAUDE.md)。

> **状態の正本は git（`git log` の実ハッシュ）とディスク（`grep -cF` で実在確認）。** 表がgitと食い違うときはgitを信じる。

## A. 開発ドキュメント整備（実装との矛盾解消）★いま進行中

実装を正本に、開発ドキュメントの記述を現況へ合わせる。棚卸しで確認した**実装の事実（＝正本）**を先に固定し、次ターンで再調査せず直せるようにする:

- **model type**（`unitModelMarkup` @ `assets/js/lessons-view.js`）= `circle-angle` / `right-triangle` / `line-graph` / `area` の**4種**。`inscribed-angle` は実装にも使用単元にも無い。
- **example type**（`workedExampleMarkup` @ `assets/js/format.js`）= 文字列 / `aligned-steps` / `walkthrough` / `word-problem` / `narrative` の**5系統**（単元実使用: walkthrough 49・narrative 5・word-problem 3・aligned-steps 2）。
- **css** = `src/assets/css/styles.css` **1本のみ**（分割されていない）。
- **js** = 役割別に分割（`app.js`=初期化、`lessons-view`/`labs-view`/`practice-view`/`router`/`nav`/`state`…）。単元本文=`content/lessons/<id>.js`（62本）、`lessons.js`=目次。
- **npm scripts** = build / check / units / unit / preview（CLAUDE.md §1 の表と一致・修正不要）。

| 単位 | 内容 | 状態 | コミット | 対象 |
|---|---|---|---|---|
| D1 | CLAUDE.md §2 の型記述を実装へ一致（model type 4種／example 5系統／css 1本） | ⬜ 未 | - | CLAUDE.md |
| D2 | design §4.1・§4.1.1 の example 型表に `walkthrough` 追加＋初版コード例の是正 | ⬜ 未 | - | design/content-architecture.md |
| D3 | README.md「教材データの編集場所」を現況化（`lessons/<id>.js`・分割モジュール） | ⬜ 未 | - | README.md |
| D4 | （任意・優先度低）design §6 ルート・§7 検査リストを router / validate-content と突き合わせ | ⬜ 未 | - | design/content-architecture.md |

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
