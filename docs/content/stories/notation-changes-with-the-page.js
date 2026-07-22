// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "notation-changes-with-the-page",
    type: "notation",
    menuTitle: "記号の読み方",
    title: "教科書の式と、いろいろな表記",
    lead: "式を縦に並べて等号をそろえる書き方は、次の一手が何を変えたかを読みやすくするための形です。資料や教科書によって記号の字形が違うこともあるので、まず式全体の意味を読む習慣をつけましょう。",
    lessonIds: ["integer-rules", "linear-inequalities", "identities-equations"],
    labIds: [],
    practiceIds: ["integer", "inequality"],
    sections: [
      {
        heading: "等号を縦にそろえる",
        body: "一つの式変形を一行ずつ書き、等号を同じ位置にそろえると、どの量が残り、どこが変わったかを追いやすくなります。英語で書かれた数学組版でも、複数行の式を等号の列でそろえる仕組みが使われます。",
      },
      {
        heading: "「以下」の記号は見た目が少し違うことがある",
        body: "教科書や資料では、\\(a\\leqq b\\) のようにイコールの線が2本の記号と、\\(a\\mathrel{\\unicode{x2264}} b\\) のように1本の記号を目にすることがあります。どちらも「\\(a\\) は \\(b\\) 以下」、つまり \\(a=b\\) も含む同じ意味です。日本の高校の教科書では2本線、大学や海外の本では1本線が主流という慣習の違いだけです。このサイトでは高校式の \\(\\leqq\\)、\\(\\geqq\\) を基本にします。",
      },
      {
        heading: "社会に出てからの読み方",
        body: "プログラムやプレーンテキストでは、\\(a\\le b\\) を \\(\\mathtt{a\\ <=\\ b}\\)、\\(a\\ge b\\) を \\(\\mathtt{a\\ >=\\ b}\\) と書くこともあります。記号の形だけで新しい意味だと決めず、資料の定義と周りの式を確認する習慣を持ちましょう。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "ここでは、教科書で出会う記法を読み分けるための説明にとどめています。" },
  };
