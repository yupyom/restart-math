import { units } from "../../content/lessons.js";
import { topics, categoryLabels } from "../../content/topics.js";
import { labs, labCatalog } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { stories, storyCatalog } from "../../content/stories.js";
import { advancedPracticeGenerators } from "./practice-advanced.js";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const pageIds = ["home", "scope", "lessons", "labs", "practice", "stories", "map"];

let mathTypesetFrame = null;
const mathTypesetTargets = new Set();

function scheduleMathTypeset(target = document.body) {
  if (!window.MathJax || typeof window.MathJax.typesetPromise !== "function") return;
  mathTypesetTargets.add(target);
  if (mathTypesetFrame) return;
  mathTypesetFrame = window.requestAnimationFrame(() => {
    const targets = Array.from(mathTypesetTargets).filter(Boolean);
    mathTypesetTargets.clear();
    mathTypesetFrame = null;
    window.MathJax.typesetPromise(targets).catch((error) => {
      console.warn("MathJax typeset failed:", error);
    });
  });
}

let activeUnit = 0;
let activeLabId = "number-line-lab";
let activePracticeMode = "integer";
let activePracticeLevel = "starter";
let currentProblem = null;
let currentStepIndex = 0;
let activeMapPage = 0;
let activeLessonRange = null;
let activeStoryId = "shared-calculation-order";
const storyTypeLabels = {
  rule: "ルールの物語",
  notation: "記法の読み方",
  history: "数学の背景と歴史",
  society: "社会とのつながり",
};

function signed(value) {
  return value < 0 ? `- ${Math.abs(value)}` : `+ ${value}`;
}

const rangeValueFormatters = {
  "int-a": (value) => `a = ${value}` ,
  "int-b": (value) => `b = ${value}` ,
  "dist-a": (value) => `a = ${value}` ,
  "dist-b": (value) => `b = ${value}` ,
  "dist-c": (value) => `c = ${value}` ,
  "radical-n": (value) => `n = ${value}` ,
  "eq-a": (value) => `${value} 袋` ,
  "eq-x": (value) => `${value} こ` ,
  "eq-b": (value) => `${value} こ` ,
  "graph-a": (value) => `a = ${value}` ,
  "graph-b": (value) => `b = ${value}` ,
  "graph-c": (value) => `c = ${value}` ,
  "quad-a": (value) => `a = ${value}` ,
  "quad-h": (value) => `p = ${value}` ,
  "quad-k": (value) => `q = ${value}` ,
  "trig-angle": (value) => `${value}°` ,
  "trig-hyp": (value) => `${value}` ,
  "prob-red": (value) => `R = ${value}` ,
  "prob-blue": (value) => `B = ${value}` ,
  "loan-principal": (value) => `${value} 万円`,
  "loan-rate": (value) => `${value}%`,
  "loan-months": (value) => `${value}か月`,
  "account-price": (value) => `${value * 100} 円`,
  "account-quantity": (value) => `${value} 個`,
  "account-cost": (value) => `${value * 100} 円`,
  "account-fixed": (value) => `${value * 100} 円`,
  "speed-rate": (value) => `${value} km/h`,
  "speed-hours": (value) => `${value} 時間`,
  "data-center": (value) => `${value}`,
  "data-spread": (value) => `${value}`,
  "circle-observer": (value) => `位置 ${value}`,
  "gcd-a": (value) => `${value}`,
  "gcd-b": (value) => `${value}`,
  "venn-a": (value) => `${value} 人`,
  "venn-b": (value) => `${value} 人`,
  "venn-both": (value) => `${value} 人`,
  "triangle-apex-x": (value) => `位置 ${value}`,
  "triangle-apex-y": (value) => `高さ ${value}`,
};

function setupRangeValueLabels() {
  Object.entries(rangeValueFormatters).forEach(([id, format]) => {
    const input = document.getElementById(id);
    if (!input) return;
    const output = document.createElement("output");
    output.className = "range-value";
    output.htmlFor = id;
    input.before(output);
    const update = () => {
      output.textContent = format(Number(input.value));
    };
    input.addEventListener("input", update);
    update();
  });
}

