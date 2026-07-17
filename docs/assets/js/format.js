// 数式・本文テキストの整形（純関数）。教材データの TeX を画面用 HTML へ変換する。

export function signed(value) {
  return value < 0 ? `- ${Math.abs(value)}` : `+ ${value}`;
}

export function compactSigned(value) {
  return value < 0 ? ` - ${Math.abs(value)}` : ` + ${value}`;
}

export function factorText(value) {
  return value < 0 ? `(${value})` : String(value);
}

export function sumExpression(left, right) {
  return `${left}${right < 0 ? `-${Math.abs(right)}` : `+${right}`}`;
}

export function compactLinearExpression(xCoef, constant) {
  if (constant === 0) return term(xCoef);
  return `${term(xCoef)}${constant < 0 ? `-${Math.abs(constant)}` : `+${constant}`}`;
}

export function compactPolynomial(terms) {
  const expression = terms
    .filter(({ value }) => value !== 0)
    .map(({ value, variable = "" }) => {
      const magnitude = variable ? term(Math.abs(value), variable) : String(Math.abs(value));
      return `${value < 0 ? "-" : "+"}${magnitude}`;
    })
    .join("");
  return expression.replace(/^\+/, "") || "0";
}

export function vertexQuadraticExpression(a, h, k) {
  const horizontal = h < 0 ? `x+${Math.abs(h)}` : h > 0 ? `x-${h}` : "x";
  const square = h === 0 ? "x^2" : `(${horizontal})^2`;
  const coefficient = a === 1 ? "" : a === -1 ? "-" : String(a);
  const vertical = k < 0 ? String(k) : k > 0 ? `+${k}` : "";
  return `${coefficient}${square}${vertical}`;
}

// 式の途中に「+3x」「-y」の形でつなぐ項。係数 ±1 の 1 は省く。
export function signedCoefTerm(coefficient, variable) {
  const sign = coefficient < 0 ? "-" : "+";
  const magnitude = Math.abs(coefficient);
  return `${sign}${magnitude === 1 ? "" : magnitude}${variable}`;
}

// 式の先頭の項。係数 ±1 の 1 は省き、正なら符号を付けない。
export function leadCoefTerm(coefficient, variable) {
  const magnitude = Math.abs(coefficient);
  const body = `${magnitude === 1 ? "" : magnitude}${variable}`;
  return coefficient < 0 ? `-${body}` : body;
}

// 定数項。0 なら項ごと省略する。
export function signedConstant(value) {
  if (value === 0) return "";
  return value < 0 ? String(value) : `+${value}`;
}

// 符号つきの数（+5 / -3）。式の末尾へつなぐときに使う。
export function signedTerm(value) {
  return value < 0 ? String(value) : `+${value}`;
}

// 根 root を持つ一次因数の表示（root=3 → x-3、root=-3 → x+3）。
export function linearFactor(root) {
  if (root < 0) return `x+${Math.abs(root)}`;
  if (root > 0) return `x-${root}`;
  return "x";
}

export function term(coef, variable = "x") {
  if (coef === 0) return "0";
  if (coef === 1) return variable;
  if (coef === -1) return `-${variable}`;
  return `${coef}${variable}`;
}

export function linearText(xCoef, constant) {
  const parts = [];
  if (xCoef !== 0) parts.push(term(xCoef));
  if (constant !== 0 || parts.length === 0) {
    parts.push(parts.length ? compactSigned(constant).trim() : `${constant}`);
  }
  return parts.join(" ").replace("+ -", "- ");
}

