// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "shared-calculation-order",
    type: "rule",
    menuTitle: "計算順序",
    title: "同じ式を、みんなで同じように読むために",
    lead: "計算順序は、速く計算するためだけの順位表ではありません。式を見た人どうしが同じ答えへたどり着くための共通の読み方です。",
    lessonIds: ["integer-rules"],
    labIds: [],
    practiceIds: ["integer"],
    sections: [
      {
        heading: "困る場面",
        body: "\\(2+3\\times4\\) を、先に足す人と先にかける人がいたら、同じ式なのに答えが \\(20\\) と \\(14\\) に分かれます。式は短いメモなので、読む順番を共有しないと意味が一つに決まりません。",
      },
      {
        heading: "共有する約束",
        body: "かっこ、累乗、乗除、加減の順に計算します。先にかけると決めることで、\\(2+3\\times4\\) は \\(2+12\\) と読めます。",
      },
      {
        heading: "小さな確認",
        body: "\\(3+2\\times5\\) を、かっこなしと \\((3+2)\\times5\\) で比べてみましょう。かっこは、いつもの読み方を意図して変える印だと分かります。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、計算規約の説明です。" },
  };
