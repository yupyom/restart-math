// 単元追補の練習問題生成器。問題がなかった21単元（数の分類・素因数分解・連立方程式・
// 図形・三角比の拡張・命題と証明・場合の数と確率・数列）を、ステップ式と
// 「選択肢で埋める穴埋め証明」の2つの型でカバーする。
// 証明・命題系の設問は choices（選択肢）を必ず持たせ、自由入力に頼らない。
import {
  binomial,
  choose,
  fractionText,
  normalizeText,
  numericAnswer,
  randomInt,
  sameOrderedList,
  sameRational,
} from "./math-utils.js";

// TeX の区切り・バックスラッシュ・空白を取りのぞいた比較用の文字列。
function cleanText(value) {
  return normalizeText(value).replace(/\\[()]/g, "").replace(/\\/g, "");
}

// 文章・式の選択肢の一致判定。TeX の区切りと空白の違いは無視する。
function sameText(input, expected) {
  return cleanText(input) === cleanText(expected);
}

// はい・いいえ の2択。
function yesNo(correctIsYes) {
  return {
    choices: ["はい", "いいえ"],
    check: (input) => {
      const text = normalizeText(input);
      return correctIsYes ? text.includes("はい") || text === "yes" : text.includes("いいえ") || text === "no";
    },
    answer: correctIsYes ? "はい" : "いいえ",
  };
}

// ---------- 数の分類 ----------

export function generateNumberClassificationProblem() {
  const numbers = [
    { tex: "5", natural: true, integer: true, irrational: false, note: "1、2、3、…と数えられる数です。" },
    { tex: "-3", natural: false, integer: true, irrational: false, note: "マイナスの整数は、自然数には入りません。" },
    { tex: "0", natural: false, integer: true, irrational: false, note: "高校では、0 は自然数に入れません（整数には入ります）。" },
    { tex: "0.7", natural: false, integer: false, irrational: false, note: "\\(0.7=\\dfrac{7}{10}\\) と分数で書けます。" },
    { tex: "-\\dfrac{2}{5}", natural: false, integer: false, irrational: false, note: "分数そのものなので有理数です。" },
    { tex: "\\sqrt{2}", natural: false, integer: false, irrational: true, note: "\\(\\sqrt{2}=1.41421\\dots\\) は分数では書けないことが証明されています。" },
    { tex: "\\sqrt{9}", natural: true, integer: true, irrational: false, note: "\\(\\sqrt{9}=3\\)。√がついていても、中身が平方数なら整数です。" },
    { tex: "\\pi", natural: false, integer: false, irrational: true, note: "円周率 \\(\\pi=3.14159\\dots\\) は分数では書けません。" },
  ];
  const target = choose(numbers);
  const naturalStep = yesNo(target.natural);
  const integerStep = yesNo(target.integer);
  return {
    modeLabel: "数の分類",
    title: "1つの数の「住所」を確かめる",
    prompt: `数 \\(${target.tex}\\) は、自然数・整数・有理数・無理数のどこに入るかを順に確かめる`,
    steps: [
      {
        label: "自然数かどうか",
        question: `\\(${target.tex}\\) は自然数（1、2、3、…）？`,
        hint: `${target.note} 自然数は「ものを数えるときに使う正の整数」です。`,
        ...naturalStep,
      },
      {
        label: "整数かどうか",
        question: `\\(${target.tex}\\) は整数？`,
        hint: `整数は「…、-2、-1、0、1、2、…」。${target.note}`,
        ...integerStep,
      },
      {
        label: "有理数か無理数か",
        question: "有理数・無理数のどちら？",
        hint: `分数（整数÷整数）で書けるなら有理数、書けないなら無理数です。${target.note}`,
        choices: ["有理数", "無理数"],
        check: (input) => {
          const text = normalizeText(input);
          return target.irrational ? text.includes("無理") : text.includes("有理");
        },
        answer: target.irrational ? "無理数" : "有理数",
      },
    ],
  };
}

export function numberClassificationAdvanced() {
  const fractions = [
    { num: 3, den: 8, finite: true },
    { num: 7, den: 20, finite: true },
    { num: 9, den: 40, finite: true },
    { num: 7, den: 16, finite: true },
    { num: 2, den: 3, finite: false },
    { num: 5, den: 6, finite: false },
    { num: 4, den: 11, finite: false },
    { num: 5, den: 12, finite: false },
  ];
  const target = choose(fractions);
  return {
    modeLabel: "少し進んだ問題",
    title: "分数を小数にすると、どちらになる？",
    prompt: `分数 \\(\\dfrac{${target.num}}{${target.den}}\\) を小数で表したときの姿を、分母から予想する`,
    steps: [
      {
        label: "分母を調べる",
        question: `分母 \\(${target.den}\\) を素因数分解すると、素因数は 2 と 5 だけ？`,
        hint: `\\(${target.den}\\) を 2 で割れるだけ割り、次に 5 で割れるだけ割って、1 になるかを見ます。`,
        choices: ["2と5だけ", "2と5以外の素因数を含む"],
        check: (input) => {
          const text = normalizeText(input);
          return target.finite ? text.includes("だけ") && !text.includes("以外") : text.includes("以外");
        },
        answer: target.finite ? "2と5だけ" : "2と5以外の素因数を含む",
      },
      {
        label: "小数の姿",
        question: "小数で表すと、どちらになる？",
        hint: "分母の素因数が2と5だけなら割り切れて有限小数、それ以外を含むと同じ並びがくり返す循環小数になります。",
        choices: ["割り切れる（有限小数）", "同じ数字の並びがくり返す（循環小数）"],
        check: (input) => {
          const text = normalizeText(input);
          return target.finite ? text.includes("有限") : text.includes("循環");
        },
        answer: target.finite ? "割り切れる（有限小数）" : "同じ数字の並びがくり返す（循環小数）",
      },
      {
        label: "分類へ戻す",
        question: "有限小数でも循環小数でも、この数は有理数といえる？",
        hint: "もともと分数（整数÷整数）の形で書けているかどうかが決め手です。",
        choices: ["いえる（分数で書けるから）", "いえない（小数だから）"],
        check: (input) => normalizeText(input).includes("いえる") && !normalizeText(input).includes("いえない"),
        answer: "いえる（分数で書けるから）",
      },
    ],
  };
}

// ---------- 素因数分解 ----------

export function generatePrimeFactorizationProblem() {
  const a = randomInt(2, 3);
  const b = randomInt(1, 2);
  const c = choose([0, 1]);
  const n = 2 ** a * 3 ** b * 5 ** c;
  const squarePart = 2 ** (a - (a % 2)) * 3 ** (b - (b % 2));
  return {
    modeLabel: "素因数分解",
    title: "数の設計図を読み取る",
    prompt: `\\(${n}\\) を素因数分解して、\\(2^{\\square}\\times3^{\\triangle}${c ? "\\times5" : ""}\\) の形の設計図を読む`,
    steps: [
      {
        label: "2で割れる回数",
        question: `\\(${n}\\) は 2 で何回割れる？（\\(2^{\\square}\\) の \\(\\square\\)）`,
        hint: `\\(${n}\\div2=${n / 2}\\)、さらに 2 で…と、割れなくなるまで数えます。`,
        check: (input) => numericAnswer(input, a),
        answer: String(a),
      },
      {
        label: "3で割れる回数",
        question: `2 で割り切ったあとの \\(${n / 2 ** a}\\) は、3 で何回割れる？`,
        hint: "素因数分解は「小さい素数から順に割る」と迷いません。",
        check: (input) => numericAnswer(input, b),
        answer: String(b),
      },
      c
        ? {
            label: "残った素因数",
            question: "2 と 3 で割り切ったあとに残る素数は？",
            hint: `\\(${n}=2^{${a}}\\times3^{${b}}\\times\\square\\) の \\(\\square\\) です。`,
            check: (input) => numericAnswer(input, 5),
            answer: "5",
          }
        : {
            label: "最大の平方因数",
            question: `設計図から、\\(${n}\\) を割り切る最大の平方数（同じ数の2乗）は？`,
            hint: `指数を偶数に切り下げます。\\(2^{${a - (a % 2)}}\\times3^{${b - (b % 2)}}\\) を計算しましょう。√の整理で使う考え方です。`,
            check: (input) => numericAnswer(input, squarePart),
            answer: String(squarePart),
          },
    ],
  };
}

