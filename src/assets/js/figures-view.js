// 数学者図鑑の描画と一覧・切替。
import { units } from "../../content/lessons.js";
import { labs, labCatalog } from "../../content/labs.js";
import { stories, storyCatalog } from "../../content/stories.js";
import { figures, figureCatalog } from "../../content/figures.js";
import { state } from "./state.js";
import { $, scheduleMathTypeset } from "./utils.js";
import { routeHash } from "./nav.js";
import { escapeHtml, formatTextWithMath } from "./format.js";
import { linkifyGlossaryTerms } from "./glossary-links.js";
import { renderDetailPager } from "./pager.js";

export function renderFigureIndex() {
  const wrap = $("#figure-index");
  if (!wrap) return;
  const cards = figures
    .map(
      (figure) => `
        <a class="index-card figure-card" href="#figures/${encodeURIComponent(figure.id)}">
          <img class="figure-card-portrait" src="${escapeHtml(figure.portrait.src)}" alt="${escapeHtml(figure.portrait.alt)}" loading="lazy" width="72" height="72" />
          <span class="figure-card-body">
            <span class="index-card-meta">${escapeHtml(figure.era)}</span>
            <strong>${escapeHtml(figure.name)}</strong>
            <span class="index-card-summary">${formatTextWithMath(figure.achievement || "")}</span>
          </span>
        </a>
      `,
    )
    .join("");
  wrap.innerHTML = `${cards}<p class="figure-index-note">※ 肖像は史料をもとにした親しみやすいデフォルメ表現で、厳密な肖像資料ではありません。</p>`;
  scheduleMathTypeset(wrap);
}

export function renderFigure() {
  const figure = figureCatalog[state.activeFigureId] || figures[0];
  if (!figure) return;
  const wrap = $("#figure-content");
  const storyActions = (figure.related?.stories || [])
    .map((id) => storyCatalog[id])
    .filter(Boolean)
    .map(
      (story) =>
        `<button class="learning-action primary" type="button" data-open-story="${escapeHtml(story.id)}">読み物へ：${formatTextWithMath(story.menuTitle || story.title)}</button>`,
    );
  const figureActions = (figure.related?.figures || [])
    .map((id) => figureCatalog[id])
    .filter(Boolean)
    .map(
      (person) =>
        `<button class="learning-action" type="button" data-open-figure="${escapeHtml(person.id)}">${escapeHtml(person.name)}</button>`,
    );
  const lessonActions = (figure.related?.lessons || [])
    .map((lessonId) => units.find((unit) => unit.id === lessonId))
    .filter(Boolean)
    .map(
      (lesson) =>
        `<button class="learning-action" type="button" data-open-lesson="${escapeHtml(lesson.id)}">単元へ：${formatTextWithMath(lesson.title)}</button>`,
    );
  const labActions = (figure.related?.labs || [])
    .map((labId) => labCatalog[labId])
    .filter(Boolean)
    .map(
      (lab) => `<button class="learning-action" type="button" data-open-lab="${escapeHtml(lab.id)}">図解へ：${escapeHtml(lab.short)}</button>`,
    );

  const metaLine = [figure.era, figure.region]
    .filter(Boolean)
    .map((item) => `<span>${escapeHtml(item)}</span>`)
    .join("");
  const profile = (figure.profile || []).map((text) => `<p>${formatTextWithMath(text)}</p>`).join("");
  const contributions = (figure.contributions || []).map((text) => `<p>${formatTextWithMath(text)}</p>`).join("");
  const source = figure.source
    ? figure.source.url
      ? `<aside class="story-sources"><h4>出典</h4><ul><li><a href="${escapeHtml(figure.source.url)}" target="_blank" rel="noreferrer">${escapeHtml(figure.name)} の伝記</a>（${escapeHtml(figure.source.publisher)}）</li></ul></aside>`
      : `<aside class="story-sources"><h4>出典</h4><p class="story-source-note">${escapeHtml(figure.source.publisher)}</p></aside>`
    : "";

  const relatedGroups = [];
  if (storyActions.length)
    relatedGroups.push(`<div class="figure-related-group"><h4>関連する読み物</h4><div class="learning-action-list">${storyActions.join("")}</div></div>`);
  if (figureActions.length)
    relatedGroups.push(`<div class="figure-related-group"><h4>関連する数学者</h4><div class="learning-action-list">${figureActions.join("")}</div></div>`);
  const materialActions = [...lessonActions, ...labActions];
  if (materialActions.length)
    relatedGroups.push(`<div class="figure-related-group"><h4>関連する単元・図解</h4><div class="learning-action-list">${materialActions.join("")}</div></div>`);

  wrap.innerHTML = `
    <button type="button" class="text-button back-to-index" data-back-to-list="figures">← 数学者図鑑の一覧へ</button>
    <p class="story-kicker">数学者図鑑</p>
    <div class="figure-detail-head">
      <figure class="figure-detail-portrait"><img src="${escapeHtml(figure.portrait.src)}" alt="${escapeHtml(figure.portrait.alt)}" loading="lazy" width="480" height="480" /></figure>
      <div class="figure-detail-titles">
        <h3>${escapeHtml(figure.name)}</h3>
        <p class="figure-detail-reading">${escapeHtml(figure.reading || "")}</p>
        <p class="figure-detail-meta">${metaLine}</p>
        <p class="figure-detail-achievement">${formatTextWithMath(figure.achievement || "")}</p>
      </div>
    </div>
    <section class="figure-section"><h4>プロフィール</h4>${profile}</section>
    <section class="figure-section"><h4>数学的な発見への寄与</h4>${contributions}</section>
    ${source}
    <section class="figure-related" aria-label="関連する教材と人物">${relatedGroups.join("")}</section>
    <div class="pager detail-pager" id="figure-pager"></div>
  `;
  renderDetailPager($("#figure-pager"), {
    items: figures,
    activeId: figure.id,
    onSelect: (id) => { location.hash = routeHash("figures", id); },
    prevLabel: "前の人物",
    nextLabel: "次の人物",
    ariaLabel: "数学者の前後移動",
  });
  linkifyGlossaryTerms(wrap);
  scheduleMathTypeset(wrap);
}

export function renderFigurePicker() {
  const wrap = $("#figure-picker");
  if (!wrap) return;
  wrap.innerHTML = "";
  figures.forEach((figure) => {
    const button = document.createElement("button");
    const isActive = figure.id === state.activeFigureId;
    button.type = "button";
    button.className = `figure-picker-button${isActive ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(isActive));
    button.innerHTML = `<img class="figure-picker-thumb" src="${escapeHtml(figure.portrait.src)}" alt="" loading="lazy" width="40" height="40" /><span class="figure-picker-text"><strong>${escapeHtml(figure.name)}</strong><span>${escapeHtml(figure.era)}</span></span>`;
    button.addEventListener("click", () => {
      if (figure.id !== state.activeFigureId) location.hash = routeHash("figures", figure.id);
    });
    wrap.append(button);
  });
}

export function setupFigures() {
  renderFigurePicker();
  renderFigure();
}

export function setFigureView(view) {
  $("#figure-index").hidden = view !== "index";
  $(".figure-shell").hidden = view === "index";
}
