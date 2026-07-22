// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "equal-sign-keeps-balance",
    type: "rule",
    menuTitle: "等号とつり合い",
    title: "等号は、左右がつり合っているという印",
    lead: "等号は「次に計算する」という矢印ではありません。左右が同じ量だと伝える、つり合いの印です。",
    lessonIds: ["identities-equations", "linear-equations", "equation-modeling"],
    labIds: ["equation-lab"],
    practiceIds: ["equation"],
    sections: [
      {
        heading: "困る場面",
        body: "\\(3x-5=16\\) の左だけに \\(5\\) を足すと、左右は同じ量ではなくなります。等号のまま書けば、読み手はまだつり合っていると受け取ってしまいます。",
      },
      {
        heading: "共有する約束",
        body: "左右に同じ操作をすれば、つり合いは保たれます。両辺に \\(5\\) を足して \\(3x=21\\)、両辺を \\(3\\) で割って \\(x=7\\) と進めます。",
      },
      {
        heading: "小さな確認",
        body: "左右に 1 ブロックずつ置いた天びんを想像します。両側から同時に 1 ブロックずつ取っても、天びんは傾きません。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、等式変形の説明です。" },
  };