export function primeFactorizationAdvanced() {
  const a = randomInt(2, 4);
  const b = randomInt(1, 3);
  const n = 2 ** a * 3 ** b;
  const count = (a + 1) * (b + 1);
  return {
    modeLabel: "少し進んだ問題",
    title: "設計図から約数の個数を数える",
    prompt: `\\(${n}=2^{${a}}\\times3^{${b}}\\) の約数の個数を、書き出さずに数える`,
    steps: [
      {
        label: "2の選び方",
        question: `約数は \\(2^{i}\\times3^{j}\\) の形。\\(i\\) の選び方（\\(0\\) から \\(${a}\\)）は何通り？`,
        hint: `\\(2^0=1\\) も含めるので、\\(${a}+1\\) 通りです。`,
        check: (input) => numericAnswer(input, a + 1),
        answer: String(a + 1),
      },
      {
        label: "3の選び方",
        question: `\\(j\\) の選び方（\\(0\\) から \\(${b}\\)）は何通り？`,
        hint: `同じ考えで \\(${b}+1\\) 通りです。`,
        check: (input) => numericAnswer(input, b + 1),
        answer: String(b + 1),
      },
      {
        label: "約数の個数",
        question: `\\(${n}\\) の約数は全部で何個？`,
        hint: `\\(i\\) と \\(j\\) の選び方をかけ合わせます：\\(${a + 1}\\times${b + 1}\\)。`,
        check: (input) => numericAnswer(input, count),
        answer: String(count),
      },
    ],
  };
}

// ---------- 連立方程式 ----------

export function generateSimultaneousProblem() {
  const x = randomInt(1, 6);
  let y = randomInt(1, 6);
  while (y === x) y = randomInt(1, 6);
  const sum = x + y;
  const difference = x - y;
  return {
    modeLabel: "連立方程式",
    title: "たして文字を消す",
    prompt: `連立方程式 \\(x+y=${sum}\\)、\\(x-y=${difference}\\) を解く`,
    steps: [
      {
        label: "2つの式をたす",
        question: `2つの式を左辺どうし・右辺どうしでたすと \\(2x=\\square\\)。\\(\\square\\) は？`,
        hint: `\\(+y\\) と \\(-y\\) が打ち消し合って \\(y\\) が消えます。右辺は \\(${sum}+(${difference})\\)。`,
        check: (input) => numericAnswer(input, sum + difference),
        answer: String(sum + difference),
      },
      {
        label: "xを求める",
        question: "\\(x\\) は？",
        hint: `\\(2x=${sum + difference}\\) の両辺を 2 で割ります。`,
        check: (input) => numericAnswer(input, x, "x"),
        answer: `x=${x}`,
      },
      {
        label: "yを求める",
        question: "\\(y\\) は？",
        hint: `\\(x=${x}\\) を \\(x+y=${sum}\\) に戻します。`,
        check: (input) => numericAnswer(input, y, "y"),
        answer: `y=${y}`,
      },
    ],
  };
}

export function simultaneousAdvanced() {
  const x = randomInt(1, 5);
  const y = randomInt(1, 5);
  const c1 = 2 * x + 3 * y;
  const c2 = 2 * x + y;
  return {
    modeLabel: "少し進んだ問題",
    title: "引き算で文字を消す加減法",
    prompt: `連立方程式 \\(2x+3y=${c1}\\)、\\(2x+y=${c2}\\) を解く`,
    steps: [
      {
        label: "消える文字を選ぶ",
        question: "上の式から下の式を引くと、どちらの文字が消える？",
        hint: "係数が同じ \\(2x\\) どうしが打ち消し合います。",
        choices: ["x", "y"],
        check: (input) => normalizeText(input) === "x",
        answer: "x",
      },
      {
        label: "引き算する",
        question: `引き算すると \\(2y=\\square\\)。\\(\\square\\) は？`,
        hint: `\\(3y-y=2y\\)、右辺は \\(${c1}-${c2}\\) です。`,
        check: (input) => numericAnswer(input, c1 - c2),
        answer: String(c1 - c2),
      },
      {
        label: "yを求める",
        question: "\\(y\\) は？",
        hint: `\\(2y=${c1 - c2}\\) を 2 で割ります。`,
        check: (input) => numericAnswer(input, y, "y"),
        answer: `y=${y}`,
      },
      {
        label: "xを求める",
        question: "\\(x\\) は？",
        hint: `\\(y=${y}\\) を \\(2x+y=${c2}\\) に戻して、\\(2x=${c2 - y}\\)。`,
        check: (input) => numericAnswer(input, x, "x"),
        answer: `x=${x}`,
      },
    ],
  };
}

// ---------- 平行線と角 ----------

export function generateParallelAnglesProblem() {
  const angle = choose([40, 45, 55, 60, 65, 70, 75]);
  return {
    modeLabel: "平行線と角",
    title: "1つの角から芋づる式に読む",
    prompt: `平行な2直線に1本の直線が交わっていて、交点の1つにできる角の1つが \\(${angle}^\\circ\\) である`,
    steps: [
      {
        label: "対頂角",
        question: `\\(${angle}^\\circ\\) の対頂角（向かい合う角）は何度？`,
        hint: "対頂角はいつでも等しくなります。交わる2直線だけで決まる性質です。",
        check: (input) => numericAnswer(input, angle),
        answer: `${angle}°`,
      },
      {
        label: "錯角",
        question: `もう一方の交点にできる、\\(${angle}^\\circ\\) の錯角は何度？`,
        hint: "2直線が平行のとき、錯角（Zの形の位置にある角）は等しくなります。平行でないと使えません。",
        check: (input) => numericAnswer(input, angle),
        answer: `${angle}°`,
      },
      {
        label: "となりの角",
        question: `\\(${angle}^\\circ\\) のとなりの角（一直線をつくる角）は何度？`,
        hint: `一直線は \\(180^\\circ\\)。\\(180-${angle}\\) を計算します。`,
        check: (input) => numericAnswer(input, 180 - angle),
        answer: `${180 - angle}°`,
      },
    ],
  };
}

export function parallelAnglesAdvanced() {
  const first = choose([40, 45, 50, 55, 60]);
  const second = choose([35, 40, 50, 60, 70]);
  const third = 180 - first - second;
  return {
    modeLabel: "少し進んだ問題",
    title: "三角形の外角を組み立てる",
    prompt: `三角形の2つの内角が \\(${first}^\\circ\\) と \\(${second}^\\circ\\) である`,
    steps: [
      {
        label: "残りの内角",
        question: "残りの内角は何度？",
        hint: `内角の和は \\(180^\\circ\\)（平行線の錯角で証明できました）。\\(180-${first}-${second}\\)。`,
        check: (input) => numericAnswer(input, third),
        answer: `${third}°`,
      },
      {
        label: "外角",
        question: `\\(${third}^\\circ\\) の内角の外角は何度？`,
        hint: `外角はとなりの内角と一直線をつくるので \\(180-${third}\\)。`,
        check: (input) => numericAnswer(input, first + second),
        answer: `${first + second}°`,
      },
      {
        label: "外角の性質",
        question: `外角 \\(${first + second}^\\circ\\) と等しいのはどれ？`,
        hint: "計算結果を見比べると、となり合わない2つの内角の和とぴったり同じです。",
        choices: [
          `となり合わない2つの内角の和（\\(${first}^\\circ+${second}^\\circ\\)）`,
          `となりの内角（\\(${third}^\\circ\\)）`,
          "3つの内角の和",
        ],
        check: (input) => normalizeText(input).includes("となり合わない"),
        answer: `となり合わない2つの内角の和（\\(${first}^\\circ+${second}^\\circ\\)）`,
      },
    ],
  };
}

// ---------- 三平方の定理（面積の組み替え証明の穴埋め） ----------

export function generatePythagorasProofProblem() {
  const triple = choose([
    { a: 3, b: 4, c: 5 },
    { a: 6, b: 8, c: 10 },
    { a: 5, b: 12, c: 13 },
    { a: 8, b: 15, c: 17 },
  ]);
  const { a, b, c } = triple;
  const bigSquare = (a + b) ** 2;
  const triangles = 2 * a * b;
  return {
    modeLabel: "三平方の定理",
    title: "面積の組み替えで証明をなぞる",
    prompt: `直角をはさむ2辺が \\(a=${a}\\)、\\(b=${b}\\) の直角三角形4枚を、1辺 \\(a+b\\) の正方形の中に並べる。真ん中に残る正方形の1辺が斜辺 \\(c\\) になる。`,
    steps: [
      {
        label: "大きい正方形",
        question: "1辺 \\(a+b\\) の正方形の面積 \\((a+b)^2\\) を展開すると？",
        hint: "乗法公式 \\((x+y)^2=x^2+2xy+y^2\\) を使います。証明の中で公式が道具として働く場面です。",
        choices: ["\\(a^2+2ab+b^2\\)", "\\(a^2+b^2\\)", "\\(a^2+ab+b^2\\)"],
        check: (input) => sameText(input, "a^2+2ab+b^2"),
        answer: "\\(a^2+2ab+b^2\\)",
      },
      {
        label: "三角形4枚",
        question: `直角三角形1枚の面積は \\(\\dfrac{ab}{2}\\)。4枚分を \\(a=${a}\\)、\\(b=${b}\\) で計算すると？`,
        hint: `\\(4\\times\\dfrac{ab}{2}=2ab=2\\times${a}\\times${b}\\)。`,
        check: (input) => numericAnswer(input, triangles),
        answer: String(triangles),
      },
      {
        label: "真ん中の正方形",
        question: `大きい正方形 \\((${a}+${b})^2=${bigSquare}\\) から三角形4枚をのぞくと、真ん中の正方形 \\(c^2\\) の面積は？`,
        hint: `\\(${bigSquare}-${triangles}\\)。式で書くと \\(c^2=(a+b)^2-2ab=a^2+b^2\\) ——これが三平方の定理です。`,
        check: (input) => numericAnswer(input, c * c),
        answer: String(c * c),
      },
      {
        label: "斜辺の長さ",
        question: `\\(c^2=${c * c}\\) より、斜辺 \\(c\\) は？`,
        hint: "長さなので正の平方根をとります。",
        check: (input) => numericAnswer(input, c, "c"),
        answer: String(c),
      },
    ],
  };
}

