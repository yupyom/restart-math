// ページ一覧・ハッシュ生成・ページ切替。循環依存を避けるため機能モジュールはここだけを参照する。
import { labs } from "../../content/labs.js";
import { stories } from "../../content/stories.js";
import { figures } from "../../content/figures.js";
import { $$ } from "./utils.js";

export const pageIds = ["home", "scope", "lessons", "labs", "practice", "stories", "figures", "map", "search"];

export function activatePage(pageId) {
  const page = pageIds.includes(pageId) ? pageId : "home";
  $$("[data-page]").forEach((section) => {
    section.hidden = section.dataset.page !== page;
  });
  $$("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === page);
  });
}

export function routeHash(page, id = "") {
  return `#${page}${id ? `/${encodeURIComponent(id)}` : ""}`;
}
