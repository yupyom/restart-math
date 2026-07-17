// 単元ノートの描画と一覧・切替。
import { units } from "../../content/lessons.js";
import { labCatalog } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { stories, storyCatalog } from "../../content/stories.js";
import { state } from "./state.js";
import { $, jumpToTop, scheduleMathTypeset, toggleSectionLead } from "./utils.js";
import { routeHash } from "./nav.js";
import { escapeHtml, formatTextWithMath, term, workedExampleMarkup } from "./format.js";
import { linkifyGlossaryTerms } from "./glossary-links.js";
import { renderPageNumbers } from "./pager.js";
import { readRoute } from "./router.js";

export function rangeTags(unit) {
  const uniqueRange = [...new Set(unit.range)];
  return `<div class="range-tags">${uniqueRange.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

export function geometryModelShell(model, illustration) {
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

export function circleAngleModelMarkup(model) {
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

export function rightTriangleModelMarkup(model) {
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

export function lineGraphModelMarkup(model) {
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

export function unitModelMarkup(unit) {
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

export function confirmationMarkup(unit) {
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

export function unitMetaLabel(unit) {
  const range = [...new Set(unit.range)].join("・");
  return unit.stage === range ? range : `${unit.stage} / ${range}`;
}

export function visibleUnits() {
  if (!state.activeLessonRange) return units;
  if (state.activeLessonRange === "中学") {
    return units.filter((unit) => unit.range.some((range) => /^中[123]$/.test(range) || range === "中学総合"));
  }
  return units.filter((unit) => unit.range.includes(state.activeLessonRange));
}

export function updateLessonFilterStatus() {
  const status = $("#lesson-filter-status");
  if (!status) return;
  status.hidden = !state.activeLessonRange;
  $("#lesson-filter-label").textContent = state.activeLessonRange ? `${state.activeLessonRange} に関係する単元を表示中` : "";
}

export function learningActionsMarkup(unit) {
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

export function contextCardsMarkup(unit) {
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

export function setHashForUnit(index) {
  const unit = units[index];
  if (!unit) return;
  const hash = routeHash("lessons", unit.id);
  if (location.hash === hash) return;
  // ブラウザバックで前の単元へ戻れるよう、履歴に残す。
  // pushState は hashchange を発火させないので、呼び出し側の描画と二重にはならない。
  history.pushState(null, "", hash);
}

export function renderUnitButtons() {
  const wrap = $("#unit-buttons");
  wrap.innerHTML = "";
  visibleUnits().forEach((unit) => {
    const index = units.findIndex((item) => item.id === unit.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `unit-button${index === state.activeUnit ? " active" : ""}`;
    button.innerHTML = `<strong>${index + 1}. ${formatTextWithMath(unit.title)}</strong><span>${formatTextWithMath(unitMetaLabel(unit))}</span>`;
    button.addEventListener("click", () => {
      state.activeUnit = index;
      renderUnit();
      setHashForUnit(index);
      jumpToTop();
    });
    wrap.append(button);
  });
}

export function renderDots() {
  const wrap = $("#unit-dots");
  const available = visibleUnits();
  const activeIndex = available.findIndex((unit) => units[state.activeUnit]?.id === unit.id);
  // 全 62 単元の番号を並べるとスクロールが増えるので、現在地の前後だけを窓で見せる。
  renderPageNumbers(wrap, {
    items: available,
    activeIndex,
    onSelect: (unitId) => {
      state.activeUnit = units.findIndex((item) => item.id === unitId);
      renderUnit();
      setHashForUnit(state.activeUnit);
      jumpToTop();
    },
  });
}

export function renderUnit() {
  const availableUnits = visibleUnits();
  if (!availableUnits.some((unit) => unit.id === units[state.activeUnit]?.id)) {
    state.activeUnit = units.findIndex((unit) => unit.id === availableUnits[0]?.id);
  }
  const unit = units[state.activeUnit];
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

  linkifyGlossaryTerms($("#unit-content"), unit.id);
  $("#prev-unit").disabled = visibleIndex === 0;
  $("#next-unit").disabled = visibleIndex === availableUnits.length - 1;
  updateLessonFilterStatus();
  renderUnitButtons();
  renderDots();
  scheduleMathTypeset($("#unit-content"));
  scheduleMathTypeset($("#unit-buttons"));
}

export function setupLessons() {
  const route = readRoute();
  const routeIndex = units.findIndex((unit) => unit.id === route.id);
  if (route.page === "lessons" && routeIndex >= 0) state.activeUnit = routeIndex;

  $("#prev-unit").addEventListener("click", () => {
    const availableUnits = visibleUnits();
    const index = availableUnits.findIndex((unit) => unit.id === units[state.activeUnit].id);
    state.activeUnit = units.findIndex((unit) => unit.id === availableUnits[Math.max(0, index - 1)].id);
    renderUnit();
    setHashForUnit(state.activeUnit);
    jumpToTop();
  });
  $("#next-unit").addEventListener("click", () => {
    const availableUnits = visibleUnits();
    const index = availableUnits.findIndex((unit) => unit.id === units[state.activeUnit].id);
    state.activeUnit = units.findIndex((unit) => unit.id === availableUnits[Math.min(availableUnits.length - 1, index + 1)].id);
    renderUnit();
    setHashForUnit(state.activeUnit);
    jumpToTop();
  });
  $("#clear-lesson-filter").addEventListener("click", () => {
    state.activeLessonRange = null;
    if ($("#lesson-index").hidden) {
      renderUnit();
      const hash = routeHash("lessons", units[state.activeUnit].id);
      if (location.hash !== hash) history.pushState(null, "", hash);
    } else {
      renderLessonIndex();
      if (location.hash !== "#lessons") history.pushState(null, "", "#lessons");
    }
  });

  renderUnit();
}

// 一覧（インデックス）と本文の表示を切り替える。IDなしの #lessons / #stories は一覧を出す。
export function setLessonView(view) {
  $("#lesson-index").hidden = view !== "index";
  $(".lesson-shell").hidden = view === "index";
  toggleSectionLead("lessons", view === "index");
}

export function renderLessonIndex() {
  const wrap = $("#lesson-index");
  wrap.innerHTML = visibleUnits()
    .map((unit) => {
      const number = units.findIndex((item) => item.id === unit.id) + 1;
      return `
        <a class="index-card" href="#lessons/${encodeURIComponent(unit.id)}">
          <span class="index-card-meta">${number}. ${escapeHtml(unitMetaLabel(unit))}</span>
          <strong>${formatTextWithMath(unit.title)}</strong>
          <span class="index-card-summary">${formatTextWithMath(unit.summary)}</span>
        </a>
      `;
    })
    .join("");
  updateLessonFilterStatus();
  scheduleMathTypeset(wrap);
}
