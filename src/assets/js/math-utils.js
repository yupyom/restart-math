// 数値計算と答え合わせ用の解析（純関数）。

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

export function fractionText(numerator, denominator) {
  if (denominator === 0) return "未定義";
  const sign = numerator * denominator < 0 ? "-" : "";
  const n = Math.abs(numerator);
  const d = Math.abs(denominator);
  const divisor = gcd(n, d);
  const reducedN = n / divisor;
  const reducedD = d / divisor;
  if (reducedD === 1) return `${sign}${reducedN}`;
  return `${sign}\\frac{${reducedN}}{${reducedD}}`;
}

export function parseFraction(input) {
  const text = normalizeText(input);
  if (/^-?\d+\/-?\d+$/.test(text)) {
    const [n, d] = text.split("/").map(Number);
    if (d === 0) return null;
    return n / d;
  }
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return null;
}

export function sameRational(input, numerator, denominator) {
  const value = parseFraction(input);
  if (value === null) return false;
  return Math.abs(value - numerator / denominator) < 1e-9;
}

export function factorial(n) {
  return Array.from({ length: n }, (_, index) => index + 1).reduce((acc, value) => acc * value, 1);
}

export function permutation(n, r) {
  let total = 1;
  for (let value = n; value > n - r; value -= 1) total *= value;
  return total;
}

export function combination(n, r) {
  return permutation(n, r) / factorial(r);
}

// 解答入力の正規化。全角と半角、記号の表記揺れをここで一手に吸収する
// （生成器・発展生成器・採点の全員がこの一つを使う。仕様の分岐を作らない）。
export function normalizeText(value) {
  return String(value)
    .trim()
    .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[−ー－]/g, "-")
    .replace(/[＋]/g, "+")
    .replace(/[＝]/g, "=")
    .replace(/[＜]/g, "<")
    .replace(/[＞]/g, ">")
    .replace(/[×・＊]/g, "*")
    .replace(/[、，；]/g, ",")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/\s+/g, "")
    .toLowerCase();
}

// 数値の一致。variable を渡すと「x=」の形の前置きを許す。度・° の単位も無視する。
export function numericAnswer(input, answer, variable = "") {
  const prefix = variable ? new RegExp(`^${variable}=`) : null;
  const text = prefix ? normalizeText(input).replace(prefix, "") : normalizeText(input);
  return Number(text.replace(/度|°/g, "")) === answer;
}

// カンマ区切りの数の組（順序を区別する）。
export function sameOrderedPair(input, first, second) {
  const values = normalizeText(input)
    .replace(/[{}()（）]/g, "")
    .split(",")
    .map(Number);
  return values.length === 2 && values[0] === first && values[1] === second;
}

// カンマ区切りの数の列（順序を区別する）。
export function sameOrderedList(input, expected) {
  const values = normalizeText(input)
    .replace(/[{}()（）]/g, "")
    .split(",")
    .filter(Boolean)
    .map(Number);
  return values.length === expected.length && values.every((value, index) => value === expected[index]);
}

// カンマ区切りの数の集合（順序を区別しない）。
export function sameNumberList(input, expected) {
  const values = normalizeText(input)
    .replace(/[{}()（）]/g, "")
    .split(",")
    .filter(Boolean)
    .map(Number)
    .sort((a, b) => a - b);
  const target = [...expected].sort((a, b) => a - b);
  return values.length === target.length && values.every((value, index) => value === target[index]);
}

// 表示用の模範解答（TeX を含む）を、学習者が入力欄に打てる文字列へ直す。
// 練習画面の選択肢生成と、scripts/test-practice.mjs の自己受理テストが同じ規則を使う。
export function answerToInputText(answer) {
  return String(answer)
    .replace(/^\\\(|\\\)$/g, "")
    .replace(/\\d?frac\{(-?[^{}]+)\}\{(-?[^{}]+)\}/g, "$1/$2")
    .replace(/\\d?frac(\d)(\d)/g, "$1/$2")
    .replace(/\\sqrt\{(\d+)\}/g, "√$1")
    .replace(/\\sqrt(\d+)/g, "√$1")
    .replace(/\\pm/g, "±")
    .replace(/\\times/g, "*")
    .replace(/\\ /g, " ")
    .trim();
}

