// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "descartes-algebra-meets-geometry",
    type: "history",
    menuTitle: "デカルトと座標",
    title: "式と図を行き来する：デカルトと座標",
    lead: "座標は、図形の位置を数の組で表し、図形の問題を式として考える橋になります。",
    portraits: [
      { src: "assets/img/portraits/descartes.webp", alt: "デカルトのイメージイラスト", caption: "ルネ・デカルト（1596–1650）" },
    ],
    lessonIds: ["functions", "geometry"],
    labIds: ["function-lab"],
    practiceIds: ["function-values", "geometry-basics"],
    sections: [
      { heading: "当時の問い", body: "図形と代数は別々の道具として発達していました。点の位置を数で表せれば、曲線を式で調べられます。" },
      { heading: "デカルトの仕事", body: "デカルトの『幾何学』には、代数を幾何へ使う考えが示されました。座標の発展は一人だけの発明ではありません。" },
      { heading: "この単元との接続", body: "\\(x\\) を入れると \\(y\\) が決まる関係を点 \\((x,y)\\) にすると、式・表・グラフが同じ関係を表します。" },
    ],
    sources: [
      { title: "René Descartes (1596–1650)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/" },
    ],
    factCheck: { status: "checked", note: "デカルトを座標の唯一の発明者とはせず、代数を幾何へ応用した仕事に限定して記述しました。" },
  };
