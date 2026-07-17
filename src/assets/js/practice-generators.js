// 練習問題の生成器（純関数群）。モード ID → 生成器の対応表もここ。
import { compactLinearExpression, compactPolynomial, factorText, linearText, sumExpression, term, vertexQuadraticExpression } from "./format.js";
import { choose, combination, fractionText, normalizeText, permutation, radicalTeX, randomInt, sameEquation, sameLinearExpression, sameRadical, sameRational } from "./math-utils.js";
import { euclideanDivisionSteps } from "./labs-view.js";

export function generateExpansionProblem() {
  const a = randomInt(1, 6);
  const b = randomInt(1, 6);
  const c = randomInt(2, 9);
  return {
    modeLabel: "展開・乗法公式",
    title: "乗法公式で係数を読む",
    prompt: `\\((x+${a})(x+${b})\\) を展開して \\(x^2+\\square x+\\triangle\\) の形にする`,
    steps: [
      {
        label: "x の係数",
        question: `\\(x\\) の係数 \\(\\square\\) は？`,
        hint: `外どうし・内どうしの積を足します。\\(x\\times${b}\\) と \\(${a}\\times x\\) で、係数は \\(${a}+${b}\\)。`,
        check: (input) => Number(normalizeText(input)) === a + b,
        answer: String(a + b),
      },
      {
        label: "定数項",
        question: "定数項 \\(\\triangle\\) は？",
        hint: `数どうしの積 \\(${a}\\times${b}\\) です。`,
        check: (input) => Number(normalizeText(input)) === a * b,
        answer: String(a * b),
      },
      {
        label: "和と差の積",
        question: `\\((x+${c})(x-${c})\\) を展開すると \\(x^2-\\square\\)。ひかれる数 \\(\\square\\) は？`,
        hint: `和と差の積は \\((x+a)(x-a)=x^2-a^2\\)。\\(x\\) の項は \\(-${c}x\\) と \\(+${c}x\\) で打ち消し合います。`,
        check: (input) => Number(normalizeText(input)) === c * c,
        answer: String(c * c),
      },
    ],
  };
}

export function generateFactoringProblem() {
  const p = randomInt(1, 6);
  let q = randomInt(2, 7);
  while (q === p) q = randomInt(2, 7);
  const sum = p + q;
  const product = p * q;
  const low = Math.min(p, q);
  const high = Math.max(p, q);
  return {
    modeLabel: "因数分解",
    title: "かけて c・たして b の2数さがし",
    prompt: `\\(x^2+${sum}x+${product}\\) を因数分解する`,
    steps: [
      {
        label: "2数をさがす",
        question: `かけて \\(${product}\\)、たして \\(${sum}\\) になる2つの数は？（カンマ区切り）`,
        hint: `かけて \\(${product}\\) になる組を書き出し、その中からたして \\(${sum}\\) になる組を選びます。`,
        check: (input) => sameNumberList(input, [p, q]),
        answer: `${low}, ${high}`,
      },
      {
        label: "式にまとめる",
        question: "因数分解した式は？（例：(x+1)(x+2)）",
        hint: "見つけた2数をそのまま入れて \\((x+\\square)(x+\\triangle)\\) の形に書きます。かっこの順番はどちらでも正解です。",
        check: (input) => {
          const text = normalizeText(input);
          return text === `(x+${p})(x+${q})` || text === `(x+${q})(x+${p})`;
        },
        answer: `(x+${low})(x+${high})`,
      },
    ],
  };
}

export function generateQuadraticSolveProblem() {
  const p = randomInt(1, 6);
  let q = randomInt(2, 7);
  while (q === p) q = randomInt(2, 7);
  const sum = p + q;
  const product = p * q;
  const low = Math.min(p, q);
  const high = Math.max(p, q);
  return {
    modeLabel: "二次方程式",
    title: "因数分解で二次方程式を解く",
    prompt: `二次方程式 \\(x^2-${sum}x+${product}=0\\) を解く`,
    steps: [
      {
        label: "因数分解",
        question: "左辺を因数分解すると？（例：(x-1)(x-2)）",
        hint: `かけて \\(+${product}\\)、たして \\(-${sum}\\) になる2数は \\(-${low}\\) と \\(-${high}\\) です。`,
        check: (input) => {
          const text = normalizeText(input).replace(/=0$/, "");
          return text === `(x-${p})(x-${q})` || text === `(x-${q})(x-${p})`;
        },
        answer: `(x-${low})(x-${high})`,
      },
      {
        label: "解を読む",
        question: "解は？（カンマ区切りで2つ）",
        hint: `かけ算が \\(0\\) になるのは、どちらかのかっこが \\(0\\) のとき。\\(x-${low}=0\\) または \\(x-${high}=0\\)。かっこの中の符号が反転して \\(x=${low},\\ ${high}\\)——ここが要注意。`,
        check: (input) => sameNumberList(String(input).replace(/x=/gi, ""), [p, q]),
        answer: `x=${low}, ${high}`,
      },
    ],
  };
}

export function generatePermCombProblem() {
  const n = randomInt(5, 7);
  const r = randomInt(2, 3);
  let perm = 1;
  for (let i = 0; i < r; i += 1) perm *= n - i;
  let rFactorial = 1;
  for (let i = 2; i <= r; i += 1) rFactorial *= i;
  const comb = perm / rFactorial;
  return {
    modeLabel: "順列と組合せ",
    title: "並べる P と選ぶ C",
    prompt: `\\(${n}\\) 人のグループで、順番をつけて \\(${r}\\) 人並べる場合と、区別なく \\(${r}\\) 人選ぶ場合を比べる`,
    steps: [
      {
        label: "順列",
        question: `\\({}_{${n}}P_{${r}}\\) の値は？`,
        hint: `\\(${n}\\) から始めて、1ずつ減らしながら \\(${r}\\) 個かけます。`,
        check: (input) => Number(normalizeText(input)) === perm,
        answer: String(perm),
      },
      {
        label: "組合せ",
        question: `\\({}_{${n}}C_{${r}}\\) の値は？`,
        hint: `順列 \\(${perm}\\) には、同じ \\(${r}\\) 人の並べ替え \\(${r}!=${rFactorial}\\) 通りが重複しています。\\(${perm}\\div${rFactorial}\\)。`,
        check: (input) => Number(normalizeText(input)) === comb,
        answer: String(comb),
      },
      {
        label: "使い分け",
        question: `${n}人から「代表${r}人」を選ぶときに使うのは P と C のどちら？`,
        hint: "代表どうしに順番や役割の区別はありません。区別がないなら、並べ替えのぶんを割った方を使います。",
        check: (input) => {
          // 模範解答の「C（組合せ）」のような括弧つき入力も受理する。
          const text = normalizeText(input).replace(/[（()）]/g, "");
          return ["c", "組合せ", "組み合わせ", "c組合せ", "c組み合わせ", `${n}c${r}`].includes(text);
        },
        answer: "C（組合せ）",
      },
    ],
  };
}

