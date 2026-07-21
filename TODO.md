# TODO（未着手・進行中のみ）

完了した変更は [CHANGELOG.md](CHANGELOG.md)、日々の作業手順は [CLAUDE.md](CLAUDE.md)、設計思想は
[design/content-architecture.md](design/content-architecture.md)。このファイルは「これからやること」だけを残す。

## 進行中

- ~~開発ドキュメントと実装の矛盾解消~~ → ✅ **完了（D1〜D6・2026-07-21）**。CLAUDE.md §2 の型記述、design §3/§4.1/§11.2/§6/§7、README を実装に一致させた。詳細は [CHANGELOG.md](CHANGELOG.md)「Docs」／[PROGRESS.md](PROGRESS.md)「A」。
- ~~ドキュメント完備性の点検~~ → ✅ **完了（点検 C0〜C11＋修正 F1〜F18・2026-07-22）**。発生しうる作業ごとに「探し方・やり方・必須の関連作業・検証」がドキュメント参照だけで辿れることを確認し、不足（F1〜F18）を補完済み。作業カタログと対応表は [PROGRESS.md](PROGRESS.md)「C」。
  - 点検フェーズ **完了（C0〜C11・2026-07-21）**。修正フェーズはテーマ別に1ターン1テーマで対応。
  - 修正の進捗: **①（design §4 例＋practice.js＝F6・F8・F10・F14）完了 f68c012**／**②（CLAUDE.md §2 是正・補完＝F4・F12・F13・F15）完了 211a4ac**／**③（文書ナビ・保守原則＝F1・F18）完了 d844a1a**／**④（波及チェックリスト＝F3）完了 489ac5b**／**⑤（コンテンツ追加手順＝F2・F5・F7・F9・F11）完了 c3bc4ef**／**⑥（仕組み拡張＝F16・F17）完了 ae5d356**。**修正フェーズ全完了（F1〜F18）**。ドライラン検証（2026-07-22）で手順の軽微改善 **F19・F20** を追加検出（低優先・次回）＋容量リスクを洗い出し（詳細は [PROGRESS.md](PROGRESS.md)「D」）。
  - 点検で判明した修正項目（修正ターンで対応。対応表は PROGRESS「C 修正項目」）:
    - ✅ **F1**（解決: C0-3）CLAUDE.md 冒頭ナビの design・PROGRESS の役割記述を実態へ更新
    - ✅ **F2**（解決: C1-4・C1-2補強・C8-1新単元分）§4 に新単元の必須関連作業（重複検索・検索ワード整備・問題のTODO化・context/図解リンク）を追記
    - ✅ **F3**（解決: C1-6・C10-1）id のリネーム・削除の波及チェックリストを新設（全 id 種別＝単元/図解/問題/読み物/数学者の逆参照先一覧＋check）
    - ✅ **F4**（解決: C1-7）model type のデータ形（各 type の必要キー）を文書化
    - ✅ **F5**（解決: C2-2・C2-3・C2-4）練習の追加ガイドを補強（両方向リンク・mode→生成器対応表・生成器の返り値形・step各フィールド・level/numberPolicy）
    - ✅ **F6**（解決: C2-3・C2-4・C2-1補強）実態齟齬の是正（practice.js 冒頭コメントの app.js 誤記・design §4.3 の practice 例）
    - ✅ **F7**（解決: C3-2・C3-3補強）図解ラボの追加手順を新設（実フィールド・描画は labs-view.js に追加・preview 確認）
    - ✅ **F8**（解決: C3-2補強）design §4.2 の labs 例を実体へ（practiceIds/starterExample 追加・phantom hostId 削除）
    - ✅ **F9**（解決: C4-2）読み物の追加手順を新設（実フィールド・出典/肖像/相互リンク・近い既存を写す＋check）
    - ✅ **F10**（解決: C4-2補強）design §4.5 の読み物例を実体へ（title/lead/sections/menuTitle を追加）
    - ✅ **F11**（解決: C5-2）数学者図鑑の追加手順を明文化（実キー・肖像配置 src/assets/img/portraits・related 逆参照・近い既存を写す＋check）
    - ✅ **F12**（解決: C5-2補強）CLAUDE.md §2 検証行の誤り是正（figures も validateMathText 対象・肖像実在/related も検査）
    - ✅ **F13**（解決: C6-1・C6-3・C6-2補強）学習マップは自動生成である旨を明文化（strand/category・range/level・有効値一覧・手動不要）
    - ✅ **F14**（解決: C6-1補強）design §4.4 の学習マップ例を実体へ（自動生成・category はキー・title/description）
    - ✅ **F15**（解決: C8-2）検索インデックスの範囲と拡張方法を明文化（search-view.js の5種索引・新種別の加え方・§2 モジュール一覧の補完）
    - ✅ **F16**（解決: C9-1）新しいページ／ルートの追加手順を明文化（nav pageIds・router 分岐・index.html data-page・design §6・preview）
    - ✅ **F17**（解決: C9-2）新しい example 型の追加手順を明文化（workedExampleMarkup＋validateExample 許可リスト必須＋design §4.1.1）
    - **F19**（低優先・ドライラン検出／C6補強）§4・§2 に注記: 数と式系の新単元を number カテゴリに入れるには `categoryForLesson` の id リスト追加が要る
    - **F20**（低優先・ドライラン検出／C2-3補強）§4.6 練習に対応表名を補足（`practiceGenerators`／発展は `advancedPracticeGenerators`・`advancedLevel`/`advancedPolicy`）
    - ✅ **F18**（解決: C11-4）CLAUDE.md にドキュメント保守の原則を明文化（実装が正本・ズレたら書換／構造=design・手順=CLAUDE の役割分担／矛盾発見時の直し方）
- **単元ブラッシュアップ（依頼11項目）** — ⏸ **次セッション以降**。完了 6（1・3・6・9・10・8）、残り 5（作業量の軽い順: 11・4・7・2・5）。詳細は [PROGRESS.md](PROGRESS.md)。
  ※新単元は CLAUDE.md「4. 新しい単元を追加する手順」に従い、練習問題を付けるなら practice.js＋生成器まで揃える。

## 未着手の候補

### コンテンツ
- 単元「集合と命題」で全称・存在の記号（∀ ∃）に触れるか注記する。
- 単元「二次関数」の頂点・軸・平方完成を図と対応づけて補強。
- 応用単元（会計・ローン・速さ）の図解ラボを増やす。

### 表示・モバイルUX
- 数式の折り返しと横スクロールの改善（特に長い式）。
- 目次の階層と現在地表示の改善。
- ダークモードの検討。
- `styles.css`（3785行・Read 2000行超）の分割を検討。部分修正・読み取りの負荷軽減のため。CLAUDE ルール（迂回した一括改変をしない）に従い、退避→段階的に。

### 検索
- 同義語辞書の拡張、部分一致の重み付け・スコアリング調整。

## 公開直前の確認（リリース時チェックリスト）
- リンク切れ・数式・モバイル導線の最終確認。
- `npm run check` が通る。
- `npm run build` で `docs/` を再生成してからプッシュ。
