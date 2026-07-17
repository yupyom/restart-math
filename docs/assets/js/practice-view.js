// 練習問題画面の描画・採点・切替。
import { units } from "../../content/lessons.js";
import { labCatalog } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { advancedPracticeGenerators } from "./practice-advanced.js";
import { state } from "./state.js";
import { $, $$, scheduleMathTypeset } from "./utils.js";
import { routeHash } from "./nav.js";
import { escapeHtml, formatTextWithMath } from "./format.js";
import { practiceGenerators } from "./practice-generators.js";

export const practiceModes = practiceCatalog.map((mode) => ({
  ...mode,
  generator: practiceGenerators[mode.id],
  advancedGenerator: advancedPracticeGenerators[mode.id],
}));

export function setupPractice() {
  const wrap = $("#practice-modes");
  wrap.innerHTML = "";
  practiceModes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mode-button${mode.id === state.activePracticeMode ? " active" : ""}`;
    button.textContent = mode.label;
    button.setAttribute("aria-pressed", String(mode.id === state.activePracticeMode));
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

export function renderPracticeModes() {
  $$(".mode-button").forEach((button, index) => {
    const isActive = practiceModes[index].id === state.activePracticeMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

export function renderPracticeLevels() {
  $$('[data-practice-level]').forEach((button) => {
    const isActive = button.dataset.practiceLevel === state.activePracticeLevel;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

export function setActivePracticeLevel(level) {
  if (!["starter", "advanced"].includes(level) || level === state.activePracticeLevel) return;
  state.activePracticeLevel = level;
  renderPracticeLevels();
  newProblem();
}

export function setActivePracticeMode(modeId, { newQuestion = true } = {}) {
  if (!practiceModes.some((mode) => mode.id === modeId)) return;
  state.activePracticeMode = modeId;
  renderPracticeModes();
  if (newQuestion) newProblem();
}

export function newProblem() {
  const mode = practiceModes.find((item) => item.id === state.activePracticeMode);
  const advanced = state.activePracticeLevel === "advanced";
  state.currentProblem = advanced ? mode.advancedGenerator() : mode.generator();
  state.currentStepIndex = 0;
  $("#problem-mode-label").textContent = `${mode.label}｜${advanced ? mode.advancedLevel : mode.level}`;
  $("#problem-title").textContent = state.currentProblem.title;
  $("#problem-policy").textContent = `${advanced ? mode.advancedLevel : mode.level}：${advanced ? mode.advancedPolicy : mode.numberPolicy}。「新しい問題」で数値や場面を変え、同じ考えを復習できます。`;
  $("#problem-prompt").textContent = state.currentProblem.prompt;
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  $("#answer-input").value = "";
  renderSteps();
  renderPracticeLearningActions(mode);
  scheduleMathTypeset($(".problem-card"));
}

export function renderPracticeLearningActions(mode) {
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

export function renderSteps() {
  const list = $("#step-list");
  list.innerHTML = "";
  state.currentProblem.steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = index < state.currentStepIndex ? "done" : index === state.currentStepIndex ? "current" : "";
    li.textContent =
      index < state.currentStepIndex
        ? `${step.label}：${step.answer}`
        : index === state.currentStepIndex
          ? `${step.label}：${step.question}`
          : step.label;
    list.append(li);
  });
  const current = state.currentProblem.steps[state.currentStepIndex];
  $("#answer-label").textContent = current ? current.question : "完了";
  $("#hint-text").textContent = current ? current.hint : "よくできました。新しい問題へ進みましょう。";
  scheduleMathTypeset($(".problem-card"));
}

export function checkCurrentStep() {
  const current = state.currentProblem.steps[state.currentStepIndex];
  if (!current) {
    newProblem();
    return;
  }

  const input = $("#answer-input").value;
  if (current.check(input)) {
    state.currentStepIndex += 1;
    $("#answer-input").value = "";
    if (state.currentStepIndex >= state.currentProblem.steps.length) {
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

export function setPracticeView(view) {
  $("#practice-index").hidden = view !== "index";
  $(".practice-shell").hidden = view === "index";
}

export function renderPracticeIndex() {
  const wrap = $("#practice-index");
  wrap.innerHTML = practiceModes
    .map((mode) => {
      const lesson = units.find((unit) => unit.id === mode.lessonIds?.[0]);
      const meta = lesson ? `${lesson.strand}｜${mode.level}` : mode.level;
      return `
        <a class="index-card" href="#practice/${encodeURIComponent(mode.id)}">
          <span class="index-card-meta">${escapeHtml(meta)}</span>
          <strong>${formatTextWithMath(mode.label)}</strong>
          <span class="index-card-summary">${formatTextWithMath(mode.numberPolicy)}</span>
        </a>
      `;
    })
    .join("");
  scheduleMathTypeset(wrap);
}
