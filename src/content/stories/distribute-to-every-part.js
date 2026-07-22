// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "distribute-to-every-part",
    type: "rule",
    menuTitle: "分配法則",
    title: "分配法則は、全員に同じ数を配る考え方",
    lead: "分配法則は文字式だけの難しい技ではありません。一つのまとまりを同じ大きさで増やすとき、全ての部分に同じ数がかかることを表しています。",
    lessonIds: ["distribution-numbers", "distribution-letters"],
    labIds: ["distribution-lab"],
    practiceIds: ["distribute"],
    sections: [
      {
        heading: "困る場面",
        body: "3 個入りの袋を、りんご 4 個とみかん 2 個の二種類にそれぞれ用意するとします。合計 6 個の袋を 3 倍するなら、りんごにもみかんにも 3 がかかります。",
      },
      {
        heading: "共有する約束",
        body: "まず \\(6\\times13\\) を考えます。\\(13\\) を \\(10+3\\) と見れば、\\(6\\times13=6\\times10+6\\times3\\) と分けられます。文字では同じ考えを \\(a(b+c)=ab+ac\\) と書きます。",
      },
      {
        heading: "小さな確認",
        body: "\\(3(x+4)\\) を、\\(x\\) カードと \\(1\\) カード 4 枚の三組として並べてみましょう。\\(x\\) カードは \\(3x\\) 枚、\\(1\\) カードは \\(12\\) 枚になります。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、面積と配布のモデルです。" },
  };
