// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "cantor-sets-and-infinity",
    type: "history",
    menuTitle: "カントールと集合",
    title: "集まりの大きさを比べる：カントールと集合",
    lead: "集合は、数カードを箱に分けるだけの記号ではありません。何を一つの集まりと見るかを決めることで、有限から無限まで同じ言葉で考えられます。",
    portraits: [
      { src: "assets/img/portraits/cantor.webp", alt: "カントールのイメージイラスト", caption: "ゲオルク・カントール（1845–1918）" },
    ],
    lessonIds: ["sets-propositions"],
    labIds: ["set-sort-lab"],
    practiceIds: ["sets"],
    sections: [
      { heading: "有限の集合から始める", body: "この教材では、まず1から12までの数を条件ごとに分け、共通部分や和集合を目で確かめます。" },
      { heading: "無限にも大きさがある", body: "19世紀のゲオルク・カントールは集合論を築き、無限集合の大きさを比べる考えを発展させました。" },
      { heading: "この単元との接続", body: "今扱う有限集合は入口です。『条件に合うものを一まとまりとして考える』見方が、確率や関数など多くの分野をつなぎます。" },
    ],
    sources: [
      { title: "Georg Cantor (1845–1918)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/" },
    ],
    factCheck: { status: "checked", note: "カントールを集合論の創始者とし、無限数・濃度の研究へつなげた範囲で記述しました。" },
  };
