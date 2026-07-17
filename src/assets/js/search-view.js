// サイト内検索の索引作成と描画。
import { units } from "../../content/lessons.js";
import { labs } from "../../content/labs.js";
import { practiceCatalog } from "../../content/practice.js";
import { stories } from "../../content/stories.js";
import { figures } from "../../content/figures.js";
import { searchSynonyms } from "../../content/search-synonyms.js";
import { $ } from "./utils.js";
import { activatePage } from "./nav.js";
import { escapeHtml, term } from "./format.js";

// TeX・記号を落とし、検索照合に使える平文へ直す。
export function plainTextForSearch(value) {
  return String(value ?? "")
    .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
    .replace(/\\[a-zA-Z]+/g, " ")
    .replace(/[{}^_&~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 検索用の正規化。索引と検索語の両側に同じ変換をかけ、全角/半角・大文字小文字・
// 漢数字⇄算用数字（「２次方程式」「2次方程式」「二次方程式」）の揺れを同一視する。
// 解答採点の normalizeText（math-utils.js）と発想は同じだが、あちらは空白除去や
// 記号の * 変換など採点専用の変換を含むため、検索は検索専用のこの関数を使う。
const KANJI_DIGITS = { "〇": "0", "零": "0", "一": "1", "二": "2", "三": "3", "四": "4", "五": "5", "六": "6", "七": "7", "八": "8", "九": "9" };

export function normalizeSearchText(value) {
  return String(value ?? "")
    .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[〇零一二三四五六七八九]/g, (char) => KANJI_DIGITS[char])
    .toLowerCase();
}

// 同義語辞書を「正規化済みの語 → グループ全語」の表に展開しておく。
const synonymGroups = new Map();
searchSynonyms.forEach((group) => {
  const variants = [...new Set(group.map((term) => normalizeSearchText(plainTextForSearch(term))).filter(Boolean))];
  variants.forEach((variant) => {
    const merged = new Set([...(synonymGroups.get(variant) || []), ...variants]);
    synonymGroups.set(variant, [...merged]);
  });
});

function expandSearchTerm(term) {
  return synonymGroups.get(term) || [term];
}

export let searchIndex = null;

export function buildSearchIndex() {
  const entries = [];

  units.forEach((unit) => {
    entries.push({
      type: "単元",
      title: unit.title,
      snippet: unit.summary,
      body: [unit.title, unit.summary, unit.stage, unit.strand, unit.range.join(" "), ...(unit.points || [])].join(" "),
      hash: `#lessons/${unit.id}`,
    });
    (unit.context?.definitions || []).forEach((definition) => {
      entries.push({
        type: "用語",
        title: definition.term,
        snippet: `${definition.meaning}（単元「${unit.title}」より）`,
        body: [definition.term, definition.meaning, definition.example, definition.boundary, unit.title].join(" "),
        hash: `#lessons/${unit.id}`,
      });
    });
  });

  labs.forEach((lab) => {
    entries.push({
      type: "図解",
      title: lab.title,
      snippet: `${lab.objectIntro}。${lab.observe}。`,
      body: [lab.title, lab.short, lab.category, lab.objectIntro, lab.observe].join(" "),
      hash: `#labs/${lab.id}`,
    });
  });

  practiceCatalog.forEach((practice) => {
    entries.push({
      type: "問題",
      title: practice.label,
      snippet: `${practice.level}：${practice.numberPolicy}`,
      body: [practice.label, practice.level, practice.numberPolicy, practice.advancedPolicy].join(" "),
      hash: `#practice/${practice.id}`,
    });
  });

  stories.forEach((story) => {
    entries.push({
      type: "読み物",
      title: story.title,
      snippet: story.lead,
      body: [story.title, story.menuTitle, story.lead].join(" "),
      hash: `#stories/${story.id}`,
    });
  });

  figures.forEach((figure) => {
    entries.push({
      type: "数学者",
      title: figure.name,
      snippet: figure.achievement,
      body: [figure.name, figure.reading, figure.era, figure.region, figure.achievement, ...(figure.profile || []), ...(figure.contributions || [])].join(" "),
      hash: `#figures/${figure.id}`,
    });
  });

  return entries.map((entry) => ({
    ...entry,
    plainTitle: normalizeSearchText(plainTextForSearch(entry.title)),
    plainSnippet: plainTextForSearch(entry.snippet),
    plainBody: normalizeSearchText(plainTextForSearch(entry.body)),
  }));
}

export function searchEntries(query) {
  if (!searchIndex) searchIndex = buildSearchIndex();
  const terms = normalizeSearchText(plainTextForSearch(query)).split(/[\s、。]+/).filter(Boolean);
  if (!terms.length) return [];
  const termVariants = terms.map(expandSearchTerm);
  const matches = searchIndex.filter((entry) => termVariants.every((variants) => variants.some((variant) => entry.plainBody.includes(variant))));
  return matches
    .map((entry) => ({
      entry,
      score: termVariants.every((variants) => variants.some((variant) => entry.plainTitle.includes(variant))) ? 0 : 1,
    }))
    .sort((first, second) => first.score - second.score)
    .map(({ entry }) => entry);
}

export function renderSearchResults(query) {
  const resultsWrap = $("#search-results");
  const status = $("#search-status");
  if (!resultsWrap || !status) return;

  const trimmed = query.trim();
  if (!trimmed) {
    status.textContent = "キーワードを入れると、関係する教材がここに並びます。";
    resultsWrap.innerHTML = "";
    return;
  }

  const results = searchEntries(trimmed);
  if (!results.length) {
    status.textContent = "見つかりませんでした。言葉を短くする・別の言い方にすると見つかることがあります。";
    resultsWrap.innerHTML = "";
    return;
  }

  const shown = results.slice(0, 30);
  status.textContent = `${results.length} 件見つかりました${results.length > shown.length ? `（先頭の ${shown.length} 件を表示）` : ""}。`;
  resultsWrap.innerHTML = shown
    .map(
      (entry) => `
        <a class="search-result" href="${escapeHtml(entry.hash)}">
          <span class="pill">${escapeHtml(entry.type)}</span>
          <strong>${escapeHtml(plainTextForSearch(entry.title))}</strong>
          <p>${escapeHtml(entry.plainSnippet.slice(0, 110))}${entry.plainSnippet.length > 110 ? "…" : ""}</p>
        </a>
      `,
    )
    .join("");
}

export function setupSearch() {
  const input = $("#site-search-input");
  if (!input) return;
  input.addEventListener("input", () => renderSearchResults(input.value));
  renderSearchResults("");

  // ホームの検索窓：送信すると検索ページへ移り、同じキーワードで結果を出す。
  const homeForm = $("#home-search-form");
  const homeInput = $("#home-search-input");
  if (homeForm && homeInput) {
    homeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      input.value = homeInput.value;
      renderSearchResults(homeInput.value);
      if (location.hash.replace("#", "") !== "search") {
        location.hash = "search";
      } else {
        activatePage("search");
      }
      window.setTimeout(() => input.focus(), 120);
    });
  }
}
