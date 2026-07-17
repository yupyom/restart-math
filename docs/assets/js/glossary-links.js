// 本文中の用語を定義単元へのリンクに変換する。
import { units } from "../../content/lessons.js";
import { glossaryTerms } from "../../content/glossary.js";
import { state } from "./state.js";
import { term } from "./format.js";

// 用語 → 定義単元の対応表。手動の用語集を優先し、単元 context の definitions からも自動で補う。
export let glossaryIndex = null;

export function buildGlossaryIndex() {
  const entries = [];
  const seenTerms = new Set();
  // 本文のあちこちに現れる一般的すぎる語は、リンクだらけになるので対象外にする。
  const stopTerms = new Set(["方程式", "文字", "記号", "かっこ", "計算", "定義", "整数"]);
  const addEntry = (term, lessonId) => {
    const cleaned = String(term ?? "").trim();
    if (cleaned.length < 2 || seenTerms.has(cleaned) || stopTerms.has(cleaned)) return;
    if (!units.some((unit) => unit.id === lessonId)) return;
    seenTerms.add(cleaned);
    entries.push({ term: cleaned, lessonId });
  };
  glossaryTerms.forEach(({ term, lessonId }) => addEntry(term, lessonId));
  units.forEach((unit) => {
    (unit.context?.definitions || []).forEach((definition) => {
      String(definition.term)
        .split(/[・、]/)
        .forEach((part) => addEntry(part, unit.id));
    });
  });
  // 「重複組合せ」より先に「組合せ」が一致しないよう、長い用語から照合する。
  return entries.sort((first, second) => second.term.length - first.term.length);
}

export function appendLinkedTerms(text, fragment, state) {
  // まず除外条件を無視して、最も手前・最も長い一致を探す。
  // 「二次方程式」（リンク対象外）の内側で「方程式」だけがリンクされる、といった部分一致を防ぐため、
  // 除外対象の用語も一致スパンとしては尊重し、その内側では短い用語を探さない。
  let best = null;
  for (const entry of glossaryIndex) {
    const at = text.indexOf(entry.term);
    if (at < 0) continue;
    if (!best || at < best.at || (at === best.at && entry.term.length > best.entry.term.length)) {
      best = { at, entry };
    }
  }
  if (!best) {
    if (text) fragment.append(document.createTextNode(text));
    return;
  }
  const spanEnd = best.at + best.entry.term.length;
  const isExcluded = best.entry.lessonId === state.currentLessonId || state.linked.has(best.entry.term);
  if (isExcluded) {
    if (spanEnd > 0) fragment.append(document.createTextNode(text.slice(0, spanEnd)));
    appendLinkedTerms(text.slice(spanEnd), fragment, state);
    return;
  }
  if (best.at > 0) fragment.append(document.createTextNode(text.slice(0, best.at)));
  const link = document.createElement("a");
  link.className = "term-link";
  link.href = `#lessons/${best.entry.lessonId}`;
  link.textContent = best.entry.term;
  link.title = `「${best.entry.term}」の単元を開く`;
  fragment.append(link);
  state.linked.add(best.entry.term);
  state.changed = true;
  appendLinkedTerms(text.slice(spanEnd), fragment, state);
}

// 描画済みの本文からテキストノードを走査し、用語の初出1回だけを単元リンクに置き換える。
// \( ... \) の TeX 部分・リンクやボタンの中・見出しには触れない。
export function linkifyGlossaryTerms(container, currentLessonId = null) {
  if (!container) return;
  if (!glossaryIndex) glossaryIndex = buildGlossaryIndex();
  const state = { currentLessonId, linked: new Set(), changed: false };

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (node.parentElement?.closest("a, button, label, select, h1, h2, h3, h4, mjx-container, script, style")) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const segments = node.nodeValue.split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\])/);
    const fragment = document.createDocumentFragment();
    state.changed = false;
    segments.forEach((segment, index) => {
      if (!segment) return;
      if (index % 2 === 1) {
        fragment.append(document.createTextNode(segment));
      } else {
        appendLinkedTerms(segment, fragment, state);
      }
    });
    if (state.changed) node.replaceWith(fragment);
  });
}