// ---------- 相似 ----------

export function generateSimilarityProblem() {
  const ratio = choose([2, 3]);
  const ab = randomInt(2, 6);
  const bc = randomInt(3, 7);
  return {
    modeLabel: "相似",
    title: "対応する辺から相似比を読む",
    prompt: `\\(\\triangle ABC\\) と \\(\\triangle DEF\\) が相似（\\(\\triangle ABC\\backsim\\triangle DEF\\)）で、\\(AB=${ab}\\)、\\(BC=${bc}\\)、\\(DE=${ab * ratio}\\) である`,
    steps: [
      {
        label: "対応する辺",
        question: "辺 \\(AB\\) に対応する辺はどれ？",
        hint: "相似の記号は対応する順に頂点を書く約束です。\\(A\\leftrightarrow D\\)、\\(B\\leftrightarrow E\\)、\\(C\\leftrightarrow F\\)。",
        choices: ["辺DE", "辺EF", "辺DF"],
        check: (input) => normalizeText(input).replace(/辺/g, "") === "de",
        answer: "辺DE",
      },
      {
        label: "相似比",
        question: `\\(DE\\) は \\(AB\\) の何倍？`,
        hint: `\\(${ab * ratio}\\div${ab}\\) を計算します。相似比は \\(1:${ratio}\\) です。`,
        check: (input) => numericAnswer(input, ratio),
        answer: String(ratio),
      },
      {
        label: "未知の辺",
        question: `辺 \\(EF\\) の長さは？`,
        hint: `\\(EF\\) は \\(BC\\) に対応するので、\\(${bc}\\times${ratio}\\)。`,
        check: (input) => numericAnswer(input, bc * ratio),
        answer: String(bc * ratio),
      },
    ],
  };
}

export function similarityAdvanced() {
  const m = 2;
  const n = 3;
  const smallArea = m * m * randomInt(2, 6);
  const largeArea = (smallArea / (m * m)) * n * n;
  return {
    modeLabel: "少し進んだ問題",
    title: "相似比から面積比へ",
    prompt: `相似比が \\(${m}:${n}\\) の2つの三角形があり、小さい方の面積は \\(${smallArea}\\) である`,
    steps: [
      {
        label: "面積比",
        question: `面積比は \\(${m * m}:\\square\\)。\\(\\square\\) は？`,
        hint: `面積比は相似比の2乗：\\(${m}^2:${n}^2\\)。縦も横も \\(${n}/${m}\\) 倍になるからです。`,
        check: (input) => numericAnswer(input, n * n),
        answer: String(n * n),
      },
      {
        label: "大きい方の面積",
        question: "大きい方の三角形の面積は？",
        hint: `\\(${smallArea}\\times\\dfrac{${n * n}}{${m * m}}\\) を計算します。`,
        check: (input) => numericAnswer(input, largeArea),
        answer: String(largeArea),
      },
      {
        label: "周の長さ比",
        question: "周の長さの比はどうなる？",
        hint: "長さはすべて同じ倍率で伸びるので、周の長さの比は相似比そのままです。",
        choices: [`相似比と同じ \\(${m}:${n}\\)`, `面積比と同じ \\(${m * m}:${n * n}\\)`, "比は決まらない"],
        check: (input) => normalizeText(input).includes("相似比"),
        answer: `相似比と同じ \\(${m}:${n}\\)`,
      },
    ],
  };
}

// ---------- 三角比の拡張 ----------

export function generateTrigExtensionProblem() {
  const scenario = choose([
    { degree: 150, fn: "sin", positive: true, reference: 30, valueTeX: "\\dfrac12", checkValue: (input) => sameRational(input, 1, 2), valueInput: "1/2" },
    { degree: 120, fn: "cos", positive: false, reference: 60, valueTeX: "-\\dfrac12", checkValue: (input) => sameRational(input, -1, 2), valueInput: "-1/2" },
    { degree: 135, fn: "tan", positive: false, reference: 45, valueTeX: "-1", checkValue: (input) => numericAnswer(input, -1), valueInput: "-1" },
  ]);
  const { degree, fn, positive, reference } = scenario;
  const signHint =
    fn === "sin"
      ? "鈍角でも高さ（y座標）は正のままです。"
      : "鈍角では x 座標が負の側へ回り込むので、cos（と tan）は負になります。";
  return {
    modeLabel: "三角比の拡張",
    title: "鈍角の三角比を半円で読む",
    prompt: `半径1の半円の座標で \\(\\${fn}${degree}^\\circ\\) を求める`,
    steps: [
      {
        label: "符号を見る",
        question: `\\(${degree}^\\circ\\) の \\(\\${fn}\\) は正・負のどちら？`,
        hint: `半円の左半分（\\(90^\\circ\\) より大きい角）では、\\(x\\) 座標が負になります。${signHint}`,
        choices: ["正", "負"],
        check: (input) => {
          const text = normalizeText(input);
          return positive ? text.includes("正") : text.includes("負");
        },
        answer: positive ? "正" : "負",
      },
      {
        label: "基準の鋭角",
        question: `大きさの手がかりになる鋭角 \\(180^\\circ-${degree}^\\circ\\) は？`,
        hint: `鈍角の三角比は、\\(180^\\circ\\) から引いた鋭角の三角比と大きさが同じです。`,
        check: (input) => numericAnswer(input, reference),
        answer: `${reference}°`,
      },
      {
        label: "値を答える",
        question: `\\(\\${fn}${degree}^\\circ\\) の値は？`,
        hint: `\\(\\${fn}${reference}^\\circ\\) と同じ大きさに、さきほどの符号を付けます。`,
        check: scenario.checkValue,
        answer: `\\(${scenario.valueTeX}\\)`,
        accept: scenario.valueInput,
      },
    ],
  };
}

export function trigExtensionAdvanced() {
  const triple = choose([
    { opposite: 3, adjacent: 4, hyp: 5 },
    { opposite: 5, adjacent: 12, hyp: 13 },
    { opposite: 8, adjacent: 15, hyp: 17 },
  ]);
  const { opposite, adjacent, hyp } = triple;
  return {
    modeLabel: "少し進んだ問題",
    title: "sin から鈍角の cos を求める",
    prompt: `\\(\\theta\\) は鈍角（\\(90^\\circ<\\theta<180^\\circ\\)）で、\\(\\sin\\theta=\\dfrac{${opposite}}{${hyp}}\\) である。\\(\\cos\\theta\\) を求める`,
    steps: [
      {
        label: "関係式を使う",
        question: `\\(\\sin^2\\theta+\\cos^2\\theta=1\\) より、\\(\\cos^2\\theta\\) は？`,
        hint: `\\(1-\\left(\\dfrac{${opposite}}{${hyp}}\\right)^2=1-\\dfrac{${opposite ** 2}}{${hyp ** 2}}\\) を計算します。`,
        check: (input) => sameRational(input, adjacent ** 2, hyp ** 2),
        answer: `\\(${fractionText(adjacent ** 2, hyp ** 2)}\\)`,
      },
      {
        label: "符号を決める",
        question: "鈍角の \\(\\cos\\theta\\) は正・負のどちら？",
        hint: "半円の左半分では x 座標が負です。2乗から戻すときに、この判断が必要になります。",
        choices: ["正", "負"],
        check: (input) => normalizeText(input).includes("負"),
        answer: "負",
      },
      {
        label: "値を答える",
        question: "\\(\\cos\\theta\\) は？",
        hint: `大きさは \\(\\sqrt{\\dfrac{${adjacent ** 2}}{${hyp ** 2}}}=\\dfrac{${adjacent}}{${hyp}}\\)。これに負の符号を付けます。`,
        check: (input) => sameRational(input, -adjacent, hyp),
        answer: `\\(${fractionText(-adjacent, hyp)}\\)`,
        example: "-3/5",
      },
    ],
  };
}

