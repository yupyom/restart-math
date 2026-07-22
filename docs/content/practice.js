// 出題の「教材としての設定」。実際の問題生成・採点コードは assets/js/practice-generators.js（追補 practice-extra.js / practice-advanced.js）に置く。
import { units } from "./lessons.js";

// 出題設定は1モード1ファイル（practice/<id>.js）。ここは import と rawPracticeCatalog の組み立て、発展設定(advancedPolicies)・並べ替えの合成だけを持つ。
import { practice as integer } from "./practice/integer.js";
import { practice as absoluteValue } from "./practice/absolute-value.js";
import { practice as exponent } from "./practice/exponent.js";
import { practice as arithmeticSequence } from "./practice/arithmetic-sequence.js";
import { practice as vennCount } from "./practice/venn-count.js";
import { practice as radical } from "./practice/radical.js";
import { practice as squareRootMeaning } from "./practice/square-root-meaning.js";
import { practice as rootOperations } from "./practice/root-operations.js";
import { practice as substitution } from "./practice/substitution.js";
import { practice as combine } from "./practice/combine.js";
import { practice as distribute } from "./practice/distribute.js";
import { practice as equation } from "./practice/equation.js";
import { practice as sets } from "./practice/sets.js";
import { practice as identities } from "./practice/identities.js";
import { practice as inequality } from "./practice/inequality.js";
import { practice as quadratic } from "./practice/quadratic.js";
import { practice as functionValues } from "./practice/function-values.js";
import { practice as quadraticSign } from "./practice/quadratic-sign.js";
import { practice as trig } from "./practice/trig.js";
import { practice as sineCosineRule } from "./practice/sine-cosine-rule.js";
import { practice as trigSurvey } from "./practice/trig-survey.js";
import { practice as counting } from "./practice/counting.js";
import { practice as probability } from "./practice/probability.js";
import { practice as dataSummary } from "./practice/data-summary.js";
import { practice as dataAnalysis } from "./practice/data-analysis.js";
import { practice as geometryProperties } from "./practice/geometry-properties.js";
import { practice as numberTheory } from "./practice/number-theory.js";
import { practice as geometryBasics } from "./practice/geometry-basics.js";
import { practice as expansion } from "./practice/expansion.js";
import { practice as factoring } from "./practice/factoring.js";
import { practice as quadraticSolve } from "./practice/quadratic-solve.js";
import { practice as permComb } from "./practice/perm-comb.js";
import { practice as sequenceSum } from "./practice/sequence-sum.js";
import { practice as quartiles } from "./practice/quartiles.js";
import { practice as significantFigures } from "./practice/significant-figures.js";
import { practice as numberClassification } from "./practice/number-classification.js";
import { practice as fractionArithmetic } from "./practice/fraction-arithmetic.js";
import { practice as primeFactorization } from "./practice/prime-factorization.js";
import { practice as simultaneousEquations } from "./practice/simultaneous-equations.js";
import { practice as parallelLinesAngles } from "./practice/parallel-lines-angles.js";
import { practice as pythagoreanTheorem } from "./practice/pythagorean-theorem.js";
import { practice as similarity } from "./practice/similarity.js";
import { practice as trigExtension } from "./practice/trig-extension.js";
import { practice as functionNotation } from "./practice/function-notation.js";
import { practice as logicConverse } from "./practice/logic-converse.js";
import { practice as necessarySufficient } from "./practice/necessary-sufficient.js";
import { practice as proofFill } from "./practice/proof-fill.js";
import { practice as geometryProofs } from "./practice/geometry-proofs.js";
import { practice as combinationsRepetition } from "./practice/combinations-repetition.js";
import { practice as complementaryEvents } from "./practice/complementary-events.js";
import { practice as conditionalProbability } from "./practice/conditional-probability.js";
import { practice as sumAndGeneralTerm } from "./practice/sum-and-general-term.js";
import { practice as differenceSequences } from "./practice/difference-sequences.js";
import { practice as recurrenceRelations } from "./practice/recurrence-relations.js";
import { practice as mathematicalInduction } from "./practice/mathematical-induction.js";
import { practice as examReview } from "./practice/exam-review.js";

const rawPracticeCatalog = [
  integer,
  absoluteValue,
  exponent,
  arithmeticSequence,
  vennCount,
  radical,
  squareRootMeaning,
  rootOperations,
  substitution,
  combine,
  distribute,
  equation,
  sets,
  identities,
  inequality,
  quadratic,
  functionValues,
  quadraticSign,
  trig,
  sineCosineRule,
  trigSurvey,
  counting,
  probability,
  dataSummary,
  dataAnalysis,
  geometryProperties,
  numberTheory,
  geometryBasics,
  expansion,
  factoring,
  quadraticSolve,
  permComb,
  sequenceSum,
  quartiles,
  significantFigures,
  numberClassification,
  fractionArithmetic,
  primeFactorization,
  simultaneousEquations,
  parallelLinesAngles,
  pythagoreanTheorem,
  similarity,
  trigExtension,
  functionNotation,
  logicConverse,
  necessarySufficient,
  proofFill,
  geometryProofs,
  combinationsRepetition,
  complementaryEvents,
  conditionalProbability,
  sumAndGeneralTerm,
  differenceSequences,
  recurrenceRelations,
  mathematicalInduction,
  examReview,
];

