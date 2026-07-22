// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "pascal-fermat-probability",
    type: "history",
    menuTitle: "確率のはじまり",
    title: "途中で終わったゲームをどう分ける？：パスカル、フェルマーと確率",
    lead: "偶然を数学で考えるきっかけの一つは、遊びの結果を予言することではなく、途中で終わったゲームの賭け金を公平に分ける問いでした。",
    portraits: [
      { src: "assets/img/portraits/pascal.webp", alt: "パスカルのイメージイラスト", caption: "ブレーズ・パスカル（1623–1662）" },
      { src: "assets/img/portraits/fermat.webp", alt: "フェルマーのイメージイラスト", caption: "ピエール・ド・フェルマー（1601–1665）" },
    ],
    lessonIds: ["counting-principles", "probability-a"],
    labIds: ["probability-lab"],
    practiceIds: ["counting", "probability"],
    sections: [
      { heading: "具体的な問い", body: "勝負が途中で終わったとき、残りの勝ち方を数えて賭け金をどう分けるかという問題がありました。" },
      { heading: "1654年の往復書簡", body: "パスカルとフェルマーは1654年の書簡で確率の問題を議論しました。確率論の起源は、それ以前の研究も含むため二人だけに限られません。" },
      { heading: "この単元との接続", body: "起こり得る結果を漏れなく数え、そのうち条件に合う結果がいくつかを見る考えが、場合の数から確率への橋になります。" },
    ],
    sources: [
      { title: "Earliest Known Uses of Some of the Words of Mathematics: Probability", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Miller/mathword/p/" },
      { title: "Pierre Fermat (1601–1665)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Fermat/" },
    ],
    factCheck: { status: "checked", note: "1654年の書簡を重要な起点の一つとし、確率論の起源を二人だけへ単純化しない記述にしました。" },
  };