// ---------- 関数の記法 ----------

export function generateFunctionNotationProblem() {
  const a = choose([-2, 2, 3]);
  const b = randomInt(-4, 4);
  const x0 = randomInt(1, 4);
  const target = a * x0 + b;
  return {
    modeLabel: "関数の記法",
    title: "f(x) の読み書きに慣れる",
    prompt: `関数 \\(f(x)=${a}x${b < 0 ? b : b > 0 ? `+${b}` : ""}\\) について答える`,
    steps: [
      {
        label: "f(2) を読む",
        question: "\\(f(2)\\) の値は？",
        hint: `\\(f(2)\\) は「\\(x\\) に 2 を入れたときの出力」。\\(${a}\\times2${b < 0 ? b : b > 0 ? `+${b}` : ""}\\) を計算します。`,
        check: (input) => numericAnswer(input, 2 * a + b),
        answer: String(2 * a + b),
      },
      {
        label: "負の入力",
        question: "\\(f(-1)\\) の値は？",
        hint: `\\(x\\) の場所にそっくり \\((-1)\\) を入れます。かっこを付けて \\(${a}\\times(-1)\\)。`,
        check: (input) => numericAnswer(input, -a + b),
        answer: String(-a + b),
      },
      {
        label: "逆向きに読む",
        question: `\\(f(x)=${target}\\) となる \\(x\\) は？`,
        hint: `今度は出力が \\(${target}\\) と分かっていて、入力を探します。方程式 \\(${a}x${b < 0 ? b : b > 0 ? `+${b}` : ""}=${target}\\) を解きましょう。`,
        check: (input) => numericAnswer(input, x0, "x"),
        answer: `x=${x0}`,
      },
    ],
  };
}

export function functionNotationAdvanced() {
  const a = choose([2, 3]);
  const b = randomInt(-3, 3);
  const low = a * 1 + b;
  const high = a * 4 + b;
  return {
    modeLabel: "少し進んだ問題",
    title: "定義域から値域を言い切る",
    prompt: `関数 \\(f(x)=${a}x${b < 0 ? b : b > 0 ? `+${b}` : ""}\\) の定義域が \\(1\\leqq x\\leqq 4\\) のとき、値域を求める`,
    steps: [
      {
        label: "左端の出力",
        question: "\\(f(1)\\) の値は？",
        hint: "定義域の端をまず調べます。",
        check: (input) => numericAnswer(input, low),
        answer: String(low),
      },
      {
        label: "右端の出力",
        question: "\\(f(4)\\) の値は？",
        hint: "もう一方の端も調べます。",
        check: (input) => numericAnswer(input, high),
        answer: String(high),
      },
      {
        label: "値域を言い切る",
        question: "値域はどれ？",
        hint: `傾き \\(${a}\\) は正なので、\\(x\\) が増えると \\(f(x)\\) も増え続けます。だから端の2つの値の間がそのまま値域です。`,
        choices: [`\\(${low}\\leqq y\\leqq ${high}\\)`, `\\(1\\leqq y\\leqq 4\\)`, `\\(y\\leqq ${high}\\)`],
        check: (input) => sameText(input, `${low}≦y≦${high}`) || sameText(input, `${low}\\leqq y\\leqq ${high}`) || sameText(input, `${low}<=y<=${high}`),
        answer: `\\(${low}\\leqq y\\leqq ${high}\\)`,
        accept: `${low}≦y≦${high}`,
      },
    ],
  };
}

// ---------- 逆・裏・対偶 ----------

const conversePropositions = [
  {
    original: "\\(x=2\\) ならば \\(x^2=4\\)",
    converse: "\\(x^2=4\\) ならば \\(x=2\\)",
    inverse: "\\(x\\neq2\\) ならば \\(x^2\\neq4\\)",
    contrapositive: "\\(x^2\\neq4\\) ならば \\(x\\neq2\\)",
  },
  {
    original: "整数 \\(n\\) が4の倍数ならば、\\(n\\) は偶数",
    converse: "整数 \\(n\\) が偶数ならば、\\(n\\) は4の倍数",
    inverse: "整数 \\(n\\) が4の倍数でないならば、\\(n\\) は偶数でない",
    contrapositive: "整数 \\(n\\) が偶数でないならば、\\(n\\) は4の倍数でない",
  },
];

export function generateLogicConverseProblem() {
  const proposition = choose(conversePropositions);
  return {
    modeLabel: "逆・裏・対偶",
    title: "3つの言いかえを区別する",
    prompt: `命題「${proposition.original}」の逆・裏・対偶を整理する`,
    steps: [
      {
        label: "逆を選ぶ",
        question: "この命題の「逆」はどれ？",
        hint: "逆は「ならば」の前後をそっくり入れかえた命題です。否定はしません。",
        choices: [proposition.converse, proposition.inverse, proposition.contrapositive],
        check: (input) => sameText(input, proposition.converse),
        answer: proposition.converse,
      },
      {
        label: "対偶を選ぶ",
        question: "この命題の「対偶」はどれ？",
        hint: "対偶は、前後を入れかえて、さらに両方を否定した命題です。",
        choices: [proposition.contrapositive, proposition.converse, proposition.inverse],
        check: (input) => sameText(input, proposition.contrapositive),
        answer: proposition.contrapositive,
      },
      {
        label: "真偽の連動",
        question: "元の命題が真のとき、必ず真といえるのはどれ？",
        hint: "対偶は元の命題と真偽が必ず一致します。逆や裏は一致するとは限りません。",
        choices: ["対偶", "逆", "裏"],
        check: (input) => normalizeText(input).includes("対偶"),
        answer: "対偶",
      },
    ],
  };
}

export function logicConverseAdvanced() {
  const scenario = choose([
    { original: "整数 \\(n\\) が4の倍数ならば、\\(n\\) は偶数", converse: "整数 \\(n\\) が偶数ならば、\\(n\\) は4の倍数", counterexample: 2, unit: "偶数" },
    { original: "整数 \\(n\\) が6の倍数ならば、\\(n\\) は3の倍数", converse: "整数 \\(n\\) が3の倍数ならば、\\(n\\) は6の倍数", counterexample: 3, unit: "3の倍数" },
  ]);
  return {
    modeLabel: "少し進んだ問題",
    title: "逆の真偽を反例で確かめる",
    prompt: `命題「${scenario.original}」について、逆の真偽まで調べる`,
    steps: [
      {
        label: "元の真偽",
        question: "元の命題は真・偽のどちら？",
        hint: "前の条件を満たす数を思い浮かべて、必ず後の条件も満たすかを考えます。",
        choices: ["真", "偽"],
        check: (input) => normalizeText(input).includes("真"),
        answer: "真",
      },
      {
        label: "逆の真偽",
        question: `逆「${scenario.converse}」は真・偽のどちら？`,
        hint: "逆は自動的には真になりません。成り立たない例が1つでもあれば偽です。",
        choices: ["真", "偽"],
        check: (input) => normalizeText(input).includes("偽"),
        answer: "偽",
      },
      {
        label: "反例をあげる",
        question: `逆の反例になる最小の正の${scenario.unit}は？`,
        hint: "前の条件（後半の条件）は満たすのに、結論を満たさない数を小さい方から探します。",
        check: (input) => numericAnswer(input, scenario.counterexample),
        answer: String(scenario.counterexample),
      },
    ],
  };
}

// ---------- 必要条件と十分条件 ----------

const necessitiesPool = [
  { p: "\\(x=3\\)", q: "\\(x^2=9\\)", forward: true, backward: false, role: "十分条件", backwardNote: "\\(x=-3\\) も \\(x^2=9\\) を満たします。" },
  { p: "\\(x>2\\)", q: "\\(x>0\\)", forward: true, backward: false, role: "十分条件", backwardNote: "\\(x=1\\) は \\(x>0\\) ですが \\(x>2\\) ではありません。" },
  { p: "\\(x>0\\)", q: "\\(x>2\\)", forward: false, backward: true, role: "必要条件", backwardNote: "\\(x>2\\) なら必ず \\(x>0\\) です。" },
  { p: "\\(x\\) が8の倍数", q: "\\(x\\) が4の倍数", forward: true, backward: false, role: "十分条件", backwardNote: "4の倍数の \\(4\\) は8の倍数ではありません。" },
];