export function generateSequenceSumProblem() {
  const first = randomInt(1, 3);
  const ratio = choose([2, 3]);
  const targetIndex = ratio === 2 ? randomInt(5, 7) : randomInt(4, 5);
  const nth = first * ratio ** (targetIndex - 1);
  const firstTerms = [0, 1, 2, 3].map((k) => first * ratio ** k).join("\\ ");
  const sigmaN = randomInt(6, 12);
  const sigmaValue = (sigmaN * (sigmaN + 1)) / 2;
  return {
    modeLabel: "等比数列とΣ",
    title: "かけ算の繰り返しと和の公式",
    prompt: `数列 \\(${firstTerms}\\ \\dots\\) について調べ、最後にΣの公式を使う`,
    steps: [
      {
        label: "公比を読む",
        question: "隣どうしの比（公比）は？",
        hint: "2番目÷1番目を計算します。どの隣どうしでも同じ比になっています。",
        check: (input) => Number(normalizeText(input)) === ratio,
        answer: String(ratio),
      },
      {
        label: "一般項で一気に",
        question: `第 \\(${targetIndex}\\) 項は？`,
        hint: `\\(a_{${targetIndex}}=${first}\\times${ratio}^{${targetIndex - 1}}\\)。かける回数は番号より1つ少ない \\(${targetIndex - 1}\\) 回です。`,
        check: (input) => Number(normalizeText(input)) === nth,
        answer: String(nth),
      },
      {
        label: "Σの公式",
        question: `\\(\\displaystyle\\sum_{k=1}^{${sigmaN}}k\\)（\\(1\\) から \\(${sigmaN}\\) までの和）は？`,
        hint: `公式 \\(\\dfrac{n(n+1)}{2}\\) に \\(n=${sigmaN}\\) を入れます。「逆順に足して2で割る」工夫の結晶です。`,
        check: (input) => Number(normalizeText(input)) === sigmaValue,
        answer: String(sigmaValue),
      },
    ],
  };
}

export function generateQuartilesProblem() {
  let value = randomInt(3, 10);
  const values = [value];
  for (let i = 0; i < 6; i += 1) {
    value += randomInt(2, 6);
    values.push(value);
  }
  const q1 = values[1];
  const median = values[3];
  const q3 = values[5];
  const iqr = q3 - q1;
  return {
    modeLabel: "四分位数",
    title: "5つの数でデータを要約する",
    prompt: `小さい順に並んだ7個のデータ \\(${values.join("\\ ")}\\) を、箱ひげ図の材料に要約する`,
    steps: [
      {
        label: "中央値",
        question: "中央値（第2四分位数）は？",
        hint: "7個の真ん中は4番目の値です。",
        check: (input) => Number(normalizeText(input)) === median,
        answer: String(median),
      },
      {
        label: "第1四分位数",
        question: "第1四分位数 \\(Q_1\\) は？",
        hint: "中央値より下の3個（1〜3番目）の真ん中、つまり2番目の値です。",
        check: (input) => Number(normalizeText(input)) === q1,
        answer: String(q1),
      },
      {
        label: "第3四分位数",
        question: "第3四分位数 \\(Q_3\\) は？",
        hint: "中央値より上の3個（5〜7番目）の真ん中、つまり6番目の値です。",
        check: (input) => Number(normalizeText(input)) === q3,
        answer: String(q3),
      },
      {
        label: "四分位範囲",
        question: "四分位範囲（箱の長さ）は？",
        hint: `\\(Q_3-Q_1=${q3}-${q1}\\)。データのまん中の約半分が収まる幅です。`,
        check: (input) => Number(normalizeText(input)) === iqr,
        answer: String(iqr),
      },
    ],
  };
}

export const practiceGenerators = {
  integer: generateIntegerProblem,
  "absolute-value": generateAbsoluteValueProblem,
  exponent: generateExponentProblem,
  "arithmetic-sequence": generateArithmeticSequenceProblem,
  "venn-count": generateVennCountProblem,
  radical: generateRadicalProblem,
  "square-root-meaning": generateSquareRootMeaningProblem,
  "root-operations": generateRootOperationsProblem,
  substitution: generateSubstitutionProblem,
  combine: generateCombineProblem,
  distribute: generateDistributeProblem,
  equation: generateEquationProblem,
  sets: generateSetsProblem,
  identities: generateIdentitiesProblem,
  inequality: generateInequalityProblem,
  quadratic: generateQuadraticVertexProblem,
  "function-values": generateFunctionValuesProblem,
  "quadratic-sign": generateQuadraticSignProblem,
  trig: generateTrigProblem,
  "trig-survey": generateTrigSurveyProblem,
  "sine-cosine-rule": generateSineCosineRuleProblem,
  counting: generateCountingProblem,
  probability: generateProbabilityProblem,
  "data-summary": generateDataSummaryProblem,
  "data-analysis": generateDataAnalysisProblem,
  "geometry-properties": generateGeometryPropertiesProblem,
  "number-theory": generateNumberTheoryProblem,
  "geometry-basics": generateGeometryBasicsProblem,
  expansion: generateExpansionProblem,
  factoring: generateFactoringProblem,
  "quadratic-solve": generateQuadraticSolveProblem,
  "perm-comb": generatePermCombProblem,
  "sequence-sum": generateSequenceSumProblem,
  quartiles: generateQuartilesProblem,
};

export function generateAbsoluteValueProblem() {
  const negative = choose([-9, -8, -7, -6, -5, -4, -3]);
  const positive = choose([2, 3, 4, 5, 6, 7]);
  const distance = Math.abs(negative - positive);
  return {
    modeLabel: "絶対値",
    title: "0からの距離を読む",
    prompt: `数直線上の \\(${negative}\\) と \\(${positive}\\) について考える`,
    steps: [
      {
        label: "絶対値を読む",
        question: `\\(|${negative}|\\) は？`,
        hint: "絶対値は0からの距離。向きのマイナスは距離には付きません。",
        check: (input) => Number(normalizeText(input)) === Math.abs(negative),
        answer: String(Math.abs(negative)),
      },
      {
        label: "2数の距離",
        question: `\\(${negative}\\) と \\(${positive}\\) の距離は？`,
        hint: `2数の距離は \\(|${negative}-${positive}|\\) で求められます。`,
        check: (input) => Number(normalizeText(input)) === distance,
        answer: String(distance),
      },
    ],
  };
}

export function generateExponentProblem() {
  const base = choose(["a", "x", "2", "3"]);
  const m = choose([2, 3, 4, 5]);
  // 累乗の累乗（m×n）が「数えて確かめられる大きさ」を超えないよう抑える。
  const n = choose([2, 3, 4].filter((value) => m * value <= 12));
  const productExponent = m + n;
  const powerExponent = m * n;
  return {
    modeLabel: "指数法則",
    title: "かけ算の回数を数える",
    prompt: `\\(${base}^{${m}}\\) を使った計算`,
    steps: [
      {
        label: "積の指数",
        question: `\\(${base}^{${m}}\\times ${base}^{${n}}=${base}^{\\Box}\\) の \\(\\Box\\) は？`,
        hint: `\\(${m}\\) 回かけて、さらに \\(${n}\\) 回かけます。回数を足しましょう。`,
        check: (input) => Number(normalizeText(input)) === productExponent,
        answer: String(productExponent),
      },
      {
        label: "累乗の累乗",
        question: `\\((${base}^{${m}})^{${n}}=${base}^{\\Box}\\) の \\(\\Box\\) は？`,
        hint: `\\(${m}\\) 回かけたものを、まるごと \\(${n}\\) セット。回数はかけ算です。`,
        check: (input) => Number(normalizeText(input)) === powerExponent,
        answer: String(powerExponent),
      },
    ],
  };
}

