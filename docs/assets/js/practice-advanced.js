// 「少し進んだ問題」の生成器群。数値の解析・採点は math-utils、式の表示は format に一本化する。
import {
  choose,
  euclideanDivisionSteps,
  fractionText,
  normalizeText,
  numericAnswer,
  radicalTeX,
  randomInt,
  sameNumberList,
  sameOrderedList,
  sameOrderedPair,
  sameRadical,
  sameRational,
} from "./math-utils.js";
import { factorText, leadCoefTerm, linearFactor, signedCoefTerm, signedConstant, signedTerm } from "./format.js";
import { extraAdvancedGenerators } from "./practice-extra.js";

function integerAdvanced() {
  const left = randomInt(8, 18);
  const right = randomInt(2, 7);
  const factor = choose([-6, -5, -4, 4, 5, 6]);
  const tail = randomInt(-15, 15) || 8;
  const grouped = left - right;
  const product = grouped * factor;
  const answer = product + tail;
  return {
    modeLabel: "少し進んだ問題",
    title: "かっこと負の数を含む計算",
    prompt: `\\((${left}-${right})\\times(${factor})${tail < 0 ? tail : `+${tail}`}\\)`,
    steps: [
      { label: "かっこの中", question: `\\(${left}-${right}\\) は？`, hint: "かっこを最初に計算します。", check: (input) => numericAnswer(input, grouped), answer: String(grouped) },
      { label: "乗法", question: `\\(${grouped}\\times(${factor})\\) は？`, hint: "符号を先に決めます。", check: (input) => numericAnswer(input, product), answer: String(product) },
      { label: "最後の加減", question: "式全体の値は？", hint: "最後に残った数を足し引きします。", check: (input) => numericAnswer(input, answer), answer: String(answer) },
    ],
  };
}

function radicalAdvanced() {
  const base = randomInt(8, 14);
  const rest = choose([2, 3, 5, 6, 7]);
  const square = base ** 2;
  const value = square * rest;
  return {
    modeLabel: "少し進んだ問題",
    title: "大きい平方因数を見つける",
    prompt: `\\(\\sqrt{${value}}\\) を最も簡単な形にする`,
    steps: [
      { label: "平方因数", question: `\\(${value}=\\Box\\times${rest}\\) の平方数は？`, hint: `\\(${base}^2\\) を確かめます。`, check: (input) => numericAnswer(input, square), answer: String(square) },
      { label: "√の外へ出す", question: "最も簡単な形は？", hint: `\\(\\sqrt{${square}}=${base}\\) です。`, check: (input) => sameRadical(input, base, rest), answer: `\\(${radicalTeX(base, rest)}\\)` },
    ],
  };
}

function squareRootAdvanced() {
  const root = randomInt(11, 20);
  const square = root ** 2;
  return {
    modeLabel: "少し進んだ問題",
    title: "平方根と方程式を区別する",
    prompt: `\\(x^2=${square}\\) と \\(\\sqrt{${square}}\\)`,
    steps: [
      { label: "√の値", question: `\\(\\sqrt{${square}}\\) は？`, hint: "√は0以上の値です。", check: (input) => numericAnswer(input, root), answer: String(root) },
      { label: "負の解", question: `\\(x^2=${square}\\) の負の解は？`, hint: "負の数も2乗すると正になります。", check: (input) => numericAnswer(input, -root, "x"), answer: `\\(x=-${root}\\)` },
      { label: "解の個数", question: "実数の解は何個？", hint: `\\(${root}\\) と \\(-${root}\\) です。`, check: (input) => numericAnswer(input, 2), answer: "2" },
    ],
  };
}

function rootOperationsAdvanced() {
  const radicand = choose([2, 3, 5, 7]);
  const first = randomInt(7, 14);
  // 係数の和が 0 になると答えが 0√n の形になってしまうので除外する。
  const second = choose([-8, -6, 5, 9].filter((value) => first + value !== 0));
  const total = first + second;
  return {
    modeLabel: "少し進んだ問題",
    title: "係数が大きいルートの加減",
    prompt: `\\(${first}\\sqrt{${radicand}}${second < 0 ? second : `+${second}`}\\sqrt{${radicand}}\\)`,
    steps: [
      { label: "係数を計算", question: `\\(${first}${second < 0 ? second : `+${second}`}\\) は？`, hint: "同じルート部分は残します。", check: (input) => numericAnswer(input, total), answer: String(total) },
      { label: "ルートを戻す", question: "整理した式は？", hint: `係数に \\(\\sqrt{${radicand}}\\) を付けます。`, check: (input) => sameRadical(input, total, radicand), answer: `\\(${radicalTeX(total, radicand)}\\)` },
    ],
  };
}

function substitutionAdvanced() {
  const coefficient = choose([-4, -3, 3, 4]);
  const constant = randomInt(-8, 8) || 5;
  const x = choose([-5, -4, -3, 3, 4, 5]);
  const square = x ** 2;
  const product = coefficient * square;
  const answer = product + constant;
  return {
    modeLabel: "少し進んだ問題",
    title: "負の数を2乗する代入",
    prompt: `\\(${coefficient}x^2${constant < 0 ? constant : `+${constant}`}\\) に \\(x=${x}\\) を代入する`,
    steps: [
      { label: "2乗", question: `\\((${x})^2\\) は？`, hint: "かっこを付けて負の数全体を2乗します。", check: (input) => numericAnswer(input, square), answer: String(square) },
      { label: "係数をかける", question: `\\(${coefficient}\\times${square}\\) は？`, hint: "符号に注意します。", check: (input) => numericAnswer(input, product), answer: String(product) },
      { label: "式の値", question: "式全体の値は？", hint: "最後に定数項を足します。", check: (input) => numericAnswer(input, answer), answer: String(answer) },
    ],
  };
}

