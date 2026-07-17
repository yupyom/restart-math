// ハッシュルーティングと全ページ共通のクリック結線。
import { units } from "../../content/lessons.js";
import { labs, labCatalog } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { stories, storyCatalog } from "../../content/stories.js";
import { figures, figureCatalog } from "../../content/figures.js";
import { state } from "./state.js";
import { $$, jumpToTop } from "./utils.js";
import { activatePage, pageIds, routeHash } from "./nav.js";
import { renderLessonIndex, renderUnit, setLessonView } from "./lessons-view.js";
import { focusLab, renderLabIndex, selectLab, setLabView } from "./labs-view.js";
import { renderPracticeIndex, setActivePracticeMode, setPracticeView } from "./practice-view.js";
import { renderStory, renderStoryIndex, renderStoryPicker, setStoryView } from "./stories-view.js";
import { renderFigure, renderFigureIndex, renderFigurePicker, setFigureView } from "./figures-view.js";

export function readRoute() {
  const raw = decodeURIComponent(location.hash.replace("#", ""));
  if (!raw || raw === "top" || raw === "roadmap") return { page: "home" };

  const [page, id, range] = raw.split("/");
  if (page === "lessons" && id === "range" && range) return { page, rangeFilter: range };
  if (page === "lessons" && (!id || units.some((unit) => unit.id === id))) return { page, id };
  if (page === "labs" && (!id || labCatalog[id])) return { page, id };
  if (page === "practice" && (!id || practiceCatalog.some((practice) => practice.id === id))) return { page, id };
  if (page === "stories" && (!id || storyCatalog[id])) return { page, id };
  if (page === "figures" && (!id || figureCatalog[id])) return { page, id };
  if (pageIds.includes(raw)) return { page: raw };

  // 以前の #単元ID / #図解ID も、そのまま開けるように残す。
  if (units.some((unit) => unit.id === raw)) return { page: "lessons", id: raw, legacy: true };
  if (labCatalog[raw]) return { page: "labs", id: raw, legacy: true };
  if (practiceCatalog.some((practice) => practice.id === raw)) return { page: "practice", id: raw, legacy: true };
  if (storyCatalog[raw]) return { page: "stories", id: raw, legacy: true };
  if (figureCatalog[raw]) return { page: "figures", id: raw, legacy: true };
  return { page: "home" };
}

export function handleRoute() {
  const route = readRoute();
  activatePage(route.page);

  if (route.page === "lessons") {
    // 単元IDつきで開いたときは範囲の絞り込みを保ち、#lessons（一覧）へ戻ったら解除する。
    state.activeLessonRange = route.rangeFilter ?? (route.id ? state.activeLessonRange : null);
    if (route.id) {
      const unitIndex = units.findIndex((unit) => unit.id === route.id);
      if (unitIndex >= 0) state.activeUnit = unitIndex;
      setLessonView("unit");
      renderUnit();
    } else {
      renderLessonIndex();
      setLessonView("index");
    }
    jumpToTop();
    return;
  }

  if (route.page === "labs") {
    if (route.id) {
      setLabView("lab");
      selectLab(route.id);
      focusLab(route.id);
    } else {
      renderLabIndex();
      setLabView("index");
      jumpToTop();
    }
    return;
  }

  if (route.page === "practice") {
    if (route.id) {
      setPracticeView("practice");
      if (route.id !== state.activePracticeMode) setActivePracticeMode(route.id);
    } else {
      renderPracticeIndex();
      setPracticeView("index");
    }
    jumpToTop();
    return;
  }

  if (route.page === "stories") {
    if (route.id) {
      state.activeStoryId = route.id;
      setStoryView("story");
      renderStoryPicker();
      renderStory();
    } else {
      renderStoryIndex();
      setStoryView("index");
    }
    jumpToTop();
    return;
  }

  if (route.page === "figures") {
    if (route.id) {
      state.activeFigureId = route.id;
      setFigureView("figure");
      renderFigurePicker();
      renderFigure();
    } else {
      renderFigureIndex();
      setFigureView("index");
    }
    jumpToTop();
  }
}

export function setupNavigation() {
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
    const backButton = event.target.closest("[data-back-to-list]");
    if (backButton) {
      const target = backButton.dataset.backToList;
      if (target === "lessons" && state.activeLessonRange) {
        location.hash = `#lessons/range/${encodeURIComponent(state.activeLessonRange)}`;
      } else {
        location.hash = `#${target}`;
      }
      return;
    }

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

    const figureButton = event.target.closest("[data-open-figure]");
    if (figureButton) {
      const figureId = figureButton.dataset.openFigure;
      if (figureCatalog[figureId]) location.hash = routeHash("figures", figureId);
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