export function generateArithmeticSequenceProblem() {
  const first = randomInt(1, 9);
  const difference = randomInt(2, 7);
  const targetIndex = randomInt(8, 15);
  const targetValue = first + (targetIndex - 1) * difference;
  const firstTerms = [0, 1, 2, 3].map((step) => first + step * difference).join("\\ ");
  return {
    modeLabel: "等差数列",
    title: "公差を見つけて一般項を使う",
    prompt: `数列 \\(${firstTerms}\\ \\dots\\) の第 \\(${targetIndex}\\) 項を求める`,
    steps: [
      {
        label: "公差を読む",
        question: "隣どうしの差（公差）は？",
        hint: "2番目から1番目を引きます。どの隣どうしでも同じ差になっています。",
        check: (input) => Number(normalizeText(input)) === difference,
        answer: String(difference),
      },
      {
        label: "一般項で一気に",
        question: `第 \\(${targetIndex}\\) 項は？`,
        hint: `\\(a_{${targetIndex}}=${first}+(${targetIndex}-1)\\times${difference}\\)。足す回数は \\(${targetIndex - 1}\\) 回です。`,
        check: (input) => Number(normalizeText(input)) === targetValue,
        answer: String(targetValue),
      },
    ],
  };
}

export function generateVennCountProblem() {
  const total = 40;
  const sizeA = randomInt(12, 20);
  const sizeB = randomInt(10, 18);
  const overlap = randomInt(4, Math.min(sizeA, sizeB) - 2);
  const union = sizeA + sizeB - overlap;
  const neither = total - union;
  return {
    modeLabel: "ベン図の個数",
    title: "重なりの二重カウントを防ぐ",
    prompt: `${total}人のクラスで、電車を使う人が \\(${sizeA}\\) 人、バスを使う人が \\(${sizeB}\\) 人、両方使う人が \\(${overlap}\\) 人いる`,
    steps: [
      {
        label: "少なくとも一方",
        question: "電車かバスの少なくとも一方を使う人は何人？",
        hint: `そのまま足すと両方の \\(${overlap}\\) 人を2回数えます。\\(${sizeA}+${sizeB}-${overlap}\\) を計算しましょう。`,
        check: (input) => Number(normalizeText(input)) === union,
        answer: String(union),
      },
      {
        label: "どちらでもない",
        question: "どちらも使わない人は何人？",
        hint: `全体の \\(${total}\\) 人から、少なくとも一方を使う人を引きます。`,
        check: (input) => Number(normalizeText(input)) === neither,
        answer: String(neither),
      },
    ],
  };
}