function combineAdvanced() {
  const xFirst = randomInt(-9, 9) || 5;
  const xSecond = randomInt(-9, 9) || -3;
  const yFirst = randomInt(-9, 9) || 4;
  const ySecond = randomInt(-9, 9) || -2;
  const constant = randomInt(-12, 12) || 7;
  const xTotal = xFirst + xSecond;
  const yTotal = yFirst + ySecond;
  return {
    modeLabel: "少し進んだ問題",
    title: "x・y・定数を別々にまとめる",
    prompt: `\\(${leadCoefTerm(xFirst, "x")}${signedCoefTerm(yFirst, "y")}${signedCoefTerm(xSecond, "x")}${signedCoefTerm(ySecond, "y")}${signedConstant(constant)}\\)`,
    steps: [
      { label: "xの係数", question: "まとめた \\(x\\) の係数は？", hint: `\\(${xFirst}\\) と \\(${xSecond}\\) を足します。`, check: (input) => numericAnswer(input, xTotal), answer: String(xTotal) },
      { label: "yの係数", question: "まとめた \\(y\\) の係数は？", hint: `\\(${yFirst}\\) と \\(${ySecond}\\) を足します。`, check: (input) => numericAnswer(input, yTotal), answer: String(yTotal) },
      { label: "定数", question: "文字が付かない定数項は？", hint: "種類の違う項とはまとめません。", check: (input) => numericAnswer(input, constant), answer: String(constant) },
    ],
  };
}

function distributeAdvanced() {
  const first = choose([-5, -4, 3, 4, 5]);
  const second = choose([-4, -3, 2, 3, 4]);
  const leftConstant = randomInt(-6, 6) || 2;
  const rightConstant = randomInt(-6, 6) || -3;
  const xCoefficient = first + second;
  const constant = first * leftConstant + second * rightConstant;
  return {
    modeLabel: "少し進んだ問題",
    title: "二つのかっこを展開する",
    prompt: `\\(${first}(x${leftConstant < 0 ? leftConstant : `+${leftConstant}`})${second < 0 ? second : `+${second}`}(x${rightConstant < 0 ? rightConstant : `+${rightConstant}`})\\)`,
    steps: [
      { label: "xの係数", question: "展開後の \\(x\\) の係数は？", hint: "二つのかっこから出る \\(x\\) の係数を足します。", check: (input) => numericAnswer(input, xCoefficient), answer: String(xCoefficient) },
      { label: "定数項", question: "展開後の定数項は？", hint: "外の数を、それぞれのかっこの定数へかけます。", check: (input) => numericAnswer(input, constant), answer: String(constant) },
      { label: "係数を並べる", question: "xの係数、定数項の順にカンマで書くと？", hint: "二つの種類を混ぜずに並べます。", check: (input) => sameOrderedPair(input, xCoefficient, constant), answer: `${xCoefficient}, ${constant}` },
    ],
  };
}

function equationAdvanced() {
  const leftCoefficient = randomInt(5, 9);
  const rightCoefficient = randomInt(1, 4);
  const solution = randomInt(-6, 8);
  const leftConstant = randomInt(-9, 9);
  const rightConstant = (leftCoefficient - rightCoefficient) * solution + leftConstant;
  return {
    modeLabel: "少し進んだ問題",
    title: "両辺にxがある一次方程式",
    prompt: `\\(${leftCoefficient}x${signedConstant(leftConstant)}=${leadCoefTerm(rightCoefficient, "x")}${signedConstant(rightConstant)}\\)`,
    steps: [
      { label: "xの項を片側へ", question: "右辺の \\(x\\) の項を左へ移すと、xの係数は？", hint: `\\(${leftCoefficient}-${rightCoefficient}\\) を計算します。`, check: (input) => numericAnswer(input, leftCoefficient - rightCoefficient), answer: String(leftCoefficient - rightCoefficient) },
      { label: "定数を片側へ", question: "定数を右へまとめた値は？", hint: `\\(${rightConstant}-${factorText(leftConstant)}\\) を計算します。`, check: (input) => numericAnswer(input, rightConstant - leftConstant), answer: String(rightConstant - leftConstant) },
      { label: "解", question: "\\(x\\) は？", hint: "最後にxの係数で割ります。", check: (input) => numericAnswer(input, solution, "x"), answer: `\\(x=${solution}\\)` },
    ],
  };
}

function setsAdvanced() {
  const universe = Array.from({ length: 12 }, (_, index) => index + 1);
  const union = universe.filter((value) => value % 2 === 0 || value % 3 === 0);
  const complement = universe.filter((value) => !union.includes(value));
  return {
    modeLabel: "少し進んだ問題",
    title: "和集合の補集合",
    prompt: "全体集合を1から12までの整数、\\(A\\) を偶数、\\(B\\) を3の倍数の集合とする。",
    steps: [
      { label: "和集合", question: "\\(A\\cup B\\) の要素をカンマで書くと？", hint: "少なくとも一方の条件に合う数を集めます。", check: (input) => sameNumberList(input, union), answer: `{ ${union.join(", ")} }` },
      { label: "補集合", question: "\\((A\\cup B)^c\\) の要素をカンマで書くと？", hint: "全体集合から和集合の要素を除きます。", check: (input) => sameNumberList(input, complement), answer: `{ ${complement.join(", ")} }` },
      { label: "言葉で読む", question: "補集合は、和集合の内側・外側のどちら？", hint: "上付きの \\(c\\) は全体集合の中での『外』を表します。", check: (input) => normalizeText(input).includes("外"), answer: "外側", choices: ["内側", "外側"] },
    ],
  };
}

function identitiesAdvanced() {
  const first = randomInt(2, 7);
  const second = randomInt(2, 7);
  const linear = first + second;
  const constant = first * second;
  return {
    modeLabel: "少し進んだ問題",
    title: "恒等式の係数を比較する",
    prompt: `\\((x+${first})(x+${second})=x^2+px+q\\) がすべての \\(x\\) で成り立つ。`,
    steps: [
      { label: "xの係数", question: "\\(p\\) は？", hint: "二つの定数を足したものが \\(x\\) の係数です。", check: (input) => numericAnswer(input, linear, "p"), answer: `\\(p=${linear}\\)` },
      { label: "定数項", question: "\\(q\\) は？", hint: "二つの定数をかけます。", check: (input) => numericAnswer(input, constant, "q"), answer: `\\(q=${constant}\\)` },
    ],
  };
}

