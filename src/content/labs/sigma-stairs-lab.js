// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "sigma-stairs-lab",
    title: "Σの階段：1+2+…+n",
    short: "Σの階段",
    category: "数B・数列",
    lessonIds: ["sigma-notation", "arithmetic-sequences", "sum-and-general-term"],
    practiceIds: ["sequence-sum", "arithmetic-sequence"],
    objectIntro: "1段・2段・…・n段と増える階段の石の数として、和を見る",
    observe: "同じ階段を逆さに重ねると、縦 \\(n+1\\)・横 \\(n\\) の長方形になる",
    starterExample: "例：\\(n=5\\) で「逆さの階段を重ねる」と \\(5\\times6=30\\) 個の長方形。その半分の \\(15\\) が \\(1+2+3+4+5\\) と一致する。",
  };