function setupMathChoiceGroups() {
  $$('[data-math-choice-group]').forEach((group) => {
    const target = document.getElementById(group.dataset.mathChoiceGroup);
    if (!target) return;
    const buttons = Array.from(group.querySelectorAll("[data-choice-value]"));
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        target.value = button.dataset.choiceValue;
        buttons.forEach((item) => {
          const isActive = item === button;
          item.classList.toggle("active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });
        target.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });
  });
}


function compactSigned(value) {
  return value < 0 ? ` - ${Math.abs(value)}` : ` + ${value}`;
}

function factorText(value) {
  return value < 0 ? `(${value})` : String(value);
}

function sumExpression(left, right) {
  return `${left}${right < 0 ? `-${Math.abs(right)}` : `+${right}`}`;
}

function compactLinearExpression(xCoef, constant) {
  if (constant === 0) return term(xCoef);
  return `${term(xCoef)}${constant < 0 ? `-${Math.abs(constant)}` : `+${constant}`}`;
}

function compactPolynomial(terms) {
  const expression = terms
    .filter(({ value }) => value !== 0)
    .map(({ value, variable = "" }) => {
      const magnitude = variable ? term(Math.abs(value), variable) : String(Math.abs(value));
      return `${value < 0 ? "-" : "+"}${magnitude}`;
    })
    .join("");
  return expression.replace(/^\+/, "") || "0";
}

function vertexQuadraticExpression(a, h, k) {
  const horizontal = h < 0 ? `x+${Math.abs(h)}` : h > 0 ? `x-${h}` : "x";
  const square = h === 0 ? "x^2" : `(${horizontal})^2`;
  const coefficient = a === 1 ? "" : a === -1 ? "-" : String(a);
  const vertical = k < 0 ? String(k) : k > 0 ? `+${k}` : "";
  return `${coefficient}${square}${vertical}`;
}

function term(coef, variable = "x") {
  if (coef === 0) return "0";
  if (coef === 1) return variable;
  if (coef === -1) return `-${variable}`;
  return `${coef}${variable}`;
}

function linearText(xCoef, constant) {
  const parts = [];
  if (xCoef !== 0) parts.push(term(xCoef));
  if (constant !== 0 || parts.length === 0) {
    parts.push(parts.length ? compactSigned(constant).trim() : `${constant}`);
  }
  return parts.join(" ").replace("+ -", "- ");
}

function rangeTags(unit) {
  const uniqueRange = [...new Set(unit.range)];
  return `<div class="range-tags">${uniqueRange.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function mathInline(text) {
  return `\\(${text}\\)`;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function legacyFormatTextWithMath(value) {
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

function formatProseWithMath(value) {
  const slash = String.fromCharCode(92);
  return escapeHtml(value).replace(
    /\b(sin|cos|tan)\b|\b([a-zA-Z])\b|([a-zA-Z])(?=[ぁ-んァ-ヶ一-龯々〆〤])/g,
    (match, functionName, standaloneVariable, attachedVariable) => {
      const math = functionName ? slash + functionName : standaloneVariable || attachedVariable;
      return slash + "(" + math + slash + ")";
    },
  );
}

function formatTextWithMath(value) {
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

function alignEquationRow(value) {
  const source = value.trim();
  const equalIndex = source.indexOf("=");
  if (equalIndex < 0) return source;
  return `${source.slice(0, equalIndex).trim()}&=${source.slice(equalIndex + 1).trim()}`;
}

function displayEquationTeX(value) {
  const source = value.trim();
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

  return `\\[\\begin{aligned}${rows.join("\\\\")}\\end{aligned}\\]`;
}

function workedExampleMarkup(value) {
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

function geometryModelShell(model, illustration) {
  return `
    <figure class="unit-model unit-model-geometry">
      <figcaption>
        <strong>${escapeHtml(model.title)}</strong>
        <span>${formatTextWithMath(model.description)}</span>
      </figcaption>
      ${illustration}
      ${model.formula ? `<div class="inline-model-formula">${workedExampleMarkup(model.formula)}</div>` : ""}
    </figure>
  `;
}

function circleAngleModelMarkup(model) {
  return geometryModelShell(
    model,
    `
      <svg class="geometry-figure circle-angle-figure" viewBox="0 0 520 320" role="img" aria-label="同じ弧 AC を見込む二つの円周角を示す円">
        <circle class="geometry-circle" cx="260" cy="160" r="112"></circle>
        <path class="geometry-arc" d="M 192 72 A 112 112 0 0 1 328 72"></path>
        <path class="geometry-chord first" d="M 192 72 L 124 222 L 328 72"></path>
        <path class="geometry-chord second" d="M 192 72 L 396 222 L 328 72"></path>
        <path class="geometry-angle first" d="M 147 206 A 30 30 0 0 1 169 185"></path>
        <path class="geometry-angle second" d="M 373 185 A 30 30 0 0 1 395 206"></path>
        <circle class="geometry-point" cx="192" cy="72" r="6"></circle>
        <circle class="geometry-point" cx="328" cy="72" r="6"></circle>
        <circle class="geometry-point" cx="124" cy="222" r="6"></circle>
        <circle class="geometry-point" cx="396" cy="222" r="6"></circle>
        <text x="181" y="58">A</text><text x="334" y="58">C</text>
        <text x="105" y="244">B</text><text x="401" y="244">D</text>
        <text class="geometry-angle-label" x="146" y="176">同じ角</text>
        <text class="geometry-angle-label" x="325" y="176">同じ角</text>
        <text class="geometry-arc-label" x="234" y="42">同じ弧 AC</text>
      </svg>
    `,
  );
}

function rightTriangleModelMarkup(model) {
  return geometryModelShell(
    model,
    `
      <svg class="geometry-figure right-triangle-figure" viewBox="0 0 520 300" role="img" aria-label="辺の長さが 3、4、5 の直角三角形">
        <path class="geometry-triangle" d="M 90 238 L 390 238 L 390 78 Z"></path>
        <path class="geometry-right-angle" d="M 356 238 L 356 204 L 390 204"></path>
        <text x="232" y="270">底辺 4</text>
        <text x="406" y="165">高さ 3</text>
        <text x="205" y="142">斜辺 5</text>
      </svg>
    `,
  );
}


function lineGraphModelMarkup(model) {
  const a = Number(model.a);
  const b = Number(model.b);
  const xMin = -5;
  const xMax = 5;
  const yMin = -4;
  const yMax = 4;
  const unit = 40;
  const ox = 240;
  const oy = 200;
  const mapX = (x) => ox + x * unit;
  const mapY = (y) => oy - y * unit;

  // 直線 y=ax+b を表示範囲の長方形で切り取り、両端を求める。
  const candidates = [
    { x: xMin, y: a * xMin + b },
    { x: xMax, y: a * xMax + b },
  ];
  if (a !== 0) {
    candidates.push({ x: (yMin - b) / a, y: yMin });
    candidates.push({ x: (yMax - b) / a, y: yMax });
  }
  const eps = 1e-9;
  const inside = candidates.filter(
    (p) => p.x >= xMin - eps && p.x <= xMax + eps && p.y >= yMin - eps && p.y <= yMax + eps,
  );
  inside.sort((p, q) => p.x - q.x || p.y - q.y);
  const start = inside[0];
  const end = inside[inside.length - 1];

  const gridLines = [];
  for (let x = xMin; x <= xMax; x += 1) {
    gridLines.push(`<line class="graph-grid" x1="${mapX(x)}" y1="${mapY(yMin)}" x2="${mapX(x)}" y2="${mapY(yMax)}"></line>`);
  }
  for (let y = yMin; y <= yMax; y += 1) {
    gridLines.push(`<line class="graph-grid" x1="${mapX(xMin)}" y1="${mapY(y)}" x2="${mapX(xMax)}" y2="${mapY(y)}"></line>`);
  }

  const tickLabels = [];
  for (let x = xMin; x <= xMax; x += 1) {
    if (x === 0) continue;
    tickLabels.push(`<text class="graph-tick" x="${mapX(x)}" y="${mapY(0) + 18}" text-anchor="middle">${x}</text>`);
  }
  for (let y = yMin; y <= yMax; y += 1) {
    if (y === 0) continue;
    tickLabels.push(`<text class="graph-tick" x="${mapX(0) - 10}" y="${mapY(y) + 5}" text-anchor="end">${y}</text>`);
  }

  // 傾きの三角形：x が1増えると y が a 増えることを見せる（表示に収まるときだけ）。
  let slopeTriangle = "";
  if (Math.abs(b) <= yMax && Math.abs(a + b) <= yMax + eps) {
    slopeTriangle = `
      <path class="graph-slope-run" d="M ${mapX(0)} ${mapY(b)} L ${mapX(1)} ${mapY(b)}"></path>
      <path class="graph-slope-rise" d="M ${mapX(1)} ${mapY(b)} L ${mapX(1)} ${mapY(a + b)}"></path>
      <text class="graph-slope-label" x="${mapX(0.5)}" y="${mapY(b) + (b <= a + b ? 20 : -10)}" text-anchor="middle">右へ1</text>
      <text class="graph-slope-label" x="${mapX(1) + 8}" y="${mapY((b + (a + b)) / 2) + 5}" text-anchor="start">上へ ${a}</text>
    `;
  }

  const interceptLabel = b === 0 ? "b=0 → 原点を通る" : `切片 b=${b}`;

  return geometryModelShell(
    model,
    `
      <svg class="geometry-figure line-graph-figure" viewBox="0 0 480 400" role="img" aria-label="${escapeHtml(`直線 y=${a}x${b === 0 ? "" : b > 0 ? "+" + b : b} のグラフ`)}">
        ${gridLines.join("")}
        <line class="graph-axis" x1="${mapX(xMin)}" y1="${mapY(0)}" x2="${mapX(xMax)}" y2="${mapY(0)}"></line>
        <line class="graph-axis" x1="${mapX(0)}" y1="${mapY(yMin)}" x2="${mapX(0)}" y2="${mapY(yMax)}"></line>
        <text class="graph-axis-label" x="${mapX(xMax) + 4}" y="${mapY(0) - 8}" text-anchor="end">x</text>
        <text class="graph-axis-label" x="${mapX(0) + 12}" y="${mapY(yMax) + 4}" text-anchor="start">y</text>
        ${tickLabels.join("")}
        <line class="graph-line" x1="${mapX(start.x)}" y1="${mapY(start.y)}" x2="${mapX(end.x)}" y2="${mapY(end.y)}"></line>
        ${slopeTriangle}
        <circle class="graph-intercept" cx="${mapX(0)}" cy="${mapY(b)}" r="6"></circle>
        <text class="graph-intercept-label" x="${mapX(0) + 12}" y="${mapY(b) - 12}" text-anchor="start">${escapeHtml(interceptLabel)}</text>
      </svg>
    `,
  );
}

function unitModelMarkup(unit) {
  const model = unit.model;
  if (!model) return "";
  if (model.type === "circle-angle") return circleAngleModelMarkup(model);
  if (model.type === "right-triangle") return rightTriangleModelMarkup(model);
  if (model.type === "line-graph") return lineGraphModelMarkup(model);
  if (model.type !== "area") return "";

  const height = Number(model.height);
  const firstWidth = Number(model.firstWidth);
  const secondWidth = Number(model.secondWidth);
  const firstArea = height * firstWidth;
  const secondArea = height * secondWidth;
  const ariaLabel = `たて ${height}、横 ${firstWidth} と ${secondWidth} に分けた長方形`;

  return `
    <figure class="unit-model unit-model-area">
      <figcaption>
        <strong>${escapeHtml(model.title)}</strong>
        <span>${formatTextWithMath(model.description)}</span>
      </figcaption>
      <div class="inline-area-diagram" role="img" aria-label="${escapeHtml(ariaLabel)}">
        <span class="inline-area-height">たて ${height}</span>
        <div class="inline-area-row" style="grid-template-columns: ${firstWidth}fr ${secondWidth}fr;">
          <div class="inline-area-part first">
            <span>横 ${firstWidth}</span>
            <strong>${formatTextWithMath(`\\(${height}\\times${firstWidth}=${firstArea}\\)`)}</strong>
          </div>
          <div class="inline-area-part second">
            <span>横 ${secondWidth}</span>
            <strong>${formatTextWithMath(`\\(${height}\\times${secondWidth}=${secondArea}\\)`)}</strong>
          </div>
        </div>
      </div>
      <div class="inline-model-formula">${workedExampleMarkup(model.formula)}</div>
    </figure>
  `;
}

function confirmationMarkup(unit) {
  const lab = labCatalog[unit.labIds?.[0]];
  const example = unit.checkExample || lab?.starterExample;
  const title = lab ? "動かして確認" : "確かめよう";

  return `
    <div class="mini-check prose">
      <h4>${title}</h4>
      <p>${formatTextWithMath(unit.check)}</p>
      ${example ? `<p class="check-example"><strong>まずはこの例：</strong>${formatTextWithMath(example)}</p>` : ""}
      ${
        lab
          ? `<button class="learning-action primary" type="button" data-open-lab="${escapeHtml(lab.id)}">図解「${escapeHtml(lab.short)}」を開いて試す</button>`
          : ""
      }
    </div>
  `;
}

function unitMetaLabel(unit) {
  const range = [...new Set(unit.range)].join("・");
  return unit.stage === range ? range : `${unit.stage} / ${range}`;
}

function visibleUnits() {
  if (!activeLessonRange) return units;
  if (activeLessonRange === "中学") {
    return units.filter((unit) => unit.range.some((range) => /^中[123]$/.test(range) || range === "中学総合"));
  }
  return units.filter((unit) => unit.range.includes(activeLessonRange));
}

function updateLessonFilterStatus() {
  const status = $("#lesson-filter-status");
  if (!status) return;
  status.hidden = !activeLessonRange;
  $("#lesson-filter-label").textContent = activeLessonRange ? `${activeLessonRange} に関係する単元を表示中` : "";
}

function learningActionsMarkup(unit) {
  const lab = labCatalog[unit.recommendedLabId];
  const practice = practiceCatalog.find((item) => item.id === unit.recommendedPracticeId);
  const nextUnit = units.find((item) => item.id === unit.recommendedNextLessonId);
  const showRecommendedLab = lab && lab.id !== unit.labIds?.[0];
  const actions = [
    showRecommendedLab
      ? `<button class="learning-action primary" type="button" data-open-lab="${escapeHtml(lab.id)}">図解：${escapeHtml(lab.short)}を動かす</button>`
      : "",
    practice
      ? `<button class="learning-action" type="button" data-open-practice="${escapeHtml(practice.id)}">問題：${escapeHtml(practice.label)}を1問</button>`
      : "",
    nextUnit
      ? `<button class="learning-action" type="button" data-open-lesson="${escapeHtml(nextUnit.id)}">次の単元：${escapeHtml(nextUnit.title)}</button>`
      : "",
  ].filter(Boolean);

  if (!actions.length) return "";

  return `
    <section class="learning-actions" aria-label="この単元の次の一手">
      <h4>次はここから</h4>
      <p>${showRecommendedLab ? `${escapeHtml(lab.objectIntro)}。` : "一問ずつ、次の教材へ進みましょう。"}</p>
      <div class="learning-action-list">
        ${actions.join("")}
      </div>
    </section>
  `;
}

function contextCardsMarkup(unit) {
  const context = unit.context;
  if (!context) return "";

  const why = context.why
    ? `
      <details class="context-card">
        <summary>なぜこの約束？</summary>
        <p><strong>${formatTextWithMath(context.why.question)}</strong></p>
        <p>${formatTextWithMath(context.why.answer)}</p>
        <p><strong>小さく確かめる：</strong>${formatTextWithMath(context.why.tryIt)}</p>
      </details>
    `
    : "";
  const definitions = context.definitions?.length
    ? `
      <details class="context-card">
        <summary>言葉をほどく</summary>
        <dl class="definition-list">
          ${context.definitions
            .map(
              (definition) => `
                <div>
                  <dt>${formatTextWithMath(definition.term)}</dt>
                  <dd>${formatTextWithMath(definition.meaning)}</dd>
                  <dd><strong>使う例：</strong>${formatTextWithMath(definition.example)}</dd>
                  <dd><strong>境目：</strong>${formatTextWithMath(definition.boundary)}</dd>
                </div>
              `,
            )
            .join("")}
        </dl>
      </details>
    `
    : "";
  const connections = context.connections?.length
    ? `
      <details class="context-card">
        <summary>どこで役立つ？</summary>
        <div class="connection-list">
          ${context.connections
            .map((connection) => {
              const action = connection.labId
                ? `<button class="learning-action" type="button" data-open-lab="${escapeHtml(connection.labId)}">図解を見る</button>`
                : connection.storyId
                  ? `<button class="learning-action" type="button" data-open-story="${escapeHtml(connection.storyId)}">読み物を開く</button>`
                  : "";
              return `
                <div class="connection-item">
                  <div>
                    <strong>${formatTextWithMath(connection.title)}</strong>
                    <p>${formatTextWithMath(connection.summary)}</p>
                  </div>
                  ${action}
                </div>
              `;
            })
            .join("")}
          ${context.storyIds?.length ? `<div class="learning-action-list">${context.storyIds
            .map((storyId) => {
              const story = storyCatalog[storyId];
              return story
                ? `<button class="learning-action" type="button" data-open-story="${escapeHtml(story.id)}">読み物：${formatTextWithMath(story.title)}</button>`
                : "";
            })
            .join("")}</div>` : ""}
        </div>
      </details>
    `
    : "";
  return why || definitions || connections ? `<div class="context-cards">${why}${definitions}${connections}</div>` : "";
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function fractionText(numerator, denominator) {
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

function parseFraction(input) {
  const text = normalizeText(input);
  if (/^-?\d+\/-?\d+$/.test(text)) {
    const [n, d] = text.split("/").map(Number);
    if (d === 0) return null;
    return n / d;
  }
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return null;
}

function sameRational(input, numerator, denominator) {
  const value = parseFraction(input);
  if (value === null) return false;
  return Math.abs(value - numerator / denominator) < 1e-9;
}

function factorial(n) {
  return Array.from({ length: n }, (_, index) => index + 1).reduce((acc, value) => acc * value, 1);
}

function permutation(n, r) {
  let total = 1;
  for (let value = n; value > n - r; value -= 1) total *= value;
  return total;
}

function combination(n, r) {
  return permutation(n, r) / factorial(r);
}

function normalizeText(value) {
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

function parseLinearExpression(input) {
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

function sameLinearExpression(input, xCoef, constant) {
  const parsed = parseLinearExpression(input);
  return parsed && parsed.xCoef === xCoef && parsed.constant === constant;
}

function parseEquation(input) {
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

function sameEquation(input, xCoef, constant) {
  const parsed = parseEquation(input);
  return parsed && parsed.xCoef === xCoef && parsed.constant === constant;
}

function largestSquareFactor(n) {
  for (let root = Math.floor(Math.sqrt(n)); root >= 1; root -= 1) {
    const square = root * root;
    if (n % square === 0) {
      return { root, square, rest: n / square };
    }
  }
  return { root: 1, square: 1, rest: n };
}

function radicalText(coef, radicand) {
  if (radicand === 1) return `${coef}`;
  if (coef === 1) return `√${radicand}`;
  if (coef === -1) return `-√${radicand}`;
  return `${coef}√${radicand}`;
}

function radicalTeX(coef, radicand) {
  if (radicand === 1) return String(coef);
  if (coef === 1) return `\\sqrt{${radicand}}`;
  if (coef === -1) return `-\\sqrt{${radicand}}`;
  return `${coef}\\sqrt{${radicand}}`;
}

function sameRadical(input, coef, radicand) {
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

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choose(values) {
  return values[randomInt(0, values.length - 1)];
}

function setHashForUnit(index) {
  const unit = units[index];
  if (!unit) return;
  history.replaceState(null, "", routeHash("lessons", unit.id));
}

function renderUnitButtons() {
  const wrap = $("#unit-buttons");
  wrap.innerHTML = "";
  visibleUnits().forEach((unit) => {
    const index = units.findIndex((item) => item.id === unit.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `unit-button${index === activeUnit ? " active" : ""}`;
    button.innerHTML = `<strong>${index + 1}. ${formatTextWithMath(unit.title)}</strong><span>${formatTextWithMath(unitMetaLabel(unit))}</span>`;
    button.addEventListener("click", () => {
      activeUnit = index;
      renderUnit();
      setHashForUnit(index);
      $("#lessons").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    wrap.append(button);
  });
}

function renderDots() {
  const wrap = $("#unit-dots");
  wrap.innerHTML = "";
  visibleUnits().forEach((unit, visibleIndex) => {
    const index = units.findIndex((item) => item.id === unit.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dot-button${index === activeUnit ? " active" : ""}`;
    button.textContent = String(visibleIndex + 1);
    button.setAttribute("aria-label", `${visibleIndex + 1}ページへ`);
    button.addEventListener("click", () => {
      activeUnit = index;
      renderUnit();
      setHashForUnit(index);
    });
    wrap.append(button);
  });
}