function inequalityAdvanced() {
  const leftCoefficient = choose([-8, -7, 6, 7, 8]);
  const rightCoefficient = choose([-3, -2, 2, 3]);
  const difference = leftCoefficient - rightCoefficient;
  const boundary = randomInt(-6, 6);
  const leftConstant = randomInt(-8, 8);
  const rightConstant = difference * boundary + leftConstant;
  const sign = difference > 0 ? "<" : ">";
  return {
    modeLabel: "少し進んだ問題",
    title: "両辺にxがある一次不等式",
    prompt: `\\(${leftCoefficient}x${signedConstant(leftConstant)}<${leadCoefTerm(rightCoefficient, "x")}${signedConstant(rightConstant)}\\)`,
    steps: [
      { label: "xの係数", question: "xの項を左へまとめた係数は？", hint: `\\(${leftCoefficient}-${factorText(rightCoefficient)}\\) を計算します。`, check: (input) => numericAnswer(input, difference), answer: String(difference) },
      { label: "境目", question: "等号にしたときの境目の数は？", hint: "定数も片側へまとめて、係数で割ります。", check: (input) => numericAnswer(input, boundary), answer: String(boundary) },
      { label: "不等号", question: "解を、\\(x\\) と境目の数を不等号で結んで書くと？", hint: difference < 0 ? "負の係数で割るので向きを反転します。" : "正の係数で割るので向きはそのままです。", check: (input) => normalizeText(input) === `x${sign}${boundary}`, answer: `\\(x${sign}${boundary}\\)` },
    ],
  };
}

function quadraticAdvanced() {
  const horizontal = randomInt(-5, 5);
  const vertical = randomInt(-8, 8);
  const linearCoefficient = -2 * horizontal;
  const constant = horizontal ** 2 + vertical;
  return {
    modeLabel: "少し進んだ問題",
    title: "平方完成して頂点を読む",
    prompt: `\\(y=x^2${linearCoefficient === 0 ? "" : signedCoefTerm(linearCoefficient, "x")}${signedConstant(constant)}\\)`,
    steps: [
      { label: "横位置", question: "平方完成したときの頂点のx座標は？", hint: `\\(x^2-2px\\) の係数から \\(p\\) を読みます。`, check: (input) => numericAnswer(input, horizontal), answer: String(horizontal) },
      { label: "高さ", question: "頂点のy座標は？", hint: `\\(x=${horizontal}\\) を元の式へ代入します。`, check: (input) => numericAnswer(input, vertical), answer: String(vertical) },
      { label: "頂点", question: "頂点を \\(x,y\\) の順に書くと？", hint: "横位置と高さを組にします。", check: (input) => sameOrderedPair(input, horizontal, vertical), answer: `\\((${horizontal},${vertical})\\)` },
    ],
  };
}

function functionValuesAdvanced() {
  const slope = choose([-4, -3, 2, 3, 4]);
  const intercept = randomInt(-8, 8);
  const firstX = randomInt(-4, 0);
  const secondX = firstX + randomInt(2, 5);
  const firstY = slope * firstX + intercept;
  const secondY = slope * secondX + intercept;
  return {
    modeLabel: "少し進んだ問題",
    title: "2点から一次関数を決める",
    prompt: `直線が2点 \\((${firstX},${firstY})\\)、\\((${secondX},${secondY})\\) を通る。`,
    steps: [
      { label: "xの増加量", question: "xの増加量は？", hint: `\\(${secondX}-${factorText(firstX)}\\) を計算します。`, check: (input) => numericAnswer(input, secondX - firstX), answer: String(secondX - firstX) },
      { label: "yの増加量", question: "yの増加量は？", hint: `\\(${secondY}-${factorText(firstY)}\\) を計算します。`, check: (input) => numericAnswer(input, secondY - firstY), answer: String(secondY - firstY) },
      { label: "傾き", question: "傾き \\(m\\) は？", hint: "yの増加量をxの増加量で割ります。", check: (input) => numericAnswer(input, slope, "m"), answer: `\\(m=${slope}\\)` },
      { label: "切片", question: "切片 \\(b\\) は？", hint: "どちらかの点を \\(y=mx+b\\) へ代入します。", check: (input) => numericAnswer(input, intercept, "b"), answer: `\\(b=${intercept}\\)` },
    ],
  };
}

function quadraticSignAdvanced() {
  // 根が 0 だと因数の表示が (x) になって読みにくいので避ける。
  const lower = randomInt(-5, -1);
  let upper = lower + randomInt(3, 7);
  while (upper === 0) upper = lower + randomInt(3, 7);
  return {
    modeLabel: "少し進んだ問題",
    title: "下に開く放物線の符号",
    prompt: `\\(-(${linearFactor(lower)})(${linearFactor(upper)})>0\\)`,
    steps: [
      { label: "二つの根", question: "根を小さい順にカンマで書くと？", hint: "各かっこが0になる値です。", check: (input) => sameNumberList(input, [lower, upper]), answer: `${lower}, ${upper}` },
      { label: "開く向き", question: "最高次の係数は正・負のどちら？", hint: "式の先頭にマイナスがあります。", check: (input) => normalizeText(input).includes("負"), answer: "負", choices: ["正", "負"] },
      { label: "正の範囲", question: "根の内側・外側のどちら？", hint: "下に開く放物線は、二つの根の間でx軸より上です。", check: (input) => normalizeText(input).includes("内"), answer: "内側", choices: ["根の間（内側）", "根の外側"] },
      { label: "解", question: "解を不等式で書くと？", hint: `\\(${lower}<x<${upper}\\) です。`, check: (input) => normalizeText(input) === `${lower}<x<${upper}`, answer: `\\(${lower}<x<${upper}\\)` },
    ],
  };
}