// ユークリッドの互除法の割り算列。図解（labs-view）と問題生成の両方が使う。
export function euclideanDivisionSteps(first, second) {
  let dividend = Math.max(first, second);
  let divisor = Math.min(first, second);
  const steps = [];
  while (divisor !== 0) {
    const quotient = Math.floor(dividend / divisor);
    const remainder = dividend % divisor;
    steps.push({ dividend, divisor, quotient, remainder });
    dividend = divisor;
    divisor = remainder;
  }
  return { steps, commonDivisor: dividend };
}

export function parseLinearExpression(input) {
  let text = normalizeText(input).replace(/\*/g, "");
  if (!text) return null;
  text = text.replace(/--/g, "+").replace(/\+-/g, "-").replace(/-\+/g, "-");
  if (!/^[+-]/.test(text)) text = `+${text}`;

  let xCoef = 0;
  let constant = 0;
  const matches = text.matchAll(/([+-])([^+-]+)/g);

  for (const match of matches) {
    const sign = match[1] === "-" ? -1 : 1;
    const body = match[2];
    if (body.includes("x")) {
      const rawCoef = body.replace("x", "");
      if (rawCoef === "") xCoef += sign;
      else if (/^\d+$/.test(rawCoef)) xCoef += sign * Number(rawCoef);
      else return null;
    } else if (/^\d+$/.test(body)) {
      constant += sign * Number(body);
    } else {
      return null;
    }
  }

  return { xCoef, constant };
}

export function sameLinearExpression(input, xCoef, constant) {
  const parsed = parseLinearExpression(input);
  return parsed && parsed.xCoef === xCoef && parsed.constant === constant;
}

export function parseEquation(input) {
  const text = normalizeText(input).replace(/\*/g, "");
  const parts = text.split("=");
  if (parts.length !== 2) return null;
  const left = parseLinearExpression(parts[0]);
  const right = parseLinearExpression(parts[1]);
  if (!left || !right) return null;
  return {
    xCoef: left.xCoef - right.xCoef,
    constant: left.constant - right.constant,
  };
}

export function sameEquation(input, xCoef, constant) {
  const parsed = parseEquation(input);
  return parsed && parsed.xCoef === xCoef && parsed.constant === constant;
}

export function largestSquareFactor(n) {
  for (let root = Math.floor(Math.sqrt(n)); root >= 1; root -= 1) {
    const square = root * root;
    if (n % square === 0) {
      return { root, square, rest: n / square };
    }
  }
  return { root: 1, square: 1, rest: n };
}

export function radicalText(coef, radicand) {
  if (radicand === 1) return `${coef}`;
  if (coef === 1) return `√${radicand}`;
  if (coef === -1) return `-√${radicand}`;
  return `${coef}√${radicand}`;
}

export function radicalTeX(coef, radicand) {
  if (radicand === 1) return String(coef);
  if (coef === 1) return `\\sqrt{${radicand}}`;
  if (coef === -1) return `-\\sqrt{${radicand}}`;
  return `${coef}\\sqrt{${radicand}}`;
}

export function sameRadical(input, coef, radicand) {
  let text = normalizeText(input)
    .replace(/\*/g, "")
    .replace(/sqrt\((\d+)\)/g, "√$1")
    .replace(/sqrt(\d+)/g, "√$1");

  if (radicand === 1) return Number(text) === coef;

  const patterns = [
    new RegExp(`^${coef}√${radicand}$`),
    new RegExp(`^${coef}root${radicand}$`),
  ];
  if (coef === 1) patterns.push(new RegExp(`^√${radicand}$`));
  if (coef === -1) patterns.push(new RegExp(`^-√${radicand}$`));
  return patterns.some((pattern) => pattern.test(text));
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function choose(values) {
  return values[randomInt(0, values.length - 1)];
}

export function binomial(n, k) {
  let result = 1;
  for (let i = 1; i <= k; i += 1) {
    result = (result * (n - k + i)) / i;
  }
  return Math.round(result);
}