function renderUnit() {
  const availableUnits = visibleUnits();
  if (!availableUnits.some((unit) => unit.id === units[activeUnit]?.id)) {
    activeUnit = units.findIndex((unit) => unit.id === availableUnits[0]?.id);
  }
  const unit = units[activeUnit];
  const visibleIndex = availableUnits.findIndex((item) => item.id === unit.id);
  $("#unit-progress-label").textContent = `${visibleIndex + 1} / ${availableUnits.length}`;
  $("#unit-progress-bar").style.width = `${((visibleIndex + 1) / availableUnits.length) * 100}%`;
  $("#unit-content").innerHTML = `
    <span class="unit-stage">${escapeHtml(unit.stage)}</span>
    ${rangeTags(unit)}
    <h3>${formatTextWithMath(unit.title)}</h3>
    <p class="unit-summary">${formatTextWithMath(unit.summary)}</p>
    ${unitModelMarkup(unit)}
    <div class="unit-content-grid">
      <div class="note-box prose">
        <h4>おさらいポイント</h4>
        <ul>${unit.points.map((point) => `<li>${formatTextWithMath(point)}</li>`).join("")}</ul>
      </div>
      <div class="example-box">
        <h4>例</h4>
        ${workedExampleMarkup(unit.example)}
      </div>
      ${confirmationMarkup(unit)}
      ${contextCardsMarkup(unit)}
      ${learningActionsMarkup(unit)}
    </div>
  `;

  $("#prev-unit").disabled = visibleIndex === 0;
  $("#next-unit").disabled = visibleIndex === availableUnits.length - 1;
  updateLessonFilterStatus();
  renderUnitButtons();
  renderDots();
  scheduleMathTypeset($("#unit-content"));
  scheduleMathTypeset($("#unit-buttons"));
}

function setupLessons() {
  const route = readRoute();
  const routeIndex = units.findIndex((unit) => unit.id === route.id);
  if (route.page === "lessons" && routeIndex >= 0) activeUnit = routeIndex;

  $("#prev-unit").addEventListener("click", () => {
    const availableUnits = visibleUnits();
    const index = availableUnits.findIndex((unit) => unit.id === units[activeUnit].id);
    activeUnit = units.findIndex((unit) => unit.id === availableUnits[Math.max(0, index - 1)].id);
    renderUnit();
    setHashForUnit(activeUnit);
  });
  $("#next-unit").addEventListener("click", () => {
    const availableUnits = visibleUnits();
    const index = availableUnits.findIndex((unit) => unit.id === units[activeUnit].id);
    activeUnit = units.findIndex((unit) => unit.id === availableUnits[Math.min(availableUnits.length - 1, index + 1)].id);
    renderUnit();
    setHashForUnit(activeUnit);
  });
  $("#clear-lesson-filter").addEventListener("click", () => {
    activeLessonRange = null;
    renderUnit();
    history.replaceState(null, "", routeHash("lessons", units[activeUnit].id));
  });

  renderUnit();
}

function setupNumberLine() {
  ["#int-a", "#int-b", "#int-op"].forEach((selector) => {
    $(selector).addEventListener("input", drawNumberLine);
  });
  drawNumberLine();
}

function setupInequalityLab() {
  ["#ineq-a", "#ineq-b", "#ineq-factor"].forEach((selector) => {
    $(selector).addEventListener("input", renderInequalityLab);
  });
  renderInequalityLab();
}

function renderInequalityLab() {
  const a = Number($("#ineq-a").value);
  const b = Number($("#ineq-b").value);
  const factor = Number($("#ineq-factor").value);
  const left = a * factor;
  const right = b * factor;
  const sign = factor < 0 ? ">" : "<";
  const position = (value) => ((value + 20) / 40) * 100;

  $("#inequality-formula").textContent = `\\(${a}<${b}\\quad\\xrightarrow{\\times(${factor})}\\quad${left}${sign}${right}\\)`;
  $("#inequality-left-point").style.left = `${position(left)}%`;
  $("#inequality-right-point").style.left = `${position(right)}%`;
  $("#inequality-left-point").textContent = String(left);
  $("#inequality-right-point").textContent = String(right);
  $("#inequality-note").textContent =
    factor < 0
      ? `\\(${left}\\) は \\(${right}\\) より右にあるので、不等号の向きは反対になります。`
      : `\\(${left}\\) は \\(${right}\\) より左にあるので、不等号の向きはそのままです。`;
  $("#inequality-result").textContent =
    factor < 0
      ? `負の数 \\(${factor}\\) をかけたので、\\(${a}<${b}\\) は \\(${left}>${right}\\) になります。`
      : `正の数 \\(${factor}\\) をかけたので、\\(${a}<${b}\\) は \\(${left}<${right}\\) のままです。`;
  scheduleMathTypeset($("#inequality-stage"));
  scheduleMathTypeset($("#inequality-result"));
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const head = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawNumberLine() {
  const canvas = $("#number-line");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const a = Number($("#int-a").value);
  const b = Number($("#int-b").value);
  const op = $("#int-op").value;
  const move = op === "+" ? b : -b;
  const result = a + move;
  const min = -16;
  const max = 16;
  const y = height * 0.64;
  const map = (value) => 48 + ((value - min) / (max - min)) * (width - 96);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#22313a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(map(min), y);
  ctx.lineTo(map(max), y);
  ctx.stroke();

  ctx.font = '700 26px "Noto Sans JP", "Hiragino Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let value = min; value <= max; value += 2) {
    const x = map(value);
    ctx.strokeStyle = value === 0 ? "#2f6f73" : "#9b8f82";
    ctx.lineWidth = value === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y + 12);
    ctx.stroke();
    ctx.fillStyle = value === 0 ? "#2f6f73" : "#6b7280";
    ctx.fillText(String(value), x, y + 18);
  }

  drawArrow(ctx, map(0), y - 70, map(a), y - 70, "#407bff");
  drawArrow(ctx, map(a), y - 118, map(result), y - 118, "#f2994a");

  ctx.font = '700 30px "Noto Sans JP", "Hiragino Sans", sans-serif';
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#407bff";
  ctx.fillText(`a = ${a}`, (map(0) + map(a)) / 2, y - 78);
  ctx.fillStyle = "#b75f00";
  ctx.fillText(op === "+" ? `b = ${b}` : `-b = ${move}`, (map(a) + map(result)) / 2, y - 126);

  ctx.fillStyle = "#1f2933";
  ctx.beginPath();
  ctx.arc(map(result), y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '700 28px "Noto Sans JP", "Hiragino Sans", sans-serif';
  ctx.fillText(`結果 ${result}`, map(result), y - 18);

  $("#number-line-result").textContent =
    op === "+"
      ? `\\(${sumExpression(a, b)}=${result}\\)。右向きはプラス、左向きはマイナスです。`
      : `\\(${a}-${factorText(b)}=${sumExpression(a, -b)}=${result}\\)。引き算は「反対向きに足す」と見られます。`;
  scheduleMathTypeset($("#number-line-result"));
}

function setupDistribution() {
  ["#dist-a", "#dist-b", "#dist-c"].forEach((selector) => {
    $(selector).addEventListener("input", renderDistribution);
  });
  renderDistribution();
}

function renderDistribution() {
  const a = Number($("#dist-a").value);
  const b = Number($("#dist-b").value);
  const c = Number($("#dist-c").value);
  const model = $("#area-model");
  model.innerHTML = `
    <div class="area-row" style="grid-template-columns: ${b}fr ${c}fr; min-height: ${110 + a * 8}px">
      <div class="area-part">\\(${a}\\times${b}\\)<br>\\(${a * b}\\)</div>
      <div class="area-part">\\(${a}\\times${c}\\)<br>\\(${a * c}\\)</div>
    </div>
  `;
  $("#distribution-result").textContent = `\\(${a}(${b}+${c})=${a}\\times${b}+${a}\\times${c}=${a * (b + c)}\\)。分けても全体は同じです。`;
  scheduleMathTypeset($("#area-model"));
  scheduleMathTypeset($("#distribution-result"));
}

function setupRadicals() {
  $("#radical-n").addEventListener("input", renderRadical);
  renderRadical();
}

function renderRadical() {
  const n = Number($("#radical-n").value);
  const factor = largestSquareFactor(n);
  const simplified = radicalText(factor.root, factor.rest);
  const simplifiedTeX = radicalTeX(factor.root, factor.rest);
  $("#radical-expression").textContent = `\\(\\sqrt{${n}}=${simplifiedTeX}\\)`;
  $("#radical-result").textContent =
    factor.square === 1
      ? `${n} の中には 1 以外の平方数因子がありません。これ以上は整数を外へ出せません。`
      : `\\(${n}=${factor.square}\\times${factor.rest}\\) なので、\\(\\sqrt{${factor.square}}=${factor.root}\\) を外へ出して \\(${simplifiedTeX}\\)。`;

  const tiles = $("#radical-tiles");
  const size = Math.min(factor.root, 12);
  const cells = Array.from({ length: size * size }, () => `<span class="square-cell"></span>`).join("");
  tiles.innerHTML = `
    <div>
      <div class="square-grid" style="grid-template-columns: repeat(${size}, 8px);">${cells}</div>
      <p class="lab-result" style="margin-top: .7rem;">平方数 \\(${factor.square}\\) ${factor.rest > 1 ? `が \\(${factor.rest}\\) 組` : ""}</p>
    </div>
  `;
  scheduleMathTypeset($("#radical-expression"));
  scheduleMathTypeset($("#radical-result"));
  scheduleMathTypeset($("#radical-tiles"));
}

function setupTerms() {
  ["#term-p", "#term-q", "#term-r", "#term-s"].forEach((selector) => {
    $(selector).addEventListener("input", renderTerms);
  });
  renderTerms();
}

function chip(value, label, extraClass = "") {
  const negative = value < 0 ? " negative" : "";
  return `<span class="term-chip ${extraClass}${negative}">${label}</span>`;
}

function renderTermChips(count, label, kind = "") {
  if (count === 0) return `<span class="term-chip muted">なし</span>`;
  return Array.from({ length: Math.min(count, 9) }, () => `<span class="term-chip ${kind}">${label}</span>`).join("");
}

function cardExpression(posX, negX, posOne, negOne) {
  const parts = [];
  if (posX) parts.push(term(posX));
  if (negX) parts.push(`- ${negX === 1 ? "x" : `${negX}x`}`);
  if (posOne) parts.push(parts.length ? `+ ${posOne}` : `${posOne}`);
  if (negOne) parts.push(`- ${negOne}`);
  return parts.join(" ") || "0";
}

function renderTerms() {
  const posX = Number($("#term-p").value);
  const negX = Number($("#term-q").value);
  const posOne = Number($("#term-r").value);
  const negOne = Number($("#term-s").value);
  const xSum = posX - negX;
  const cSum = posOne - negOne;
  const original = cardExpression(posX, negX, posOne, negOne);
  $("#term-p-count").textContent = `${posX}枚`;
  $("#term-q-count").textContent = `${negX}枚`;
  $("#term-r-count").textContent = `${posOne}枚`;
  $("#term-s-count").textContent = `${negOne}枚`;
  $("#term-board").innerHTML = `
    <div class="term-lane">
      <h4>xカードの箱</h4>
      <p>同じ \\(x\\) のカードだけを数えます。</p>
      <div class="term-chips">${renderTermChips(posX, "+x", "positive-x")}${renderTermChips(negX, "-x", "negative-x")}</div>
      <div class="term-explain">\\(+x\\) と \\(-x\\) は1組で \\(0\\)。残りは \\(${term(xSum)}\\)</div>
    </div>
    <div class="term-lane">
      <h4>1カードの箱</h4>
      <p>数字だけのカードは、\\(x\\) カードとは別に数えます。</p>
      <div class="term-chips">${renderTermChips(posOne, "+1", "constant")}${renderTermChips(negOne, "-1", "constant negative-one")}</div>
      <div class="term-explain">\\(+1\\) と \\(-1\\) は1組で \\(0\\)。残りは \\(${cSum}\\)</div>
    </div>
  `;
  $("#term-result").textContent = `\\(${original}=${linearText(xSum, cSum)}\\)`;
  scheduleMathTypeset($("#term-board"));
  scheduleMathTypeset($("#term-result"));
}

