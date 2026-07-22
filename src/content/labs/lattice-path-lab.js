// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "lattice-path-lab",
    title: "格子の道の最短経路",
    short: "最短経路",
    category: "数A・場合の数",
    lessonIds: ["combinations-repetition", "combinations", "permutations"],
    practiceIds: ["counting", "perm-comb"],
    objectIntro: "碁盤の目の道を、右と上の矢印の列に置き換えて見る",
    observe: "どの道順も「→ と ↑ の並べ方」とちょうど1対1に対応する",
    starterExample: "例：右へ \\(4\\)・上へ \\(3\\) にすると、道順は \\(\\dfrac{7!}{4!\\,3!}={}_7C_3=35\\) 通り。「別の道順にする」を押すと、対応する矢印の列も一緒に変わる。",
  };
