// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "gauss-patterns-in-integers",
    type: "history",
    menuTitle: "ガウスと整数",
    title: "整数の規則を一つの分野へ：ガウス",
    lead: "割り算の余りや素数の規則は、ばらばらな計算ではなく、整数を調べる数論という分野につながります。",
    portraits: [
      { src: "assets/img/portraits/gauss.webp", alt: "ガウスのイメージイラスト", caption: "カール・フリードリヒ・ガウス（1777–1855）" },
    ],
    lessonIds: ["math-human-activities"],
    labIds: ["euclidean-algorithm-lab"],
    practiceIds: ["number-theory"],
    sections: [
      { heading: "扱った範囲", body: "ガウスは数論だけでなく、天文学・測地学・物理など幅広い問題を研究しました。" },
      { heading: "数論での仕事", body: "整数の合同や二次形式などを体系的に扱い、整数の規則を深く調べる土台を築きました。" },
      { heading: "この単元との接続", body: "互除法で余りを追う操作は、同じ数で割った余りに注目する考えへの入口です。" },
    ],
    sources: [
      { title: "Carl Friedrich Gauss (1777–1855)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/" },
    ],
    factCheck: { status: "checked", note: "業績を数論だけへ単純化せず、複数分野にまたがる研究だったことを併記しました。" },
  };