function renderUnitBlocks(count, options = {}) {
  const { markFirst = 0, maxVisible = 18 } = options;
  const visible = Math.min(count, maxVisible);
  const blocks = Array.from({ length: visible }, (_, index) => {
    const className = index < markFirst ? "unit-block take-away" : "unit-block";
    return `<span class="${className}">1</span>`;
  }).join("");
  const more = count > visible ? `<span class="more-blocks">+${count - visible}</span>` : "";
  if (count === 0) return `<span class="more-blocks">0こ</span>`;
  return blocks + more;
}

function renderXBags(count) {
  return Array.from({ length: count }, (_, index) => `<span class="x-bag" aria-label="x袋 ${index + 1}">x袋</span>`).join("");
}

function setupEquation() {
  ["#eq-a", "#eq-x", "#eq-b"].forEach((selector) => {
    $(selector).addEventListener("input", renderEquation);
  });
  renderEquation();
}

function renderEquation() {
  const a = Number($("#eq-a").value);
  const x = Number($("#eq-x").value);
  const b = Number($("#eq-b").value);
  const c = a * x + b;
  const equation = `${term(a)}+${b}=${c}`;
  const rightAfterRemove = c - b;
  $("#balance-stage").innerHTML = `
    <div class="equation-model">
      <div class="equation-side">
        <h4>左：x袋が ${a}こ、1ブロックが ${b}こ</h4>
        <div class="object-row">${renderXBags(a)}${renderUnitBlocks(b, { markFirst: b })}</div>
      </div>
      <div class="equation-equals">=</div>
      <div class="equation-side">
        <h4>右：1ブロックが ${c}こ</h4>
        <div class="object-row">${renderUnitBlocks(c, { markFirst: b })}</div>
      </div>
    </div>
    <div class="equation-step-cards">
      <div class="equation-step-card">
        <strong>1</strong>
        <div>
          <p>左右から同じ \\(${b}\\) この1ブロックを取りのぞきます。</p>
          <div class="equation-formula">\\(${equation}\\Rightarrow ${term(a)}=${rightAfterRemove}\\)</div>
        </div>
      </div>
      <div class="equation-step-card">
        <strong>2</strong>
        <div>
          <p>残った \\(${rightAfterRemove}\\) このブロックを、\\(${a}\\) このx袋に同じ数ずつ分けます。</p>
          <div class="equation-formula">\\(${rightAfterRemove}\\div ${a}=${x}\\)</div>
        </div>
      </div>
      <div class="equation-step-card">
        <strong>3</strong>
        <div>
          <p>x袋1こには \\(${x}\\) こ入っています。</p>
          <div class="equation-formula">\\(x=${x}\\)</div>
        </div>
      </div>
    </div>
  `;
  $("#equation-result").textContent = `ブロックで見ると、\\(${b}\\) この余分な1ブロックを左右から同じように取るだけです。式では \\(${equation}\\Rightarrow ${term(a)}=${rightAfterRemove}\\Rightarrow x=${x}\\)。`;
  scheduleMathTypeset($("#balance-stage"));
  scheduleMathTypeset($("#equation-result"));
}

const GRAPH_MIN = -10;
const GRAPH_MAX = 10;

function setupGraph() {
  ["#graph-type", "#graph-x", "#graph-a", "#graph-b", "#graph-c"].forEach((selector) => {
    $(selector).addEventListener("input", drawGraph);
  });

  const canvas = $("#function-graph");
  const xSlider = $("#graph-x");
  // グラフ上をドラッグしても入力 x を動かせるようにする。
  const pointerToX = (event) => {
    const rect = canvas.getBoundingClientRect();
    const canvasPx = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const raw = GRAPH_MIN + (canvasPx / canvas.width) * (GRAPH_MAX - GRAPH_MIN);
    return Math.max(GRAPH_MIN, Math.min(GRAPH_MAX, Math.round(raw)));
  };
  let dragging = false;
  const applyPointer = (event) => {
    xSlider.value = String(pointerToX(event));
    drawGraph();
  };
  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    canvas.setPointerCapture(event.pointerId);
    applyPointer(event);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (dragging) applyPointer(event);
  });
  const stopDrag = () => {
    dragging = false;
  };
  canvas.addEventListener("pointerup", stopDrag);
  canvas.addEventListener("pointercancel", stopDrag);

  drawGraph();
}

// 負の数はかっこで囲み、代入の式が読み違えられないようにする。
function bracketNegative(value) {
  return value < 0 ? `(${value})` : String(value);
}

function drawGraph() {
  const canvas = $("#function-graph");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const type = $("#graph-type").value;
  const a = Number($("#graph-a").value);
  const b = Number($("#graph-b").value);
  const c = Number($("#graph-c").value);
  const inputX = Number($("#graph-x").value);
  const min = GRAPH_MIN;
  const max = GRAPH_MAX;
  const mapX = (x) => ((x - min) / (max - min)) * width;
  const mapY = (y) => height - ((y - min) / (max - min)) * height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#e4d9c8";
  ctx.lineWidth = 1;
  for (let i = min; i <= max; i += 1) {
    ctx.beginPath();
    ctx.moveTo(mapX(i), 0);
    ctx.lineTo(mapX(i), height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, mapY(i));
    ctx.lineTo(width, mapY(i));
    ctx.stroke();
  }

  ctx.strokeStyle = "#1f2933";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mapX(min), mapY(0));
  ctx.lineTo(mapX(max), mapY(0));
  ctx.moveTo(mapX(0), mapY(min));
  ctx.lineTo(mapX(0), mapY(max));
  ctx.stroke();

  const f = type === "linear" ? (x) => a * x + b : (x) => a * x * x + b * x + c;
  ctx.strokeStyle = "#2f6f73";
  ctx.lineWidth = 5;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= width; px += 3) {
    const x = min + (px / width) * (max - min);
    const y = f(x);
    const py = mapY(y);
    if (py < -height || py > height * 2) {
      started = false;
      continue;
    }
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  // 入力 x に対応する点 (x, f(x)) と、軸への案内線を描く。
  const outputY = f(inputX);
  const px = mapX(inputX);
  const py = mapY(outputY);
  const onScreen = outputY >= min && outputY <= max;

  // x 軸上の入力位置（オレンジ）はいつでも見せる。
  ctx.fillStyle = "#f2994a";
  ctx.beginPath();
  ctx.arc(px, mapY(0), 7, 0, Math.PI * 2);
  ctx.fill();

  if (onScreen) {
    ctx.save();
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = "#d9468a";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(px, mapY(0));
    ctx.lineTo(px, py);
    ctx.moveTo(px, py);
    ctx.lineTo(mapX(0), py);
    ctx.stroke();
    ctx.restore();

    // y 軸上の出力位置。
    ctx.fillStyle = "#407bff";
    ctx.beginPath();
    ctx.arc(mapX(0), py, 7, 0, Math.PI * 2);
    ctx.fill();

    // 対応する点 P=(x, y)。
    ctx.fillStyle = "#d9468a";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#184c50";
    ctx.font = "bold 22px 'Noto Sans JP', sans-serif";
    ctx.textAlign = px > width - 120 ? "right" : "left";
    ctx.fillText(`(${inputX}, ${outputY})`, px + (px > width - 120 ? -14 : 14), py - 14);
  }

  const substitution =
    type === "linear"
      ? `${a}\\times${bracketNegative(inputX)}${b === 0 ? "" : b > 0 ? `+${b}` : `-${Math.abs(b)}`}`
      : `${a}\\times${bracketNegative(inputX)}^2${b === 0 ? "" : b > 0 ? `+${b}\\times${bracketNegative(inputX)}` : `-${Math.abs(b)}\\times${bracketNegative(inputX)}`}${c === 0 ? "" : c > 0 ? `+${c}` : `-${Math.abs(c)}`}`;
  $("#graph-point").textContent = `入力 \\(x=${inputX}\\) を入れると、出力は \\(y=${substitution}=${outputY}\\)。対応する点は \\((${inputX},\\ ${outputY})\\) です。${onScreen ? "" : "（この点はグラフの表示範囲の外にあります）"}`;

  const graphExpression =
    type === "linear"
      ? compactPolynomial([
          { value: a, variable: "x" },
          { value: b },
        ])
      : compactPolynomial([
          { value: a, variable: "x^2" },
          { value: b, variable: "x" },
          { value: c },
        ]);
  $("#graph-result").textContent =
    type === "linear"
      ? `\\(y=${graphExpression}\\)。係数 \\(${a}\\) は傾き、\\(${b}\\) は \\(y\\) 軸との交点です。`
      : `\\(y=${graphExpression}\\)。\\(x^2\\) の係数で開き方と上下の向きが変わります。`;
  scheduleMathTypeset($("#graph-point"));
  scheduleMathTypeset($("#graph-result"));
}

function setupQuadraticVertex() {
  ["#quad-a", "#quad-h", "#quad-k"].forEach((selector) => {
    $(selector).addEventListener("input", drawQuadraticVertex);
  });
  drawQuadraticVertex();
}

function drawQuadraticVertex() {
  const canvas = $("#quadratic-vertex");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const rawA = Number($("#quad-a").value);
  const a = rawA === 0 ? 1 : rawA;
  const h = Number($("#quad-h").value);
  const k = Number($("#quad-k").value);
  const min = -10;
  const max = 10;
  const mapX = (x) => ((x - min) / (max - min)) * width;
  const mapY = (y) => height - ((y - min) / (max - min)) * height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#e4d9c8";
  ctx.lineWidth = 1;
  for (let value = min; value <= max; value += 1) {
    ctx.beginPath();
    ctx.moveTo(mapX(value), 0);
    ctx.lineTo(mapX(value), height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, mapY(value));
    ctx.lineTo(width, mapY(value));
    ctx.stroke();
  }

  ctx.strokeStyle = "#1f2933";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mapX(min), mapY(0));
  ctx.lineTo(mapX(max), mapY(0));
  ctx.moveTo(mapX(0), mapY(min));
  ctx.lineTo(mapX(0), mapY(max));
  ctx.stroke();

  ctx.strokeStyle = "#d9468a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= width; px += 3) {
    const x = min + (px / width) * (max - min);
    const y = a * (x - h) ** 2 + k;
    const py = mapY(y);
    if (py < -height || py > height * 2) {
      started = false;
      continue;
    }
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  ctx.fillStyle = "#1f2933";
  ctx.beginPath();
  ctx.arc(mapX(h), mapY(k), 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = '700 22px "Noto Sans JP", "Hiragino Sans", sans-serif';
  ctx.textAlign = "left";
  ctx.fillText(`頂点 (${h}, ${k})`, Math.min(mapX(h) + 14, width - 170), Math.max(mapY(k) - 14, 28));

  const kind = a > 0 ? "下に凸なので最小値" : "上に凸なので最大値";
  const zeroNote = rawA === 0 ? "（a=0 は二次関数ではないため、表示は a=1 として扱っています。）" : "";
  $("#quadratic-result").textContent = `\\(y=${vertexQuadraticExpression(a, h, k)}\\)。頂点は \\((${h},${k})\\)、${kind} は \\(${k}\\) です。${zeroNote}`;
  scheduleMathTypeset($("#quadratic-result"));
}

function setupTrigLab() {
  ["#trig-angle", "#trig-hyp", "#trig-focus"].forEach((selector) => {
    $(selector).addEventListener("input", drawTrigLab);
  });
  drawTrigLab();
}