export function generateNecessarySufficientProblem() {
  const scenario = choose(necessitiesPool);
  return {
    modeLabel: "必要条件と十分条件",
    title: "矢印を2回確かめる",
    prompt: `条件 \\(p\\)：${scenario.p}、条件 \\(q\\)：${scenario.q} について、\\(p\\) は \\(q\\) の何条件かを調べる`,
    steps: [
      {
        label: "行きの矢印",
        question: "「\\(p\\) ならば \\(q\\)」は真・偽のどちら？",
        hint: "p を満たす例をいくつか思い浮かべ、必ず q も満たすかを見ます。",
        choices: ["真", "偽"],
        check: (input) => normalizeText(input).includes(scenario.forward ? "真" : "偽"),
        answer: scenario.forward ? "真" : "偽",
      },
      {
        label: "帰りの矢印",
        question: "「\\(q\\) ならば \\(p\\)」は真・偽のどちら？",
        hint: scenario.backwardNote,
        choices: ["真", "偽"],
        check: (input) => normalizeText(input).includes(scenario.backward ? "真" : "偽"),
        answer: scenario.backward ? "真" : "偽",
      },
      {
        label: "何条件か",
        question: "\\(p\\) は \\(q\\) の何条件？",
        hint: "「p ⟹ q」だけ真なら p は十分条件、「q ⟹ p」だけ真なら p は必要条件、両方真なら必要十分条件です。",
        choices: ["十分条件", "必要条件", "必要十分条件"],
        check: (input) => {
          const text = normalizeText(input);
          if (scenario.role === "必要十分条件") return text.includes("必要十分");
          return text.includes(scenario.role.slice(0, 2)) && !text.includes("必要十分");
        },
        answer: scenario.role,
      },
    ],
  };
}

export function necessarySufficientAdvanced() {
  const scenario = choose([
    { p: "\\(|x|=3\\)", q: "\\(x=3\\) または \\(x=-3\\)", role: "必要十分条件" },
    { p: "\\(x^2=16\\)", q: "\\(x=4\\) または \\(x=-4\\)", role: "必要十分条件" },
  ]);
  return {
    modeLabel: "少し進んだ問題",
    title: "必要十分（同値）を見抜く",
    prompt: `条件 \\(p\\)：${scenario.p}、条件 \\(q\\)：${scenario.q} の関係を調べる`,
    steps: [
      {
        label: "行きの矢印",
        question: "「\\(p\\) ならば \\(q\\)」は真・偽のどちら？",
        hint: "p を満たす数をすべて書き出して、q の内容と見比べます。",
        choices: ["真", "偽"],
        check: (input) => normalizeText(input).includes("真"),
        answer: "真",
      },
      {
        label: "帰りの矢印",
        question: "「\\(q\\) ならば \\(p\\)」は真・偽のどちら？",
        hint: "q の2つの場合それぞれで p が成り立つかを見ます。",
        choices: ["真", "偽"],
        check: (input) => normalizeText(input).includes("真"),
        answer: "真",
      },
      {
        label: "何条件か",
        question: "\\(p\\) は \\(q\\) の何条件？",
        hint: "両方向の矢印が真なら、2つの条件は同じ集合を表しています。",
        choices: ["必要十分条件", "十分条件だが必要条件でない", "必要条件だが十分条件でない"],
        check: (input) => normalizeText(input).includes("必要十分"),
        answer: "必要十分条件",
      },
    ],
  };
}

// ---------- 証明の穴埋め ----------

export function generateProofFillProblem() {
  return {
    modeLabel: "証明の穴埋め",
    title: "「偶数＋偶数は偶数」を証明する",
    prompt: "命題「偶数と偶数の和は偶数である」の証明を、穴埋めで一手ずつ完成させる",
    steps: [
      {
        label: "文字で表す",
        question: "2つの偶数の表し方として正しいのはどれ？（\\(m\\)、\\(n\\) は整数）",
        hint: "同じ文字 \\(2m\\) と \\(2m\\) にすると「同じ数どうしの和」しか表せません。別々の文字を使うのが第一手です。",
        choices: ["\\(2m\\) と \\(2n\\)（別の文字）", "\\(2m\\) と \\(2m\\)（同じ文字）", "\\(m\\) と \\(n\\)"],
        check: (input) => {
          const text = normalizeText(input);
          return text.includes("2m") && text.includes("2n");
        },
        answer: "\\(2m\\) と \\(2n\\)（別の文字）",
      },
      {
        label: "和を計算する",
        question: "和は \\(2m+2n=2(\\square)\\)。\\(\\square\\) に入る式は？",
        hint: "2 が共通因数なので、分配法則を逆向きに使ってくくり出します。",
        check: (input) => sameText(input, "m+n") || sameText(input, "n+m"),
        answer: "m+n",
        example: "m+n",
      },
      {
        label: "結論の根拠",
        question: "\\(2(m+n)\\) が偶数だといえる理由はどれ？",
        hint: "偶数の定義は「2×（整数）の形で書ける数」でした。定義に戻るのが証明の締めくくりです。",
        choices: ["2×（整数）の形だから", "いくつか例で確かめたから", "見た目が偶数らしいから"],
        check: (input) => normalizeText(input).includes("2*(整数)の形だから".replace("*", "*")) || normalizeText(input).includes("の形だから"),
        answer: "2×（整数）の形だから",
      },
      {
        label: "例では足りない理由",
        question: "「\\(2+4=6\\)、\\(6+8=14\\) で確かめたから証明できた」といえない理由はどれ？",
        hint: "命題は「すべての偶数」についての主張です。文字を使うと、すべての場合を一度に扱えます。",
        choices: [
          "試していない偶数で成り立たない可能性が残るから",
          "計算例が少なすぎるから（100個なら十分）",
          "たし算の例では答えが小さすぎるから",
        ],
        check: (input) => normalizeText(input).includes("可能性"),
        answer: "試していない偶数で成り立たない可能性が残るから",
      },
    ],
  };
}

export function proofFillAdvanced() {
  return {
    modeLabel: "少し進んだ問題",
    title: "「連続する2つの整数の和は奇数」を証明する",
    prompt: "命題「連続する2つの整数の和は奇数である」の証明を穴埋めで完成させる",
    steps: [
      {
        label: "文字で表す",
        question: "整数 \\(n\\) から始まる連続する2つの整数は、\\(n\\) と \\(\\square\\)。\\(\\square\\) は？",
        hint: "連続する整数は1ずつ増えます。",
        check: (input) => sameText(input, "n+1"),
        answer: "n+1",
        example: "n+1",
      },
      {
        label: "和を計算する",
        question: "2つの数の和 \\(n+(n+1)\\) を整理すると？",
        hint: "同類項 \\(n\\) と \\(n\\) をまとめます。",
        choices: ["\\(2n+1\\)", "\\(2n\\)", "\\(n^2+n\\)"],
        check: (input) => sameText(input, "2n+1"),
        answer: "\\(2n+1\\)",
      },
      {
        label: "結論の根拠",
        question: "\\(2n+1\\) が奇数だといえる理由はどれ？",
        hint: "奇数の定義は「（偶数）+1、つまり \\(2\\times(\\text{整数})+1\\) の形で書ける数」です。",
        choices: ["2×（整数）+1 の形だから", "n が奇数のときがあるから", "計算すると必ず正になるから"],
        check: (input) => normalizeText(input).includes("+1の形だから"),
        answer: "2×（整数）+1 の形だから",
      },
    ],
  };
}

// ---------- 図形の証明（合同条件の穴埋め） ----------

