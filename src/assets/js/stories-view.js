// 読み物の描画と一覧・切替。
import { units } from "../../content/lessons.js";
import { labCatalog } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { stories, storyCatalog } from "../../content/stories.js";
import { state } from "./state.js";
import { $, scheduleMathTypeset, toggleSectionLead } from "./utils.js";
import { routeHash } from "./nav.js";
import { escapeHtml, formatTextWithMath } from "./format.js";
import { linkifyGlossaryTerms } from "./glossary-links.js";
import { renderDetailPager } from "./pager.js";

export const storyTypeLabels = {
  rule: "ルールの物語",
  notation: "記法の読み方",
  history: "数学の背景と歴史",
  society: "社会とのつながり",
};

export function renderStory() {
  const story = storyCatalog[state.activeStoryId] || stories[0];
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

  const portraits = story.portraits?.length
    ? `<div class="story-portraits">${story.portraits
        .map(
          (portrait) =>
            `<figure class="story-portrait"><img src="${escapeHtml(portrait.src)}" alt="${escapeHtml(portrait.alt)}" loading="lazy" width="480" height="480" /><figcaption>${escapeHtml(portrait.caption)}</figcaption></figure>`,
        )
        .join("")}</div>`
    : "";

  wrap.innerHTML = `
    <button type="button" class="text-button back-to-index" data-back-to-list="stories">← 読み物の一覧へ</button>
    <p class="story-kicker">${escapeHtml(storyTypeLabels[story.type] || "読み物")}</p>
    <h3>${formatTextWithMath(story.title)}</h3>
    ${portraits}
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
    <div class="pager detail-pager" id="story-pager"></div>
  `;
  renderDetailPager($("#story-pager"), {
    items: stories,
    activeId: story.id,
    onSelect: (id) => { location.hash = routeHash("stories", id); },
    prevLabel: "前の読み物",
    nextLabel: "次の読み物",
    ariaLabel: "読み物の前後移動",
  });
  linkifyGlossaryTerms(wrap);
  scheduleMathTypeset(wrap);
}

export function renderStoryPicker() {
  const wrap = $("#story-picker");
  wrap.innerHTML = "";
  stories.forEach((story) => {
    const button = document.createElement("button");
    const isActive = story.id === state.activeStoryId;
    button.type = "button";
    button.className = `story-picker-button${isActive ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(isActive));
    button.innerHTML = `<span>${escapeHtml(storyTypeLabels[story.type] || "読み物")}</span><strong>${formatTextWithMath(story.menuTitle || story.title)}</strong>`;
    button.addEventListener("click", () => {
      if (story.id !== state.activeStoryId) location.hash = routeHash("stories", story.id);
    });
    wrap.append(button);
  });
  scheduleMathTypeset(wrap);
}

export function setupStories() {
  renderStoryPicker();
  renderStory();
}

export function setStoryView(view) {
  $("#story-index").hidden = view !== "index";
  $(".story-shell").hidden = view === "index";
  toggleSectionLead("stories", view === "index");
}

export function renderStoryIndex() {
  const wrap = $("#story-index");
  wrap.innerHTML = stories
    .map(
      (story) => `
        <a class="index-card" href="#stories/${encodeURIComponent(story.id)}">
          <span class="index-card-meta">${escapeHtml(storyTypeLabels[story.type] || "読み物")}</span>
          <strong>${formatTextWithMath(story.title)}</strong>
          <span class="index-card-summary">${formatTextWithMath(story.lead)}</span>
        </a>
      `,
    )
    .join("");
  scheduleMathTypeset(wrap);
}
