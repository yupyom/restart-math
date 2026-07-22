// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "euclidean-algorithm-lab",
    title: "長方形を正方形で分ける互除法",
    short: "互除法",
    category: "数A・数学と人間の活動",
    lessonIds: ["math-human-activities"],
    practiceIds: ["number-theory"],
    objectIntro: "2本の長さを、同じ大きさの正方形で余りなく区切れるか試す",
    observe: "大きい数を小さい数で割った余りへ置き換えても、共通の区切り幅は変わらない",
    starterExample: "例：\\(84\\) と \\(30\\) を選び、\\(84=30\\times2+24\\)、\\(30=24\\times1+6\\) と余りを小さくして、最大公約数 \\(6\\) を見つける。",
  };