export function generateGeometryProofProblem() {
  const useIsosceles = choose([true, false]);
  if (useIsosceles) {
    return {
      modeLabel: "図形の証明",
      title: "二等辺三角形を2つに分ける証明",
      prompt: "\\(AB=AC\\) の二等辺三角形 \\(ABC\\) で、\\(\\angle A\\) の二等分線と辺 \\(BC\\) の交点を \\(D\\) とする。\\(\\triangle ABD\\equiv\\triangle ACD\\) を示す。",
      steps: [
        {
          label: "仮定を確かめる",
          question: "この証明で「仮定」として使えるのはどれ？",
          hint: "問題文に書いてあることが仮定、これから示したいことが結論です。混ぜないのが第一歩。",
          choices: ["\\(AB=AC\\) と \\(\\angle BAD=\\angle CAD\\)", "\\(BD=CD\\)", "\\(\\angle ABD=\\angle ACD\\)"],
          check: (input) => sameText(input, "AB=AC と \\angle BAD=\\angle CAD") || (normalizeText(input).includes("ab=ac") && normalizeText(input).includes("bad")),
          answer: "\\(AB=AC\\) と \\(\\angle BAD=\\angle CAD\\)",
        },
        {
          label: "共通な辺",
          question: "2つの三角形が共有している辺はどれ？（例：AB）",
          hint: "図を思い浮かべると、真ん中の線は両方の三角形に属しています。",
          check: (input) => normalizeText(input).replace(/辺/g, "") === "ad",
          answer: "AD",
          example: "AD",
        },
        {
          label: "合同条件を選ぶ",
          question: "そろった材料（2組の辺と、その間の角）に合う合同条件はどれ？",
          hint: "\\(AB=AC\\)、\\(AD\\) 共通、\\(\\angle BAD=\\angle CAD\\)。等しい角が2組の辺に「はさまれて」います。",
          choices: [
            "2組の辺とその間の角がそれぞれ等しい",
            "3組の辺がそれぞれ等しい",
            "1組の辺とその両端の角がそれぞれ等しい",
          ],
          check: (input) => normalizeText(input).includes("間の角"),
          answer: "2組の辺とその間の角がそれぞれ等しい",
        },
        {
          label: "合同から言えること",
          question: "合同が示されたあと、対応する辺として新しく言えるのはどれ？",
          hint: "合同な図形では、対応する辺・角がすべて等しくなります。\\(D\\) が辺 \\(BC\\) の真ん中だと分かります。",
          choices: ["\\(BD=CD\\)", "\\(AB=BC\\)", "\\(AD=BC\\)"],
          check: (input) => sameText(input, "BD=CD"),
          answer: "\\(BD=CD\\)",
        },
      ],
    };
  }

  return {
    modeLabel: "図形の証明",
    title: "平行線と対頂角で合同を示す",
    prompt: "\\(AB\\parallel DC\\) で、線分 \\(AC\\) と \\(BD\\) が点 \\(O\\) で交わり、\\(AO=CO\\) とする。\\(\\triangle OAB\\equiv\\triangle OCD\\) を示す。",
    steps: [
      {
        label: "角の根拠①",
        question: "\\(\\angle AOB=\\angle COD\\) といえる根拠はどれ？",
        hint: "2本の線分が交わってできる、向かい合わせの角です。",
        choices: ["対頂角だから", "錯角だから", "同位角だから"],
        check: (input) => normalizeText(input).includes("対頂角"),
        answer: "対頂角だから",
      },
      {
        label: "角の根拠②",
        question: "\\(\\angle OAB=\\angle OCD\\) といえる根拠はどれ？",
        hint: "\\(AB\\parallel DC\\) という平行の仮定を使う場面です。Zの形の位置関係を探します。",
        choices: ["平行線の錯角だから", "対頂角だから", "円周角だから"],
        check: (input) => normalizeText(input).includes("錯角"),
        answer: "平行線の錯角だから",
      },
      {
        label: "合同条件を選ぶ",
        question: "そろった材料（\\(AO=CO\\) と、その両側の2つの角）に合う合同条件はどれ？",
        hint: "等しい辺 \\(AO=CO\\) の両端に、等しい角が2組そろっています。",
        choices: [
          "1組の辺とその両端の角がそれぞれ等しい",
          "2組の辺とその間の角がそれぞれ等しい",
          "3組の辺がそれぞれ等しい",
        ],
        check: (input) => normalizeText(input).includes("両端の角"),
        answer: "1組の辺とその両端の角がそれぞれ等しい",
      },
    ],
  };
}

// ---------- 重複組合せ ----------

export function generateCombinationsRepetitionProblem() {
  const count = randomInt(4, 6);
  const symbols = count + 2;
  const total = binomial(symbols, 2);
  return {
    modeLabel: "重複組合せ",
    title: "○と仕切りで数える",
    prompt: `りんご・みかん・ももの3種類から、同じ種類を何個選んでもよいことにして \\(${count}\\) 個の果物を選ぶ。選び方は何通りか。`,
    steps: [
      {
        label: "仕切りの本数",
        question: "果物○を種類ごとに分けるための仕切り｜は何本必要？",
        hint: "3つの部屋（りんご・みかん・もも）に分けるには、境目が \\(3-1\\) 本あれば足ります。",
        check: (input) => numericAnswer(input, 2),
        answer: "2",
      },
      {
        label: "記号の総数",
        question: `○ \\(${count}\\) 個と仕切り2本を一列に並べる。記号は全部でいくつ？`,
        hint: `\\(${count}+2\\) を計算します。この並び1つが、選び方1つに対応します。`,
        check: (input) => numericAnswer(input, symbols),
        answer: String(symbols),
      },
      {
        label: "選び方の総数",
        question: `\\(${symbols}\\) か所から仕切りの場所2つを選ぶ \\({}_{${symbols}}C_{2}\\) は？`,
        hint: `\\(\\dfrac{${symbols}\\times${symbols - 1}}{2}\\) を計算します。○の場所を選ぶと考えても同じ答えになります。`,
        check: (input) => numericAnswer(input, total),
        answer: String(total),
      },
    ],
  };
}

// ---------- 余事象 ----------

export function generateComplementaryProblem() {
  const coins = choose([2, 3]);
  const total = 2 ** coins;
  return {
    modeLabel: "余事象",
    title: "『少なくとも1枚』は裏側から数える",
    prompt: `コインを \\(${coins}\\) 枚投げるとき、少なくとも1枚は表が出る確率を求める`,
    steps: [
      {
        label: "起こり方の総数",
        question: `表裏の出方は全部で何通り？`,
        hint: `1枚につき2通りが \\(${coins}\\) 枚分。\\(2^{${coins}}\\) を計算します。`,
        check: (input) => numericAnswer(input, total),
        answer: String(total),
      },
      {
        label: "余事象を選ぶ",
        question: "「少なくとも1枚は表」の余事象（それが起こらない場合）はどれ？",
        hint: "「少なくとも1枚は表」が外れるのは、表が1枚もないときだけです。",
        choices: ["全部が裏", "全部が表", "ちょうど1枚が表"],
        check: (input) => {
          const text = normalizeText(input);
          return text.includes("裏") && (text.includes("全部") || text.includes("すべて"));
        },
        answer: "全部が裏",
      },
      {
        label: "余事象の確率",
        question: "全部が裏になる確率は？",
        hint: `\\(${total}\\) 通りのうち、全部裏は1通りだけです。`,
        check: (input) => sameRational(input, 1, total),
        answer: `\\(${fractionText(1, total)}\\)`,
      },
      {
        label: "1から引く",
        question: "少なくとも1枚は表が出る確率は？",
        hint: `全体の確率1から余事象の確率を引きます：\\(1-\\dfrac{1}{${total}}\\)。`,
        check: (input) => sameRational(input, total - 1, total),
        answer: `\\(${fractionText(total - 1, total)}\\)`,
      },
    ],
  };
}

export function complementaryAdvanced() {
  const face = randomInt(1, 6);
  return {
    modeLabel: "少し進んだ問題",
    title: "さいころ2回の『少なくとも1回』",
    prompt: `さいころを2回投げるとき、少なくとも1回は \\(${face}\\) の目が出る確率を求める`,
    steps: [
      {
        label: "1回分の余事象",
        question: `1回投げて \\(${face}\\) が出ない確率は？`,
        hint: `6つの目のうち、\\(${face}\\) 以外は5つです。`,
        check: (input) => sameRational(input, 5, 6),
        answer: `\\(\\dfrac56\\)`,
      },
      {
        label: "2回とも出ない",
        question: `2回とも \\(${face}\\) が出ない確率は？`,
        hint: `1回目と2回目は独立なので、\\(\\dfrac56\\times\\dfrac56\\) をかけます。`,
        check: (input) => sameRational(input, 25, 36),
        answer: `\\(\\dfrac{25}{36}\\)`,
      },
      {
        label: "1から引く",
        question: `少なくとも1回は \\(${face}\\) が出る確率は？`,
        hint: `\\(1-\\dfrac{25}{36}\\) を計算します。場合分けして足すより、ずっと速い道です。`,
        check: (input) => sameRational(input, 11, 36),
        answer: `\\(\\dfrac{11}{36}\\)`,
      },
    ],
  };
}

// ---------- 条件付き確率 ----------

export function generateConditionalProbabilityProblem() {
  const scenario = choose([
    { groupSize: 24, bothSize: 18 },
    { groupSize: 20, bothSize: 15 },
    { groupSize: 30, bothSize: 12 },
    { groupSize: 25, bothSize: 10 },
  ]);
  const total = 40;
  const { groupSize, bothSize } = scenario;
  return {
    modeLabel: "条件付き確率",
    title: "情報が分母を変える",
    prompt: `${total}人のクラスで、電車通学の人が \\(${groupSize}\\) 人いて、そのうち \\(${bothSize}\\) 人は自転車も使う。「選んだ1人が電車通学だと分かったとき、自転車も使う確率」\\(P_{A}(B)\\) を求める`,
    steps: [
      {
        label: "何も情報がないとき",
        question: `クラスから1人選んだとき、その人が電車通学である確率 \\(P(A)\\) は？`,
        hint: `分母はクラス全体の \\(${total}\\) 人です。約分も忘れずに。`,
        check: (input) => sameRational(input, groupSize, total),
        answer: `\\(${fractionText(groupSize, total)}\\)`,
      },
      {
        label: "分母の変わり方",
        question: "「電車通学だと分かった」あとの確率では、分母になるのはどの人数？",
        hint: "情報が入ると、考える世界が「クラス全体」から「電車通学の人たち」に縮みます。",
        choices: [`電車通学の \\(${groupSize}\\) 人`, `クラス全体の \\(${total}\\) 人`, `自転車も使う \\(${bothSize}\\) 人`],
        check: (input) => cleanText(input).includes(`電車通学の${groupSize}人`) || normalizeText(input) === String(groupSize),
        answer: `電車通学の \\(${groupSize}\\) 人`,
      },
      {
        label: "条件付き確率",
        question: `\\(P_{A}(B)\\) は？`,
        hint: `縮んだ世界 \\(${groupSize}\\) 人のうち、自転車も使うのは \\(${bothSize}\\) 人：\\(\\dfrac{${bothSize}}{${groupSize}}\\)。`,
        check: (input) => sameRational(input, bothSize, groupSize),
        answer: `\\(${fractionText(bothSize, groupSize)}\\)`,
      },
    ],
  };
}

