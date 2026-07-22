// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "probability-lab",
    title: "確率の木",
    short: "確率",
    category: "数A・確率",
    lessonIds: ["counting-principles", "permutations", "combinations", "probability-a", "data"],
    practiceIds: ["counting", "perm-comb", "probability"],
    objectIntro: "玉の袋から取り出す順番を枝にする",
    observe: "戻す・戻さないで、二回目の分母が変わる",
    starterExample: "例：赤玉を \\(3\\) 個、青玉を \\(5\\) 個にして、「戻さず2回」に切り替え、二回目の全体が \\(7\\) 個になることを見る。",
  };