function trigAdvanced() {
  const angle = choose([30, 60]);
  const unit = randomInt(3, 8);
  const hypotenuse = unit * 2;
  const target = unit;
  const targetName = angle === 30 ? "対辺" : "隣辺";
  const ratioName = angle === 30 ? "sin" : "cos";
  return {
    modeLabel: "少し進んだ問題",
    title: "代表角から辺を求める",
    prompt: `斜辺が \\(${hypotenuse}\\)、角 \\(\\theta=${angle}^\\circ\\) の直角三角形で${targetName}を求める。`,
    steps: [
      { label: "使う比", question: `斜辺と${targetName}を結ぶのは sin・cos・tan のどれ？`, hint: `${targetName}÷斜辺の比を選びます。`, check: (input) => normalizeText(input).includes(ratioName), answer: ratioName, choices: ["sin", "cos", "tan"] },
      { label: "代表値", question: `\\(${ratioName}${angle}^\\circ\\) は？`, hint: "正三角形を半分にした比を使います。", check: (input) => sameRational(input, 1, 2), answer: `\\(\\frac12\\)` },
      { label: "辺の長さ", question: `${targetName}は？`, hint: `\\(${hypotenuse}\\times\\frac12\\) を計算します。`, check: (input) => numericAnswer(input, target), answer: String(target) },
    ],
  };
}

function sineCosineAdvanced() {
  const { second, third, answer } = choose([
    { second: 3, third: 8, answer: 7 },
    { second: 5, third: 8, answer: 7 },
    { second: 7, third: 15, answer: 13 },
  ]);
  const square = answer ** 2;
  return {
    modeLabel: "少し進んだ問題",
    title: "余弦定理で第三辺を求める",
    prompt: `\\(b=${second}\\)、\\(c=${third}\\)、その間の角 \\(A=60^\\circ\\) のとき辺 \\(a\\) を求める。`,
    steps: [
      { label: "定理を選ぶ", question: "2辺とその間の角から第三辺を求めるのは正弦定理・余弦定理のどちら？", hint: "\\(a^2=b^2+c^2-2bc\\cos A\\) を使います。", check: (input) => normalizeText(input).includes("余弦"), answer: "余弦定理", choices: ["正弦定理", "余弦定理"] },
      { label: "aの2乗", question: `\\(a^2=${second}^2+${third}^2-2\\times${second}\\times${third}\\times\\frac12\\) は？`, hint: "乗法を先に計算します。", check: (input) => numericAnswer(input, square), answer: String(square) },
      { label: "辺の長さ", question: "\\(a\\) は？", hint: "辺の長さなので正の平方根を取ります。", check: (input) => numericAnswer(input, answer, "a"), answer: `\\(a=${answer}\\)` },
    ],
  };
}

function countingAdvanced() {
  const size = choose([4, 5, 6]);
  const duplicateFactor = 2;
  let factorial = 1;
  for (let value = 2; value <= size; value += 1) factorial *= value;
  const answer = factorial / duplicateFactor;
  return {
    modeLabel: "少し進んだ問題",
    title: "同じものを含む並べ方",
    prompt: `\\(${size}\\) 枚の文字カードを一列に並べる。2枚だけが同じ文字で、残りはすべて異なる文字とする。`,
    steps: [
      { label: "区別して並べる", question: `全部を別物と考えた \\(${size}!\\) は？`, hint: `\\(${size}\\) から1までをかけます。`, check: (input) => numericAnswer(input, factorial), answer: String(factorial) },
      { label: "重複を除く", question: "同じ2個の入れ替えを何通りとして割る？", hint: "同じもの2個の並べ替えは \\(2!\\) 通りです。", check: (input) => numericAnswer(input, duplicateFactor), answer: String(duplicateFactor) },
      { label: "異なる並べ方", question: "答えは何通り？", hint: `\\(${factorial}\\div2\\) を計算します。`, check: (input) => numericAnswer(input, answer), answer: String(answer) },
    ],
  };
}

function probabilityAdvanced() {
  const red = randomInt(2, 5);
  const blue = randomInt(3, 7);
  const total = red + blue;
  const noRedNumerator = blue ** 2;
  const noRedDenominator = total ** 2;
  const atLeastOneNumerator = noRedDenominator - noRedNumerator;
  return {
    modeLabel: "少し進んだ問題",
    title: "少なくとも1回を余事象で求める",
    prompt: `赤玉 \\(${red}\\) 個、青玉 \\(${blue}\\) 個から戻して2回引く。少なくとも1回赤が出る確率を求める。`,
    steps: [
      { label: "赤が出ない確率", question: "1回で青が出る確率は？", hint: "赤が出ないとは青が出ることです。", check: (input) => sameRational(input, blue, total), answer: `\\(${fractionText(blue, total)}\\)` },
      { label: "2回とも青", question: "2回とも赤が出ない確率は？", hint: "青の確率を2回かけます。", check: (input) => sameRational(input, noRedNumerator, noRedDenominator), answer: `\\(${fractionText(noRedNumerator, noRedDenominator)}\\)` },
      { label: "余事象", question: "少なくとも1回赤が出る確率は？", hint: "1から『2回とも青』を引きます。", check: (input) => sameRational(input, atLeastOneNumerator, noRedDenominator), answer: `\\(${fractionText(atLeastOneNumerator, noRedDenominator)}\\)` },
    ],
  };
}

function dataSummaryAdvanced() {
  const values = choose([
    [12, 4, 6, 8, 10, 2],
    [3, 15, 6, 9, 12, 3],
    [20, 5, 7, 9, 11, 8],
  ]);
  const sorted = [...values].sort((a, b) => a - b);
  const total = sorted.reduce((sum, value) => sum + value, 0);
  const mean = total / sorted.length;
  const median = (sorted[2] + sorted[3]) / 2;
  const range = sorted.at(-1) - sorted[0];
  return {
    modeLabel: "少し進んだ問題",
    title: "未整列データの代表値",
    prompt: `データ \\( ${values.join(", ")} \\)`,
    steps: [
      { label: "並べ替え", question: "小さい順にカンマで書くと？", hint: "中央値を求める前に必ず並べます。", check: (input) => sameOrderedList(input, sorted), answer: sorted.join(", ") },
      { label: "平均", question: "平均は？", hint: `合計を \\(${sorted.length}\\) で割ります。`, check: (input) => numericAnswer(input, mean), answer: String(mean) },
      { label: "中央値", question: "中央値は？", hint: "6個なので中央2個の平均です。", check: (input) => numericAnswer(input, median), answer: String(median) },
      { label: "範囲", question: "範囲は？", hint: "最大値から最小値を引きます。", check: (input) => numericAnswer(input, range), answer: String(range) },
    ],
  };
}

