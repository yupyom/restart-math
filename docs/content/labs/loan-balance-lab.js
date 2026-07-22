// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "loan-balance-lab",
    title: "ローンの返済と利息（単利・複利）",
    short: "返済",
    category: "応用・数と式",
    lessonIds: ["linear-equations", "equation-modeling", "functions", "geometric-sequences"],
    practiceIds: ["equation"],
    objectIntro: "借入額・年率・期間を、元金と利息に分けた棒で見る。単利と複利を切り替えられる",
    observe: "単利は同じ額ずつ、複利は利息が利息を生んで等比数列的に増える",
    starterExample: "例：借入額 \\(60\\) 万円・年率 \\(2\\%\\)・期間 \\(12\\) か月の単利では利息 \\(1.2\\) 万円。複利に切り替えて、期間を延ばすと差が開く。",
  };