function drawTrigLab() {
  const canvas = $("#trig-canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const degree = Number($("#trig-angle").value);
  const hyp = Number($("#trig-hyp").value);
  const focus = $("#trig-focus").value;
  const rad = (degree * Math.PI) / 180;
  const adjacent = hyp * Math.cos(rad);
  const opposite = hyp * Math.sin(rad);
  const scale = Math.min(62, (width - 230) / adjacent, (height - 90) / opposite);
  const ax = 110;
  const ay = height - 55;
  const bx = ax + adjacent * scale;
  const by = ay;
  const cx = bx;
  const cy = ay - opposite * scale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(47,111,115,0.12)";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = focus === "cos" || focus === "all" ? "#407bff" : "#b9c2cf";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.strokeStyle = focus === "sin" || focus === "all" ? "#d9468a" : "#b9c2cf";
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  ctx.strokeStyle = focus === "all" ? "#2f6f73" : "#b9c2cf";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  ctx.strokeStyle = "#1f2933";
  ctx.lineWidth = 3;
  ctx.strokeRect(bx - 24, by - 24, 24, 24);

  ctx.font = '700 22px "Noto Sans JP", "Hiragino Sans", sans-serif';
  ctx.fillStyle = "#1f2933";
  ctx.fillText(`θ = ${degree}°`, ax + 26, ay - 18);
  ctx.fillStyle = "#407bff";
  ctx.fillText(`隣辺 ≒ ${adjacent.toFixed(2)}`, (ax + bx) / 2 - 60, ay + 34);
  ctx.fillStyle = "#d9468a";
  ctx.fillText(`対辺 ≒ ${opposite.toFixed(2)}`, bx + 18, (by + cy) / 2);
  ctx.fillStyle = "#2f6f73";
  ctx.fillText(`斜辺 = ${hyp}`, (ax + cx) / 2 - 30, (ay + cy) / 2 - 14);

  $("#trig-result").textContent =
    `\\(\\sin${degree}^{\\circ}\\approx${(opposite / hyp).toFixed(3)}\\)、` +
    `\\(\\cos${degree}^{\\circ}\\approx${(adjacent / hyp).toFixed(3)}\\)、` +
    `\\(\\tan${degree}^{\\circ}\\approx${(opposite / adjacent).toFixed(3)}\\)。斜辺を変えても、角度が同じなら比は同じです。`;
  scheduleMathTypeset($("#trig-result"));
}

function setupProbabilityLab() {
  ["#prob-red", "#prob-blue", "#prob-mode"].forEach((selector) => {
    $(selector).addEventListener("input", renderProbabilityLab);
  });
  renderProbabilityLab();
}

function renderProbabilityLab() {
  const red = Number($("#prob-red").value);
  const blue = Number($("#prob-blue").value);
  const total = red + blue;
  const mode = $("#prob-mode").value;
  const secondRedNumerator = mode === "replace" ? red : red - 1;
  const secondTotal = mode === "replace" ? total : total - 1;
  const rrNumerator = red * secondRedNumerator;
  const rrDenominator = total * secondTotal;
  const rbNumerator = red * (mode === "replace" ? blue : blue);
  const rbDenominator = total * secondTotal;

  $("#probability-stage").innerHTML = `
    <div class="probability-tree">
      <div class="tree-node root">袋<br>R:${red} B:${blue}</div>
      <div class="tree-column">
        <div class="tree-branch red">1回目 R<br>\\(${fractionText(red, total)}\\)</div>
        <div class="tree-branch blue">1回目 B<br>\\(${fractionText(blue, total)}\\)</div>
      </div>
      <div class="tree-column">
        <div class="tree-branch red">R の後に R<br>\\(${fractionText(secondRedNumerator, secondTotal)}\\)</div>
        <div class="tree-branch blue">R の後に B<br>\\(${fractionText(mode === "replace" ? blue : blue, secondTotal)}\\)</div>
      </div>
    </div>
    <p class="tree-note">枝をたどるときは確率をかけます。</p>
  `;
  $("#probability-result").textContent =
    mode === "replace"
      ? `戻して2回なので、赤赤の確率は \\(${fractionText(red, total)}\\times${fractionText(red, total)}=${fractionText(rrNumerator, rrDenominator)}\\)。`
      : `戻さず2回なので、赤赤の確率は \\(${fractionText(red, total)}\\times${fractionText(red - 1, total - 1)}=${fractionText(rrNumerator, rrDenominator)}\\)。2回目の分母が変わります。`;
  scheduleMathTypeset($("#probability-stage"));
  scheduleMathTypeset($("#probability-result"));
}

function setupSetSortLab() {
  ["#set-a-rule", "#set-b-divisor", "#set-operation"].forEach((selector) => {
    $(selector).addEventListener("input", renderSetSortLab);
  });
  renderSetSortLab();
}

function renderSetSortLab() {
  const aRule = $("#set-a-rule").value;
  const divisor = Number($("#set-b-divisor").value);
  const operation = $("#set-operation").value;
  const aPredicates = {
    even: { label: "偶数", test: (value) => value % 2 === 0 },
    odd: { label: "奇数", test: (value) => value % 2 === 1 },
    "over-six": { label: "6より大きい数", test: (value) => value > 6 },
  };
  const a = aPredicates[aRule];
  const numbers = Array.from({ length: 12 }, (_, index) => index + 1);
  const operationLabels = {
    intersection: "共通部分",
    union: "和集合",
    "a-only": "Aだけに入る部分",
  };
  const isSelected = (inA, inB) =>
    operation === "intersection" ? inA && inB : operation === "union" ? inA || inB : inA && !inB;
  const selected = numbers.filter((value) => isSelected(a.test(value), value % divisor === 0));
  const cards = numbers
    .map((value) => {
      const inA = a.test(value);
      const inB = value % divisor === 0;
      const memberships = [inA ? "A" : "", inB ? "B" : ""].filter(Boolean).join("・") || "外";
      return `<span class="set-number-card${inA ? " in-a" : ""}${inB ? " in-b" : ""}${isSelected(inA, inB) ? " selected" : ""}"><strong>${value}</strong><small>${memberships}</small></span>`;
    })
    .join("");

  $("#set-sort-stage").innerHTML = `
    <div class="set-condition-row">
      <span><i class="set-dot a"></i>集合 A：${escapeHtml(a.label)}</span>
      <span><i class="set-dot b"></i>集合 B：${divisor}の倍数</span>
    </div>
    <div class="set-card-grid" role="img" aria-label="1から12までの数カードを集合Aと集合Bへ分けた図">${cards}</div>
    <p class="set-selection"><strong>${escapeHtml(operationLabels[operation])}</strong>：{ ${selected.join(", ") || "なし"} }</p>
  `;
  const symbol = operation === "intersection" ? "A\\cap B" : operation === "union" ? "A\\cup B" : "A\\cap B^c";
  $("#set-sort-result").textContent =
    operation === "intersection"
      ? `\\(${symbol}\\) は、A と B の両方の条件に合う数です。今は { ${selected.join(", ")} } です。`
      : operation === "union"
        ? `\\(${symbol}\\) は、A または B の少なくとも一方に入る数です。両方に入る数も含みます。`
        : `\\(${symbol}\\) は、A に入り B には入らない数です。補集合 \\(B^c\\) は「B の外」を表します。`;
  scheduleMathTypeset($("#set-sort-result"));
}

function circlePoint(degree, centerX = 260, centerY = 160, radius = 120) {
  const radian = (degree * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian),
  };
}

function setupGeometryPropertiesLab() {
  $("#circle-observer").addEventListener("input", renderGeometryPropertiesLab);
  renderGeometryPropertiesLab();
}

function renderGeometryPropertiesLab() {
  const observerDegree = Number($("#circle-observer").value);
  const pointA = circlePoint(-150);
  const pointC = circlePoint(-30);
  const pointB = circlePoint(observerDegree);
  const pointD = circlePoint(170);
  const coordinate = (point) => `${point.x.toFixed(1)} ${point.y.toFixed(1)}`;

  $("#circle-angle-stage").innerHTML = `
    <svg class="circle-angle-lab-svg" viewBox="0 0 520 320" role="img" aria-label="同じ弧ACを点Bと点Dから見る二つの円周角">
      <circle class="circle-angle-ring" cx="260" cy="160" r="120"></circle>
      <path class="circle-angle-arc" d="M ${coordinate(pointA)} A 120 120 0 0 1 ${coordinate(pointC)}"></path>
      <path class="circle-angle-ray first" d="M ${coordinate(pointB)} L ${coordinate(pointA)} M ${coordinate(pointB)} L ${coordinate(pointC)}"></path>
      <path class="circle-angle-ray second" d="M ${coordinate(pointD)} L ${coordinate(pointA)} M ${coordinate(pointD)} L ${coordinate(pointC)}"></path>
      <circle class="circle-angle-point" cx="${pointA.x}" cy="${pointA.y}" r="6"></circle>
      <circle class="circle-angle-point" cx="${pointC.x}" cy="${pointC.y}" r="6"></circle>
      <circle class="circle-angle-point observer" cx="${pointB.x}" cy="${pointB.y}" r="8"></circle>
      <circle class="circle-angle-point" cx="${pointD.x}" cy="${pointD.y}" r="6"></circle>
      <text x="${pointA.x - 22}" y="${pointA.y - 10}">A</text>
      <text x="${pointC.x + 10}" y="${pointC.y - 10}">C</text>
      <text x="${pointB.x + 10}" y="${pointB.y + 18}">B</text>
      <text x="${pointD.x - 24}" y="${pointD.y + 4}">D</text>
      <text class="circle-angle-value" x="218" y="32">弧 AC = 120°</text>
    </svg>
    <div class="applied-metrics">
      <div class="applied-metric"><span>弧 AC の中心角</span><strong>120°</strong></div>
      <div class="applied-metric"><span>∠ABC</span><strong>60°</strong></div>
      <div class="applied-metric positive"><span>∠ADC</span><strong>60°</strong></div>
    </div>
  `;
  $("#circle-angle-result").textContent =
    `点 \\(B\\) を動かしても、見ている弧 \\(AC\\) は同じです。円周角は同じ弧に対する中心角の半分なので、\\(\\angle ABC=\\angle ADC=120^\\circ\\div2=60^\\circ\\) です。`;
  scheduleMathTypeset($("#circle-angle-result"));
}

function setupTriangleAngleLab() {
  ["#triangle-apex-x", "#triangle-apex-y"].forEach((selector) => {
    $(selector).addEventListener("input", renderTriangleAngleLab);
  });
  renderTriangleAngleLab();
}

function renderTriangleAngleLab() {
  const apexX = Number($("#triangle-apex-x").value);
  const height = Number($("#triangle-apex-y").value);
  const baseY = 250;
  const pointB = { x: 70, y: baseY };
  const pointC = { x: 390, y: baseY };
  const pointA = { x: apexX, y: baseY - height };

  const toDegrees = (radian) => (radian * 180) / Math.PI;
  const rawAngleB = toDegrees(Math.atan2(height, pointA.x - pointB.x));
  const rawAngleC = toDegrees(Math.atan2(height, pointC.x - pointA.x));
  const angleB = Math.round(rawAngleB);
  const angleC = Math.round(rawAngleC);
  const angleA = 180 - angleB - angleC;
  const exteriorC = 180 - angleC;

  $("#triangle-stage").innerHTML = `
    <svg class="triangle-lab-svg" viewBox="0 0 520 320" role="img" aria-label="頂点Aを動かせる三角形と、頂点Cの外角">
      <line class="triangle-extension" x1="${pointC.x}" y1="${baseY}" x2="490" y2="${baseY}"></line>
      <polygon class="triangle-shape" points="${pointA.x},${pointA.y} ${pointB.x},${pointB.y} ${pointC.x},${pointC.y}"></polygon>
      <circle class="triangle-point apex" cx="${pointA.x}" cy="${pointA.y}" r="8"></circle>
      <circle class="triangle-point" cx="${pointB.x}" cy="${pointB.y}" r="6"></circle>
      <circle class="triangle-point" cx="${pointC.x}" cy="${pointC.y}" r="6"></circle>
      <text x="${pointA.x - 10}" y="${pointA.y - 14}">A</text>
      <text x="${pointB.x - 24}" y="${pointB.y + 6}">B</text>
      <text x="${pointC.x + 4}" y="${pointC.y + 26}">C</text>
      <text class="triangle-angle-label apex-label" x="${pointA.x + 14}" y="${pointA.y + 10}">${angleA}°</text>
      <text class="triangle-angle-label" x="${pointB.x + 26}" y="${pointB.y - 12}">${angleB}°</text>
      <text class="triangle-angle-label" x="${pointC.x - 52}" y="${pointC.y - 12}">${angleC}°</text>
      <text class="triangle-angle-label exterior" x="${pointC.x + 26}" y="${pointC.y - 12}">${exteriorC}°</text>
    </svg>
    <div class="applied-metrics">
      <div class="applied-metric"><span>内角の和</span><strong>180°</strong></div>
      <div class="applied-metric positive"><span>C の外角</span><strong>${exteriorC}°</strong></div>
      <div class="applied-metric"><span>∠A + ∠B</span><strong>${angleA + angleB}°</strong></div>
    </div>
  `;
  $("#triangle-angle-result").textContent =
    `頂点 \\(A\\) をどこへ動かしても、内角の和は \\(${angleA}^\\circ+${angleB}^\\circ+${angleC}^\\circ=180^\\circ\\) のままです。` +
    `また、\\(C\\) の外角（点線側の角）は \\(180^\\circ-${angleC}^\\circ=${exteriorC}^\\circ\\) で、隣り合わない2つの内角の和 \\(\\angle A+\\angle B=${angleA + angleB}^\\circ\\) と一致します。`;
  scheduleMathTypeset($("#triangle-angle-result"));
}

