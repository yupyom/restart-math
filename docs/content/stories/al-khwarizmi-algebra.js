// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "al-khwarizmi-algebra",
    type: "history",
    menuTitle: "代数のはじまり",
    title: "文章の問題を共通の方法で解く：アル＝フワーリズミと代数",
    lead: "方程式は、意味のない文字操作から始まったのではありません。相続・取引・測量など、生活の問題を同じ方法で解くための道具として整理されました。",
    portraits: [
      { src: "assets/img/portraits/al-khwarizmi.webp", alt: "アル＝フワーリズミのイメージイラスト", caption: "アル＝フワーリズミ（780頃–850頃）" },
    ],
    lessonIds: ["linear-equations", "equation-modeling", "quadratic-inequalities"],
    labIds: ["equation-lab"],
    practiceIds: ["equation", "quadratic-sign"],
    sections: [
      { heading: "実用の問題", body: "9世紀ごろのアル＝フワーリズミの代数書は、相続、取引、土地の測量などで必要になる計算を扱いました。" },
      { heading: "文字記号より先に方法があった", body: "そこでは現在の \\(x\\) のような記号を使わず、一次・二次方程式の形と解き方を言葉で説明しています。" },
      { heading: "この単元との接続", body: "文章から同じ量を二通りに表し、方程式の形に整理すれば、題材が変わっても同じ解き方を使えます。" },
    ],
    sources: [
      { title: "Al-Khwarizmi (c. 780–850)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Al-Khwarizmi/" },
    ],
    factCheck: { status: "checked", note: "代数書の実用的目的、言葉による記述、一次・二次方程式の扱いに限定して記述しました。" },
  };
