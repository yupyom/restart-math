// 図解ラボは1件1ファイル（labs/<id>.js）。ここは import と一覧・カタログ・unitLabRefs の合成だけを持つ。
import { lab as numberLineLab } from "./labs/number-line-lab.js";
import { lab as inequalityLab } from "./labs/inequality-lab.js";
import { lab as distributionLab } from "./labs/distribution-lab.js";
import { lab as radicalLab } from "./labs/radical-lab.js";
import { lab as termLab } from "./labs/term-lab.js";
import { lab as equationLab } from "./labs/equation-lab.js";
import { lab as functionLab } from "./labs/function-lab.js";
import { lab as quadraticLab } from "./labs/quadratic-lab.js";
import { lab as trigLab } from "./labs/trig-lab.js";
import { lab as unitSemicircleLab } from "./labs/unit-semicircle-lab.js";
import { lab as probabilityLab } from "./labs/probability-lab.js";
import { lab as latticePathLab } from "./labs/lattice-path-lab.js";
import { lab as setSortLab } from "./labs/set-sort-lab.js";
import { lab as triangleAngleLab } from "./labs/triangle-angle-lab.js";
import { lab as vennLab } from "./labs/venn-lab.js";
import { lab as geometryPropertiesLab } from "./labs/geometry-properties-lab.js";
import { lab as euclideanAlgorithmLab } from "./labs/euclidean-algorithm-lab.js";
import { lab as loanBalanceLab } from "./labs/loan-balance-lab.js";
import { lab as accountingBalanceLab } from "./labs/accounting-balance-lab.js";
import { lab as speedDistanceLab } from "./labs/speed-distance-lab.js";
import { lab as dataSpreadLab } from "./labs/data-spread-lab.js";
import { lab as boxPlotLab } from "./labs/box-plot-lab.js";
import { lab as sigmaStairsLab } from "./labs/sigma-stairs-lab.js";

export const labs = [
  numberLineLab,
  inequalityLab,
  distributionLab,
  radicalLab,
  termLab,
  equationLab,
  functionLab,
  quadraticLab,
  trigLab,
  unitSemicircleLab,
  probabilityLab,
  latticePathLab,
  setSortLab,
  triangleAngleLab,
  vennLab,
  geometryPropertiesLab,
  euclideanAlgorithmLab,
  loanBalanceLab,
  accountingBalanceLab,
  speedDistanceLab,
  dataSpreadLab,
  boxPlotLab,
  sigmaStairsLab,
];

export const labCatalog = Object.fromEntries(labs.map((lab) => [lab.id, lab]));

export const unitLabRefs = {
  "integers-signs": ["number-line-lab"],
  "absolute-value": ["number-line-lab"],
  "integer-rules": ["number-line-lab"],
  "absolute-value-equations": ["number-line-lab", "inequality-lab"],
  "distribution-numbers": ["distribution-lab"],
  "expansion-formulas": ["distribution-lab"],
  factoring: ["distribution-lab", "term-lab"],
  "quadratic-equations": ["quadratic-lab"],
  "powers-roots": ["radical-lab"],
  "simplify-roots": ["radical-lab"],
  "root-operations": ["radical-lab", "term-lab"],
  "letters-as-boxes": ["term-lab"],
  "like-terms": ["term-lab"],
  "distribution-letters": ["distribution-lab", "term-lab"],
  "linear-inequalities": ["inequality-lab", "number-line-lab"],
  "sets-propositions": ["set-sort-lab", "venn-lab"],
  "venn-diagrams": ["venn-lab", "set-sort-lab"],
  "identities-equations": ["equation-lab"],
  "simultaneous-equations": ["function-lab"],
  "quadratic-vertex": ["quadratic-lab"],
  "quadratic-inequalities": ["quadratic-lab"],
  "trig-ratios": ["trig-lab", "unit-semicircle-lab"],
  "trig-extension": ["unit-semicircle-lab", "trig-lab"],
  "sine-cosine-rule": ["trig-lab", "unit-semicircle-lab"],
  "counting-principles": ["probability-lab"],
  permutations: ["probability-lab", "lattice-path-lab"],
  combinations: ["probability-lab", "lattice-path-lab"],
  "combinations-repetition": ["lattice-path-lab", "probability-lab"],
  "probability-a": ["probability-lab"],
  "geometry-a": ["geometry-properties-lab", "triangle-angle-lab"],
  "geometry-proofs": ["triangle-angle-lab"],
  "parallel-lines-angles": ["triangle-angle-lab"],
  "math-human-activities": ["euclidean-algorithm-lab"],
  geometry: ["triangle-angle-lab", "geometry-properties-lab", "trig-lab"],
  "linear-equations": ["equation-lab", "loan-balance-lab", "speed-distance-lab"],
  "equation-modeling": ["equation-lab", "speed-distance-lab", "loan-balance-lab"],
  functions: ["function-lab", "speed-distance-lab", "accounting-balance-lab"],
  "function-notation": ["function-lab"],
  "pythagorean-theorem": ["trig-lab", "geometry-properties-lab"],
  "geometric-series-sum": ["loan-balance-lab"],
  "geometric-sequences": ["loan-balance-lab"],
  "prime-factorization": ["radical-lab", "euclidean-algorithm-lab"],
  similarity: ["trig-lab"],
  "conditional-probability": ["probability-lab"],
  "data-analysis-i": ["data-spread-lab", "box-plot-lab"],
  "box-plots": ["box-plot-lab", "data-spread-lab"],
  "sigma-notation": ["sigma-stairs-lab"],
  "arithmetic-sequences": ["sigma-stairs-lab"],
  "sum-and-general-term": ["sigma-stairs-lab"],
  "complementary-events": ["probability-lab"],
  data: ["data-spread-lab", "probability-lab"],
  "exam-review": ["accounting-balance-lab"],
};
