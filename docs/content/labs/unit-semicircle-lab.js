// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "unit-semicircle-lab",
    title: "単位半円の三角比",
    short: "単位半円",
    category: "数I・図形と計量",
    lessonIds: ["trig-extension", "trig-ratios", "sine-cosine-rule"],
    practiceIds: ["sine-cosine-rule", "trig"],
    objectIntro: "半径1の半円の上で、角 θ の方向にある点の座標を見る",
    observe: "90°を超えると点が y 軸の左へ移り、cos θ（x 座標）だけが負になる",
    starterExample: "例：\\(\\theta\\) を \\(120^\\circ\\) にすると点の座標は \\((-0.5,\\ 0.87)\\)。\\(60^\\circ\\) の点と左右対称で、\\(\\cos\\) の符号だけが変わる。",
  };