function dataAnalysisAdvanced() {
  const center = randomInt(4, 10);
  const values = [center - 1, center, center + 1];
  return {
    modeLabel: "少し進んだ問題",
    title: "分数になる分散",
    prompt: `データ \\( ${values.join(", ")} \\) の分散を求める。`,
    steps: [
      { label: "平均", question: "平均は？", hint: "中央の値と同じになります。", check: (input) => numericAnswer(input, center), answer: String(center) },
      { label: "偏差", question: "偏差を小さい順にカンマで書くと？", hint: "各値から平均を引きます。", check: (input) => sameNumberList(input, [-1, 0, 1]), answer: "-1, 0, 1" },
      { label: "2乗の合計", question: "偏差を2乗した値の合計は？", hint: `\\((-1)^2+0^2+1^2\\) を計算します。`, check: (input) => numericAnswer(input, 2), answer: "2" },
      { label: "分散", question: "偏差の2乗の平均は？", hint: "2乗の合計をデータの個数3で割ります。", check: (input) => sameRational(input, 2, 3), answer: `\\(\\frac23\\)` },
      { label: "標準偏差", question: "標準偏差は、分散の何を取る？", hint: "元のデータと同じ単位へ戻します。", check: (input) => normalizeText(input).includes("平方根"), answer: "正の平方根", choices: ["正の平方根", "2乗した値", "半分の値"] },
    ],
  };
}

function geometryPropertiesAdvanced() {
  const inscribed = choose([25, 35, 40, 55, 65, 70]);
  const central = inscribed * 2;
  return {
    modeLabel: "少し進んだ問題",
    title: "円周角から中心角へ戻す",
    prompt: `弧 \\(AC\\) を見込む円周角が \\(${inscribed}^\\circ\\) である。`,
    steps: [
      { label: "中心角", question: "同じ弧を見込む中心角は何度？", hint: "中心角は円周角の2倍です。", check: (input) => numericAnswer(input, central), answer: `${central}°` },
      { label: "弧の大きさ", question: "小さいほうの弧 \\(AC\\) は何度？", hint: "弧の角度は対応する中心角で表します。", check: (input) => numericAnswer(input, central), answer: `${central}°` },
    ],
  };
}

function numberTheoryAdvanced() {
  const [first, second] = choose([
    [899, 493],
    [662, 414],
    [527, 341],
  ]);
  const result = euclideanDivisionSteps(first, second);
  const steps = result.steps.map(({ dividend, divisor, remainder }, index) => ({
    label: `余り ${index + 1}`,
    question: `\\(${dividend}\\) を \\(${divisor}\\) で割った余りは？`,
    hint: "商をかけて、引いた残りを求めます。",
    check: (input) => numericAnswer(input, remainder),
    answer: String(remainder),
  }));
  steps.push({ label: "最大公約数", question: "最大公約数は？", hint: "余りが0になる直前の余りです。", check: (input) => numericAnswer(input, result.commonDivisor), answer: String(result.commonDivisor) });
  return {
    modeLabel: "少し進んだ問題",
    title: "3桁の整数の互除法",
    prompt: `\\(${first}\\) と \\(${second}\\) の最大公約数を求める。`,
    steps,
  };
}

function geometryBasicsAdvanced() {
  const triangle = choose([
    { leg: 5, hypotenuse: 13, answer: 12 },
    { leg: 8, hypotenuse: 17, answer: 15 },
    { leg: 7, hypotenuse: 25, answer: 24 },
  ]);
  const square = triangle.hypotenuse ** 2 - triangle.leg ** 2;
  return {
    modeLabel: "少し進んだ問題",
    title: "斜辺から短い辺を求める",
    prompt: `斜辺が \\(${triangle.hypotenuse}\\)、一つの短い辺が \\(${triangle.leg}\\) の直角三角形。`,
    steps: [
      { label: "平方を引く", question: `未知の辺の2乗 \\(${triangle.hypotenuse}^2-${triangle.leg}^2\\) は？`, hint: "斜辺の平方から、分かっている短辺の平方を引きます。", check: (input) => numericAnswer(input, square), answer: String(square) },
      { label: "長さ", question: "未知の辺の長さは？", hint: "正の平方根を取ります。", check: (input) => numericAnswer(input, triangle.answer), answer: String(triangle.answer) },
    ],
  };
}

function absoluteValueAdvanced() {
  const first = choose([-12, -9, -8, -7, 7, 8, 9, 12]);
  const second = choose([-6, -5, -4, 4, 5, 6]);
  const product = first * second;
  const difference = Math.abs(first) - Math.abs(second);
  return {
    modeLabel: "少し進んだ問題",
    title: "計算してから距離を読む",
    prompt: `\\(${first}\\) と \\(${second < 0 ? `(${second})` : second}\\) を使った絶対値の計算`,
    steps: [
      {
        label: "積の絶対値",
        question: `\\(|${first}\\times${second < 0 ? `(${second})` : second}|\\) は？`,
        hint: "先に中の積を計算してから、0からの距離を読みます。",
        check: (input) => numericAnswer(input, Math.abs(product)),
        answer: String(Math.abs(product)),
      },
      {
        label: "絶対値どうしの差",
        question: `\\(|${first}|-|${second}|\\) は？`,
        hint: "それぞれの絶対値を先に求めてから引きます。結果は負になることもあります。",
        check: (input) => numericAnswer(input, difference),
        answer: String(difference),
      },
    ],
  };
}

