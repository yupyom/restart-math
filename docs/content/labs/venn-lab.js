// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "venn-lab",
    title: "ベン図で人数を数える",
    short: "ベン図",
    category: "数I・集合と命題",
    lessonIds: ["venn-diagrams", "sets-propositions", "counting-principles"],
    practiceIds: ["venn-count", "sets", "counting"],
    objectIntro: "2つの円の人数と重なりを動かして、二重に数えられる部分を見る",
    observe: "そのまま足すと重なりを2回数える。1回分引くと正しい人数になる",
    starterExample: "例：\\(n(A)=18\\)、\\(n(B)=14\\)、重なりを \\(6\\) にすると、\\(n(A\\cup B)=18+14-6=26\\) 人と数えられる。",
  };
