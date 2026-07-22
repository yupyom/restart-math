// 図解ラボのカタログ（1件1ファイル）。編集後は npm run check。一覧・単元対応は labs.js が合成する。
export const lab = {
    id: "triangle-angle-lab",
    title: "三角形の内角と外角",
    short: "三角形の角",
    category: "図形の基本",
    lessonIds: ["geometry", "parallel-lines-angles", "geometry-proofs", "geometry-a"],
    practiceIds: ["geometry-basics", "geometry-properties"],
    objectIntro: "三角形の頂点を左右・上下に動かして、3つの角の変化を見る",
    observe: "形をどれだけ変えても、内角の和はいつも180°のまま",
    starterExample: "例：頂点を右へ寄せると角Aと角Bは変わるが、3つの角の和は \\(180^\\circ\\) のまま。外角は、隣り合わない2つの内角の和になる。",
  };
