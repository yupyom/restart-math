// DOM ショートカットと MathJax の組版キュー、ページ共通の小さな UI 部品。
import { escapeHtml } from "./format.js";

export const $ = (selector) => document.querySelector(selector);

export const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// 見出しのリード文は一覧ページだけに出し、詳細ページでは隠して上部を軽くする。
// .section-lead-persistent は隠さない（問題ページの操作案内など、詳細でも残したい一文）。
export function toggleSectionLead(pageId, showOnIndex) {
  const section = document.querySelector(`[data-page="${pageId}"]`);
  if (!section) return;
  section.querySelectorAll(".section-lead").forEach((lead) => {
    lead.hidden = !showOnIndex;
  });
}

export let mathTypesetFrame = null;

export const mathTypesetTargets = new Set();

export let mathTypesetQueue = Promise.resolve();

export function flushMathTypeset() {
  mathTypesetFrame = null;
  // MathJax 本体（CDN・defer）の読み込みが済んでいなければ、ターゲットを捨てずに少し待って再試行する。
  if (!window.MathJax || typeof window.MathJax.typesetPromise !== "function") {
    mathTypesetFrame = window.setTimeout(flushMathTypeset, 200);
    return;
  }
  const connected = Array.from(mathTypesetTargets).filter((element) => element && element.isConnected);
  mathTypesetTargets.clear();
  // 親と子を同じバッチに渡すと、同じ数式が二重に処理されて
  // splitText の IndexSizeError で描画が壊れる。他のターゲットに含まれる要素は外す。
  const targets = connected.filter(
    (element) => !connected.some((other) => other !== element && other.contains(element)),
  );
  if (!targets.length) return;
  // typesetPromise は並行呼び出しに弱いので直列化し、
  // 再描画で入れ替わった要素の古い管理情報は typesetClear で先に消す。
  mathTypesetQueue = mathTypesetQueue
    .then(() => {
      window.MathJax.typesetClear?.(targets);
      return window.MathJax.typesetPromise(targets);
    })
    .catch((error) => {
      console.warn("MathJax typeset failed:", error);
    });
}

export function scheduleMathTypeset(target = document.body) {
  mathTypesetTargets.add(target);
  if (mathTypesetFrame) return;
  // requestAnimationFrame はバックグラウンドのタブで止まるため、タイマーでまとめる。
  mathTypesetFrame = window.setTimeout(flushMathTypeset, 16);
}

// ページ移動のスクロールは即時に行う。html の scroll-behavior: smooth のままだと、
// 移動直後の MathJax 描画で本文の高さが変わってスムーズスクロールが途中で止まり、
// ページの途中から表示される（特にスマホ）。behavior: "instant" の明示指定が必要
// （インラインで scroll-behavior を上書きしても同期的には効かない）。
export function jumpToTop(element = null) {
  try {
    if (element) element.scrollIntoView({ behavior: "instant", block: "start" });
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  } catch {
    if (element) element.scrollIntoView(true);
    else window.scrollTo(0, 0);
  }
}

export function setupMathChoiceGroups() {
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

// スマホでは左目次を横フリックではなく、タップで開閉する縦メニューにする。
export function setupContentMenuToggles() {
  $$(".content-menu").forEach((menu) => {
    const title = menu.querySelector(".content-menu-title")?.textContent?.trim() || "一覧";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "content-menu-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = `<span>${escapeHtml(title)}の一覧から選ぶ</span><span class="content-menu-caret" aria-hidden="true">▾</span>`;
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    menu.prepend(toggle);
    // 一覧から選んだら閉じる。PCでは open クラスに対応する表示切替がないので影響しない。
    menu.addEventListener("click", (event) => {
      if (event.target.closest("button:not(.content-menu-toggle), a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}