const advancedPolicies = {
  integer: "かっこを含む3段階の計算・答えは3桁以内",
  "absolute-value": "積や差の絶対値を、計算してから距離として読む",
  exponent: "累乗の積と商を組み合わせて指数を整理する",
  "arithmetic-sequence": "離れた2つの項から公差を逆算して一般項を使う",
  "venn-count": "『どちらでもない』の人数から重なりを逆算する",
  radical: "ルートの中は1400以下・大きい平方因数（\\(8^2\\)〜\\(14^2\\)）を探す",
  "square-root-meaning": "平方数は400以下・√と方程式の解を区別する",
  "root-operations": "係数は2桁を含む、同じルートの加減",
  substitution: "負の数・2乗を含む式へ代入する",
  combine: "3種類以上の項を符号ごと整理する",
  distribute: "2つのかっこを順に展開する",
  equation: "両辺に文字がある一次方程式",
  sets: "和集合の補集合まで扱い、条件に合わない要素も整理する",
  identities: "係数を比較して恒等式の未知係数を求める",
  inequality: "両辺に文字がある一次不等式",
  quadratic: "平方完成して頂点を求める",
  "function-values": "2点から一次関数の式を決める",
  "quadratic-sign": "2次不等式の向きと根の内外を使い分ける",
  trig: "代表角と辺の長さから未知の辺を求める",
  "trig-survey": "60°の見上げで √3 が残る、木の高さの測量",
  "sine-cosine-rule": "辺と角の対応を自分で選んで定理を使う",
  counting: "重複を除く順列・組合せ",
  probability: "少なくとも1回起こる確率を余事象で求める",
  "data-summary": "未整列の6個のデータから平均・中央値・範囲を順に求める",
  "data-analysis": "偏差が異なるデータの分散を分数で求める",
  "geometry-properties": "円周角から弧・中心角を逆算する",
  "number-theory": "3桁の整数で互除法を4段階以上使う",
  "geometry-basics": "三平方の定理で未知の短辺を求める",
  expansion: "係数つきの (ax+b)(cx+d) を展開する",
  factoring: "定数項が負になる因数分解・2数の符号を見極める",
  "quadratic-solve": "因数分解が見えにくい形を、判別式と解の公式で解く",
  "perm-comb": "円順列と、同じものを含む順列",
  "sequence-sum": "等比数列の和と Σ(2k+m) 型を公式で計算する",
  quartiles: "8個（偶数個）のデータで、真ん中2つの平均が要る四分位数",
  "number-classification": "分数を小数にしたときの有限・循環を、分母の素因数から見分ける",
  "prime-factorization": "指数の設計図から約数の個数を数える",
  "simultaneous-equations": "係数のそろった文字を引き算で消す加減法",
  "parallel-lines-angles": "三角形の外角を内角から組み立てる",
  similarity: "面積比は相似比の2乗を使う",
  "trig-extension": "sin²θ+cos²θ=1 で鈍角の cos を求める",
  "function-notation": "定義域の端の値から値域を言い切る",
  "logic-converse": "逆の真偽を反例で判断する",
  "necessary-sufficient": "両方向の矢印が真になる必要十分（同値）まで判定する",
  "proof-fill": "連続する2つの整数の和が奇数になる証明を穴埋めで",
  "complementary-events": "さいころ2回の『少なくとも1回』を余事象で",
  "conditional-probability": "乗法定理 P(A∩B)=P(A)×P_A(B) で2回引きを組み立てる",
  "sum-and-general-term": "S_n−S_{n−1} で一般項の式まで取り出し、n=1 を照合する",
  "difference-sequences": "階差の和で第10項・第15項へ一気に跳ぶ",
  "recurrence-relations": "かけ算の漸化式から等比数列を見抜く",
  "exam-review": "少し進んだ問題から混合出題",
};

// 問題の目次は、対応する単元の学習順（learningPath 順）に並べる。
const unitOrder = new Map(units.map((unit) => [unit.id, unit.order]));
const firstLessonOrder = (practice) =>
  Math.min(...practice.lessonIds.map((lessonId) => unitOrder.get(lessonId) ?? Number.MAX_SAFE_INTEGER));

export const practiceCatalog = rawPracticeCatalog
  .map((practice) => ({
    ...practice,
    advancedLevel: "少し進んだ問題",
    advancedPolicy: advancedPolicies[practice.id],
  }))
  .sort((first, second) => firstLessonOrder(first) - firstLessonOrder(second));