export function mathInline(text) {
  return `\\(${text}\\)`;
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function legacyFormatTextWithMath(value) {
  const mathSegments = /(\\\\\([\s\S]*?\\\\\)|\\\\\[[\s\S]*?\\\\\])/g;
  return String(value)
    .split(mathSegments)
    .map((segment) => {
      if (/^\\\\[([]/.test(segment)) return escapeHtml(segment);
      return escapeHtml(segment).replace(
        /\b(sin|cos|tan)\b|\b([a-zA-Z])\b|([a-zA-Z])(?=[ぁ-んァ-ヶ一-龯々〆〤])/g,
        (match, functionName, standaloneVariable, attachedVariable) => {
          const math = functionName ? `\\\\${functionName}` : standaloneVariable || attachedVariable;
          return `\\\\(${math}\\\\)`;
        },
      );
    })
    .join("");
}

export function formatProseWithMath(value) {
  const slash = String.fromCharCode(92);
  return escapeHtml(value).replace(
    /\b(sin|cos|tan)\b|\b([a-zA-Z])\b|([a-zA-Z])(?=[ぁ-んァ-ヶ一-龯々〆〤])/g,
    (match, functionName, standaloneVariable, attachedVariable) => {
      const math = functionName ? slash + functionName : standaloneVariable || attachedVariable;
      return slash + "(" + math + slash + ")";
    },
  );
}

export function formatTextWithMath(value) {
  const source = String(value);
  const slash = String.fromCharCode(92);
  const inlineOpen = slash + "(";
  const inlineClose = slash + ")";
  const displayOpen = slash + "[";
  const displayClose = slash + "]";
  let cursor = 0;
  let output = "";

  while (cursor < source.length) {
    const inlineIndex = source.indexOf(inlineOpen, cursor);
    const displayIndex = source.indexOf(displayOpen, cursor);
    const starts = [inlineIndex, displayIndex].filter((index) => index >= 0);
    if (!starts.length) return output + formatProseWithMath(source.slice(cursor));

    const start = Math.min(...starts);
    const close = start === inlineIndex ? inlineClose : displayClose;
    const end = source.indexOf(close, start + 2);
    output += formatProseWithMath(source.slice(cursor, start));
    if (end < 0) return output + formatProseWithMath(source.slice(start));

    output += escapeHtml(source.slice(start, end + close.length));
    cursor = end + close.length;
  }

  return output;
}

export function alignEquationRow(value) {
  const source = value.trim();
  const equalIndex = source.indexOf("=");
  if (equalIndex < 0) return source;
  return `${source.slice(0, equalIndex).trim()}&=${source.slice(equalIndex + 1).trim()}`;
}

export function hasBalancedBraces(value) {
  let depth = 0;
  for (const char of value) {
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

export function displayEquationTeX(value) {
  const source = value.trim();

  // 表示は2モードに分ける。
  // ①並記モード：\quad・矢印・下かっこなどで「複数の式」や「注釈つきの式」を
  //   1行に並べているものは、= で機械的に揃えず、そのまま表示する。
  // ②チェーンモード：3a=3×120=360 のような1本の変形の連鎖だけを、= を縦に揃えて表示する。
  const isSideBySide = /\\quad|\\qquad|\\Longrightarrow|\\Longleftrightarrow|\\Leftrightarrow|\\iff|\\underbrace|\\overbrace/.test(
    source,
  );
  if (isSideBySide) {
    return `\\[${source}\\]`;
  }

  const arrowSteps = source.split("\\Rightarrow").map((step) => step.trim());
  let rows;

  if (arrowSteps.length > 1) {
    rows = arrowSteps.map(alignEquationRow);
  } else {
    const equalSteps = source.split("=").map((step) => step.trim());
    rows =
      equalSteps.length > 2
        ? [`${equalSteps[0]}&=${equalSteps[1]}`, ...equalSteps.slice(2).map((step) => `&=${step}`)]
        : [alignEquationRow(source)];
  }

  // \underbrace{x+2=7} のように、かっこの内側に = を含む式を機械的に分割すると
  // TeX が壊れる。& で区切った各断片のかっこが対応している場合だけ整列する。
  const splitIsSafe = rows.every((row) => row.split("&").every(hasBalancedBraces));
  if (!splitIsSafe) {
    return `\\[${source}\\]`;
  }

  return `\\[\\begin{aligned}${rows.join("\\\\")}\\end{aligned}\\]`;
}

export function workedExampleMarkup(value) {
  if (value && typeof value === "object" && value.type === "aligned-steps") {
    const rows = value.rows.map((row) => alignEquationRow(row)).join("\\\\");
    return `
      <div class="worked-example worked-example-steps">
        ${value.intro ? `<p class="example-intro">${formatTextWithMath(value.intro)}</p>` : ""}
        <div class="equation-display">${escapeHtml(`\\[\\begin{aligned}${rows}\\end{aligned}\\]`)}</div>
        ${value.conclusion ? `<p class="example-intro">${formatTextWithMath(value.conclusion)}</p>` : ""}
      </div>
    `;
  }

  if (value && typeof value === "object" && value.type === "walkthrough") {
    const steps = value.steps
      .map((step, index) => {
        const note = step.note ? `<p class="walkthrough-note">${formatTextWithMath(step.note)}</p>` : "";
        const body = step.text
          ? `<div class="walkthrough-sentence">${formatTextWithMath(step.text)}</div>`
          : `<div class="walkthrough-equation">${escapeHtml(`\\(${String(step.equation).replace(/^\\\(|\\\)$/g, "")}\\)`)}</div>`;
        return `
          <li class="walkthrough-step">
            <span class="walkthrough-index" aria-hidden="true">${index + 1}</span>
            <div class="walkthrough-body">
              ${body}
              ${note}
            </div>
          </li>
        `;
      })
      .join("");
    return `
      <div class="worked-example worked-example-walkthrough">
        ${value.intro ? `<p class="example-intro">${formatTextWithMath(value.intro)}</p>` : ""}
        <ol class="walkthrough-list">${steps}</ol>
        ${value.conclusion ? `<p class="example-intro walkthrough-conclusion">${formatTextWithMath(value.conclusion)}</p>` : ""}
      </div>
    `;
  }

  if (value && typeof value === "object" && value.type === "word-problem") {
    return `
      <div class="worked-example worked-example-word">
        <p class="example-intro">${formatTextWithMath(value.prompt)}</p>
        <p class="example-intro">${formatTextWithMath(value.explanation)}</p>
        <div class="equation-display">${escapeHtml(displayEquationTeX(value.equation.replace(/^\\\(|\\\)$/g, "")))}</div>
      </div>
    `;
  }

  if (value && typeof value === "object" && value.type === "narrative") {
    return `
      <div class="worked-example worked-example-narrative">
        <p class="example-intro">${formatTextWithMath(value.body)}</p>
        ${value.equation ? `<div class="equation-display">${escapeHtml(displayEquationTeX(value.equation.replace(/^\\\(|\\\)$/g, "")))}</div>` : ""}
      </div>
    `;
  }

  const source = String(value);
  if (!/(?:=|\\Rightarrow)/.test(source)) {
    return `<div class="worked-example"><p class="example-intro">${formatTextWithMath(source)}</p></div>`;
  }
  const inlineMath = /\\\(([\s\S]*?)\\\)/g;
  const fragments = [];
  let cursor = 0;
  let match;

  function addProse(prose) {
    const cleaned = prose.replace(/^[\s、。]+|[\s、。]+$/g, "");
    if (cleaned) fragments.push(`<p class="example-intro">${formatTextWithMath(cleaned)}</p>`);
  }

  while ((match = inlineMath.exec(source))) {
    addProse(source.slice(cursor, match.index));
    fragments.push(`<div class="equation-display">${escapeHtml(displayEquationTeX(match[1]))}</div>`);
    cursor = match.index + match[0].length;
  }
  addProse(source.slice(cursor));

  return fragments.length ? `<div class="worked-example">${fragments.join("")}</div>` : `<p class="example-intro">${formatTextWithMath(source)}</p>`;
}
