import { units } from "./lessons.js";

export const categoryLabels = {
  number: "数と計算",
  algebra: "文字式・方程式",
  function: "関数",
  geometry: "図形",
  data: "データ・確率",
};

function categoryForLesson(unit) {
  if (["関数"].includes(unit.strand)) return "function";
  if (["図形", "図形と計量", "図形の性質"].includes(unit.strand)) return "geometry";
  if (["データ", "データの分析", "場合の数と確率"].includes(unit.strand)) return "data";
  if (["数と式", "数学と人間の活動", "総合"].includes(unit.strand)) {
    return ["integers-signs", "integer-rules", "distribution-numbers", "powers-roots", "simplify-roots", "root-operations"].includes(unit.id)
      ? "number"
      : "algebra";
  }
  return "algebra";
}

function levelForLesson(unit) {
  if (unit.range.includes("数A")) return 4;
  if (unit.range.includes("数I")) return 3;
  if (unit.range.includes("中3")) return 3;
  if (unit.range.includes("中2")) return 2;
  return 1;
}

// 学習マップは本文を複製せず、単元データから入口だけを生成する。
export const topics = units.map((unit) => ({
  id: `topic-${unit.id}`,
  lessonId: unit.id,
  category: categoryForLesson(unit),
  level: levelForLesson(unit),
  title: unit.title,
  description: unit.summary,
}));