function setupVennLab() {
  ["#venn-a", "#venn-b", "#venn-both"].forEach((selector) => {
    $(selector).addEventListener("input", renderVennLab);
  });
  renderVennLab();
}

function renderVennLab() {
  const total = 40;
  const sizeA = Number($("#venn-a").value);
  const sizeB = Number($("#venn-b").value);
  const bothInput = $("#venn-both");
  const bothMax = Math.min(sizeA, sizeB);
  bothInput.max = String(bothMax);
  if (Number(bothInput.value) > bothMax) {
    bothInput.value = String(bothMax);
    bothInput.dispatchEvent(new Event("input"));
    return;
  }
  const both = Number(bothInput.value);
  const onlyA = sizeA - both;
  const onlyB = sizeB - both;
  const union = sizeA + sizeB - both;
  const outside = total - union;

  $("#venn-stage").innerHTML = `
    <svg class="venn-lab-svg" viewBox="0 0 520 320" role="img" aria-label="2つの集合の人数を示すベン図">
      <rect class="venn-universe" x="25" y="35" width="470" height="250" rx="14"></rect>
      <circle class="venn-circle-a" cx="205" cy="160" r="95"></circle>
      <circle class="venn-circle-b" cx="315" cy="160" r="95"></circle>
      <text class="venn-set-label" x="120" y="70">A</text>
      <text class="venn-set-label b" x="390" y="70">B</text>
      <text class="venn-universe-label" x="40" y="62">全体 ${total}人</text>
      <text class="venn-count" x="150" y="168">${onlyA}</text>
      <text class="venn-count" x="260" y="168">${both}</text>
      <text class="venn-count" x="370" y="168">${onlyB}</text>
      <text class="venn-count outside" x="440" y="265">${outside}</text>
    </svg>
    <div class="applied-metrics">
      <div class="applied-metric"><span>A だけ</span><strong>${onlyA}人</strong></div>
      <div class="applied-metric"><span>両方（A ∩ B）</span><strong>${both}人</strong></div>
      <div class="applied-metric"><span>B だけ</span><strong>${onlyB}人</strong></div>
      <div class="applied-metric positive"><span>少なくとも一方（A ∪ B）</span><strong>${union}人</strong></div>
      <div class="applied-metric"><span>どちらでもない</span><strong>${outside}人</strong></div>
    </div>
  `;
  $("#venn-result").textContent =
    `そのまま足すと \\(${sizeA}+${sizeB}=${sizeA + sizeB}\\) 人ですが、これは重なりの \\(${both}\\) 人を2回数えた数です。` +
    `1回分を引いて \\(n(A\\cup B)=${sizeA}+${sizeB}-${both}=${union}\\) 人。どちらでもない人は \\(${total}-${union}=${outside}\\) 人です。`;
  scheduleMathTypeset($("#venn-result"));
}