function exponentAdvanced() {
  const m = randomInt(3, 6);
  const n = randomInt(2, 4);
  const p = randomInt(2, Math.min(4, m + n - 2));
  const combined = m + n - p;
  const valueBase = 2;
  const valueExponent = randomInt(4, 7);
  const value = valueBase ** valueExponent;
  return {
    modeLabel: "少し進んだ問題",
    title: "積・商をまとめて指数を整理する",
    prompt: `\\(a^{${m}}\\times a^{${n}}\\div a^{${p}}\\) を整理する`,
    steps: [
      {
        label: "指数をまとめる",
        question: `\\(a^{${m}}\\times a^{${n}}\\div a^{${p}}=a^{\\Box}\\) の \\(\\Box\\) は？`,
        hint: `かけ算は回数を足し、わり算は回数を引きます。\\(${m}+${n}-${p}\\)。`,
        check: (input) => numericAnswer(input, combined),
        answer: String(combined),
      },
      {
        label: "値も求める",
        question: `\\(${valueBase}^{${valueExponent}}\\) の値は？`,
        hint: `\\(${valueBase}\\) を \\(${valueExponent}\\) 回かけます。\\(${valueBase}^{4}=16\\) を足場にすると速い。`,
        check: (input) => numericAnswer(input, value),
        answer: String(value),
      },
    ],
  };
}

function arithmeticSequenceAdvanced() {
  const first = randomInt(2, 12);
  const difference = choose([3, 4, 5, 6, 7]);
  const earlyIndex = randomInt(3, 5);
  const lateIndex = earlyIndex + choose([3, 4, 5]);
  const earlyValue = first + (earlyIndex - 1) * difference;
  const lateValue = first + (lateIndex - 1) * difference;
  const targetIndex = randomInt(20, 40);
  const targetValue = first + (targetIndex - 1) * difference;
  return {
    modeLabel: "少し進んだ問題",
    title: "離れた2項から数列を復元する",
    prompt: `等差数列で、第 \\(${earlyIndex}\\) 項が \\(${earlyValue}\\)、第 \\(${lateIndex}\\) 項が \\(${lateValue}\\)`,
    steps: [
      {
        label: "公差を逆算",
        question: "公差は？",
        hint: `\\(${lateIndex}-${earlyIndex}=${lateIndex - earlyIndex}\\) 回分で \\(${lateValue - earlyValue}\\) 増えています。`,
        check: (input) => numericAnswer(input, difference),
        answer: String(difference),
      },
      {
        label: "初項を逆算",
        question: "初項は？",
        hint: `第 \\(${earlyIndex}\\) 項から公差を \\(${earlyIndex - 1}\\) 回分引き戻します。`,
        check: (input) => numericAnswer(input, first),
        answer: String(first),
      },
      {
        label: "遠くの項へ",
        question: `第 \\(${targetIndex}\\) 項は？`,
        hint: `\\(a_{${targetIndex}}=${first}+(${targetIndex}-1)\\times${difference}\\)。`,
        check: (input) => numericAnswer(input, targetValue),
        answer: String(targetValue),
      },
    ],
  };
}

function vennCountAdvanced() {
  const total = 40;
  const sizeA = randomInt(14, 22);
  const sizeB = randomInt(12, 20);
  const overlap = randomInt(5, Math.min(sizeA, sizeB) - 3);
  const union = sizeA + sizeB - overlap;
  const neither = total - union;
  return {
    modeLabel: "少し進んだ問題",
    title: "どちらでもない人数から逆算する",
    prompt: `${total}人のクラスで、電車を使う人が \\(${sizeA}\\) 人、バスを使う人が \\(${sizeB}\\) 人、どちらも使わない人が \\(${neither}\\) 人いる`,
    steps: [
      {
        label: "少なくとも一方",
        question: "少なくとも一方を使う人は何人？",
        hint: `全体 \\(${total}\\) 人から、どちらも使わない \\(${neither}\\) 人を引きます。`,
        check: (input) => numericAnswer(input, union),
        answer: String(union),
      },
      {
        label: "重なりを逆算",
        question: "両方使う人は何人？",
        hint: `\\(n(A\\cup B)=n(A)+n(B)-n(A\\cap B)\\) を逆向きに使います：\\(${sizeA}+${sizeB}-${union}\\)。`,
        check: (input) => numericAnswer(input, overlap),
        answer: String(overlap),
      },
    ],
  };
}

function trigSurveyAdvanced() {
  const distance = choose([4, 5, 6, 8, 10]);
  const approx = Math.round(distance * 1.73 * 100) / 100;
  return {
    modeLabel: "少し進んだ問題",
    title: "木の高さを60°で見上げる",
    prompt: `木から \\(${distance}\\) m離れた地点で、てっぺんを見上げる角度を測ったら \\(60^\\circ\\) でした。木の高さを求めます（目の高さは考えません）。`,
    steps: [
      {
        label: "使う三角比",
        question: "sin・cos・tan のどれを使う？",
        hint: "水平距離（隣辺）から高さ（対辺）を求めます。",
        check: (input) => normalizeText(input).includes("tan"),
        answer: "tan",
        choices: ["sin", "cos", "tan"],
      },
      {
        label: "根号のまま表す",
        question: `高さは \\(${distance}\\times\\tan60^\\circ\\)。\\(\\tan60^\\circ=\\sqrt3\\) なので、高さを根号のまま表すと？`,
        hint: `\\(${distance}\\sqrt3\\) の形になります。「${distance}√3」のように入力してください。`,
        check: (input) => sameRadical(input, distance, 3),
        answer: `\\(${radicalTeX(distance, 3)}\\)`,
      },
      {
        label: "およその値",
        question: `\\(\\sqrt3\\approx1.73\\) として、高さはおよそ何m？（\\(${distance}\\times1.73\\) を計算）`,
        hint: `\\(${distance}\\times1.73=${approx}\\) です。`,
        check: (input) => numericAnswer(input, approx),
        answer: String(approx),
      },
    ],
  };
}

