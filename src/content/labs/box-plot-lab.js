// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "box-plot-lab",
    title: "箱ひげ図と四分位数",
    short: "箱ひげ図",
    category: "応用・データ",
    lessonIds: ["box-plots", "data-analysis-i", "data"],
    practiceIds: ["quartiles", "data-summary"],
    objectIntro: "数直線に並んだ11個のデータと、その真下の箱ひげ図を対応させて見る",
    observe: "箱（Q1〜Q3）には、まん中の約半分のデータが入る",
    starterExample: "例：下側の幅を \\(2\\)、上側の幅を \\(8\\) にすると、箱とひげが右へ長く伸び、分布のかたよりがそのまま箱ひげ図の形になる。",
  };
