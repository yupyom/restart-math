// 学習マップの描画。
import { units } from "../../content/lessons.js";
import { topics, categoryLabels } from "../../content/topics.js";
import { state } from "./state.js";
import { $, $$, jumpToTop, scheduleMathTypeset } from "./utils.js";
import { activatePage } from "./nav.js";
import { formatTextWithMath } from "./format.js";
import { renderUnit, setHashForUnit, setLessonView } from "./lessons-view.js";

export function setupMap() {
  ["#map-category", "#map-level"].forEach((selector) => {
    $(selector).addEventListener("change", () => {
      state.activeMapPage = 0;
      renderMap();
    });
  });
  $("#prev-map").addEventListener("click", () => {
    state.activeMapPage = Math.max(0, state.activeMapPage - 1);
    renderMap();
  });
  $("#next-map").addEventListener("click", () => {
    state.activeMapPage += 1;
    renderMap();
  });
  renderMap();
}

export function filteredTopics() {
  const category = $("#map-category").value;
  const level = $("#map-level").value;
  return topics.filter((topic) => {
    const categoryOk = category === "all" || topic.category === category;
    const levelOk = level === "all" || String(topic.level) === level;
    return categoryOk && levelOk;
  });
}

export function renderMap() {
  const pageSize = 8;
  const items = filteredTopics();
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  state.activeMapPage = Math.min(state.activeMapPage, totalPages - 1);
  const pageItems = items.slice(state.activeMapPage * pageSize, state.activeMapPage * pageSize + pageSize);
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
        state.activeLessonRange = null;
        state.activeUnit = index;
        setLessonView("unit");
        renderUnit();
        activatePage("lessons");
        setHashForUnit(index);
        jumpToTop();
      }
    });
  });

  $("#map-page-label").textContent = `${state.activeMapPage + 1} / ${totalPages}`;
  $("#prev-map").disabled = state.activeMapPage === 0;
  $("#next-map").disabled = state.activeMapPage >= totalPages - 1;
  scheduleMathTypeset($("#topic-grid"));
}