export function conditionalProbabilityAdvanced() {
  const red = randomInt(3, 5);
  const blue = randomInt(2, 4);
  const total = red + blue;
  return {
    modeLabel: "少し進んだ問題",
    title: "乗法定理で2回引きを組み立てる",
    prompt: `赤玉 \\(${red}\\) 個、青玉 \\(${blue}\\) 個の袋から、戻さずに2回引く。両方赤になる確率を、乗法定理 \\(P(A\\cap B)=P(A)\\times P_{A}(B)\\) で求める`,
    steps: [
      {
        label: "1回目",
        question: "1回目が赤である確率 \\(P(A)\\) は？",
        hint: `\\(${total}\\) 個のうち赤は \\(${red}\\) 個です。`,
        check: (input) => sameRational(input, red, total),
        answer: `\\(${fractionText(red, total)}\\)`,
      },
      {
        label: "条件付き確率",
        question: `1回目が赤だったという条件のもとで、2回目も赤の確率 \\(P_{A}(B)\\) は？`,
        hint: `袋の中身が変わります：赤 \\(${red - 1}\\) 個、全体 \\(${total - 1}\\) 個。`,
        check: (input) => sameRational(input, red - 1, total - 1),
        answer: `\\(${fractionText(red - 1, total - 1)}\\)`,
      },
      {
        label: "乗法定理",
        question: `両方赤になる確率 \\(P(A\\cap B)\\) は？`,
        hint: `\\(\\dfrac{${red}}{${total}}\\times\\dfrac{${red - 1}}{${total - 1}}\\) を計算して約分します。`,
        check: (input) => sameRational(input, red * (red - 1), total * (total - 1)),
        answer: `\\(${fractionText(red * (red - 1), total * (total - 1))}\\)`,
      },
    ],
  };
}

// ---------- 和の式から一般項 ----------

export function generateSumGeneralTermProblem() {
  const c = randomInt(1, 4);
  const s1 = 1 + c;
  const s2 = 4 + 2 * c;
  return {
    modeLabel: "和から一般項",
    title: "和の式を引き算でほどく",
    prompt: `数列の初項から第 \\(n\\) 項までの和が \\(S_n=n^2+${c}n\\) で与えられている`,
    steps: [
      {
        label: "初項を読む",
        question: `初項 \\(a_1\\) は？（\\(a_1=S_1\\) を使う）`,
        hint: `第1項までの和は、初項そのものです。\\(S_1=1^2+${c}\\times1\\)。`,
        check: (input) => numericAnswer(input, s1),
        answer: String(s1),
      },
      {
        label: "2項までの和",
        question: `\\(S_2\\) は？`,
        hint: `\\(S_2=2^2+${c}\\times2\\) を計算します。`,
        check: (input) => numericAnswer(input, s2),
        answer: String(s2),
      },
      {
        label: "第2項を取り出す",
        question: `\\(a_2=S_2-S_1\\) は？`,
        hint: `「2項までの和」から「1項までの和」を引くと、ちょうど第2項だけが残ります：\\(${s2}-${s1}\\)。`,
        check: (input) => numericAnswer(input, s2 - s1),
        answer: String(s2 - s1),
      },
    ],
  };
}

export function sumGeneralTermAdvanced() {
  const c = randomInt(1, 4);
  const s6 = 36 + 6 * c;
  const s5 = 25 + 5 * c;
  const generalTeX = `2n+${c - 1 === 0 ? "" : c - 1}`.replace(/\+$/, "");
  const constant = c - 1;
  return {
    modeLabel: "少し進んだ問題",
    title: "S_n − S_{n−1} で一般項の式まで",
    prompt: `和の式 \\(S_n=n^2+${c}n\\) から、一般項 \\(a_n\\) を式のまま取り出す`,
    steps: [
      {
        label: "具体的に1つ",
        question: `\\(a_6=S_6-S_5\\) は？`,
        hint: `\\(S_6=${s6}\\)、\\(S_5=${s5}\\)。引き算します。`,
        check: (input) => numericAnswer(input, s6 - s5),
        answer: String(s6 - s5),
      },
      {
        label: "一般項の式",
        question: `\\(n\\geqq2\\) のとき \\(a_n=S_n-S_{n-1}\\) を整理すると？`,
        hint: `\\(n^2+${c}n-\\{(n-1)^2+${c}(n-1)\\}\\) を展開すると、\\(n^2\\) が消えて一次式が残ります。`,
        choices: [
          `\\(a_n=${constant === 0 ? "2n" : `2n+${constant}`}\\)`,
          `\\(a_n=2n+${constant + 2}\\)`,
          `\\(a_n=n+${c}\\)`,
        ],
        check: (input) => sameText(input, `a_n=${constant === 0 ? "2n" : `2n+${constant}`}`) || sameText(input, constant === 0 ? "2n" : `2n+${constant}`),
        answer: `\\(a_n=${constant === 0 ? "2n" : `2n+${constant}`}\\)`,
      },
      {
        label: "n=1 の照合",
        question: `この式に \\(n=1\\) を入れると？（\\(a_1=S_1=${1 + c}\\) と一致するか確かめる）`,
        hint: `\\(2\\times1+${constant}\\) を計算します。一致すれば、この式はすべての \\(n\\) で使えます。`,
        check: (input) => numericAnswer(input, 2 + constant),
        answer: String(2 + constant),
      },
    ],
  };
}

// ---------- 階差数列 ----------

export function generateDifferenceSequenceProblem() {
  const first = randomInt(2, 5);
  const start = randomInt(1, 3);
  const terms = [first];
  for (let i = 0; i < 4; i += 1) terms.push(terms[terms.length - 1] + start + i);
  const nextDiff = start + 4;
  return {
    modeLabel: "階差数列",
    title: "増え方の列を取り出す",
    prompt: `数列 \\(${terms.join("\\ ")}\\ \\dots\\) の増え方を調べ、次の項を予想する`,
    steps: [
      {
        label: "階差を取り出す",
        question: "隣どうしの差（階差）を、最初から3つ、カンマ区切りで書くと？",
        hint: `\\(${terms[1]}-${terms[0]}\\)、\\(${terms[2]}-${terms[1]}\\)、…と順に引き算します。`,
        check: (input) => sameOrderedList(input, [start, start + 1, start + 2]),
        answer: `${start}, ${start + 1}, ${start + 2}`,
        example: "1, 2, 3",
      },
      {
        label: "階差の規則",
        question: "階差の列はどんな数列？",
        hint: "取り出した差の列 自体が、公差1で増えています。",
        choices: ["公差1の等差数列", "公比2の等比数列", "規則はない"],
        check: (input) => normalizeText(input).includes("等差"),
        answer: "公差1の等差数列",
      },
      {
        label: "次の項を予想",
        question: `第6項は？`,
        hint: `次の階差は \\(${nextDiff}\\)。第5項 \\(${terms[4]}\\) に足します。`,
        check: (input) => numericAnswer(input, terms[4] + nextDiff),
        answer: String(terms[4] + nextDiff),
      },
    ],
  };
}

export function differenceSequenceAdvanced() {
  const first = randomInt(1, 4);
  const sum9 = 45;
  return {
    modeLabel: "少し進んだ問題",
    title: "階差の和で遠くの項へ",
    prompt: `初項 \\(${first}\\)、階差数列が \\(1,\\ 2,\\ 3,\\ \\dots\\)（\\(b_k=k\\)）の数列で、第10項を求める`,
    steps: [
      {
        label: "階差の合計",
        question: `第1項から第10項までに足される階差の合計 \\(\\displaystyle\\sum_{k=1}^{9}k\\) は？`,
        hint: `階差は項の間に入るので、10項までなら9個です。\\(\\dfrac{9\\times10}{2}\\)。`,
        check: (input) => numericAnswer(input, sum9),
        answer: String(sum9),
      },
      {
        label: "第10項",
        question: `第10項 \\(a_{10}=a_1+\\displaystyle\\sum_{k=1}^{9}k\\) は？`,
        hint: `\\(${first}+${sum9}\\) を計算します。`,
        check: (input) => numericAnswer(input, first + sum9),
        answer: String(first + sum9),
      },
      {
        label: "第15項",
        question: `同じ考え方で、第15項は？（\\(\\displaystyle\\sum_{k=1}^{14}k=105\\)）`,
        hint: `\\(${first}+105\\) を計算します。階差の和さえ求まれば、遠くの項へ一気に跳べます。`,
        check: (input) => numericAnswer(input, first + 105),
        answer: String(first + 105),
      },
    ],
  };
}

