// 動く図解（全ラボ）の描画と一覧・切替。
import { units } from "../../content/lessons.js";
import { labs, labCatalog } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { state } from "./state.js";
import { $, $$, jumpToTop, scheduleMathTypeset } from "./utils.js";
import { compactPolynomial, escapeHtml, factorText, formatTextWithMath, linearText, sumExpression, term, vertexQuadraticExpression } from "./format.js";
import { binomial, fractionText, gcd, largestSquareFactor, radicalTeX, radicalText, randomInt } from "./math-utils.js";

export const rangeValueFormatters = {
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
  "data-outlier": (value) => `+${value}`,
  "gcd-a": (value) => `${value}`,
  "gcd-b": (value) => `${value}`,
  "venn-a": (value) => `${value} 人`,
  "venn-b": (value) => `${value} 人`,
  "venn-both": (value) => `${value} 人`,
  "triangle-apex-x": (value) => `位置 ${value}`,
  "triangle-apex-y": (value) => `高さ ${value}`,
  "semicircle-angle": (value) => `θ = ${value}°`,
  "lattice-right": (value) => `右へ ${value}`,
  "lattice-up": (value) => `上へ ${value}`,
  "box-median": (value) => `中央値 ${value}`,
  "box-lower": (value) => `間隔 ${value}`,
  "box-upper": (value) => `間隔 ${value}`,
  "stairs-n": (value) => `n = ${value}`,
};

