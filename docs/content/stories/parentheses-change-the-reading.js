// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "parentheses-change-the-reading",
    type: "rule",
    menuTitle: "かっこの役割",
    title: "かっこは、読む順番を変える印",
    lead: "かっこは飾りではなく、式をどう読むかを指定する記号です。見た目が少し変わるだけで、答えが変わることがあります。",
    lessonIds: ["integer-rules", "distribution-numbers"],
    labIds: ["distribution-lab"],
    practiceIds: ["integer", "distribute"],
    sections: [
      {
        heading: "困る場面",
        body: "\\(6\\times10+3\\) と \\(6\\times(10+3)\\) は、数字が同じでも別の仕事をしています。前者は \\(60\\) に \\(3\\) を足し、後者は \\(13\\) を \\(6\\) 倍します。",
      },
      {
        heading: "約束の役割",
        body: "かっこは「この部分を先に一まとまりとして読んでください」という目印です。計算順序を全て書き直さずに、式の読み方だけを変えられます。",
      },
      {
        heading: "小さな確認",
        body: "\\(6\\times(10+3)\\) を、横 \\(10\\) と横 \\(3\\) の長方形二つとして考えます。二つを先に足しても、別々に \\(6\\) 倍しても、全体の面積は同じです。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、式の読み方の説明です。" },
  };