export function generateIntegerProblem() {
  const a = choose([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
  const b = choose([-5, -4, -3, -2, 2, 3, 4, 5]);
  const c = choose([-5, -4, -3, -2, 2, 3, 4, 5]);
  const product = b * c;
  const answer = a + product;
  return {
    modeLabel: "整数",
    title: "計算順序と符号",
    prompt: `\\(${a}+${factorText(b)}\\times${factorText(c)}\\)`,
    steps: [
      {
        label: "先に乗法を計算する",
        question: `\\(${factorText(b)}\\times${factorText(c)}\\) は？`,
        hint: "同じ符号なら正、違う符号なら負です。",
        check: (input) => Number(normalizeText(input)) === product,
        answer: String(product),
      },
      {
        label: "残った足し算・引き算を計算する",
        question: `\\(${sumExpression(a, product)}\\) は？`,
        hint: "数直線で、\\(a\\) から積の分だけ移動します。",
        check: (input) => Number(normalizeText(input)) === answer,
        answer: String(answer),
      },
    ],
  };
}

export function generateRadicalProblem() {
  const radicalCases = [
    { n: 8, base: 2, rest: 2 },
    { n: 12, base: 2, rest: 3 },
    { n: 18, base: 3, rest: 2 },
    { n: 20, base: 2, rest: 5 },
    { n: 24, base: 2, rest: 6 },
    { n: 27, base: 3, rest: 3 },
    { n: 28, base: 2, rest: 7 },
    { n: 32, base: 4, rest: 2 },
    { n: 45, base: 3, rest: 5 },
    { n: 48, base: 4, rest: 3 },
    { n: 50, base: 5, rest: 2 },
    { n: 72, base: 6, rest: 2 },
    { n: 75, base: 5, rest: 3 },
    { n: 80, base: 4, rest: 5 },
    { n: 98, base: 7, rest: 2 },
  ];
  const { n, base, rest } = choose(radicalCases);
  return {
    modeLabel: "ルート",
    title: "平方数を外へ出す",
    prompt: `\\(\\sqrt{${n}}\\) を簡単にする`,
    steps: [
      {
        label: "平方数の因数を見つける",
        question: `\\(${n}=\\Box\\times${rest}\\)。\\(\\Box\\) に入る平方数は？`,
        hint: `\\(${base}^2\\) を探してみましょう。`,
        check: (input) => Number(normalizeText(input)) === base * base,
        answer: String(base * base),
      },
      {
        label: "√の外へ出す",
        question: `\\(\\sqrt{${n}}=?\\)`,
        hint: `\\(\\sqrt{${base * base}}=${base}\\) です。`,
        check: (input) => sameRadical(input, base, rest),
        answer: `\\(${radicalTeX(base, rest)}\\)`,
      },
    ],
  };
}

export function generateSubstitutionProblem() {
  const a = randomInt(2, 4);
  const b = randomInt(-5, 5);
  const x = randomInt(-3, 5);
  const answer = a * x + b;
  const expression = compactLinearExpression(a, b);
  return {
    modeLabel: "文字式",
    title: "式の値",
    prompt: `\\(${expression}\\) に \\(x=${x}\\) を代入する`,
    steps: [
      {
        label: "文字を数に置き換える",
        question: `\\(${expression}\\) は、\\(x=${x}\\) のときどんな式？`,
        hint: `\\(${term(a)}\\) は \\(${a}\\times x\\) です。`,
        check: (input) => {
          const text = normalizeText(input);
          const constant = b === 0 ? "" : b < 0 ? String(b) : `+${b}`;
          const acceptable = [`${a}*${x}${constant}`, `${a}(${x})${constant}`, `${a}*(${x})${constant}`].map(normalizeText);
          return acceptable.includes(text);
        },
        answer: `\\(${a}\\times${factorText(x)}${b < 0 ? `-${Math.abs(b)}` : b > 0 ? `+${b}` : ""}\\)`,
      },
      {
        label: "数として計算する",
        question: "式の値は？",
        hint: "符号に注意して、先にかけ算をします。",
        check: (input) => Number(normalizeText(input)) === answer,
        answer: String(answer),
      },
    ],
  };
}

export function generateCombineProblem() {
  const p = randomInt(-5, 5) || 2;
  const q = randomInt(-5, 5) || -3;
  const r = randomInt(-6, 6) || 4;
  const s = randomInt(-6, 6) || -2;
  const xSum = p + q;
  const cSum = r + s;
  return {
    modeLabel: "文字式",
    title: "同類項をまとめる",
    prompt: `\\(${compactPolynomial([
      { value: p, variable: "x" },
      { value: q, variable: "x" },
      { value: r },
      { value: s },
    ])}\\)`,
    steps: [
      {
        label: "x の係数だけをまとめる",
        question: `\\(${sumExpression(p, q)}\\) は？`,
        hint: "\\(x\\) が何個分あるかを数えます。",
        check: (input) => Number(normalizeText(input)) === xSum,
        answer: String(xSum),
      },
      {
        label: "定数だけをまとめる",
        question: `\\(${sumExpression(r, s)}\\) は？`,
        hint: "\\(x\\) が付かない数どうしを計算します。",
        check: (input) => Number(normalizeText(input)) === cSum,
        answer: String(cSum),
      },
      {
        label: "ひとつの文字式にする",
        question: "整理した式は？",
        hint: `\\(${term(xSum)}\\) と \\(${cSum}\\) を並べます。`,
        check: (input) => sameLinearExpression(input, xSum, cSum),
        answer: `\\(${linearText(xSum, cSum)}\\)`,
      },
    ],
  };
}

export function generateDistributeProblem() {
  const a = choose([-4, -3, -2, 2, 3, 4]);
  const b = choose([-5, -4, -3, -2, 2, 3, 4, 5]);
  const xCoef = a;
  const constant = a * b;
  return {
    modeLabel: "分配法則",
    title: "かっこを外す",
    prompt: `\\(${a}(${compactPolynomial([{ value: 1, variable: "x" }, { value: b }])})\\) を展開する`,
    steps: [
      {
        label: "x の項へ配る",
        question: `\\(${a}\\times x\\) は？`,
        hint: "係数がそのまま x の係数になります。",
        check: (input) => sameLinearExpression(input, xCoef, 0),
        answer: `\\(${term(xCoef)}\\)`,
      },
      {
        label: "定数項へ配る",
        question: `\\(${a}\\times${factorText(b)}\\) は？`,
        hint: "負の数をかけるときは符号に注意。",
        check: (input) => Number(normalizeText(input)) === constant,
        answer: String(constant),
      },
      {
        label: "展開した式を書く",
        question: "展開した結果は？",
        hint: `\\(${term(xCoef)}\\) と \\(${constant}\\) を足した形です。`,
        check: (input) => sameLinearExpression(input, xCoef, constant),
        answer: `\\(${linearText(xCoef, constant)}\\)`,
      },
    ],
  };
}

export function generateEquationProblem() {
  const a = randomInt(2, 5);
  const x = randomInt(1, 6);
  const b = randomInt(1, 6);
  const c = a * x + b;
  return {
    modeLabel: "方程式",
    title: "x袋を一人にする",
    prompt: `\\(${compactLinearExpression(a, b)}=${c}\\)`,
    steps: [
      {
        label: "余分な1ブロックを取る",
        question: `左右から \\(${b}\\) この1ブロックを取ると、右辺は？`,
        hint: `式では、両辺から \\(${b}\\) を引きます。ブロックで見ると、同じ数だけ取りのぞきます。`,
        check: (input) => Number(normalizeText(input).replace(`${a}x=`, "")) === c - b || sameEquation(input, a, -(c - b)),
        answer: `\\(${term(a)}=${c - b}\\)`,
      },
      {
        label: "x袋の数で分ける",
        question: "\\(x\\) 袋1つの中身は？",
        hint: `残ったブロックを \\(${a}\\) このx袋に同じ数ずつ分けます。式では両辺を \\(${a}\\) で割ります。`,
        check: (input) => normalizeText(input) === `x=${x}` || Number(normalizeText(input)) === x,
        answer: `\\(x=${x}\\)`,
      },
    ],
  };
}

export function sameInequalityAnswer(input, sign, boundary) {
  const text = normalizeText(input).replace("＜", "<").replace("＞", ">");
  const compact = text.replace(/^x/, "");
  return (
    text === `x${sign}${boundary}` ||
    compact === `${sign}${boundary}` ||
    text === `${boundary}${sign === "<" ? ">x" : "<x"}`
  );
}

export function generateInequalityProblem() {
  const a = choose([-4, -3, -2, 2, 3, 4]);
  const boundary = randomInt(-4, 5);
  const b = randomInt(-5, 5);
  const c = a * boundary + b;
  const right = c - b;
  const sign = a > 0 ? "<" : ">";
  return {
    modeLabel: "数I",
    title: "一次不等式",
    prompt: `\\(${compactLinearExpression(a, b)}<${c}\\)`,
    steps: [
      {
        label: "定数項を右辺へ移す",
        question: `\\(${term(a)}<\\Box\\) の \\(\\Box\\) は？`,
        hint: b < 0 ? `両辺に \\(${Math.abs(b)}\\) を足します。` : `両辺から \\(${b}\\) を引きます。`,
        check: (input) => Number(normalizeText(input)) === right,
        answer: String(right),
      },
      {
        label: "係数で割る",
        question: "\\(x\\) の範囲は？",
        hint: a < 0 ? "負の数で割るので、不等号の向きが変わります。" : "正の数で割るので、不等号の向きはそのままです。",
        check: (input) => sameInequalityAnswer(input, sign, boundary),
        answer: `\\(x${sign}${boundary}\\)`,
      },
    ],
  };
}

export function samePoint(input, x, y) {
  const text = normalizeText(input).replace(/[()（）]/g, "");
  return text === `${x},${y}` || text === `${x}、${y}`;
}

export function generateQuadraticVertexProblem() {
  const a = choose([-2, -1, 1, 2]);
  const h = randomInt(-3, 4);
  const k = randomInt(-5, 5);
  return {
    modeLabel: "数I",
    title: "頂点と最大・最小",
    prompt: `\\(y=${vertexQuadraticExpression(a, h, k)}\\)`,
    steps: [
      {
        label: "頂点を読む",
        question: "頂点の座標は？",
        hint: "頂点形式 \\(y=a(x-p)^2+q\\) では、\\(p\\) が横位置、\\(q\\) が高さです。",
        check: (input) => samePoint(input, h, k),
        answer: `\\((${h},${k})\\)`,
      },
      {
        label: a > 0 ? "最小値を読む" : "最大値を読む",
        question: a > 0 ? "最小値は？" : "最大値は？",
        hint: a > 0 ? "下に凸なので頂点の y 座標が最小値です。" : "上に凸なので頂点の y 座標が最大値です。",
        check: (input) => Number(normalizeText(input)) === k,
        answer: String(k),
      },
    ],
  };
}

export function generateTrigProblem() {
  const triangles = [
    { opposite: 3, adjacent: 4, hyp: 5 },
    { opposite: 5, adjacent: 12, hyp: 13 },
    { opposite: 8, adjacent: 15, hyp: 17 },
  ];
  const tri = choose(triangles);
  return {
    modeLabel: "数I",
    title: "三角比",
    prompt: `直角三角形で、角 \\(\\theta\\) の対辺が \\(${tri.opposite}\\)、隣辺が \\(${tri.adjacent}\\)、斜辺が \\(${tri.hyp}\\)`,
    steps: [
      {
        label: "\\(\\sin\\theta\\)",
        question: "\\(\\sin\\theta\\) は？",
        hint: "\\(\\sin\\theta=\\dfrac{\\text{対辺}}{\\text{斜辺}}\\) です。",
        check: (input) => sameRational(input, tri.opposite, tri.hyp),
        answer: `\\(${fractionText(tri.opposite, tri.hyp)}\\)`,
      },
      {
        label: "\\(\\cos\\theta\\)",
        question: "\\(\\cos\\theta\\) は？",
        hint: "\\(\\cos\\theta=\\dfrac{\\text{隣辺}}{\\text{斜辺}}\\) です。",
        check: (input) => sameRational(input, tri.adjacent, tri.hyp),
        answer: `\\(${fractionText(tri.adjacent, tri.hyp)}\\)`,
      },
      {
        label: "\\(\\tan\\theta\\)",
        question: "\\(\\tan\\theta\\) は？",
        hint: "\\(\\tan\\theta=\\dfrac{\\text{対辺}}{\\text{隣辺}}\\) です。",
        check: (input) => sameRational(input, tri.opposite, tri.adjacent),
        answer: `\\(${fractionText(tri.opposite, tri.adjacent)}\\)`,
      },
    ],
  };
}

export function generateTrigSurveyProblem() {
  const scenarios = [
    () => {
      const length = choose([6, 8, 10, 12]);
      return {
        prompt: `長さ \\(${length}\\) mのはしごを、地面から \\(30^\\circ\\) の角度で壁に立てかけました。はしごの先が届く高さは何mでしょう。`,
        ratio: "sin",
        ratioQuestion: "\\(\\sin30^\\circ\\) の値は？",
        ratioHint: "三角定規の比 \\(1:2:\\sqrt3\\) で、\\(30^\\circ\\) の対辺は斜辺の半分です。",
        ratioCheck: (input) => sameRational(input, 1, 2),
        ratioAnswer: "1/2",
        formula: `${length}\\times\\sin30^\\circ=${length}\\times\\dfrac12`,
        answer: length / 2,
        why: "はしご（斜辺）と角度から高さ（対辺）を求めるので \\(\\sin\\)",
      };
    },
    () => {
      const distance = choose([5, 7, 9, 12]);
      return {
        prompt: `木から \\(${distance}\\) m離れた地点で、木のてっぺんを見上げる角度を測ったら、ちょうど \\(45^\\circ\\) でした。木の高さは何mでしょう（目の高さは考えません）。`,
        ratio: "tan",
        ratioQuestion: "\\(\\tan45^\\circ\\) の値は？",
        ratioHint: "\\(45^\\circ\\) の直角二等辺三角形では、対辺と隣辺が同じ長さです。",
        ratioCheck: (input) => Number(normalizeText(input)) === 1,
        ratioAnswer: "1",
        formula: `${distance}\\times\\tan45^\\circ=${distance}\\times1`,
        answer: distance,
        why: "水平距離（隣辺）から高さ（対辺）を求めるので \\(\\tan\\)",
      };
    },
    () => {
      const length = choose([6, 8, 10, 14]);
      return {
        prompt: `長さ \\(${length}\\) mのロープを、支柱の先から地面へ \\(60^\\circ\\) の角度でピンと張りました。ロープの根元は、支柱の真下から何m離れているでしょう。`,
        ratio: "cos",
        ratioQuestion: "\\(\\cos60^\\circ\\) の値は？",
        ratioHint: "三角定規の比 \\(1:2:\\sqrt3\\) で、\\(60^\\circ\\) の隣辺は斜辺の半分です。",
        ratioCheck: (input) => sameRational(input, 1, 2),
        ratioAnswer: "1/2",
        formula: `${length}\\times\\cos60^\\circ=${length}\\times\\dfrac12`,
        answer: length / 2,
        why: "ロープ（斜辺）と角度から水平方向の距離（隣辺）を求めるので \\(\\cos\\)",
      };
    },
  ];
  const scenario = choose(scenarios)();
  return {
    modeLabel: "三角比の応用",
    title: "三角比で長さを測る",
    prompt: scenario.prompt,
    steps: [
      {
        label: "使う三角比",
        question: "sin・cos・tan のどれを使う？",
        hint: "分かっている辺と求めたい辺が、角から見て「対辺・隣辺・斜辺」のどれとどれかを考えます。",
        check: (input) => normalizeText(input).includes(scenario.ratio),
        answer: scenario.ratio,
      },
      {
        label: "比の値",
        question: scenario.ratioQuestion,
        hint: scenario.ratioHint,
        check: scenario.ratioCheck,
        answer: scenario.ratioAnswer,
      },
      {
        label: "長さを求める",
        question: "求める長さは何m？",
        hint: `${scenario.why}。\\(${scenario.formula}\\) を計算します。`,
        check: (input) => Number(normalizeText(input).replace(/m$/, "")) === scenario.answer,
        answer: String(scenario.answer),
      },
    ],
  };
}

export function generateCountingProblem() {
  const cases = [
    { mode: "permutation", n: 4, r: 2 },
    { mode: "permutation", n: 5, r: 2 },
    { mode: "permutation", n: 6, r: 2 },
    { mode: "permutation", n: 4, r: 3 },
    { mode: "permutation", n: 5, r: 3 },
    { mode: "combination", n: 4, r: 2 },
    { mode: "combination", n: 5, r: 2 },
    { mode: "combination", n: 6, r: 2 },
    { mode: "combination", n: 5, r: 3 },
    { mode: "combination", n: 6, r: 3 },
  ];
  const { mode, n, r } = choose(cases);
  const total = mode === "permutation" ? permutation(n, r) : combination(n, r);
  return {
    modeLabel: "数A",
    title: mode === "permutation" ? "順列" : "組合せ",
    prompt:
      mode === "permutation"
        ? `\\(${n}\\) 人から \\(${r}\\) 人を選んで一列に並べる`
        : `\\(${n}\\) 人から \\(${r}\\) 人を選ぶ`,
    steps: [
      {
        label: "順序を区別するか",
        question: "使う考え方は？（順列 / 組合せ）",
        hint: mode === "permutation" ? "並べるので順序を区別します。" : "選ぶだけなので順序を区別しません。",
        check: (input) => {
          const text = normalizeText(input);
          return mode === "permutation" ? text.includes("順列") || text === "p" : text.includes("組合") || text === "c";
        },
        answer: mode === "permutation" ? "順列" : "組合せ",
      },
      {
        label: "総数を求める",
        question: "全部で何通り？",
        hint:
          mode === "permutation"
            ? `\\({}_{${n}}P_{${r}}\\) を計算します。`
            : `\\({}_{${n}}C_{${r}}\\) を計算します。`,
        check: (input) => Number(normalizeText(input)) === total,
        answer: String(total),
      },
    ],
  };
}

export function generateProbabilityProblem() {
  const ballCases = [
    { red: 2, blue: 3 },
    { red: 3, blue: 2 },
    { red: 3, blue: 4 },
    { red: 4, blue: 3 },
    { red: 2, blue: 4 },
    { red: 4, blue: 2 },
  ];
  const { red, blue } = choose(ballCases);
  const total = red + blue;
  const replace = choose([true, false]);
  const secondRed = replace ? red : red - 1;
  const secondTotal = replace ? total : total - 1;
  const rrNumerator = red * secondRed;
  const rrDenominator = total * secondTotal;
  return {
    modeLabel: "数A",
    title: replace ? "独立な試行" : "戻さない確率",
    prompt: `赤玉 \\(${red}\\) 個、青玉 \\(${blue}\\) 個の袋から、${replace ? "戻して" : "戻さず"}2回取り出す。赤赤の確率を求める。`,
    steps: [
      {
        label: "1回目が赤",
        question: "1回目が赤の確率は？",
        hint: "赤玉の数を全体の数で割ります。",
        check: (input) => sameRational(input, red, total),
        answer: `\\(${fractionText(red, total)}\\)`,
      },
      {
        label: "2回目も赤",
        question: "1回目に赤が出た後、2回目も赤の確率は？",
        hint: replace ? "戻すので袋の中身は最初と同じです。" : "戻さないので、赤玉も全体も1つずつ減ります。",
        check: (input) => sameRational(input, secondRed, secondTotal),
        answer: `\\(${fractionText(secondRed, secondTotal)}\\)`,
      },
      {
        label: "枝をかける",
        question: "赤赤の確率は？",
        hint: "1回目の確率と2回目の確率をかけます。",
        check: (input) => sameRational(input, rrNumerator, rrDenominator),
        answer: `\\(${fractionText(rrNumerator, rrDenominator)}\\)`,
      },
    ],
  };
}

export function samePlusMinus(input, value) {
  const text = normalizeText(input)
    .replace(/^x=/, "")
    .replace(/[(){}]/g, "")
    .replace(/±/g, "+/-")
    .replace(/[、，;]/g, ",");
  if ([`+/-${value}`, `-${value},${value}`, `${value},-${value}`].includes(text)) return true;
  const values = text
    .split(",")
    .map(Number)
    .filter((item) => Number.isFinite(item))
    .sort((a, b) => a - b);
  return values.length === 2 && values[0] === -value && values[1] === value;
}

export function sameNumberList(input, expected) {
  const values = normalizeText(input)
    .replace(/[{}()（）]/g, "")
    .replace(/[、，;]/g, ",")
    .split(",")
    .filter(Boolean)
    .map(Number)
    .sort((a, b) => a - b);
  const target = [...expected].sort((a, b) => a - b);
  return values.length === target.length && values.every((value, index) => value === target[index]);
}

export function generateSquareRootMeaningProblem() {
  const root = randomInt(2, 10);
  const square = root ** 2;
  return {
    modeLabel: "数I",
    title: "平方根と√の違い",
    prompt: `\\(x^2=${square}\\) と \\(\\sqrt{${square}}\\) を区別する`,
    steps: [
      {
        label: "√の値を求める",
        question: `\\(\\sqrt{${square}}\\) は？`,
        hint: "√は0以上の平方根を表します。",
        check: (input) => Number(normalizeText(input)) === root,
        answer: String(root),
      },
      {
        label: "方程式の解を求める",
        question: `\\(x^2=${square}\\) の解を二つ書くと？`,
        hint: `\\(${root}^2\\) だけでなく \\((-${root})^2\\) も \\(${square}\\) です。`,
        check: (input) => samePlusMinus(input, root),
        answer: `\\(x=\\pm${root}\\)`,
      },
    ],
  };
}

export function generateRootOperationsProblem() {
  const useAddition = choose([true, false]);
  if (useAddition) {
    const radicand = choose([2, 3, 5, 7]);
    const first = randomInt(1, 5);
    const second = choose([-2, -1, 2, 3, 4].filter((value) => first + value !== 0));
    const total = first + second;
    const expression = `${radicalTeX(first, radicand)}${second < 0 ? "-" : "+"}${radicalTeX(Math.abs(second), radicand)}`;
    return {
      modeLabel: "数I",
      title: "同じルートをまとめる",
      prompt: `\\(${expression}\\)`,
      steps: [
        {
          label: "係数だけを計算する",
          question: `\\(${sumExpression(first, second)}\\) は？`,
          hint: `\\(\\sqrt{${radicand}}\\) を同じ種類のカードとして数えます。`,
          check: (input) => Number(normalizeText(input)) === total,
          answer: String(total),
        },
        {
          label: "ルートを付けて答える",
          question: "まとめた結果は？",
          hint: `係数 \\(${total}\\) と \\(\\sqrt{${radicand}}\\) を組み合わせます。`,
          check: (input) => sameRadical(input, total, radicand),
          answer: `\\(${radicalTeX(total, radicand)}\\)`,
        },
      ],
    };
  }

  const multiplicationCases = [
    { left: 2, right: 8, coef: 4, rest: 1 },
    { left: 3, right: 12, coef: 6, rest: 1 },
    { left: 6, right: 3, coef: 3, rest: 2 },
    { left: 2, right: 18, coef: 6, rest: 1 },
    { left: 2, right: 6, coef: 2, rest: 3 },
  ];
  const problem = choose(multiplicationCases);
  const product = problem.left * problem.right;
  return {
    modeLabel: "数I",
    title: "ルートのかけ算",
    prompt: `\\(\\sqrt{${problem.left}}\\times\\sqrt{${problem.right}}\\)`,
    steps: [
      {
        label: "ルートの中をかける",
        question: "一つの√にまとめると、√の中はいくつ？",
        hint: `\\(\\sqrt{a}\\sqrt{b}=\\sqrt{ab}\\) を使います。`,
        check: (input) => Number(normalizeText(input)) === product,
        answer: String(product),
      },
      {
        label: "平方数を外へ出す",
        question: "最も簡単な形は？",
        hint: "ルートの中にある最大の平方数を探します。",
        check: (input) => sameRadical(input, problem.coef, problem.rest),
        answer: `\\(${radicalTeX(problem.coef, problem.rest)}\\)`,
      },
    ],
  };
}

export function generateSetsProblem() {
  const useCards = choose([true, false]);
  if (useCards) {
    const operation = choose(["intersection", "union"]);
    const expected = operation === "intersection" ? [6, 12] : [2, 3, 4, 6, 8, 9, 10, 12];
    return {
      modeLabel: "数I",
      title: operation === "intersection" ? "集合の共通部分" : "集合の和集合",
      prompt: "全体を1から12までの整数とし、\\(A\\) を偶数、\\(B\\) を3の倍数の集合とする。",
      steps: [
        {
          label: "記号の意味を読む",
          question: operation === "intersection" ? "\\(A\\cap B\\) は共通部分・和集合のどちら？" : "\\(A\\cup B\\) は共通部分・和集合のどちら？",
          hint: operation === "intersection" ? "\\(\\cap\\) は両方に入る部分です。" : "\\(\\cup\\) は少なくとも一方に入る部分です。",
          check: (input) => normalizeText(input).includes(operation === "intersection" ? "共通" : "和集合"),
          answer: operation === "intersection" ? "共通部分" : "和集合",
        },
        {
          label: "要素を並べる",
          question: "入る数を小さい順に、カンマで区切って書くと？",
          hint: operation === "intersection" ? "偶数かつ3の倍数、つまり6の倍数を探します。" : "偶数または3の倍数を集め、重なった数は一度だけ書きます。",
          check: (input) => sameNumberList(input, expected),
          answer: `{ ${expected.join(", ")} }`,
        },
      ],
    };
  }

  const proposition = choose([
    { prompt: "整数が4の倍数なら、その整数は偶数である", truth: true, counterexample: null },
    { prompt: "整数が偶数なら、その整数は4の倍数である", truth: false, counterexample: 2 },
    { prompt: "整数が3の倍数なら、その整数は6の倍数である", truth: false, counterexample: 3 },
  ]);
  return {
    modeLabel: "数I",
    title: "命題と反例",
    prompt: `命題「${proposition.prompt}」`,
    steps: [
      {
        label: "真偽を判断する",
        question: "真・偽のどちら？",
        hint: "『すべて』成り立つか、小さい整数で確かめます。",
        check: (input) => normalizeText(input).includes(proposition.truth ? "真" : "偽"),
        answer: proposition.truth ? "真" : "偽",
      },
      proposition.truth
        ? {
            label: "集合の箱へ戻す",
            question: "4の倍数の集合は、偶数の集合の内側・外側のどちら？",
            hint: "4、8、12、…は、すべて偶数の箱にも入ります。",
            check: (input) => ["内", "中", "含"].some((word) => normalizeText(input).includes(word)),
            answer: "内側（偶数の集合に含まれる）",
          }
        : {
            label: "反例を一つ挙げる",
            question: "命題を偽にする最小の正の整数は？",
            hint: "前の条件を満たすが、後ろの条件を満たさない数を探します。",
            check: (input) => Number(normalizeText(input)) === proposition.counterexample,
            answer: String(proposition.counterexample),
          },
    ],
  };
}

export function generateIdentitiesProblem() {
  const identity = choose([true, false]);
  const multiplier = randomInt(2, 4);
  const constant = randomInt(1, 5);
  if (identity) {
    const expanded = multiplier * constant;
    return {
      modeLabel: "数I",
      title: "恒等式か方程式か",
      prompt: `\\(${multiplier}(x+${constant})=${term(multiplier)}+${expanded}\\)`,
      steps: [
        {
          label: "式の役割を分ける",
          question: "恒等式・方程式のどちら？",
          hint: "どの \\(x\\) を入れても左右が同じかを考えます。",
          check: (input) => normalizeText(input).includes("恒等"),
          answer: "恒等式",
        },
        {
          label: "一つの値で確かめる",
          question: `\\(x=2\\) のとき、左右の値はいくつ？`,
          hint: "左辺と右辺を別々に計算します。",
          check: (input) => Number(normalizeText(input)) === multiplier * (2 + constant),
          answer: String(multiplier * (2 + constant)),
        },
      ],
    };
  }

  const solution = randomInt(1, 6);
  const right = multiplier * solution + constant;
  return {
    modeLabel: "数I",
    title: "恒等式か方程式か",
    prompt: `\\(${compactLinearExpression(multiplier, constant)}=${right}\\)`,
    steps: [
      {
        label: "式の役割を分ける",
        question: "恒等式・方程式のどちら？",
        hint: "ある \\(x\\) の値でだけ左右が等しくなる式です。",
        check: (input) => normalizeText(input).includes("方程"),
        answer: "方程式",
      },
      {
        label: "成り立つ値を求める",
        question: "\\(x\\) は？",
        hint: `両辺から \\(${constant}\\) を引き、\\(${multiplier}\\) で割ります。`,
        check: (input) => Number(normalizeText(input).replace(/^x=/, "")) === solution,
        answer: `\\(x=${solution}\\)`,
      },
    ],
  };
}

export function generateFunctionValuesProblem() {
  const slope = choose([-3, -2, 2, 3]);
  const intercept = randomInt(-4, 4);
  const x = randomInt(-3, 4);
  const y = slope * x + intercept;
  return {
    modeLabel: "数I",
    title: "関数の入力と出力",
    prompt: `関数 \\(y=${compactLinearExpression(slope, intercept)}\\) に \\(x=${x}\\) を入れる`,
    steps: [
      {
        label: "xを数に置き換える",
        question: "代入した計算式の、かけ算の結果は？",
        hint: `まず \\(${slope}\\times${factorText(x)}\\) を計算します。`,
        check: (input) => Number(normalizeText(input)) === slope * x,
        answer: String(slope * x),
      },
      {
        label: "出力yを求める",
        question: "\\(y\\) は？",
        hint: `かけ算の結果に切片 \\(${intercept}\\) を加えます。`,
        check: (input) => Number(normalizeText(input).replace(/^y=/, "")) === y,
        answer: `\\(y=${y}\\)`,
      },
    ],
  };
}

export function sameOutsideInterval(input, lower, upper) {
  const text = normalizeText(input)
    .replace(/[＜]/g, "<")
    .replace(/[＞]/g, ">")
    .replace(/または|or|、|，|;/g, ",");
  const left = text.includes(`x<${lower}`) || text.includes(`${lower}>x`);
  const right = text.includes(`${upper}<x`) || text.includes(`x>${upper}`);
  return left && right;
}

export function generateQuadraticSignProblem() {
  // 根が 0 だと因数の表示が (x) になって読みにくいので引き直す。
  let lower = randomInt(-4, 1);
  let upper = lower + randomInt(2, 5);
  while (lower === 0 || upper === 0) {
    lower = randomInt(-4, 1);
    upper = lower + randomInt(2, 5);
  }
  const leftFactor = lower < 0 ? `x+${Math.abs(lower)}` : lower > 0 ? `x-${lower}` : "x";
  const rightFactor = upper < 0 ? `x+${Math.abs(upper)}` : upper > 0 ? `x-${upper}` : "x";
  return {
    modeLabel: "数I",
    title: "二次不等式をグラフで読む",
    prompt: `\\((${leftFactor})(${rightFactor})>0\\)`,
    steps: [
      {
        label: "x軸との交点を読む",
        question: "二つの境目を小さい順に、カンマで区切ると？",
        hint: "各因数が0になる値を求めます。",
        check: (input) => sameNumberList(input, [lower, upper]),
        answer: `${lower}, ${upper}`,
      },
      {
        label: "正になる側を選ぶ",
        question: "上に開く放物線がx軸より上なのは、根の間・根の外側のどちら？",
        hint: "上に開く放物線は、二つの交点の外側でx軸より上になります。",
        check: (input) => normalizeText(input).includes("外"),
        answer: "根の外側",
      },
      {
        label: "解を不等式で書く",
        question: "解は？（二つの範囲をカンマで区切る）",
        hint: `左は \\(x<${lower}\\)、右は \\(${upper}<x\\) です。`,
        check: (input) => sameOutsideInterval(input, lower, upper),
        answer: `\\(x<${lower},\\ ${upper}<x\\)`,
      },
    ],
  };
}

export function generateSineCosineRuleProblem() {
  const useSineRule = choose([true, false]);
  if (useSineRule) {
    const sideA = choose([2, 3, 4]);
    const sideB = sideA * 2;
    return {
      modeLabel: "数I",
      title: "正弦定理",
      prompt: `三角形で \\(A=30^\\circ\\)、\\(B=90^\\circ\\)、\\(a=${sideA}\\)。辺 \\(b\\) を求める。`,
      steps: [
        {
          label: "辺と向かいの角を対応させる",
          question: "\\(\\sin30^\\circ\\) は？",
          hint: "30°・60°・90°の直角三角形の代表値です。",
          check: (input) => sameRational(input, 1, 2),
          answer: `\\(\\frac12\\)`,
        },
        {
          label: "正弦定理へ代入する",
          question: `\\(\\dfrac{${sideA}}{1/2}=\\dfrac{b}{1}\\) より、\\(b\\) は？`,
          hint: `\\(${sideA}\\div\\frac12\\) を計算します。`,
          check: (input) => Number(normalizeText(input).replace(/^b=/, "")) === sideB,
          answer: `\\(b=${sideB}\\)`,
        },
      ],
    };
  }

  const side = randomInt(3, 7);
  return {
    modeLabel: "数I",
    title: "余弦定理",
    prompt: `三角形で \\(b=c=${side}\\)、その間の角 \\(A=60^\\circ\\)。辺 \\(a\\) を求める。`,
    steps: [
      {
        label: "角の代表値を使う",
        question: "\\(\\cos60^\\circ\\) は？",
        hint: "正三角形を半分にした図を思い出します。",
        check: (input) => sameRational(input, 1, 2),
        answer: `\\(\\frac12\\)`,
      },
      {
        label: "余弦定理を計算する",
        question: `\\(a^2=${side}^2+${side}^2-2\\times${side}\\times${side}\\times\\frac12\\) は？`,
        hint: "最後の項は \\(2bc\\cos A=bc\\) になります。",
        check: (input) => Number(normalizeText(input)) === side ** 2,
        answer: String(side ** 2),
      },
      {
        label: "辺の長さを答える",
        question: "正の長さ \\(a\\) は？",
        hint: `\\(a^2=${side ** 2}\\) で、辺の長さは正です。`,
        check: (input) => Number(normalizeText(input).replace(/^a=/, "")) === side,
        answer: `\\(a=${side}\\)`,
      },
    ],
  };
}

export function generateDataSummaryProblem() {
  const values = choose([
    [1, 2, 2, 5, 20],
    [2, 4, 6, 8],
    [3, 3, 5, 7, 7],
    [4, 5, 5, 6, 10],
  ]);
  const total = values.reduce((sum, value) => sum + value, 0);
  const mean = total / values.length;
  const middle = Math.floor(values.length / 2);
  const median = values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2;
  const range = values.at(-1) - values[0];
  return {
    modeLabel: "データ",
    title: "平均・中央値・範囲",
    prompt: `小さい順に並んだデータ \\( ${values.join(", ")} \\)`,
    steps: [
      {
        label: "合計する",
        question: "すべての値の合計は？",
        hint: "平均は、この合計を個数で割って求めます。",
        check: (input) => Number(normalizeText(input)) === total,
        answer: String(total),
      },
      {
        label: "平均を求める",
        question: `合計を \\(${values.length}\\) で割った平均は？`,
        hint: `\\(${total}\\div${values.length}\\) を計算します。`,
        check: (input) => Number(normalizeText(input)) === mean,
        answer: String(mean),
      },
      {
        label: "中央値を求める",
        question: "小さい順の中央にある値は？",
        hint: values.length % 2 ? "中央の1個を見ます。" : "中央の2個を足して2で割ります。",
        check: (input) => Number(normalizeText(input)) === median,
        answer: String(median),
      },
      {
        label: "範囲を求める",
        question: "最大値−最小値は？",
        hint: `\\(${values.at(-1)}-${values[0]}\\) を計算します。`,
        check: (input) => Number(normalizeText(input)) === range,
        answer: String(range),
      },
    ],
  };
}

export function generateDataAnalysisProblem() {
  const center = choose([5, 8, 10, 12]);
  const distance = choose([1, 2, 3]);
  const values = [center - distance, center - distance, center + distance, center + distance];
  return {
    modeLabel: "数I",
    title: "分散と標準偏差",
    prompt: `データ \\( ${values.join(", ")} \\) の分散と標準偏差を求める`,
    steps: [
      {
        label: "平均を求める",
        question: "平均は？",
        hint: "4個を合計して4で割ります。",
        check: (input) => Number(normalizeText(input)) === center,
        answer: String(center),
      },
      {
        label: "偏差の大きさを見る",
        question: "各値と平均の差の絶対値は？",
        hint: `どの値も平均 \\(${center}\\) から同じだけ離れています。`,
        check: (input) => Number(normalizeText(input)) === distance,
        answer: String(distance),
      },
      {
        label: "分散を求める",
        question: "偏差の2乗の平均は？",
        hint: `四つの偏差を2乗すると、すべて \\(${distance ** 2}\\) です。`,
        check: (input) => Number(normalizeText(input)) === distance ** 2,
        answer: String(distance ** 2),
      },
      {
        label: "標準偏差を求める",
        question: "分散の正の平方根は？",
        hint: "標準偏差は分散の平方根です。",
        check: (input) => Number(normalizeText(input)) === distance,
        answer: String(distance),
      },
    ],
  };
}

export function generateGeometryPropertiesProblem() {
  const centralAngle = choose([60, 80, 100, 120, 140, 180]);
  const inscribedAngle = centralAngle / 2;
  return {
    modeLabel: "数A",
    title: "円周角",
    prompt: `弧 \\(AC\\) に対する中心角が \\(${centralAngle}^\\circ\\) のとき、同じ弧を見込む円周角 \\(\\angle ABC\\) を求める。`,
    steps: [
      {
        label: "中心角との関係を使う",
        question: "円周角は中心角の何分の1？",
        hint: "同じ弧に対する円周角は中心角の半分です。",
        check: (input) => sameRational(input, 1, 2) || normalizeText(input).includes("半分"),
        answer: `\\(\\frac12\\)`,
      },
      {
        label: "角度を求める",
        question: "\\(\\angle ABC\\) は何度？",
        hint: `\\(${centralAngle}\\div2\\) を計算します。`,
        check: (input) => Number(normalizeText(input).replace(/度|°/g, "")) === inscribedAngle,
        answer: `${inscribedAngle}°`,
      },
    ],
  };
}

export function generateNumberTheoryProblem() {
  const [first, second] = choose([
    [84, 30],
    [72, 30],
    [54, 24],
    [48, 18],
    [45, 30],
  ]);
  const { steps: divisions, commonDivisor } = euclideanDivisionSteps(first, second);
  const steps = divisions.map(({ dividend, divisor, remainder }, index) => ({
    label: `割り算 ${index + 1}`,
    question: `\\(${dividend}\\) を \\(${divisor}\\) で割った余りは？`,
    hint: `\\(${dividend}=${divisor}\\times\\Box+\\text{余り}\\) と書きます。`,
    check: (input) => Number(normalizeText(input)) === remainder,
    answer: String(remainder),
  }));
  steps.push({
    label: "最大公約数を読む",
    question: "余りが0になったときの割る数、つまり最大公約数は？",
    hint: "最後の0でない余りと同じ数です。",
    check: (input) => Number(normalizeText(input)) === commonDivisor,
    answer: String(commonDivisor),
  });
  return {
    modeLabel: "数A",
    title: "ユークリッドの互除法",
    prompt: `\\(${first}\\) と \\(${second}\\) の最大公約数を求める`,
    steps,
  };
}

export function generateGeometryBasicsProblem() {
  const useAngles = choose([true, false]);
  if (useAngles) {
    const first = choose([30, 40, 50, 60, 70]);
    const second = choose([40, 50, 60, 70, 80]);
    const third = 180 - first - second;
    return {
      modeLabel: "図形",
      title: "三角形の内角",
      prompt: `三角形の二つの角が \\(${first}^\\circ\\) と \\(${second}^\\circ\\)`,
      steps: [
        {
          label: "内角の和を使う",
          question: "残りの角は何度？",
          hint: "三角形の内角の和は180°です。",
          check: (input) => Number(normalizeText(input).replace(/度|°/g, "")) === third,
          answer: `${third}°`,
        },
      ],
    };
  }

  const triangle = choose([
    { first: 3, second: 4, hypotenuse: 5 },
    { first: 5, second: 12, hypotenuse: 13 },
    { first: 8, second: 15, hypotenuse: 17 },
  ]);
  return {
    modeLabel: "図形",
    title: "三平方の定理",
    prompt: `直角をはさむ二辺が \\(${triangle.first}\\) と \\(${triangle.second}\\) の直角三角形`,
    steps: [
      {
        label: "二辺の平方を足す",
        question: `\\(${triangle.first}^2+${triangle.second}^2\\) は？`,
        hint: "斜辺の平方に等しくなります。",
        check: (input) => Number(normalizeText(input)) === triangle.hypotenuse ** 2,
        answer: String(triangle.hypotenuse ** 2),
      },
      {
        label: "斜辺を求める",
        question: "斜辺の長さは？",
        hint: "平方根を取り、長さなので正の値を選びます。",
        check: (input) => Number(normalizeText(input)) === triangle.hypotenuse,
        answer: String(triangle.hypotenuse),
      },
    ],
  };
}