export function setupRangeValueLabels() {
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

export function setupNumberLine() {
  ["#int-a", "#int-b", "#int-op"].forEach((selector) => {
    $(selector).addEventListener("input", drawNumberLine);
  });
  drawNumberLine();
}

export function setupInequalityLab() {
  ["#ineq-a", "#ineq-b", "#ineq-factor"].forEach((selector) => {
    $(selector).addEventListener("input", renderInequalityLab);
  });
  renderInequalityLab();
}

export function renderInequalityLab() {
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

export function drawArrow(ctx, x1, y1, x2, y2, color) {
  const head = 20;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 6;
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

export function drawNumberLine() {
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

export function setupDistribution() {
  ["#dist-a", "#dist-b", "#dist-c"].forEach((selector) => {
    $(selector).addEventListener("input", renderDistribution);
  });
  renderDistribution();
}

export function renderDistribution() {
  const a = Number($("#dist-a").value);
  const b = Number($("#dist-b").value);
  const c = Number($("#dist-c").value);
  const model = $("#area-model");
  model.innerHTML = `
    <div class="area-figure">
      <div class="area-height-label" style="min-height: ${110 + a * 8}px"><span>\\(a=${a}\\)</span></div>
      <div class="area-body">
        <div class="area-row" style="grid-template-columns: ${b}fr ${c}fr; min-height: ${110 + a * 8}px">
          <div class="area-part">\\(${a}\\times${b}\\)<br>\\(${a * b}\\)</div>
          <div class="area-part">\\(${a}\\times${c}\\)<br>\\(${a * c}\\)</div>
        </div>
        <div class="area-width-labels" style="grid-template-columns: ${b}fr ${c}fr">
          <span class="width-b">\\(b=${b}\\)</span>
          <span class="width-c">\\(c=${c}\\)</span>
        </div>
      </div>
    </div>
  `;
  // 答案の模範のように、= を縦にそろえて1段ずつ展開する。
  $("#distribution-result").textContent =
    `\\[\\begin{aligned}${a}(${b}+${c})&=${a}\\times${b}+${a}\\times${c}\\\\&=${a * b}+${a * c}\\\\&=${a * (b + c)}\\end{aligned}\\] 分けて計算しても、全体の面積 \\(${a}\\times${b + c}=${a * (b + c)}\\) と同じです。`;
  scheduleMathTypeset($("#area-model"));
  scheduleMathTypeset($("#distribution-result"));
}

export function setupRadicals() {
  $("#radical-n").addEventListener("input", renderRadical);
  renderRadical();
}

export function renderRadical() {
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

export function setupTerms() {
  ["#term-p", "#term-q", "#term-r", "#term-s"].forEach((selector) => {
    $(selector).addEventListener("input", renderTerms);
  });
  renderTerms();
}

export function chip(value, label, extraClass = "") {
  const negative = value < 0 ? " negative" : "";
  return `<span class="term-chip ${extraClass}${negative}">${label}</span>`;
}

export function renderTermChips(count, label, kind = "") {
  if (count === 0) return `<span class="term-chip muted">なし</span>`;
  return Array.from({ length: Math.min(count, 9) }, () => `<span class="term-chip ${kind}">${label}</span>`).join("");
}

export function cardExpression(posX, negX, posOne, negOne) {
  const parts = [];
  if (posX) parts.push(term(posX));
  if (negX) parts.push(`- ${negX === 1 ? "x" : `${negX}x`}`);
  if (posOne) parts.push(parts.length ? `+ ${posOne}` : `${posOne}`);
  if (negOne) parts.push(`- ${negOne}`);
  return parts.join(" ") || "0";
}

export function renderTerms() {
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

export function renderUnitBlocks(count, options = {}) {
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

export function renderXBags(count) {
  return Array.from({ length: count }, (_, index) => `<span class="x-bag" aria-label="x袋 ${index + 1}">x袋</span>`).join("");
}

export function setupEquation() {
  ["#eq-a", "#eq-x", "#eq-b"].forEach((selector) => {
    $(selector).addEventListener("input", renderEquation);
  });
  renderEquation();
}

export function renderEquation() {
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

export const GRAPH_MIN = -10;

export const GRAPH_MAX = 10;

export function setupGraph() {
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
export function bracketNegative(value) {
  return value < 0 ? `(${value})` : String(value);
}

export function drawGraph() {
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

export function setupQuadraticVertex() {
  ["#quad-a", "#quad-h", "#quad-k"].forEach((selector) => {
    $(selector).addEventListener("input", drawQuadraticVertex);
  });
  drawQuadraticVertex();
}

export function drawQuadraticVertex() {
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

export function setupTrigLab() {
  ["#trig-angle", "#trig-hyp", "#trig-base", "#trig-focus"].forEach((selector) => {
    $(selector).addEventListener("input", drawTrigLab);
  });
  $$("[data-trig-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#trig-angle").value = button.dataset.trigPreset;
      $("#trig-angle").dispatchEvent(new Event("input"));
    });
  });
  drawTrigLab();
}

export function drawTrigLab() {
  const canvas = $("#trig-canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const degree = Number($("#trig-angle").value);
  const baseLength = Number($("#trig-hyp").value);
  const baseSide = $("#trig-base").value;
  const focus = $("#trig-focus").value;
  const rad = (degree * Math.PI) / 180;
  // 角度と1辺が決まれば、残りの2辺は自動的に決まる。どの辺を「決めた辺」にするかを選べる。
  let hyp;
  if (baseSide === "opposite") {
    hyp = baseLength / Math.sin(rad);
  } else if (baseSide === "adjacent") {
    hyp = baseLength / Math.cos(rad);
  } else {
    hyp = baseLength;
  }
  const adjacent = hyp * Math.cos(rad);
  const opposite = hyp * Math.sin(rad);
  const sideText = (value, isBase) => (isBase ? `= ${compactNumber(baseLength)}` : `≒ ${value.toFixed(2)}`);
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

  // 選んだ比で使う2辺だけを強調する（sin＝対辺と斜辺、cos＝隣辺と斜辺、tan＝対辺と隣辺）
  const useOpposite = focus === "sin" || focus === "tan" || focus === "all";
  const useAdjacent = focus === "cos" || focus === "tan" || focus === "all";
  const useHypotenuse = focus === "sin" || focus === "cos" || focus === "all";

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = useAdjacent ? "#407bff" : "#ccd3db";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.strokeStyle = useOpposite ? "#d9468a" : "#ccd3db";
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  ctx.strokeStyle = useHypotenuse ? "#2f6f73" : "#ccd3db";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  ctx.strokeStyle = "#1f2933";
  ctx.lineWidth = 3;
  ctx.strokeRect(bx - 24, by - 24, 24, 24);

  ctx.font = '700 22px "Noto Sans JP", "Hiragino Sans", sans-serif';
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#1f2933";
  ctx.fillText(`θ = ${degree}°`, ax + 30, ay - 16);
  const hypText = baseSide === "hyp" ? compactNumber(baseLength) : hyp.toFixed(2);
  const oppText = baseSide === "opposite" ? compactNumber(baseLength) : opposite.toFixed(2);
  const adjText = baseSide === "adjacent" ? compactNumber(baseLength) : adjacent.toFixed(2);

  ctx.textAlign = "center";
  ctx.fillStyle = useAdjacent ? "#2c56b8" : "#8b95a1";
  ctx.fillText(`隣辺 ${sideText(adjacent, baseSide === "adjacent")}`, (ax + bx) / 2, ay + 36);
  ctx.textAlign = "left";
  ctx.fillStyle = useOpposite ? "#a42c68" : "#8b95a1";
  ctx.fillText(`対辺 ${sideText(opposite, baseSide === "opposite")}`, bx + 16, (by + cy) / 2 + 8);
  ctx.textAlign = "center";
  ctx.fillStyle = useHypotenuse ? "#184c50" : "#8b95a1";
  ctx.fillText(`斜辺 ${sideText(hyp, baseSide === "hyp")}`, (ax + cx) / 2 - 52, (ay + cy) / 2 - 16);

  // 図の下に、いま見ている比の定義式を数値つきで示す
  const sinFormula = `\\(\\sin${degree}^{\\circ}=\\dfrac{\\text{対辺}}{\\text{斜辺}}=\\dfrac{${oppText}}{${hypText}}\\approx${(opposite / hyp).toFixed(3)}\\)`;
  const cosFormula = `\\(\\cos${degree}^{\\circ}=\\dfrac{\\text{隣辺}}{\\text{斜辺}}=\\dfrac{${adjText}}{${hypText}}\\approx${(adjacent / hyp).toFixed(3)}\\)`;
  const tanFormula = `\\(\\tan${degree}^{\\circ}=\\dfrac{\\text{対辺}}{\\text{隣辺}}=\\dfrac{${oppText}}{${adjText}}\\approx${(opposite / adjacent).toFixed(3)}\\)`;
  $("#trig-formula").textContent =
    focus === "sin" ? sinFormula : focus === "cos" ? cosFormula : focus === "tan" ? tanFormula : `${sinFormula}　${cosFormula}　${tanFormula}`;

  const famousRatio =
    degree === 45
      ? "いまの形は直角二等辺三角形（三角定規の一つ）。3辺の比はちょうど \\(1:1:\\sqrt{2}\\) です。対辺を \\(1\\) に決めると、隣辺も \\(1\\)、斜辺は \\(\\sqrt2\\approx1.41\\) になります。"
      : degree === 30 || degree === 60
        ? `いまの形はもう一つの三角定規。3辺の比はちょうど \\(1:2:\\sqrt{3}\\) です。斜辺を \\(2\\) に決めると、${degree === 30 ? "対辺" : "隣辺"}はちょうど \\(1\\)、残りの辺は \\(\\sqrt3\\approx1.73\\) になります。`
        : "";
  $("#trig-result").textContent =
    `色のついた2辺の比が、選んだ三角比です。斜辺を変えても、角度が同じなら比は変わりません。${famousRatio}`;
  scheduleMathTypeset($("#trig-formula"));
  scheduleMathTypeset($("#trig-result"));
}

export function setupProbabilityLab() {
  ["#prob-red", "#prob-blue", "#prob-mode"].forEach((selector) => {
    $(selector).addEventListener("input", renderProbabilityLab);
  });
  renderProbabilityLab();
}

export function renderProbabilityLab() {
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

export function setupSetSortLab() {
  ["#set-a-rule", "#set-b-divisor", "#set-operation"].forEach((selector) => {
    $(selector).addEventListener("input", renderSetSortLab);
  });
  renderSetSortLab();
}

export function renderSetSortLab() {
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

export function circlePoint(degree, centerX = 260, centerY = 160, radius = 120) {
  const radian = (degree * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(radian),
    y: centerY + radius * Math.sin(radian),
  };
}

export function setupGeometryPropertiesLab() {
  $("#circle-observer").addEventListener("input", renderGeometryPropertiesLab);
  renderGeometryPropertiesLab();
}

export function renderGeometryPropertiesLab() {
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

export function setupTriangleAngleLab() {
  ["#triangle-apex-x", "#triangle-apex-y"].forEach((selector) => {
    $(selector).addEventListener("input", renderTriangleAngleLab);
  });
  renderTriangleAngleLab();
}

export function renderTriangleAngleLab() {
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

export function setupVennLab() {
  ["#venn-a", "#venn-b", "#venn-both"].forEach((selector) => {
    $(selector).addEventListener("input", renderVennLab);
  });
  renderVennLab();
}

export function renderVennLab() {
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
    <p class="lab-question">問題：${total}人のクラスで通学の方法を調べると、電車を使う人（\\(A\\)）が \\(${sizeA}\\) 人、バスを使う人（\\(B\\)）が \\(${sizeB}\\) 人、両方使う人が \\(${both}\\) 人いました。どちらも使わない人は何人でしょう？</p>
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
  scheduleMathTypeset($("#venn-stage"));
  scheduleMathTypeset($("#venn-result"));
}

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

export function setupEuclideanAlgorithmLab() {
  ["#gcd-a", "#gcd-b"].forEach((selector) => {
    $(selector).addEventListener("input", renderEuclideanAlgorithmLab);
  });
  renderEuclideanAlgorithmLab();
}

// 長方形を「なるべく大きな正方形」で端から埋めていく図。互除法の各手順が正方形の大きさに対応する。
export function euclidTilingMarkup(first, second) {
  const rectWidth = Math.max(first, second);
  const rectHeight = Math.min(first, second);
  const scale = Math.min(460 / rectWidth, 200 / rectHeight);
  const colors = ["#2f6f73", "#db8d3d", "#d9468a", "#407bff", "#7b8794"];
  const squares = [];
  let x = 0;
  let y = 0;
  let w = rectWidth;
  let h = rectHeight;
  let depth = 0;
  while (w > 0 && h > 0 && depth < 8) {
    if (w >= h) {
      const count = Math.floor(w / h);
      for (let i = 0; i < count; i += 1) squares.push({ x: x + i * h, y, size: h, depth });
      x += count * h;
      w -= count * h;
    } else {
      const count = Math.floor(h / w);
      for (let i = 0; i < count; i += 1) squares.push({ x, y: y + i * w, size: w, depth });
      y += count * w;
      h -= count * w;
    }
    depth += 1;
  }
  const originX = 74;
  const originY = 40;
  const rects = squares
    .map((square) => {
      const px = originX + square.x * scale;
      const py = originY + square.y * scale;
      const side = square.size * scale;
      const color = colors[square.depth % colors.length];
      const label =
        side > 58
          ? `<text x="${px + side / 2}" y="${py + side / 2 + 7}" text-anchor="middle" fill="${color}" font-size="18" font-weight="700">一辺 ${square.size}</text>`
          : side > 30
            ? `<text x="${px + side / 2}" y="${py + side / 2 + 7}" text-anchor="middle" fill="${color}" font-size="16" font-weight="700">${square.size}</text>`
            : "";
      return `<rect x="${px}" y="${py}" width="${side}" height="${side}" fill="${color}" fill-opacity="0.14" stroke="${color}" stroke-width="2.5"></rect>${label}`;
    })
    .join("");
  const drawnWidth = rectWidth * scale;
  const drawnHeight = rectHeight * scale;
  const width = originX + drawnWidth + 14;
  const height = originY + drawnHeight + 14;
  // 面積の図と誤解されないよう、外側に「横」「たて」の寸法線を添える
  const dimensions = `
    <line x1="${originX}" y1="${originY - 16}" x2="${originX + drawnWidth}" y2="${originY - 16}" stroke="#52606d" stroke-width="2"></line>
    <line x1="${originX}" y1="${originY - 22}" x2="${originX}" y2="${originY - 10}" stroke="#52606d" stroke-width="2"></line>
    <line x1="${originX + drawnWidth}" y1="${originY - 22}" x2="${originX + drawnWidth}" y2="${originY - 10}" stroke="#52606d" stroke-width="2"></line>
    <text x="${originX + drawnWidth / 2}" y="${originY - 24}" text-anchor="middle" fill="#1f2933" font-size="17" font-weight="700">横 ${rectWidth}</text>
    <line x1="${originX - 16}" y1="${originY}" x2="${originX - 16}" y2="${originY + drawnHeight}" stroke="#52606d" stroke-width="2"></line>
    <line x1="${originX - 22}" y1="${originY}" x2="${originX - 10}" y2="${originY}" stroke="#52606d" stroke-width="2"></line>
    <line x1="${originX - 22}" y1="${originY + drawnHeight}" x2="${originX - 10}" y2="${originY + drawnHeight}" stroke="#52606d" stroke-width="2"></line>
    <text x="${originX - 28}" y="${originY + drawnHeight / 2}" text-anchor="middle" fill="#1f2933" font-size="17" font-weight="700" transform="rotate(-90 ${originX - 28} ${originY + drawnHeight / 2})">たて ${rectHeight}</text>
  `;
  return `
    <svg class="euclid-tiling-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="横${rectWidth}・たて${rectHeight}の長方形を正方形で敷きつめた図">
      ${dimensions}
      <rect x="${originX}" y="${originY}" width="${drawnWidth}" height="${drawnHeight}" fill="none" stroke="#1f2933" stroke-width="3"></rect>
      ${rects}
    </svg>
  `;
}

export function renderEuclideanAlgorithmLab() {
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
    <p class="lab-question">問題：横 \\(${Math.max(first, second)}\\) cm・たて \\(${Math.min(first, second)}\\) cm の長方形の紙を、同じ大きさの正方形ですき間なく敷きつめたい。正方形の一辺は最大で何cmにできる？——この答えが2つの数の最大公約数です。</p>
    ${euclidTilingMarkup(first, second)}
    <div class="applied-metrics">
      <div class="applied-metric"><span>横の長さ</span><strong>${Math.max(first, second)}</strong></div>
      <div class="applied-metric"><span>たての長さ</span><strong>${Math.min(first, second)}</strong></div>
      <div class="applied-metric positive"><span>最大公約数（一辺の最大）</span><strong>${commonDivisor}</strong></div>
    </div>
    <ol class="euclid-step-list">${equations}</ol>
  `;
  $("#euclid-result").textContent =
    `図のように、まず一辺 \\(${Math.min(first, second)}\\) の正方形で埋め、余った部分をまた正方形で埋め……と繰り返すと、最後に残る一番小さい正方形の一辺が \\(${commonDivisor}\\)。これが最大公約数で、上の割り算の各行が図の各段階に対応しています。`;
  scheduleMathTypeset($("#euclid-stage"));
  scheduleMathTypeset($("#euclid-result"));
}

export function formatYen(value) {
  return `${Math.round(value).toLocaleString("ja-JP")}円`;
}

export function compactNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

export function stackedBarMarkup(segments, label) {
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

// ---- 単位半円の三角比ラボ ----

// 有名角は近似値でなく正確な値も添える。
export const semicircleExactValues = {
  0: { sin: "0", cos: "1" },
  30: { sin: "\\frac{1}{2}", cos: "\\frac{\\sqrt3}{2}" },
  45: { sin: "\\frac{\\sqrt2}{2}", cos: "\\frac{\\sqrt2}{2}" },
  60: { sin: "\\frac{\\sqrt3}{2}", cos: "\\frac{1}{2}" },
  90: { sin: "1", cos: "0" },
  120: { sin: "\\frac{\\sqrt3}{2}", cos: "-\\frac{1}{2}" },
  135: { sin: "\\frac{\\sqrt2}{2}", cos: "-\\frac{\\sqrt2}{2}" },
  150: { sin: "\\frac{1}{2}", cos: "-\\frac{\\sqrt3}{2}" },
  180: { sin: "0", cos: "-1" },
};

export function setupUnitSemicircleLab() {
  $("#semicircle-angle").addEventListener("input", renderUnitSemicircleLab);
  $$("[data-semicircle-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#semicircle-angle").value = button.dataset.semicirclePreset;
      $("#semicircle-angle").dispatchEvent(new Event("input"));
    });
  });
  renderUnitSemicircleLab();
}

export function renderUnitSemicircleLab() {
  const angle = Number($("#semicircle-angle").value);
  const radian = (angle * Math.PI) / 180;
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  const cx = 260;
  const cy = 250;
  const r = 190;
  const px = cx + r * cos;
  const py = cy - r * sin;
  const mirrorAngle = 180 - angle;
  const mx = cx + r * Math.cos((mirrorAngle * Math.PI) / 180);
  const my = cy - r * Math.sin((mirrorAngle * Math.PI) / 180);
  const arcR = 34;
  const arcEndX = cx + arcR * cos;
  const arcEndY = cy - arcR * sin;
  const round2 = (value) => (Math.abs(value) < 0.005 ? 0 : Math.round(value * 100) / 100);

  $("#semicircle-stage").innerHTML = `
    <svg class="lab-diagram-svg" viewBox="0 0 520 300" role="img" aria-label="半径1の半円上で角θの点の座標を見る図">
      <line class="semi-axis" x1="40" y1="${cy}" x2="490" y2="${cy}"></line>
      <line class="semi-axis" x1="${cx}" y1="${cy + 8}" x2="${cx}" y2="36"></line>
      <path class="semi-arc" d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}"></path>
      <text class="semi-tick" x="${cx - r - 6}" y="${cy + 24}">-1</text>
      <text class="semi-tick" x="${cx - 16}" y="${cy + 24}">0</text>
      <text class="semi-tick" x="${cx + r - 4}" y="${cy + 24}">1</text>
      <text class="semi-tick" x="${cx + 10}" y="${cy - r + 4}">1</text>
      ${angle !== 90 && angle !== 0 && angle !== 180 ? `<circle class="semi-mirror" cx="${mx}" cy="${my}" r="7"></circle><text class="semi-mirror-label" x="${mx + (mirrorAngle > 90 ? -76 : 14)}" y="${my - 10}">${mirrorAngle}°の点</text>` : ""}
      <line class="semi-cos" x1="${cx}" y1="${cy}" x2="${px}" y2="${cy}"></line>
      <line class="semi-sin" x1="${px}" y1="${cy}" x2="${px}" y2="${py}"></line>
      <line class="semi-radius" x1="${cx}" y1="${cy}" x2="${px}" y2="${py}"></line>
      <path class="semi-angle-arc" d="M ${cx + arcR} ${cy} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}"></path>
      <text class="semi-angle-label" x="${cx + 44}" y="${cy - 14}">θ=${angle}°</text>
      <circle class="semi-point" cx="${px}" cy="${py}" r="9"></circle>
      <text class="semi-point-label" x="${px + (angle > 90 ? -150 : 16)}" y="${py - 14}">P(${round2(cos)}, ${round2(sin)})</text>
    </svg>
    <div class="applied-metrics">
      <div class="applied-metric${cos < 0 ? " negative" : ""}"><span>cos θ（x 座標・青）</span><strong>${round2(cos)}</strong></div>
      <div class="applied-metric positive"><span>sin θ（y 座標・橙）</span><strong>${round2(sin)}</strong></div>
      <div class="applied-metric"><span>対称の角 180°−θ</span><strong>${mirrorAngle}°</strong></div>
    </div>
  `;

  const exact = semicircleExactValues[angle];
  const exactText = exact
    ? `この角は正確な値が分かります：\\(\\sin${angle}^\\circ=${exact.sin}\\)、\\(\\cos${angle}^\\circ=${exact.cos}\\)。`
    : "";
  const signText =
    angle < 90
      ? "点は \\(y\\) 軸の右側にあり、\\(\\sin\\) も \\(\\cos\\) も正——直角三角形の定義と同じ値です。"
      : angle === 90
        ? "点は \\(y\\) 軸の真上。\\(\\cos90^\\circ=0\\) になり、ここが符号の変わり目です。"
        : "点が \\(y\\) 軸の左側へ移ったので \\(\\cos\\theta\\)（\\(x\\) 座標）は負、\\(\\sin\\theta\\) は半円の上側だから正のままです。";
  $("#semicircle-result").textContent =
    `角 \\(\\theta=${angle}^\\circ\\) の点の座標は \\((\\cos\\theta,\\ \\sin\\theta)=(${round2(cos)},\\ ${round2(sin)})\\)。${signText}${exactText}`;
  scheduleMathTypeset($("#semicircle-result"));
}

// ---- 格子の道の最短経路ラボ ----

export let latticePathSteps = [];

export function shuffleLatticePath() {
  const right = Number($("#lattice-right").value);
  const up = Number($("#lattice-up").value);
  const steps = [...Array(right).fill("R"), ...Array(up).fill("U")];
  for (let i = steps.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [steps[i], steps[j]] = [steps[j], steps[i]];
  }
  latticePathSteps = steps;
}

export function setupLatticePathLab() {
  ["#lattice-right", "#lattice-up"].forEach((selector) => {
    $(selector).addEventListener("input", () => {
      shuffleLatticePath();
      renderLatticePathLab();
    });
  });
  $("#lattice-shuffle").addEventListener("click", () => {
    shuffleLatticePath();
    renderLatticePathLab();
  });
  shuffleLatticePath();
  renderLatticePathLab();
}

export function renderLatticePathLab() {
  const right = Number($("#lattice-right").value);
  const up = Number($("#lattice-up").value);
  const total = right + up;
  const count = binomial(total, up);
  const cell = Math.min(60, Math.floor(420 / right), Math.floor(230 / up));
  const gridW = right * cell;
  const gridH = up * cell;
  const x0 = Math.round((520 - gridW) / 2);
  const y0 = gridH + 34;
  const viewH = gridH + 74;

  const gridLines = [];
  for (let i = 0; i <= right; i += 1) {
    gridLines.push(`<line class="lattice-grid" x1="${x0 + i * cell}" y1="${y0}" x2="${x0 + i * cell}" y2="${y0 - gridH}"></line>`);
  }
  for (let j = 0; j <= up; j += 1) {
    gridLines.push(`<line class="lattice-grid" x1="${x0}" y1="${y0 - j * cell}" x2="${x0 + gridW}" y2="${y0 - j * cell}"></line>`);
  }

  let cursorX = 0;
  let cursorY = 0;
  const pathLines = latticePathSteps
    .map((step) => {
      const fromX = x0 + cursorX * cell;
      const fromY = y0 - cursorY * cell;
      if (step === "R") cursorX += 1;
      else cursorY += 1;
      const toX = x0 + cursorX * cell;
      const toY = y0 - cursorY * cell;
      return `<line class="lattice-step ${step === "R" ? "right" : "upward"}" x1="${fromX}" y1="${fromY}" x2="${toX}" y2="${toY}"></line>`;
    })
    .join("");

  const arrowChips = latticePathSteps
    .map((step) => `<span class="lattice-arrow ${step === "R" ? "right" : "upward"}">${step === "R" ? "→" : "↑"}</span>`)
    .join("");

  $("#lattice-stage").innerHTML = `
    <div class="lattice-figure">
      <svg class="lab-diagram-svg" viewBox="0 0 520 ${viewH}" role="img" aria-label="碁盤の目の道と、1本の最短経路">
        ${gridLines.join("")}
        ${pathLines}
        <circle class="lattice-node start" cx="${x0}" cy="${y0}" r="9"></circle>
        <circle class="lattice-node goal" cx="${x0 + gridW}" cy="${y0 - gridH}" r="9"></circle>
        <text class="lattice-label" x="${x0 - 14}" y="${y0 + 28}">スタート</text>
        <text class="lattice-label" x="${x0 + gridW - 30}" y="${y0 - gridH - 14}">ゴール</text>
      </svg>
      <div class="lattice-arrows" aria-label="この道順を矢印の列で表したもの">${arrowChips}</div>
    </div>
    <div class="applied-metrics">
      <div class="applied-metric"><span>→ の数</span><strong>${right} 個</strong></div>
      <div class="applied-metric positive"><span>↑ の数</span><strong>${up} 個</strong></div>
      <div class="applied-metric"><span>矢印の合計</span><strong>${total} 歩</strong></div>
      <div class="applied-metric"><span>道順の総数</span><strong>${count} 通り</strong></div>
    </div>
  `;
  $("#lattice-result").textContent =
    `どの道順も「→ を \\(${right}\\) 個、↑ を \\(${up}\\) 個ならべた列」とちょうど1対1に対応します。` +
    `だから道順の総数は、同じものを含む順列 \\(\\dfrac{${total}!}{${right}!\\,${up}!}={}_{${total}}C_{${up}}=${count}\\) 通り——` +
    `「\\(${total}\\) 歩のうち、どの \\(${up}\\) 歩で上へ進むか」を選ぶ組合せです。`;
  scheduleMathTypeset($("#lattice-result"));
}

// ---- 箱ひげ図ラボ ----

export function setupBoxPlotLab() {
  ["#box-median", "#box-lower", "#box-upper"].forEach((selector) => {
    $(selector).addEventListener("input", renderBoxPlotLab);
  });
  renderBoxPlotLab();
}

export function renderBoxPlotLab() {
  const median = Number($("#box-median").value);
  const lower = Number($("#box-lower").value);
  const upper = Number($("#box-upper").value);
  // 11個のデータ：中央値の左右に、それぞれ等間隔で5個ずつ置く。
  const values = [];
  for (let k = -5; k <= 5; k += 1) {
    values.push(median + k * (k < 0 ? lower : upper));
  }
  const min = values[0];
  const q1 = values[2];
  const q3 = values[8];
  const max = values[10];
  const iqr = q3 - q1;
  const toX = (value) => 40 + value * 4.4;

  const dotY = 92;
  const boxTop = 170;
  const boxBottom = 230;
  const whiskerY = (boxTop + boxBottom) / 2;
  // ラベルは上下2段の互い違いにして、値が近いときの重なりを避ける。
  const guides = [
    { value: min, label: "最小値", tier: 0 },
    { value: q1, label: "Q1", tier: 1 },
    { value: median, label: "中央値", tier: 0 },
    { value: q3, label: "Q3", tier: 1 },
    { value: max, label: "最大値", tier: 0 },
  ];

  $("#box-plot-stage").innerHTML = `
    <svg class="lab-diagram-svg" viewBox="0 0 520 320" role="img" aria-label="11個のデータの点と、対応する箱ひげ図">
      ${[0, 20, 40, 60, 80, 100]
        .map((tick) => `<line class="boxplot-tick" x1="${toX(tick)}" y1="278" x2="${toX(tick)}" y2="286"></line><text class="boxplot-tick-label" x="${toX(tick) - 10}" y="304">${tick}</text>`)
        .join("")}
      <line class="boxplot-axis" x1="36" y1="278" x2="488" y2="278"></line>
      ${guides
        .map((guide) => `<line class="boxplot-guide" x1="${toX(guide.value)}" y1="${dotY + 14}" x2="${toX(guide.value)}" y2="${boxTop - 8}"></line><text class="boxplot-guide-label" x="${toX(guide.value) - 20}" y="${guide.tier === 0 ? dotY - 40 : dotY - 18}">${guide.label}</text>`)
        .join("")}
      ${values.map((value) => `<circle class="boxplot-dot" cx="${toX(value)}" cy="${dotY}" r="7"></circle>`).join("")}
      <line class="boxplot-whisker" x1="${toX(min)}" y1="${whiskerY}" x2="${toX(q1)}" y2="${whiskerY}"></line>
      <line class="boxplot-whisker" x1="${toX(q3)}" y1="${whiskerY}" x2="${toX(max)}" y2="${whiskerY}"></line>
      <line class="boxplot-cap" x1="${toX(min)}" y1="${boxTop + 12}" x2="${toX(min)}" y2="${boxBottom - 12}"></line>
      <line class="boxplot-cap" x1="${toX(max)}" y1="${boxTop + 12}" x2="${toX(max)}" y2="${boxBottom - 12}"></line>
      <rect class="boxplot-box" x="${toX(q1)}" y="${boxTop}" width="${toX(q3) - toX(q1)}" height="${boxBottom - boxTop}"></rect>
      <line class="boxplot-median" x1="${toX(median)}" y1="${boxTop}" x2="${toX(median)}" y2="${boxBottom}"></line>
    </svg>
    <div class="applied-metrics">
      <div class="applied-metric"><span>最小値</span><strong>${min}</strong></div>
      <div class="applied-metric"><span>Q1</span><strong>${q1}</strong></div>
      <div class="applied-metric positive"><span>中央値</span><strong>${median}</strong></div>
      <div class="applied-metric"><span>Q3</span><strong>${q3}</strong></div>
      <div class="applied-metric"><span>最大値</span><strong>${max}</strong></div>
      <div class="applied-metric"><span>四分位範囲</span><strong>${iqr}</strong></div>
    </div>
  `;
  const skewText =
    lower === upper
      ? "いまは左右対称なので、箱もひげも左右で同じ長さです。"
      : lower < upper
        ? "上側の間隔の方が広いので、箱とひげが右へ長く伸びています——データが大きい側に散らばっているしるしです。"
        : "下側の間隔の方が広いので、箱とひげが左へ長く伸びています——データが小さい側に散らばっているしるしです。";
  $("#box-plot-result").textContent =
    `11個のデータのうち、箱（\\(Q_1=${q1}\\) から \\(Q_3=${q3}\\)）には両端を含めて7個——まん中の約半分——が入っています。` +
    `箱の長さが四分位範囲 \\(Q_3-Q_1=${iqr}\\) です。${skewText}`;
  scheduleMathTypeset($("#box-plot-result"));
}

// ---- Σの階段ラボ ----

export function setupSigmaStairsLab() {
  ["#stairs-n", "#stairs-mode"].forEach((selector) => {
    $(selector).addEventListener("input", renderSigmaStairsLab);
  });
  renderSigmaStairsLab();
}

export function renderSigmaStairsLab() {
  const n = Number($("#stairs-n").value);
  const paired = $("#stairs-mode").value === "pair";
  const sum = (n * (n + 1)) / 2;
  const cell = Math.min(34, Math.floor(400 / n), Math.floor(230 / (n + 1)));
  const gridW = n * cell;
  const gridH = (n + 1) * cell;
  const x0 = Math.round((520 - gridW) / 2);
  const y0 = gridH + 8;
  const viewH = gridH + 64;

  const blocks = [];
  for (let column = 1; column <= n; column += 1) {
    for (let row = 1; row <= (paired ? n + 1 : column); row += 1) {
      const isOriginal = row <= column;
      blocks.push(
        `<rect class="stairs-block ${isOriginal ? "original" : "flipped"}" x="${x0 + (column - 1) * cell + 1}" y="${y0 - row * cell + 1}" width="${cell - 2}" height="${cell - 2}" rx="4"></rect>`,
      );
    }
  }
  const columnLabels =
    cell >= 22
      ? Array.from({ length: n }, (_, index) => `<text class="stairs-count" x="${x0 + index * cell + cell / 2 - 5}" y="${y0 + 24}">${index + 1}</text>`).join("")
      : "";

  $("#sigma-stairs-stage").innerHTML = `
    <svg class="lab-diagram-svg" viewBox="0 0 520 ${viewH}" role="img" aria-label="1段からn段まで増える階段の図">
      ${blocks.join("")}
      ${columnLabels}
      ${
        paired
          ? `<text class="stairs-side-label" x="${x0 - 10}" y="${y0 - gridH / 2}" text-anchor="end">縦 ${n + 1}</text><text class="stairs-side-label" x="${x0 + gridW / 2 - 20}" y="${y0 + 46}">横 ${n}</text>`
          : ""
      }
    </svg>
    <div class="applied-metrics">
      <div class="applied-metric"><span>段の数 n</span><strong>${n}</strong></div>
      <div class="applied-metric positive"><span>青の石（1+2+…+${n}）</span><strong>${sum} 個</strong></div>
      ${paired ? `<div class="applied-metric"><span>長方形ぜんぶ（${n}×${n + 1}）</span><strong>${n * (n + 1)} 個</strong></div>` : ""}
    </div>
  `;
  $("#sigma-stairs-result").textContent = paired
    ? `橙の逆さ階段を重ねると、どの列もちょうど \\(${n + 1}\\) 個になり、横 \\(${n}\\) 列の長方形——石は全部で \\(${n}\\times${n + 1}=${n * (n + 1)}\\) 個です。` +
      `青はその半分なので \\(1+2+\\cdots+${n}=\\dfrac{${n}\\times${n + 1}}{2}=${sum}\\)。公式 \\(\\sum_{k=1}^{n}k=\\dfrac{n(n+1)}{2}\\) は、この絵の式です。`
    : `階段の石は \\(1+2+\\cdots+${n}=${sum}\\) 個。1列ずつ数えるのは大変です。「逆さの階段を重ねる」に切り替えると、数えなくても分かる形に変わります。`;
  scheduleMathTypeset($("#sigma-stairs-result"));
}

export function stackLegendMarkup(segments) {
  return `<div class="stack-legend">${segments
    .filter((segment) => segment.value > 0)
    .map(
      (segment) =>
        `<span><i class="${segment.kind}"></i>${escapeHtml(segment.label)} ${escapeHtml(segment.valueText)}</span>`,
    )
    .join("")}</div>`;
}

export function setupAppliedLabs() {
  ["#loan-mode", "#loan-principal", "#loan-rate", "#loan-months"].forEach((selector) => {
    $(selector).addEventListener("input", renderLoanLab);
  });
  ["#account-price", "#account-quantity", "#account-cost", "#account-fixed"].forEach((selector) => {
    $(selector).addEventListener("input", renderAccountingLab);
  });
  ["#speed-rate", "#speed-hours"].forEach((selector) => {
    $(selector).addEventListener("input", renderSpeedLab);
  });
  ["#data-center", "#data-spread", "#data-outlier"].forEach((selector) => {
    $(selector).addEventListener("input", renderDataSpreadLab);
  });
  renderLoanLab();
  renderAccountingLab();
  renderSpeedLab();
  renderDataSpreadLab();
}

export function renderLoanLab() {
  const mode = $("#loan-mode").value;
  const isCompound = mode === "compound";
  const principalInMan = Number($("#loan-principal").value);
  const rate = Number($("#loan-rate").value);
  const months = Number($("#loan-months").value);
  const years = months / 12;
  // 単利は「元金 × 年率 × 年数」。複利は「元金 ×（1＋年率）^年数」で、利息が元金に組み入れられていく。
  const totalInMan = isCompound
    ? principalInMan * (1 + rate / 100) ** years
    : principalInMan + principalInMan * (rate / 100) * years;
  const interestInMan = totalInMan - principalInMan;
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
      <div class="applied-metric"><span>利息（${isCompound ? "複利" : "単利"}）</span><strong>${formatYen(interest)}</strong></div>
      <div class="applied-metric positive"><span>合計</span><strong>${formatYen(total)}</strong></div>
    </div>
    ${stackedBarMarkup(segments, `元金 ${formatYen(principal)} と利息 ${formatYen(interest)} の内訳`)}
    ${stackLegendMarkup(segments)}
    <p class="applied-caution">${
      isCompound
        ? "複利は、付いた利息を元金に組み入れて翌年の利率をかける方式です。残高は等比数列（初項＝元金、公比＝1＋年率）として増えます。期間を長くして、単利との差を見比べてみましょう。"
        : "単利は「元金 × 年率 × 年数」で利息を置く方式です。利息は一次関数的（同じ額ずつ）にしか増えません。複利に切り替えて違いを見てみましょう。"
    }</p>
  `;
  $("#loan-result").textContent = isCompound
    ? `複利のモデルでは、合計は \\(${principalInMan}\\times${(1 + rate / 100).toFixed(2)}^{${compactNumber(years)}}\\approx${compactNumber(Math.round(totalInMan * 10) / 10)}\\) 万円です。利息が利息を生むので、同じ年率でも期間が長いほど単利との差が開きます。`
    : `単利のモデルでは、利息は \\(${principalInMan}\\times${(rate / 100).toFixed(2)}\\times${compactNumber(years)}=${compactNumber(Math.round(interestInMan * 10) / 10)}\\) 万円です。合計 \\(${compactNumber(Math.round(totalInMan * 10) / 10)}\\) 万円を ${months} か月で等しく分けると、1か月あたりは約 ${formatYen(monthly)} です。`;
  scheduleMathTypeset($("#loan-result"));
}

export function renderAccountingLab() {
  const price = Number($("#account-price").value) * 100;
  const quantity = Number($("#account-quantity").value);
  const unitCost = Number($("#account-cost").value) * 100;
  const fixedCost = Number($("#account-fixed").value) * 100;
  const sales = price * quantity;
  const variableCost = unitCost * quantity;
  const cost = variableCost + fixedCost;
  const profit = sales - cost;
  const segments = [
    { label: "製造費用（1個ごと）", kind: "variable", value: variableCost, valueText: formatYen(variableCost) },
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
    `売上は \\(${price}\\times${quantity}=${sales}\\) 円です。費用（作る・売るのにかかるお金）は、1個ごとの製造費用と固定の費用を合わせて \\(${unitCost}\\times${quantity}+${fixedCost}=${cost}\\) 円。${profit >= 0 ? "利益" : "損失"}は \\(${sales}-${cost}=${profit}\\) 円です。`;
  scheduleMathTypeset($("#accounting-result"));
}

export function renderSpeedLab() {
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
      <span class="speed-marker">ここまで ${distance} km</span>
      <div class="speed-road-labels"><span>出発 0 km</span><span>同じ速さで進む</span><span>目盛りの右端 600 km</span></div>
    </div>
  `;
  $("#speed-result").textContent = `速さが一定なら、道のりは \\(${rate}\\times${hours}=${distance}\\) km です。時間を1時間増やすごとに、道のりは ${rate} km ずつ増えます。`;
  scheduleMathTypeset($("#speed-result"));
}

export function renderDataSpreadLab() {
  const center = Number($("#data-center").value);
  const spread = Number($("#data-spread").value);
  const outlier = Number($("#data-outlier").value);
  const halfSpread = spread / 2;
  // 外れ値は一番大きい値だけを引き上げる。平均は動くが、中央値（3番目）は動かない。
  const values = [center - spread, center - halfSpread, center, center + halfSpread, center + spread + outlier];
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const min = center - Math.max(spread + 10, 30);
  const max = center + Math.max(spread + outlier + 10, 30);
  const range = values.at(-1) - values[0];
  const median = values[2];
  const squaredDeviations = values.map((value) => Math.round((value - mean) ** 2 * 100) / 100);
  const variance = squaredDeviations.reduce((sum, value) => sum + value, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  const meanText = compactNumber(Math.round(mean * 10) / 10);
  const points = values
    .map((value, index) => {
      const position = ((value - min) / (max - min)) * 100;
      return `<span class="data-point" style="left: ${position}%" aria-label="${index + 1}番目の値 ${value}">${value}</span>`;
    })
    .join("");
  const meanPosition = ((mean - min) / (max - min)) * 100;
  const medianPosition = ((median - min) / (max - min)) * 100;

  $("#data-spread-stage").innerHTML = `
    <div class="applied-metrics">
      <div class="applied-metric"><span>平均</span><strong>${meanText}</strong></div>
      <div class="applied-metric"><span>中央値</span><strong>${median}</strong></div>
      <div class="applied-metric"><span>範囲</span><strong>${range}</strong></div>
      <div class="applied-metric"><span>分散</span><strong>${compactNumber(Math.round(variance * 10) / 10)}</strong></div>
      <div class="applied-metric positive"><span>標準偏差</span><strong>${standardDeviation.toFixed(2)}</strong></div>
    </div>
    <div class="data-axis" role="img" aria-label="最小 ${values[0]}、最大 ${values.at(-1)} の五つの値を並べた数直線">
      ${points}
      <span class="data-mean-marker" style="left: ${meanPosition}%" title="平均 ${meanText}">▲</span>
      <span class="data-median-marker" style="left: ${medianPosition}%" title="中央値 ${median}">▼</span>
    </div>
    <div class="data-axis-labels"><span>${min}</span><span><span class="tag-teal-text">▼中央値 ${median}</span>｜<span class="tag-orange-text">▲平均 ${meanText}</span></span><span>${max}</span></div>
  `;
  $("#data-spread-result").textContent =
    outlier > 0
      ? `外れ値で一番大きい値だけを \\(${outlier}\\) 引き上げました。平均は \\((${values.join("+")})\\div5=${meanText}\\) と右へ動きますが、中央値（小さい順で3番目）は \\(${median}\\) のまま動きません。極端な値に平均は引っぱられ、中央値は動きにくい——これが2つの代表値の性格の違いです。`
      : `平均は合計を個数で割って \\((${values.join("+")})\\div5=${meanText}\\) です。いまは値が左右対称なので、平均と中央値 \\(${median}\\) が一致しています。「外れ値」スライダーを動かして、2つがずれる様子を見てみましょう。範囲は \\(${values.at(-1)}-${values[0]}=${range}\\) です。`;
  scheduleMathTypeset($("#data-spread-result"));
}

export function renderLabPicker() {
  const wrap = $("#lab-picker");
  wrap.innerHTML = labs
    .map(
      (lab) =>
        `<button class="lab-picker-button${lab.id === state.activeLabId ? " active" : ""}" type="button" data-select-lab="${escapeHtml(lab.id)}" aria-pressed="${lab.id === state.activeLabId}"><span>${escapeHtml(lab.category)}</span><strong>${escapeHtml(lab.short)}</strong></button>`,
    )
    .join("");
}

export function renderLabLearningActions(labId) {
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

export function selectLab(labId, { scroll = false } = {}) {
  if (!labCatalog[labId]) return;
  state.activeLabId = labId;
  const lab = document.getElementById(labId);
  $$(".lab-card").forEach((card) => {
    card.hidden = card.id !== labId;
    card.classList.remove("lab-focus");
  });
  renderLabPicker();
  renderLabLearningActions(labId);
  if (scroll && lab) {
    window.setTimeout(() => jumpToTop(lab), 80);
  }
}

export function setupLabs() {
  renderLabPicker();
  selectLab(state.activeLabId);
}

export function focusLab(labId) {
  selectLab(labId, { scroll: true });
  const lab = document.getElementById(labId);
  if (!lab) return;
  lab.classList.add("lab-focus");
  window.setTimeout(() => lab.classList.remove("lab-focus"), 2200);
}

export function setLabView(view) {
  $("#lab-index").hidden = view !== "index";
  $(".lab-shell").hidden = view === "index";
}

export function renderLabIndex() {
  const wrap = $("#lab-index");
  wrap.innerHTML = labs
    .map(
      (lab) => `
        <a class="index-card" href="#labs/${encodeURIComponent(lab.id)}">
          <span class="index-card-meta">${escapeHtml(lab.category)}</span>
          <strong>${formatTextWithMath(lab.title)}</strong>
          <span class="index-card-summary">${formatTextWithMath(`${lab.objectIntro}。${lab.observe}。`)}</span>
        </a>
      `,
    )
    .join("");
  scheduleMathTypeset(wrap);
}