function euclideanDivisionSteps(first, second) {
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

function setupEuclideanAlgorithmLab() {
  ["#gcd-a", "#gcd-b"].forEach((selector) => {
    $(selector).addEventListener("input", renderEuclideanAlgorithmLab);
  });
  renderEuclideanAlgorithmLab();
}

function renderEuclideanAlgorithmLab() {
  const first = Number($("#gcd-a").value);
  const second = Number($("#gcd-b").value);
  const { steps, commonDivisor } = euclideanDivisionSteps(first, second);
  const equations = steps
    .map(
      ({ dividend, divisor, quotient, remainder }, index) => `
        <li class="euclid-step${remainder === 0 ? " final" : ""}">
          <span>手順 ${index + 1}</span>
          <strong>\\(${dividend}=${divisor}\\times${quotient}+${remainder}\\)</strong>
          <small>${remainder === 0 ? `余りが0。最後の割る数 ${divisor} が最大公約数` : `次は ${divisor} と余り ${remainder} を使う`}</small>
        </li>`,
    )
    .join("");

  $("#euclid-stage").innerHTML = `
    <div class="applied-metrics">
      <div class="applied-metric"><span>一つ目</span><strong>${first}</strong></div>
      <div class="applied-metric"><span>二つ目</span><strong>${second}</strong></div>
      <div class="applied-metric positive"><span>最大公約数</span><strong>${commonDivisor}</strong></div>
    </div>
    <ol class="euclid-step-list">${equations}</ol>
  `;
  $("#euclid-result").textContent =
    `\\(${first}\\) と \\(${second}\\) をどちらも余りなく区切れる最大の幅は \\(${commonDivisor}\\) です。大きい数を余りへ置き換えても、共通の区切り幅は変わりません。`;
  scheduleMathTypeset($("#euclid-stage"));
  scheduleMathTypeset($("#euclid-result"));
}

function formatYen(value) {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

function compactNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function stackedBarMarkup(segments, label) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const parts = segments
    .filter((segment) => segment.value > 0)
    .map((segment) => {
      const share = (segment.value / total) * 100;
      const barLabel = share >= 12 ? escapeHtml(segment.label) : "";
      return `<span class="stack-segment ${segment.kind}" style="width: ${share}%" title="${escapeHtml(segment.label)}：${escapeHtml(segment.valueText)}">${barLabel}</span>`;
    })
    .join("");
  return `<div class="stacked-bar" role="img" aria-label="${escapeHtml(label)}">${parts}</div>`;
}

function stackLegendMarkup(segments) {
  return `<div class="stack-legend">${segments
    .filter((segment) => segment.value > 0)
    .map(
      (segment) =>
        `<span><i class="${segment.kind}"></i>${escapeHtml(segment.label)} ${escapeHtml(segment.valueText)}</span>`,
    )
    .join("")}</div>`;
}

function setupAppliedLabs() {
  ["#loan-principal", "#loan-rate", "#loan-months"].forEach((selector) => {
    $(selector).addEventListener("input", renderLoanLab);
  });
  ["#account-price", "#account-quantity", "#account-cost", "#account-fixed"].forEach((selector) => {
    $(selector).addEventListener("input", renderAccountingLab);
  });
  ["#speed-rate", "#speed-hours"].forEach((selector) => {
    $(selector).addEventListener("input", renderSpeedLab);
  });
  ["#data-center", "#data-spread"].forEach((selector) => {
    $(selector).addEventListener("input", renderDataSpreadLab);
  });
  renderLoanLab();
  renderAccountingLab();
  renderSpeedLab();
  renderDataSpreadLab();
}

function renderLoanLab() {
  const principalInMan = Number($("#loan-principal").value);
  const rate = Number($("#loan-rate").value);
  const months = Number($("#loan-months").value);
  const years = months / 12;
  const interestInMan = principalInMan * (rate / 100) * years;
  const totalInMan = principalInMan + interestInMan;
  const principal = principalInMan * 10000;
  const interest = interestInMan * 10000;
  const total = totalInMan * 10000;
  const monthly = total / months;
  const segments = [
    { label: "元金", kind: "principal", value: principal, valueText: formatYen(principal) },
    { label: "利息", kind: "interest", value: interest, valueText: formatYen(interest) },
  ];

  $("#loan-stage").innerHTML = `
    <div class="applied-metrics">
      <div class="applied-metric"><span>借入額</span><strong>${formatYen(principal)}</strong></div>
      <div class="applied-metric"><span>利息（単利）</span><strong>${formatYen(interest)}</strong></div>
      <div class="applied-metric positive"><span>合計</span><strong>${formatYen(total)}</strong></div>
    </div>
    ${stackedBarMarkup(segments, `元金 ${formatYen(principal)} と利息 ${formatYen(interest)} の内訳`)}
    ${stackLegendMarkup(segments)}
    <p class="applied-caution">これは「元金 × 年率 × 年数」で利息を置く単利の教材モデルです。実際のローンは契約・返済方式・手数料で変わるため、商品比較や返済判断には使いません。</p>
  `;
  $("#loan-result").textContent =
    `単利のモデルでは、利息は \\(${principalInMan}\\times${(rate / 100).toFixed(2)}\\times${compactNumber(years)}=${compactNumber(interestInMan)}\\) 万円です。合計 \\(${compactNumber(totalInMan)}\\) 万円を ${months} か月で等しく分けると、1か月あたりは約 ${formatYen(monthly)} です。`;
  scheduleMathTypeset($("#loan-result"));
}

function renderAccountingLab() {
  const price = Number($("#account-price").value) * 100;
  const quantity = Number($("#account-quantity").value);
  const unitCost = Number($("#account-cost").value) * 100;
  const fixedCost = Number($("#account-fixed").value) * 100;
  const sales = price * quantity;
  const variableCost = unitCost * quantity;
  const cost = variableCost + fixedCost;
  const profit = sales - cost;
  const segments = [
    { label: "品物ごとの費用", kind: "variable", value: variableCost, valueText: formatYen(variableCost) },
    { label: "固定の費用", kind: "fixed", value: fixedCost, valueText: formatYen(fixedCost) },
    { label: profit >= 0 ? "利益" : "費用が上回る分", kind: profit >= 0 ? "profit" : "interest", value: Math.abs(profit), valueText: formatYen(Math.abs(profit)) },
  ];

  $("#accounting-stage").innerHTML = `
    <div class="applied-metrics">
      <div class="applied-metric"><span>売上</span><strong>${formatYen(sales)}</strong></div>
      <div class="applied-metric"><span>費用</span><strong>${formatYen(cost)}</strong></div>
      <div class="applied-metric ${profit >= 0 ? "positive" : "negative"}"><span>${profit >= 0 ? "利益" : "損失"}</span><strong>${formatYen(Math.abs(profit))}</strong></div>
    </div>
    ${stackedBarMarkup(segments, `売上 ${formatYen(sales)} を費用と${profit >= 0 ? "利益" : "費用が上回る分"}に分けた棒`)}
    ${stackLegendMarkup(segments)}
    <p class="applied-caution">この図は、売上から費用を引くという会計の基本関係だけを示す教材例です。税金・在庫・実際の事業判断は扱いません。</p>
  `;
  $("#accounting-result").textContent =
    `売上は \\(${price}\\times${quantity}=${sales}\\) 円です。費用は \\(${unitCost}\\times${quantity}+${fixedCost}=${cost}\\) 円なので、${profit >= 0 ? "利益" : "損失"}は \\(${sales}-${cost}=${profit}\\) 円です。`;
  scheduleMathTypeset($("#accounting-result"));
}

function renderSpeedLab() {
  const rate = Number($("#speed-rate").value);
  const hours = Number($("#speed-hours").value);
  const distance = rate * hours;
  const distanceRatio = Math.max(4, Math.min(88, (distance / 600) * 88));

  $("#speed-stage").innerHTML = `
    <div class="applied-metrics">
      <div class="applied-metric"><span>速さ</span><strong>${rate} km/h</strong></div>
      <div class="applied-metric"><span>時間</span><strong>${hours} 時間</strong></div>
      <div class="applied-metric positive"><span>道のり</span><strong>${distance} km</strong></div>
    </div>
    <div class="speed-road" style="--distance-ratio: ${distanceRatio}%" role="img" aria-label="${rate} km/h で ${hours} 時間進み、${distance} km の道のりを表すバー">
      <span class="speed-marker">${distance} km</span>
      <div class="speed-road-labels"><span>出発</span><span>同じ速さで進む</span><span>${distance} km</span></div>
    </div>
  `;
  $("#speed-result").textContent = `速さが一定なら、道のりは \\(${rate}\\times${hours}=${distance}\\) km です。時間を1時間増やすごとに、道のりは ${rate} km ずつ増えます。`;
  scheduleMathTypeset($("#speed-result"));
}

function renderDataSpreadLab() {
  const center = Number($("#data-center").value);
  const spread = Number($("#data-spread").value);
  const halfSpread = spread / 2;
  const values = [center - spread, center - halfSpread, center, center + halfSpread, center + spread];
  const min = center - Math.max(spread + 10, 30);
  const max = center + Math.max(spread + 10, 30);
  const range = values.at(-1) - values[0];
  const median = values[2];
  const squaredDeviations = values.map((value) => (value - center) ** 2);
  const variance = squaredDeviations.reduce((sum, value) => sum + value, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  const points = values
    .map((value, index) => {
      const position = ((value - min) / (max - min)) * 100;
      return `<span class="data-point" style="left: ${position}%" aria-label="${index + 1}番目の値 ${value}">${value}</span>`;
    })
    .join("");

  $("#data-spread-stage").innerHTML = `
    <div class="applied-metrics">
      <div class="applied-metric"><span>5つの値の平均</span><strong>${center}</strong></div>
      <div class="applied-metric"><span>中央値</span><strong>${median}</strong></div>
      <div class="applied-metric"><span>範囲</span><strong>${range}</strong></div>
      <div class="applied-metric"><span>分散</span><strong>${compactNumber(variance)}</strong></div>
      <div class="applied-metric positive"><span>標準偏差</span><strong>${standardDeviation.toFixed(2)}</strong></div>
    </div>
    <div class="data-axis" role="img" aria-label="平均 ${center}、最小 ${values[0]}、最大 ${values.at(-1)} の五つの値を並べた数直線">${points}</div>
    <div class="data-axis-labels"><span>${min}</span><span>平均・中央値 ${center}</span><span>${max}</span></div>
  `;
  $("#data-spread-result").textContent =
    `平均は合計を個数で割って \\((${values.join("+")})\\div5=${center}\\) です。中央値は小さい順の中央なので \\(${median}\\)、範囲は \\(${values.at(-1)}-${values[0]}=${range}\\) です。分散は偏差の2乗 \\(${squaredDeviations.join("+")}\\) の平均で \\(${compactNumber(variance)}\\)、標準偏差はその平方根で約 \\(${standardDeviation.toFixed(2)}\\) です。`;
  scheduleMathTypeset($("#data-spread-result"));
}

function renderLabPicker() {
  const wrap = $("#lab-picker");
  wrap.innerHTML = labs
    .map(
      (lab) =>
        `<button class="lab-picker-button${lab.id === activeLabId ? " active" : ""}" type="button" data-select-lab="${escapeHtml(lab.id)}" aria-pressed="${lab.id === activeLabId}"><span>${escapeHtml(lab.category)}</span><strong>${escapeHtml(lab.short)}</strong></button>`,
    )
    .join("");
}

function renderLabLearningActions(labId) {
  const lab = labCatalog[labId];
  const wrap = $("#lab-learning-actions");
  if (!lab || !wrap) return;
  const lesson = units.find((unit) => unit.id === lab.lessonIds?.[0]);
  const practice = practiceCatalog.find((item) => item.id === lab.practiceIds?.[0]);
  const actions = [
    lesson
      ? `<button class="learning-action primary" type="button" data-open-lesson="${escapeHtml(lesson.id)}">説明を読む：${formatTextWithMath(lesson.title)}</button>`
      : "",
    practice
      ? `<button class="learning-action" type="button" data-open-practice="${escapeHtml(practice.id)}">この図解のルールで解く：${escapeHtml(practice.label)}</button>`
      : "",
  ].filter(Boolean);
  wrap.innerHTML = actions.length
    ? `<section class="learning-actions" aria-label="この図解から次の教材へ"><h4>次はここから</h4><p>${formatTextWithMath(lab.observe)}</p><div class="learning-action-list">${actions.join("")}</div></section>`
    : "";
  scheduleMathTypeset(wrap);
}

function selectLab(labId, { scroll = false } = {}) {
  if (!labCatalog[labId]) return;
  activeLabId = labId;
  const lab = document.getElementById(labId);
  $$(".lab-card").forEach((card) => {
    card.hidden = card.id !== labId;
    card.classList.remove("lab-focus");
  });
  renderLabPicker();
  renderLabLearningActions(labId);
  if (scroll && lab) {
    window.setTimeout(() => lab.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  }
}

function setupLabs() {
  renderLabPicker();
  selectLab(activeLabId);
}

const practiceGenerators = {
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
  "sine-cosine-rule": generateSineCosineRuleProblem,
  counting: generateCountingProblem,
  probability: generateProbabilityProblem,
  "data-summary": generateDataSummaryProblem,
  "data-analysis": generateDataAnalysisProblem,
  "geometry-properties": generateGeometryPropertiesProblem,
  "number-theory": generateNumberTheoryProblem,
  "geometry-basics": generateGeometryBasicsProblem,
};

const practiceModes = practiceCatalog.map((mode) => ({
  ...mode,
  generator: practiceGenerators[mode.id],
  advancedGenerator: advancedPracticeGenerators[mode.id],
}));

function generateAbsoluteValueProblem() {
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

function generateExponentProblem() {
  const base = choose(["a", "x", "2", "3"]);
  const m = choose([2, 3, 4, 5]);
  const n = choose([2, 3, 4]);
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

function generateArithmeticSequenceProblem() {
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

function generateVennCountProblem() {
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

function generateIntegerProblem() {
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

function generateRadicalProblem() {
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

function generateSubstitutionProblem() {
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
          const acceptable = [`${a}*${x}${constant}`, `${a}(${x})${constant}`].map(normalizeText);
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

function generateCombineProblem() {
  const p = randomInt(-5, 5) || 2;
  const q = randomInt(-5, 5) || -3;
  const r = randomInt(-6, 6);
  const s = randomInt(-6, 6);
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
        hint: `\\(${xSum}x\\) と \\(${cSum}\\) を並べます。`,
        check: (input) => sameLinearExpression(input, xSum, cSum),
        answer: `\\(${linearText(xSum, cSum)}\\)`,
      },
    ],
  };
}

function generateDistributeProblem() {
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

function generateEquationProblem() {
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

function sameInequalityAnswer(input, sign, boundary) {
  const text = normalizeText(input).replace("＜", "<").replace("＞", ">");
  const compact = text.replace(/^x/, "");
  return (
    text === `x${sign}${boundary}` ||
    compact === `${sign}${boundary}` ||
    text === `${boundary}${sign === "<" ? ">x" : "<x"}`
  );
}

function generateInequalityProblem() {
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

function samePoint(input, x, y) {
  const text = normalizeText(input).replace(/[()（）]/g, "");
  return text === `${x},${y}` || text === `${x}、${y}`;
}

function generateQuadraticVertexProblem() {
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

function generateTrigProblem() {
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

function generateCountingProblem() {
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

function generateProbabilityProblem() {
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

function samePlusMinus(input, value) {
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

function sameNumberList(input, expected) {
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

function generateSquareRootMeaningProblem() {
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

function generateRootOperationsProblem() {
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
    { left: 5, right: 20, coef: 10, rest: 1 },
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

function generateSetsProblem() {
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

function generateIdentitiesProblem() {
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

function generateFunctionValuesProblem() {
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

function sameOutsideInterval(input, lower, upper) {
  const text = normalizeText(input)
    .replace(/[＜]/g, "<")
    .replace(/[＞]/g, ">")
    .replace(/または|or|、|，|;/g, ",");
  const left = text.includes(`x<${lower}`) || text.includes(`${lower}>x`);
  const right = text.includes(`${upper}<x`) || text.includes(`x>${upper}`);
  return left && right;
}

function generateQuadraticSignProblem() {
  const lower = randomInt(-4, 1);
  const upper = lower + randomInt(2, 5);
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

function generateSineCosineRuleProblem() {
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

function generateDataSummaryProblem() {
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

function generateDataAnalysisProblem() {
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

function generateGeometryPropertiesProblem() {
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
        check: (input) => Number(normalizeText(input).replace("度", "")) === inscribedAngle,
        answer: `${inscribedAngle}°`,
      },
    ],
  };
}

function generateNumberTheoryProblem() {
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

function generateGeometryBasicsProblem() {
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
          check: (input) => Number(normalizeText(input).replace("度", "")) === third,
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

function setupPractice() {
  const wrap = $("#practice-modes");
  wrap.innerHTML = "";
  practiceModes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mode-button${mode.id === activePracticeMode ? " active" : ""}`;
    button.textContent = mode.label;
    button.setAttribute("aria-pressed", String(mode.id === activePracticeMode));
    button.addEventListener("click", () => {
      setActivePracticeMode(mode.id);
      if (location.hash.replace("#", "") !== `practice/${mode.id}`) {
        location.hash = routeHash("practice", mode.id);
      }
    });
    wrap.append(button);
  });

  $$('[data-practice-level]').forEach((button) => {
    button.addEventListener("click", () => setActivePracticeLevel(button.dataset.practiceLevel));
  });

  $("#new-problem").addEventListener("click", newProblem);
  $("#answer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    checkCurrentStep();
  });
  newProblem();
}

function renderPracticeModes() {
  $$(".mode-button").forEach((button, index) => {
    const isActive = practiceModes[index].id === activePracticeMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderPracticeLevels() {
  $$('[data-practice-level]').forEach((button) => {
    const isActive = button.dataset.practiceLevel === activePracticeLevel;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setActivePracticeLevel(level) {
  if (!["starter", "advanced"].includes(level) || level === activePracticeLevel) return;
  activePracticeLevel = level;
  renderPracticeLevels();
  newProblem();
}

function setActivePracticeMode(modeId, { newQuestion = true } = {}) {
  if (!practiceModes.some((mode) => mode.id === modeId)) return;
  activePracticeMode = modeId;
  renderPracticeModes();
  if (newQuestion) newProblem();
}

function newProblem() {
  const mode = practiceModes.find((item) => item.id === activePracticeMode);
  const advanced = activePracticeLevel === "advanced";
  currentProblem = advanced ? mode.advancedGenerator() : mode.generator();
  currentStepIndex = 0;
  $("#problem-mode-label").textContent = `${mode.label}｜${advanced ? mode.advancedLevel : mode.level}`;
  $("#problem-title").textContent = currentProblem.title;
  $("#problem-policy").textContent = `${advanced ? mode.advancedLevel : mode.level}：${advanced ? mode.advancedPolicy : mode.numberPolicy}。「新しい問題」で数値や場面を変え、同じ考えを復習できます。`;
  $("#problem-prompt").textContent = currentProblem.prompt;
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  $("#answer-input").value = "";
  renderSteps();
  renderPracticeLearningActions(mode);
  scheduleMathTypeset($(".problem-card"));
}

function renderPracticeLearningActions(mode) {
  const wrap = $("#practice-learning-actions");
  if (!mode || !wrap) return;
  const lesson = units.find((unit) => unit.id === mode.lessonIds?.[0]);
  const lab = labCatalog[mode.labIds?.[0]];
  const actions = [
    lesson
      ? `<button class="learning-action primary" type="button" data-open-lesson="${escapeHtml(lesson.id)}">単元の説明に戻る：${formatTextWithMath(lesson.title)}</button>`
      : "",
    lab
      ? `<button class="learning-action" type="button" data-open-lab="${escapeHtml(lab.id)}">図解に戻る：${escapeHtml(lab.short)}</button>`
      : "",
  ].filter(Boolean);
  wrap.innerHTML = actions.length
    ? `<section class="learning-actions" aria-label="この問題から戻る教材"><h4>迷ったら戻れる場所</h4><p>答えを急がず、説明や具体物の図解に戻ってからもう一度試せます。</p><div class="learning-action-list">${actions.join("")}</div></section>`
    : "";
  scheduleMathTypeset(wrap);
}

function renderSteps() {
  const list = $("#step-list");
  list.innerHTML = "";
  currentProblem.steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = index < currentStepIndex ? "done" : index === currentStepIndex ? "current" : "";
    li.textContent =
      index < currentStepIndex
        ? `${step.label}：${step.answer}`
        : index === currentStepIndex
          ? `${step.label}：${step.question}`
          : step.label;
    list.append(li);
  });
  const current = currentProblem.steps[currentStepIndex];
  $("#answer-label").textContent = current ? current.question : "完了";
  $("#hint-text").textContent = current ? current.hint : "よくできました。新しい問題へ進みましょう。";
  scheduleMathTypeset($(".problem-card"));
}

function checkCurrentStep() {
  const current = currentProblem.steps[currentStepIndex];
  if (!current) {
    newProblem();
    return;
  }

  const input = $("#answer-input").value;
  if (current.check(input)) {
    currentStepIndex += 1;
    $("#answer-input").value = "";
    if (currentStepIndex >= currentProblem.steps.length) {
      $("#feedback").textContent = "正解！この問題は完了です。";
      $("#feedback").className = "feedback good";
    } else {
      $("#feedback").textContent = "いい感じ。次のステップへ進みましょう。";
      $("#feedback").className = "feedback good";
    }
    renderSteps();
  } else {
    $("#feedback").textContent = "惜しいです。ヒントを見ながら、符号・種類・順序をもう一度確認してみましょう。";
    $("#feedback").className = "feedback try";
  }
}

function renderStory() {
  const story = storyCatalog[activeStoryId] || stories[0];
  if (!story) return;
  const wrap = $("#story-content");
  const lessonActions = story.lessonIds
    .map((lessonId) => units.find((unit) => unit.id === lessonId))
    .filter(Boolean)
    .map(
      (lesson) =>
        `<button class="learning-action primary" type="button" data-open-lesson="${escapeHtml(lesson.id)}">単元へ：${formatTextWithMath(lesson.title)}</button>`,
    );
  const labActions = story.labIds
    .map((labId) => labCatalog[labId])
    .filter(Boolean)
    .map(
      (lab) => `<button class="learning-action" type="button" data-open-lab="${escapeHtml(lab.id)}">図解へ：${escapeHtml(lab.short)}</button>`,
    );
  const practiceActions = story.practiceIds
    .map((practiceId) => practiceCatalog.find((practice) => practice.id === practiceId))
    .filter(Boolean)
    .map(
      (practice) => `<button class="learning-action" type="button" data-open-practice="${escapeHtml(practice.id)}">問題へ：${escapeHtml(practice.label)}</button>`,
    );
  const sources = story.sources?.length
    ? `
      <aside class="story-sources">
        <h4>出典</h4>
        <ul>${story.sources
          .map(
            (source) =>
              `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a>${source.publisher ? `（${escapeHtml(source.publisher)}）` : ""}</li>`,
          )
          .join("")}</ul>
        <p class="story-source-note">${formatTextWithMath(story.factCheck?.note || "出典と事実確認の状態を教材データで管理します。")}</p>
      </aside>
    `
    : `
      <aside class="story-sources">
        <h4>事実確認について</h4>
        <p class="story-source-note">${formatTextWithMath(story.factCheck?.note || "この読み物に外部の事実は含まれません。")}</p>
      </aside>
    `;

  wrap.innerHTML = `
    <p class="story-kicker">${escapeHtml(storyTypeLabels[story.type] || "読み物")}</p>
    <h3>${formatTextWithMath(story.title)}</h3>
    <p class="story-lead">${formatTextWithMath(story.lead)}</p>
    ${story.sections
      .map(
        (section) => `<section class="story-section"><h4>${formatTextWithMath(section.heading)}</h4><p>${formatTextWithMath(section.body)}</p></section>`,
      )
      .join("")}
    ${sources}
    <section class="learning-actions" aria-label="読み物から教材へ">
      <h4>ここから戻る</h4>
      <p>読み物は補助線です。説明・図解・問題の好きな場所へ戻れます。</p>
      <div class="learning-action-list">${[...lessonActions, ...labActions, ...practiceActions].join("")}</div>
    </section>
  `;
  scheduleMathTypeset(wrap);
}

function renderStoryPicker() {
  const wrap = $("#story-picker");
  wrap.innerHTML = "";
  stories.forEach((story) => {
    const button = document.createElement("button");
    const isActive = story.id === activeStoryId;
    button.type = "button";
    button.className = `story-picker-button${isActive ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(isActive));
    button.innerHTML = `<span>${escapeHtml(storyTypeLabels[story.type] || "読み物")}</span><strong>${formatTextWithMath(story.menuTitle || story.title)}</strong>`;
    button.addEventListener("click", () => {
      if (story.id !== activeStoryId) location.hash = routeHash("stories", story.id);
    });
    wrap.append(button);
  });
  scheduleMathTypeset(wrap);
}

function setupStories() {
  renderStoryPicker();
  renderStory();
}

function setupMap() {
  ["#map-category", "#map-level"].forEach((selector) => {
    $(selector).addEventListener("change", () => {
      activeMapPage = 0;
      renderMap();
    });
  });
  $("#prev-map").addEventListener("click", () => {
    activeMapPage = Math.max(0, activeMapPage - 1);
    renderMap();
  });
  $("#next-map").addEventListener("click", () => {
    activeMapPage += 1;
    renderMap();
  });
  renderMap();
}

function filteredTopics() {
  const category = $("#map-category").value;
  const level = $("#map-level").value;
  return topics.filter((topic) => {
    const categoryOk = category === "all" || topic.category === category;
    const levelOk = level === "all" || String(topic.level) === level;
    return categoryOk && levelOk;
  });
}

function renderMap() {
  const pageSize = 8;
  const items = filteredTopics();
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  activeMapPage = Math.min(activeMapPage, totalPages - 1);
  const pageItems = items.slice(activeMapPage * pageSize, activeMapPage * pageSize + pageSize);
  $("#topic-grid").innerHTML = pageItems
    .map(
      (topic) => `
        <article class="topic-card">
          <div>
            <div class="topic-meta">
              <span class="pill">LEVEL ${topic.level}</span>
              <span class="pill">${categoryLabels[topic.category]}</span>
            </div>
            <h3>${formatTextWithMath(topic.title)}</h3>
            <p>${formatTextWithMath(topic.description)}</p>
          </div>
          <a href="#lessons/${topic.lessonId}" data-unit-link="${topic.lessonId}">単元を開く</a>
        </article>
      `,
    )
    .join("");

  $$("[data-unit-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const unitId = event.currentTarget.dataset.unitLink;
      const index = units.findIndex((unit) => unit.id === unitId);
      if (index >= 0) {
        activeLessonRange = null;
        activeUnit = index;
        renderUnit();
        activatePage("lessons");
        setHashForUnit(index);
        $("#lessons").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  $("#map-page-label").textContent = `${activeMapPage + 1} / ${totalPages}`;
  $("#prev-map").disabled = activeMapPage === 0;
  $("#next-map").disabled = activeMapPage >= totalPages - 1;
  scheduleMathTypeset($("#topic-grid"));
}

function activatePage(pageId) {
  const page = pageIds.includes(pageId) ? pageId : "home";
  $$("[data-page]").forEach((section) => {
    section.hidden = section.dataset.page !== page;
  });
  $$("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === page);
  });
}

function routeHash(page, id = "") {
  return `#${page}${id ? `/${encodeURIComponent(id)}` : ""}`;
}

function readRoute() {
  const raw = decodeURIComponent(location.hash.replace("#", ""));
  if (!raw || raw === "top" || raw === "roadmap") return { page: "home" };

  const [page, id, range] = raw.split("/");
  if (page === "lessons" && id === "range" && range) return { page, rangeFilter: range };
  if (page === "lessons" && (!id || units.some((unit) => unit.id === id))) return { page, id };
  if (page === "labs" && (!id || labCatalog[id])) return { page, id };
  if (page === "practice" && (!id || practiceCatalog.some((practice) => practice.id === id))) return { page, id };
  if (page === "stories" && (!id || storyCatalog[id])) return { page, id };
  if (pageIds.includes(raw)) return { page: raw };

  // 以前の #単元ID / #図解ID も、そのまま開けるように残す。
  if (units.some((unit) => unit.id === raw)) return { page: "lessons", id: raw, legacy: true };
  if (labCatalog[raw]) return { page: "labs", id: raw, legacy: true };
  if (practiceCatalog.some((practice) => practice.id === raw)) return { page: "practice", id: raw, legacy: true };
  if (storyCatalog[raw]) return { page: "stories", id: raw, legacy: true };
  return { page: "home" };
}

function focusLab(labId) {
  selectLab(labId, { scroll: true });
  const lab = document.getElementById(labId);
  if (!lab) return;
  lab.classList.add("lab-focus");
  window.setTimeout(() => lab.classList.remove("lab-focus"), 2200);
}

function handleRoute() {
  const route = readRoute();
  activatePage(route.page);

  if (route.page === "lessons") {
    activeLessonRange = route.rangeFilter ?? null;
    if (route.id) {
      const unitIndex = units.findIndex((unit) => unit.id === route.id);
      if (unitIndex >= 0) activeUnit = unitIndex;
    }
    renderUnit();
    $("#lessons").scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (route.page === "labs") {
    selectLab(route.id || activeLabId);
    if (route.id) focusLab(route.id);
    return;
  }

  if (route.page === "practice" && route.id && route.id !== activePracticeMode) {
    setActivePracticeMode(route.id);
    return;
  }

  if (route.page === "stories") {
    activeStoryId = route.id || activeStoryId;
    renderStoryPicker();
    renderStory();
    if (route.id) $("#stories").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function setupNavigation() {
  $$("[data-page-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const page = event.currentTarget.dataset.pageLink;
      if (location.hash.replace("#", "") === page) {
        activatePage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        location.hash = page;
      }
    });
  });

  document.addEventListener("click", (event) => {
    const labButton = event.target.closest("[data-open-lab]");
    if (labButton) {
      const labId = labButton.dataset.openLab;
      if (labCatalog[labId]) location.hash = routeHash("labs", labId);
      return;
    }

    const practiceButton = event.target.closest("[data-open-practice]");
    if (practiceButton) {
      const practiceId = practiceButton.dataset.openPractice;
      if (practiceCatalog.some((practice) => practice.id === practiceId)) {
        location.hash = routeHash("practice", practiceId);
      }
      return;
    }

    const lessonButton = event.target.closest("[data-open-lesson]");
    if (lessonButton) {
      const lessonId = lessonButton.dataset.openLesson;
      if (units.some((unit) => unit.id === lessonId)) location.hash = routeHash("lessons", lessonId);
      return;
    }

    const storyButton = event.target.closest("[data-open-story]");
    if (storyButton) {
      const storyId = storyButton.dataset.openStory;
      if (storyCatalog[storyId]) location.hash = routeHash("stories", storyId);
      return;
    }

    const rangeButton = event.target.closest("[data-open-range]");
    if (rangeButton) {
      const range = rangeButton.dataset.openRange;
      location.hash = `#lessons/range/${encodeURIComponent(range)}`;
      return;
    }

    const labPickerButton = event.target.closest("[data-select-lab]");
    if (labPickerButton) {
      const labId = labPickerButton.dataset.selectLab;
      if (labCatalog[labId]) location.hash = routeHash("labs", labId);
    }
  });

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

function init() {
  setupMathChoiceGroups();
  setupLessons();
  setupNumberLine();
  setupInequalityLab();
  setupDistribution();
  setupRadicals();
  setupTerms();
  setupEquation();
  setupGraph();
  setupQuadraticVertex();
  setupTrigLab();
  setupProbabilityLab();
  setupSetSortLab();
  setupVennLab();
  setupTriangleAngleLab();
  setupGeometryPropertiesLab();
  setupEuclideanAlgorithmLab();
  setupAppliedLabs();
  setupRangeValueLabels();
  setupLabs();
  setupPractice();
  setupStories();
  setupMap();
  setupNavigation();
}

document.addEventListener("DOMContentLoaded", init);