// ---------- 漸化式 ----------

export function generateRecurrenceProblem() {
  const first = randomInt(1, 5);
  const step = randomInt(2, 5);
  return {
    modeLabel: "漸化式",
    title: "隣の関係で数列を作る",
    prompt: `\\(a_1=${first}\\)、\\(a_{n+1}=a_n+${step}\\) で決まる数列を調べる`,
    steps: [
      {
        label: "次の項",
        question: `\\(a_2\\) は？`,
        hint: `漸化式に \\(n=1\\) を入れると \\(a_2=a_1+${step}\\)。`,
        check: (input) => numericAnswer(input, first + step),
        answer: String(first + step),
      },
      {
        label: "その次",
        question: `\\(a_3\\) は？`,
        hint: `\\(a_3=a_2+${step}\\)。1つ前の項さえ分かれば、次が決まる仕組みです。`,
        check: (input) => numericAnswer(input, first + 2 * step),
        answer: String(first + 2 * step),
      },
      {
        label: "正体を見抜く",
        question: "この数列の正体は？",
        hint: `「前の項に必ず \\(${step}\\) を足す」——いつも同じ数を足すのは、見覚えのある増え方です。`,
        choices: [`公差 \\(${step}\\) の等差数列`, `公比 \\(${step}\\) の等比数列`, "規則のない数列"],
        check: (input) => normalizeText(input).includes("等差"),
        answer: `公差 \\(${step}\\) の等差数列`,
      },
      {
        label: "一般項で遠くへ",
        question: `\\(a_{10}\\) は？`,
        hint: `等差数列と分かれば一般項が使えます：\\(a_{10}=${first}+(10-1)\\times${step}\\)。`,
        check: (input) => numericAnswer(input, first + 9 * step),
        answer: String(first + 9 * step),
      },
    ],
  };
}

export function recurrenceAdvanced() {
  const first = randomInt(1, 3);
  const ratio = choose([2, 3]);
  const sixth = first * ratio ** 5;
  return {
    modeLabel: "少し進んだ問題",
    title: "かけ算の漸化式",
    prompt: `\\(a_1=${first}\\)、\\(a_{n+1}=${ratio}a_n\\) で決まる数列を調べる`,
    steps: [
      {
        label: "次の項",
        question: `\\(a_2\\) は？`,
        hint: `\\(a_2=${ratio}\\times a_1\\)。`,
        check: (input) => numericAnswer(input, first * ratio),
        answer: String(first * ratio),
      },
      {
        label: "その次",
        question: `\\(a_3\\) は？`,
        hint: `\\(a_3=${ratio}\\times a_2\\)。`,
        check: (input) => numericAnswer(input, first * ratio ** 2),
        answer: String(first * ratio ** 2),
      },
      {
        label: "正体を見抜く",
        question: "この数列の正体は？",
        hint: `「前の項に必ず \\(${ratio}\\) をかける」増え方です。`,
        choices: [`公比 \\(${ratio}\\) の等比数列`, `公差 \\(${ratio}\\) の等差数列`, "階差数列"],
        check: (input) => normalizeText(input).includes("等比"),
        answer: `公比 \\(${ratio}\\) の等比数列`,
      },
      {
        label: "一般項で遠くへ",
        question: `\\(a_6\\) は？`,
        hint: `\\(a_6=${first}\\times${ratio}^{5}\\)。かける回数は番号より1つ少ない5回です。`,
        check: (input) => numericAnswer(input, sixth),
        answer: String(sixth),
      },
    ],
  };
}

// ---------- 数学的帰納法 ----------

export function generateInductionProblem() {
  const useSum = choose([true, false]);
  const proposition = useSum
    ? { text: "\\(1+2+\\dots+n=\\dfrac{n(n+1)}{2}\\)", leftAtOne: 1, rightHint: "\\(\\dfrac{1\\times2}{2}=1\\)", rightAtOne: 1 }
    : { text: "\\(2^n\\geqq n+1\\)", leftAtOne: 2, rightHint: "\\(1+1=2\\)", rightAtOne: 2 };
  return {
    modeLabel: "数学的帰納法",
    title: "ドミノ倒しの2つの手順",
    prompt: `すべての自然数 \\(n\\) で ${proposition.text} が成り立つことを、数学的帰納法で示す準備をする`,
    steps: [
      {
        label: "最初のドミノ",
        question: "まず具体的に確かめるのは \\(n=\\square\\) のとき。\\(\\square\\) は？",
        hint: "いちばん手前のドミノを倒しておくのが第一手です。自然数の出発点から。",
        check: (input) => numericAnswer(input, 1),
        answer: "1",
      },
      {
        label: "左辺の値",
        question: `\\(n=1\\) のとき、左辺の値は？`,
        hint: useSum ? "和は最初の1項だけ、つまり 1 です。" : "\\(2^1\\) を計算します。",
        check: (input) => numericAnswer(input, proposition.leftAtOne),
        answer: String(proposition.leftAtOne),
      },
      {
        label: "右辺の値",
        question: `\\(n=1\\) のとき、右辺の値は？`,
        hint: `${proposition.rightHint} なので、左辺と${useSum ? "一致" : "比べて成立"}が確かめられます。`,
        check: (input) => numericAnswer(input, proposition.rightAtOne),
        answer: String(proposition.rightAtOne),
      },
      {
        label: "次の一手",
        question: "\\(n=1\\) の確認のあと、次にやることはどれ？",
        hint: "「どの1枚が倒れても、次の1枚が倒れる」仕組みを示すのが帰納法の心臓部です。",
        choices: [
          "\\(n=k\\) で成り立つと仮定して、\\(n=k+1\\) でも成り立つことを示す",
          "すべての \\(n\\) で成り立つと仮定する",
          "\\(n=k+1\\) で成り立つと仮定して、\\(n=k\\) を示す",
        ],
        check: (input) => {
          const text = cleanText(input);
          return text.includes("n=kで成り立つと仮定") && text.includes("k+1");
        },
        answer: "\\(n=k\\) で成り立つと仮定して、\\(n=k+1\\) でも成り立つことを示す",
      },
    ],
  };
}

export const extraPracticeGenerators = {
  "number-classification": generateNumberClassificationProblem,
  "prime-factorization": generatePrimeFactorizationProblem,
  "simultaneous-equations": generateSimultaneousProblem,
  "parallel-lines-angles": generateParallelAnglesProblem,
  "pythagorean-theorem": generatePythagorasProofProblem,
  similarity: generateSimilarityProblem,
  "trig-extension": generateTrigExtensionProblem,
  "function-notation": generateFunctionNotationProblem,
  "logic-converse": generateLogicConverseProblem,
  "necessary-sufficient": generateNecessarySufficientProblem,
  "proof-fill": generateProofFillProblem,
  "geometry-proofs": generateGeometryProofProblem,
  "combinations-repetition": generateCombinationsRepetitionProblem,
  "complementary-events": generateComplementaryProblem,
  "conditional-probability": generateConditionalProbabilityProblem,
  "sum-and-general-term": generateSumGeneralTermProblem,
  "difference-sequences": generateDifferenceSequenceProblem,
  "recurrence-relations": generateRecurrenceProblem,
  "mathematical-induction": generateInductionProblem,
};

export const extraAdvancedGenerators = {
  "number-classification": numberClassificationAdvanced,
  "prime-factorization": primeFactorizationAdvanced,
  "simultaneous-equations": simultaneousAdvanced,
  "parallel-lines-angles": parallelAnglesAdvanced,
  similarity: similarityAdvanced,
  "trig-extension": trigExtensionAdvanced,
  "function-notation": functionNotationAdvanced,
  "logic-converse": logicConverseAdvanced,
  "necessary-sufficient": necessarySufficientAdvanced,
  "proof-fill": proofFillAdvanced,
  "complementary-events": complementaryAdvanced,
  "conditional-probability": conditionalProbabilityAdvanced,
  "sum-and-general-term": sumGeneralTermAdvanced,
  "difference-sequences": differenceSequenceAdvanced,
  "recurrence-relations": recurrenceAdvanced,
};
