// 単元本文データ（1単元1ファイル）。編集後は npm run check。表示順は lessons.js の learningPath が決める。
export const unit = {
  id: "root-operations",
  stage: "ルート 3",
  range: ["中3", "数I"],
  title: "ルートの足し算・かけ算",
  summary:
    "ルートの足し引きは、『同じ \\(\\sqrt{\\phantom{a}}\\) の部分どうし』だけができます。これは文字式の同類項（\\(x\\) どうし）とそっくりで、\\(\\sqrt{3}\\) を一つの『種類』とみて個数を数える感覚です。かけ算では \\(\\sqrt{a}\\times\\sqrt{b}=\\sqrt{ab}\\) と、中どうしをかけられます。",
  points: [
    "\\(2\\sqrt{3}+5\\sqrt{3}=7\\sqrt{3}\\)（\\(\\sqrt{3}\\) が2個と5個で7個分）",
    "\\(\\sqrt{2}+\\sqrt{3}\\) は種類が違うので、これ以上まとめられない",
    "足し算では \\(\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}\\)。中どうしは足せない",
    "かけ算では \\(\\sqrt{6}\\times\\sqrt{3}=\\sqrt{18}=3\\sqrt{2}\\)（かけてから整理）",
  ],
  example: {
    type: "walkthrough",
    intro: "\\(\\sqrt{12}+\\sqrt{27}\\) を計算します。ルートの足し算は、まず両方を整理して『同じルート』にそろえてから。",
    steps: [
      { equation: "\\sqrt{12}=2\\sqrt{3}", note: "\\(12=4\\times3\\) なので、平方数4を外へ。\\(2\\sqrt{3}\\) になる。" },
      { equation: "\\sqrt{27}=3\\sqrt{3}", note: "\\(27=9\\times3\\) なので、平方数9を外へ。\\(3\\sqrt{3}\\)。同じ \\(\\sqrt{3}\\) がそろった！" },
      { equation: "2\\sqrt{3}+3\\sqrt{3}=5\\sqrt{3}", note: "\\(\\sqrt{3}\\) を『種類』とみて \\(2+3=5\\) 個分。文字式の同類項と全く同じ考え。" },
    ],
    conclusion: "整理せずに \\(\\sqrt{12}+\\sqrt{27}=\\sqrt{39}\\) とするのは誤り。ルートの中どうしは足せません（\\(\\sqrt{a}+\\sqrt{b}\\ne\\sqrt{a+b}\\)）。ここが最大の注意点です。",
  },
  check: "文字式の同類項と似ています。\\(\\sqrt{3}\\) のまとまりを数えている、と考えましょう。",
};