function expansionAdvanced() {
  const a = randomInt(2, 3);
  const c = randomInt(2, 3);
  const b = choose([-5, -4, -3, 2, 3, 4, 5]);
  const d = choose([-5, -4, -3, 2, 3, 4, 5]);
  const squareCoefficient = a * c;
  const xCoefficient = a * d + b * c;
  const constant = b * d;
  return {
    modeLabel: "少し進んだ問題",
    title: "係数つきのかっこを展開する",
    prompt: `\\((${a}x${signedTerm(b)})(${c}x${signedTerm(d)})\\) を展開する`,
    steps: [
      {
        label: "x²の係数",
        question: "\\(x^2\\) の係数は？",
        hint: `\\(x\\) の項どうしの積 \\(${a}x\\times${c}x\\) から出ます。`,
        check: (input) => numericAnswer(input, squareCoefficient),
        answer: String(squareCoefficient),
      },
      {
        label: "xの係数",
        question: "\\(x\\) の係数は？",
        hint: `外どうし \\(${a}\\times(${d})\\) と内どうし \\((${b})\\times${c}\\) の和です。符号ごと計算します。`,
        check: (input) => numericAnswer(input, xCoefficient),
        answer: String(xCoefficient),
      },
      {
        label: "定数項",
        question: "定数項は？",
        hint: `数どうしの積 \\((${b})\\times(${d})\\)。符号のかけ算に注意。`,
        check: (input) => numericAnswer(input, constant),
        answer: String(constant),
      },
    ],
  };
}

function factoringAdvanced() {
  const p = randomInt(2, 7);
  let q = -randomInt(2, 7);
  while (Math.abs(q) === p) q = -randomInt(2, 7);
  const sum = p + q;
  const product = p * q;
  const expectedA = `(x${signedTerm(p)})(x${signedTerm(q)})`;
  const expectedB = `(x${signedTerm(q)})(x${signedTerm(p)})`;
  return {
    modeLabel: "少し進んだ問題",
    title: "符号の組を見極める因数分解",
    prompt: `\\(x^2${signedCoefTerm(sum, "x")}${signedTerm(product)}\\) を因数分解する`,
    steps: [
      {
        label: "2数をさがす",
        question: `かけて \\(${product}\\)、たして \\(${sum}\\) になる2つの数は？（カンマ区切り・符号つき）`,
        hint: `積が負なので、2数は正と負の組です。差が \\(${Math.abs(sum)}\\) になる組を探し、たして \\(${sum}\\) になるよう符号を割り当てます。`,
        check: (input) => sameNumberList(input, [p, q]),
        answer: `${Math.min(p, q)}, ${Math.max(p, q)}`,
      },
      {
        label: "式にまとめる",
        question: "因数分解した式は？",
        example: "(x+1)(x-2)",
        hint: `見つけた2数を符号ごと入れて \\((x${signedTerm(p)})(x${signedTerm(q)})\\) の形にします。`,
        check: (input) => {
          const text = normalizeText(input);
          return text === expectedA || text === expectedB;
        },
        answer: expectedA,
        choices: [expectedA, `(x${signedTerm(-p)})(x${signedTerm(-q)})`, `(x${signedTerm(-p)})(x${signedTerm(q)})`],
      },
    ],
  };
}

function quadraticSolveAdvanced() {
  const rootA = randomInt(-5, 3);
  let rootB = randomInt(-2, 6);
  while (rootB === rootA) rootB = randomInt(-2, 6);
  const b = -(rootA + rootB);
  const c = rootA * rootB;
  const discriminant = b * b - 4 * c;
  const sqrtD = Math.abs(rootA - rootB);
  const low = Math.min(rootA, rootB);
  const high = Math.max(rootA, rootB);
  return {
    modeLabel: "少し進んだ問題",
    title: "判別式と解の公式で解く",
    prompt: `二次方程式 \\(x^2${b === 0 ? "" : signedCoefTerm(b, "x")}${signedConstant(c)}=0\\) を、解の公式 \\(x=\\dfrac{-b\\pm\\sqrt{D}}{2a}\\) で解く`,
    steps: [
      {
        label: "判別式",
        question: "判別式 \\(D=b^2-4ac\\) の値は？",
        hint: `\\(a=1,\\ b=${b},\\ c=${c}\\)。\\(D=(${b})^2-4\\times1\\times(${c})\\) を符号ごと計算します。`,
        check: (input) => numericAnswer(input, discriminant),
        answer: String(discriminant),
      },
      {
        label: "ルートを外す",
        question: "\\(\\sqrt{D}\\) の値は？",
        hint: `\\(D=${discriminant}\\) は平方数です。2乗すると \\(${discriminant}\\) になる正の数を探します。`,
        check: (input) => numericAnswer(input, sqrtD),
        answer: String(sqrtD),
      },
      {
        label: "解を求める",
        question: "解は？（カンマ区切りで2つ）",
        hint: `\\(x=\\dfrac{${-b}\\pm${sqrtD}}{2}\\)。プラスとマイナスの両方を計算します。`,
        check: (input) => sameNumberList(String(input).replace(/x=/gi, ""), [rootA, rootB]),
        answer: `x=${low}, ${high}`,
      },
    ],
  };
}

function factorialOf(value) {
  let result = 1;
  for (let i = 2; i <= value; i += 1) result *= i;
  return result;
}

function permCombAdvanced() {
  const tableSize = randomInt(4, 6);
  const circular = factorialOf(tableSize - 1);
  const duplicateCount = randomInt(2, 3);
  const letters = `${"A".repeat(duplicateCount)}BB C`.replace(" ", "");
  const totalLetters = duplicateCount + 3;
  const arrangements = factorialOf(totalLetters) / (factorialOf(duplicateCount) * 2);
  return {
    modeLabel: "少し進んだ問題",
    title: "円順列と、同じものを含む順列",
    prompt: `前半は \\(${tableSize}\\) 人の円卓、後半は ${totalLetters} 文字 \\(\\mathrm{${letters}}\\) の並べ替えを数える`,
    steps: [
      {
        label: "円順列",
        question: `\\(${tableSize}\\) 人が円卓に座る座り方は何通り？`,
        hint: `回して重なる配置は同じとみなします。1人の席を固定して、残り \\(${tableSize - 1}\\) 人の順列 \\((${tableSize}-1)!\\) を計算。`,
        check: (input) => numericAnswer(input, circular),
        answer: String(circular),
      },
      {
        label: "同じものを含む順列",
        question: `\\(\\mathrm{${letters}}\\) の ${totalLetters} 文字を一列に並べる方法は何通り？`,
        hint: `一列の \\(${totalLetters}!\\) を、同じ文字どうしの入れ替え（Aが \\(${duplicateCount}!\\)、Bが \\(2!\\)）で割ります。`,
        check: (input) => numericAnswer(input, arrangements),
        answer: String(arrangements),
      },
    ],
  };
}

