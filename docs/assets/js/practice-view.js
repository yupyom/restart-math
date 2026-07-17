// 練習問題画面の描画・採点・切替。
import { units } from "../../content/lessons.js";
import { labCatalog } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { advancedPracticeGenerators } from "./practice-advanced.js";
import { state } from "./state.js";
import { $, $$, scheduleMathTypeset, toggleSectionLead } from "./utils.js";
import { routeHash } from "./nav.js";
import { escapeHtml, formatTextWithMath } from "./format.js";
import { practiceGenerators } from "./practice-generators.js";
import { answerToInputText } from "./math-utils.js";
import { renderDetailPager } from "./pager.js";

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
  $("#show-choices").addEventListener("click", showChoices);
  $("#give-up").addEventListener("click", revealCurrentStep);
  newProblem();
  renderPracticePager();
}

export function renderPracticeModes() {
  $$(".mode-button").forEach((button, index) => {
    const isActive = practiceModes[index].id === state.activePracticeMode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderPracticePager();
}

function renderPracticePager() {
  renderDetailPager($("#practice-pager"), {
    items: practiceModes,
    activeId: state.activePracticeMode,
    onSelect: (id) => { location.hash = routeHash("practice", id); },
    prevLabel: "前の問題",
    nextLabel: "次の問題",
    ariaLabel: "問題の前後移動",
  });
}

export function renderPracticeLevels() {
  const mode = activeMode();
  $$('[data-practice-level]').forEach((button) => {
    const isActive = button.dataset.practiceLevel === state.activePracticeLevel;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    // 発展問題がまだないモードでは「少し進んだ問題」のタブを出さない。
    if (button.dataset.practiceLevel === "advanced") button.hidden = !mode?.advancedGenerator;
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
  // 別の問題へ移ったら難易度は「はじめの一問」に戻す。前のモードで「少し進んだ問題」を
  // 選んだまま引き継ぐと、発展問題のないモードでは無言でやさしい問題に化けて紛らわしい。
  state.activePracticeLevel = "starter";
  renderPracticeModes();
  if (newQuestion) newProblem();
}

function activeMode() {
  return practiceModes.find((item) => item.id === state.activePracticeMode);
}

export function newProblem() {
  const mode = activeMode();
  const advanced = state.activePracticeLevel === "advanced" && Boolean(mode.advancedGenerator);
  state.currentProblem = (advanced ? mode.advancedGenerator : mode.generator)();
  state.currentStepIndex = 0;
  const levelLabel = advanced ? mode.advancedLevel : mode.level;
  const policy = advanced ? mode.advancedPolicy : mode.numberPolicy;
  $("#problem-mode-label").textContent = `${mode.label}｜${levelLabel}`;
  $("#problem-title").textContent = state.currentProblem.title;
  $("#problem-policy").textContent = `${levelLabel}：${policy}。「新しい問題」で数値や場面を変え、同じ考えを復習できます。`;
  $("#problem-prompt").textContent = state.currentProblem.prompt;
  setFeedback("", "");
  $("#answer-input").value = "";
  clearRevealPanel();
  renderPracticeLevels();
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

// 正解として受理される、入力欄そのままの書き方の文字列。
function canonicalInput(step) {
  return step.accept ?? answerToInputText(step.answer);
}

// 入力欄の placeholder に出す「書き方の例」。答えそのものは出さない。
function inputExample(step) {
  if (step.example) return `例：${step.example}`;
  const canonical = canonicalInput(step);
  const candidates = (() => {
    if (/^x=±/.test(canonical)) return ["x=±3", "x=±5"];
    if (/^[a-z]=-?\d+$/.test(canonical)) return [`${canonical[0]}=3`, `${canonical[0]}=-2`];
    if (/^-?\d+\/\d+$/.test(canonical)) return ["3/4", "2/5"];
    if (canonical.includes("√")) return ["2√3", "3√2"];
    if (/^-?\d+(?:\.\d+)?$/.test(canonical)) return ["-12", "8"];
    if (/^[a-z][<>]/.test(canonical) || /[<>]/.test(canonical)) return ["x<2", "x>1"];
    if (canonical.startsWith("(") && canonical.includes(",")) return ["(1, 2)", "(2, -3)"];
    if (canonical.includes(",")) return ["2, 5", "1, 4"];
    return null;
  })();
  if (!candidates) return "";
  const sample = candidates.find((candidate) => candidate.replace(/\s+/g, "") !== canonical.replace(/\s+/g, ""));
  return sample ? `例：${sample}` : "";
}

function shuffle(values) {
  const array = [...values];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 選択肢モード用の選択肢。生成器が choices を持てばそれを使い、
// 数値・分数・ルート・x=◯ などの答えは正解の周辺から「間違えやすい形」の誤答をつくる。
// つくれない設問は null（ボタンを出さない）。
function buildChoices(step) {
  if (Array.isArray(step.choices) && step.choices.length >= 2) return shuffle(step.choices);
  const raw = buildAutoChoices(step);
  if (!raw) return null;
  // 自動生成した誤答が、偶然この設問の正解として受理される形（対称な組の符号反転など）
  // になっていないかを check 本体で確かめ、受理されるものは外す。
  const canonical = canonicalInput(step);
  const safe = raw.filter((candidate) => candidate === canonical || !step.check(candidate));
  return safe.length >= 2 ? safe : null;
}

function buildAutoChoices(step) {
  const canonical = canonicalInput(step);

  // 整数（末尾の ° つきも同様に扱う）
  const numeric = canonical.match(/^(-?\d+)(°?)$/);
  if (numeric) {
    const value = Number(numeric[1]);
    const unit = numeric[2];
    const pool = [...new Set([-value, value + 1, value - 1, value + 2, value - 2, value * 2])].filter(
      (candidate) => candidate !== value,
    );
    const distractors = shuffle(pool).slice(0, 2);
    return shuffle([value, ...distractors].map((candidate) => `${candidate}${unit}`));
  }

  const fraction = canonical.match(/^(-?\d+)\/(\d+)$/);
  if (fraction) {
    const top = Number(fraction[1]);
    const bottom = Number(fraction[2]);
    const pool = [...new Set([`${bottom}/${top}`, `${top}/${bottom + 1}`, `${top + 1}/${bottom}`])].filter(
      (candidate) => candidate !== canonical && !/\/0$|^0\//.test(candidate) && !candidate.includes("/-"),
    );
    return shuffle([canonical, ...shuffle(pool).slice(0, 2)]);
  }

  // 係数つきルート（2√3 など）。よくある誤りは「中と外の取り違え」と「ルートの外し忘れ・掛けすぎ」。
  const radical = canonical.match(/^(-?\d+)√(\d+)$/);
  if (radical) {
    const coef = Number(radical[1]);
    const radicand = Number(radical[2]);
    const pool = [...new Set([`${radicand}√${Math.abs(coef)}`, `${coef * radicand}`, `${coef + 1}√${radicand}`])].filter(
      (candidate) => candidate !== canonical,
    );
    return shuffle([canonical, ...shuffle(pool).slice(0, 2)]);
  }

  // x=±3 型。「正だけ」「負だけ」がそのまま良い誤答になる。
  const plusMinus = canonical.match(/^x=±(\d+)$/);
  if (plusMinus) {
    return shuffle([canonical, `x=${plusMinus[1]}`, `x=-${plusMinus[1]}`]);
  }

  // x=3 のような一文字の答え。符号の誤りを中心に並べる。
  const assignment = canonical.match(/^([a-z])=(-?\d+)$/);
  if (assignment) {
    const variable = assignment[1];
    const value = Number(assignment[2]);
    const pool = [...new Set([-value, value + 1, value - 1, value * 2])].filter((candidate) => candidate !== value);
    return shuffle([value, ...shuffle(pool).slice(0, 2)].map((candidate) => `${variable}=${candidate}`));
  }

  // x<3 のような不等式。向きの反転と境目の符号違いを誤答にする。
  const inequality = canonical.match(/^x([<>])(-?\d+)$/);
  if (inequality) {
    const sign = inequality[1];
    const boundary = Number(inequality[2]);
    const flipped = sign === "<" ? ">" : "<";
    const other = boundary === 0 ? 1 : -boundary;
    return shuffle([canonical, `x${flipped}${boundary}`, `x${sign}${other}`]);
  }

  // カンマ区切りの数の組。「符号を全部反転」「1つずれる」を誤答にする。
  if (/^\(?-?\d+(,\s*-?\d+)+\)?$/.test(canonical)) {
    const wrapped = canonical.startsWith("(");
    const numbers = canonical.replace(/[()]/g, "").split(",").map((piece) => Number(piece.trim()));
    const negated = numbers.map((value) => -value);
    const shifted = numbers.map((value, index) => (index === numbers.length - 1 ? value + 1 : value));
    const render = (values) => {
      const body = values.join(", ");
      return wrapped ? `(${body})` : body;
    };
    const pool = [...new Set([render(negated), render(shifted)])].filter((candidate) => candidate !== render(numbers));
    if (!pool.length) return null;
    return shuffle([render(numbers), ...pool]);
  }

  return null;
}

function currentStep() {
  return state.currentProblem?.steps[state.currentStepIndex];
}

function setFeedback(text, tone) {
  $("#feedback").textContent = text;
  $("#feedback").className = `feedback${tone ? ` ${tone}` : ""}`;
}

function clearRevealPanel() {
  const panel = $("#reveal-panel");
  panel.hidden = true;
  panel.innerHTML = "";
}

function clearChoices() {
  const area = $("#choice-area");
  area.hidden = true;
  area.innerHTML = "";
}

export function renderSteps() {
  const list = $("#step-list");
  list.innerHTML = "";
  state.currentProblem.steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = index < state.currentStepIndex ? "done" : index === state.currentStepIndex ? "current" : "";
    li.textContent =
      index < state.currentStepIndex
        ? `${step.label}：${step.answer}${step.revealed ? "（答えを見た）" : ""}`
        : index === state.currentStepIndex
          ? `${step.label}：${step.question}`
          : step.label;
    list.append(li);
  });
  const current = currentStep();
  $("#answer-label").textContent = current ? current.question : "完了";
  $("#hint-text").textContent = current ? current.hint : "よくできました。新しい問題へ進みましょう。";
  $("#answer-input").placeholder = current ? inputExample(current) : "";
  $("#answer-tools").hidden = !current;
  // 選択肢はステップ表示のたびに一度だけ組み、押すまで並びを固定する。
  currentChoices = current ? buildChoices(current) : null;
  $("#show-choices").hidden = !currentChoices;
  clearChoices();
  scheduleMathTypeset($(".problem-card"));
}

let currentChoices = null;

// 入力の書き方だけが違う正解を拾うための緩和ルール。
// 変換後の文字列が本来の check を通ったときだけ受理し、書き方のメモを返す。
const inputRelaxations = [
  {
    note: "かっこは付けなくて大丈夫です。-20 のように、そのまま書けます。",
    transform: (text) => {
      const match = text.trim().match(/^[（(](.+)[）)]$/);
      // (1, 2) のような座標や (x+1)(x+2) のような式のかっこは崩さない。
      return match && !match[1].includes(",") && !match[1].includes("(") ? match[1] : null;
    },
  },
  {
    note: "先頭の「=」は書かずに、答えの数だけで大丈夫です。",
    transform: (text) => {
      const trimmed = text.trim();
      return /^[=＝]/.test(trimmed) ? trimmed.slice(1) : null;
    },
  },
  {
    note: "「答え」などの言葉は書かず、数や式だけで大丈夫です。",
    transform: (text) => {
      const match = text.trim().match(/^(?:答え|こたえ|答)\s*[:：は]?\s*(.+)$/);
      return match ? match[1] : null;
    },
  },
];

// check を直接通すか、書き方の緩和で通るかを判定する。
// 戻り値: { correct, note } — note は書き方を教えるメモ（緩和で通ったときだけ）。
function evaluateAnswer(step, input) {
  if (step.check(input)) return { correct: true, note: "" };
  for (const relaxation of inputRelaxations) {
    const transformed = relaxation.transform(String(input));
    if (transformed !== null && step.check(transformed)) {
      return { correct: true, note: relaxation.note };
    }
  }
  return { correct: false, note: "" };
}

function advanceStep(revealed) {
  state.currentStepIndex += 1;
  $("#answer-input").value = "";
  const finished = state.currentStepIndex >= state.currentProblem.steps.length;
  if (revealed) {
    setFeedback(
      finished
        ? "模範解答を確認しました。この問題はここまで。「別の問題を作る」で同じ型をもう一度試せます。"
        : "模範解答を確認しました。読んだら、次のステップへ進みましょう。",
      "",
    );
  } else if (finished) {
    const anyRevealed = state.currentProblem.steps.some((step) => step.revealed);
    setFeedback(
      anyRevealed
        ? "この問題は完了です。答えを見たステップは、「別の問題を作る」でもう一度自力で試してみましょう。"
        : "正解！この問題は完了です。",
      "good",
    );
  }
  renderSteps();
}

export function checkCurrentStep() {
  const current = currentStep();
  if (!current) {
    newProblem();
    return;
  }

  const input = $("#answer-input").value;
  if (!String(input).trim()) {
    setFeedback("答えを入力してから「確認」を押してください。入力欄のうすい文字が書き方の例です。", "try");
    return;
  }

  const { correct, note } = evaluateAnswer(current, input);
  if (correct) {
    clearRevealPanel();
    const isLast = state.currentStepIndex + 1 >= state.currentProblem.steps.length;
    if (!isLast) setFeedback(note ? `正解です。メモ：${note}` : "いい感じ。次のステップへ進みましょう。", "good");
    advanceStep(false);
    if (isLast && note) setFeedback(`正解！この問題は完了です。メモ：${note}`, "good");
  } else {
    setFeedback(
      "惜しいです。符号・種類・順序をもう一度確認してみましょう。迷ったら「選択肢から選ぶ」、どうしても分からなければ「答えと解説を見る」が使えます。",
      "try",
    );
  }
}

// ヒントモード：答えの候補を並べ、選んで確認できるようにする。
export function showChoices() {
  const current = currentStep();
  if (!current || !currentChoices) return;
  const area = $("#choice-area");
  if (!area.hidden) {
    clearChoices();
    return;
  }
  area.innerHTML = `<p class="choice-lead">この中から選んで押すと、そのまま答え合わせをします。</p>`;
  const list = document.createElement("div");
  list.className = "choice-list";
  currentChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;
    button.addEventListener("click", () => {
      $("#answer-input").value = choice;
      checkCurrentStep();
    });
    list.append(button);
  });
  area.append(list);
  area.hidden = false;
  scheduleMathTypeset(area);
}

// ギブアップ：模範解答と解説を表示して、次のステップへ進む。
export function revealCurrentStep() {
  const current = currentStep();
  if (!current) return;
  current.revealed = true;
  const panel = $("#reveal-panel");
  panel.innerHTML = `
    <h4>ステップ「${escapeHtml(current.label)}」の模範解答</h4>
    <p class="reveal-answer">${formatTextWithMath(current.answer)}</p>
    <p class="reveal-explanation">${formatTextWithMath(current.hint)}</p>
    <p class="reveal-note">分からないまま止まるより、答えを見て型を覚える方が先に進めます。「別の問題を作る」で、同じ型を数値を変えてもう一度試せます。</p>
  `;
  panel.hidden = false;
  advanceStep(true);
  scheduleMathTypeset(panel);
}

export function setPracticeView(view) {
  $("#practice-index").hidden = view !== "index";
  $(".practice-shell").hidden = view === "index";
  toggleSectionLead("practice", view === "index");
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
