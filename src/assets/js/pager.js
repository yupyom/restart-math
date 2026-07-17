// 詳細ページ共通の「前へ／番号（窓付き）／次へ」ページャー。
// 番号を全件ぶん並べるとスクロールが増えるので、検索サイトのように
// 現在地の前後だけを窓（既定 9・スマホ 5）で見せる。前へ／次へは隣へ移動する。

// 全 total 件のうち、現在地 activeIndex を中心に size 個ぶんの連続した添字を返す。
// 端では窓を内側へ寄せ、常に size 個（total が少なければ全件）を見せる。
export function windowedIndices(activeIndex, total, size) {
  if (total <= size) return Array.from({ length: total }, (_, index) => index);
  const half = Math.floor(size / 2);
  const start = Math.max(0, Math.min(activeIndex - half, total - size));
  return Array.from({ length: size }, (_, index) => start + index);
}

// スマホでは横に並びきらないので窓を狭める。
function windowSize() {
  return window.innerWidth < 560 ? 5 : 9;
}

// 番号ボタン（窓付き）を wrap に敷き直す。items は表示順の配列で、各要素は id を持つ。
// onSelect(id) で遷移する。単元の #unit-dots と、詳細ページの共通ページャーで共用する。
export function renderPageNumbers(wrap, { items, activeIndex, onSelect }) {
  if (!wrap) return;
  wrap.innerHTML = "";
  if (activeIndex < 0) return;
  windowedIndices(activeIndex, items.length, windowSize()).forEach((index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dot-button${index === activeIndex ? " active" : ""}`;
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `${index + 1}ページへ`);
    if (index === activeIndex) button.setAttribute("aria-current", "true");
    button.addEventListener("click", () => onSelect(items[index].id));
    wrap.append(button);
  });
}

// 「前へ・番号・次へ」をまるごと container に描く（図鑑・読み物・図解・問題で共用）。
export function renderDetailPager(container, { items, activeId, onSelect, prevLabel = "前へ", nextLabel = "次へ", ariaLabel = "ページ送り" }) {
  if (!container) return;
  const activeIndex = items.findIndex((item) => item.id === activeId);
  container.className = "pager detail-pager";
  container.setAttribute("aria-label", ariaLabel);
  container.innerHTML = "";
  if (activeIndex < 0) return;

  const prev = document.createElement("button");
  prev.type = "button";
  prev.className = "button ghost";
  prev.textContent = prevLabel;
  prev.disabled = activeIndex === 0;
  if (activeIndex > 0) prev.addEventListener("click", () => onSelect(items[activeIndex - 1].id));
  container.append(prev);

  const numbers = document.createElement("div");
  numbers.className = "page-dots";
  numbers.setAttribute("aria-label", "ページ番号");
  renderPageNumbers(numbers, { items, activeIndex, onSelect });
  container.append(numbers);

  const next = document.createElement("button");
  next.type = "button";
  next.className = "button primary";
  next.textContent = nextLabel;
  next.disabled = activeIndex === items.length - 1;
  if (activeIndex < items.length - 1) next.addEventListener("click", () => onSelect(items[activeIndex + 1].id));
  container.append(next);
}