function sequenceSumAdvanced() {
  const first = randomInt(1, 2);
  const ratio = choose([2, 3]);
  const count = ratio === 2 ? 5 : 4;
  const geometricSum = (first * (ratio ** count - 1)) / (ratio - 1);
  const sigmaN = randomInt(5, 9);
  const addend = randomInt(1, 5);
  const sigmaValue = sigmaN * (sigmaN + 1) + addend * sigmaN;
  return {
    modeLabel: "少し進んだ問題",
    title: "等比の和とΣの計算",
    prompt: `前半は初項 \\(${first}\\)・公比 \\(${ratio}\\) の等比数列、後半は \\(\\displaystyle\\sum_{k=1}^{${sigmaN}}(2k+${addend})\\) を計算する`,
    steps: [
      {
        label: "等比数列の和",
        question: `初項から第 \\(${count}\\) 項までの和は？`,
        hint: `公式 \\(S_n=\\dfrac{a(r^n-1)}{r-1}\\) に \\(a=${first},\\ r=${ratio},\\ n=${count}\\)。「ずらして引く」の結果です。`,
        check: (input) => numericAnswer(input, geometricSum),
        answer: String(geometricSum),
      },
      {
        label: "Σを分ける",
        question: `\\(\\displaystyle\\sum_{k=1}^{${sigmaN}}(2k+${addend})\\) の値は？`,
        hint: `\\(2\\sum k+\\sum ${addend}\\) に分けます。\\(2\\times\\dfrac{${sigmaN}\\times${sigmaN + 1}}{2}+${addend}\\times${sigmaN}\\)。定数 \\(${addend}\\) は \\(${sigmaN}\\) 回足されます。`,
        check: (input) => numericAnswer(input, sigmaValue),
        answer: String(sigmaValue),
      },
    ],
  };
}

function quartilesAdvanced() {
  let value = randomInt(2, 5) * 2;
  const values = [value];
  for (let i = 0; i < 7; i += 1) {
    value += randomInt(1, 3) * 2;
    values.push(value);
  }
  const q1 = (values[1] + values[2]) / 2;
  const median = (values[3] + values[4]) / 2;
  const q3 = (values[5] + values[6]) / 2;
  const iqr = q3 - q1;
  return {
    modeLabel: "少し進んだ問題",
    title: "偶数個のデータの四分位数",
    prompt: `小さい順に並んだ8個のデータ \\(${values.join("\\ ")}\\) を要約する（真ん中が2つあるときは平均をとる）`,
    steps: [
      {
        label: "中央値",
        question: "中央値は？",
        hint: "8個の真ん中は4番目と5番目の間。2つの値の平均をとります。",
        check: (input) => numericAnswer(input, median),
        answer: String(median),
      },
      {
        label: "第1四分位数",
        question: "\\(Q_1\\) は？",
        hint: "下半分は1〜4番目の4個。その中央値なので、2番目と3番目の平均です。",
        check: (input) => numericAnswer(input, q1),
        answer: String(q1),
      },
      {
        label: "第3四分位数",
        question: "\\(Q_3\\) は？",
        hint: "上半分は5〜8番目の4個。その中央値なので、6番目と7番目の平均です。",
        check: (input) => numericAnswer(input, q3),
        answer: String(q3),
      },
      {
        label: "四分位範囲",
        question: "四分位範囲は？",
        hint: `\\(Q_3-Q_1=${q3}-${q1}\\)。外れ値の影響を受けにくい散らばりの指標です。`,
        check: (input) => numericAnswer(input, iqr),
        answer: String(iqr),
      },
    ],
  };
}

// 学び直し総合（exam-review）：発展問題からの混合出題。
function examReviewAdvanced() {
  const pool = [
    integerAdvanced,
    equationAdvanced,
    radicalAdvanced,
    expansionAdvanced,
    trigAdvanced,
    probabilityAdvanced,
    dataSummaryAdvanced,
    vennCountAdvanced,
    arithmeticSequenceAdvanced,
    quartilesAdvanced,
  ];
  const problem = choose(pool)();
  return { ...problem, title: `総合演習：${problem.title}` };
}

export const advancedPracticeGenerators = {
  ...extraAdvancedGenerators,
  "exam-review": examReviewAdvanced,
  integer: integerAdvanced,
  "absolute-value": absoluteValueAdvanced,
  "trig-survey": trigSurveyAdvanced,
  exponent: exponentAdvanced,
  "arithmetic-sequence": arithmeticSequenceAdvanced,
  "venn-count": vennCountAdvanced,
  radical: radicalAdvanced,
  "square-root-meaning": squareRootAdvanced,
  "root-operations": rootOperationsAdvanced,
  substitution: substitutionAdvanced,
  combine: combineAdvanced,
  distribute: distributeAdvanced,
  equation: equationAdvanced,
  sets: setsAdvanced,
  identities: identitiesAdvanced,
  inequality: inequalityAdvanced,
  quadratic: quadraticAdvanced,
  "function-values": functionValuesAdvanced,
  "quadratic-sign": quadraticSignAdvanced,
  trig: trigAdvanced,
  "sine-cosine-rule": sineCosineAdvanced,
  counting: countingAdvanced,
  probability: probabilityAdvanced,
  "data-summary": dataSummaryAdvanced,
  "data-analysis": dataAnalysisAdvanced,
  "geometry-properties": geometryPropertiesAdvanced,
  "number-theory": numberTheoryAdvanced,
  "geometry-basics": geometryBasicsAdvanced,
  expansion: expansionAdvanced,
  factoring: factoringAdvanced,
  "quadratic-solve": quadraticSolveAdvanced,
  "perm-comb": permCombAdvanced,
  "sequence-sum": sequenceSumAdvanced,
  quartiles: quartilesAdvanced,
};
