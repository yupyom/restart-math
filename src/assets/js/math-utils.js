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

export function normalizeText(value) {
  return String(value)
    .trim()
    .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[−ー－]/g, "-")
    .replace(/[＋]/g, "+")
    .replace(/[＝]/g, "=")
    .replace(/[×・＊]/g, "*")
    .replace(/\s+/g, "")
    .toLowerCase();
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
