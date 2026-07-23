// scripts/overflow-check.mjs — 横はみ出し（横スクロール）検査用の計測ツール。
// ヘッドレスの system Chrome で指定ルートを狭い幅で開き、ページ全体が横に溢れていないか、
// どの要素が viewport 幅を超えているかを数値で報告する。数式（インライン MathJax）が
// 長くて版面を横に突き破る不具合の検出・回帰確認に使う。
//
// 使い方:
//   node scripts/overflow-check.mjs <ルート> [--w <px>]
//   npm run overflow -- lessons/pi-and-approximation --w 360
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { once } from "node:events";

function parseArgs(argv) {
  const positional = [];
  const opts = { w: 360, h: 780 };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--w") opts.w = Number(argv[(i += 1)]);
    else if (a === "--h") opts.h = Number(argv[(i += 1)]);
    else positional.push(a);
  }
  return { routes: positional, opts };
}

const { routes, opts } = parseArgs(process.argv.slice(2));
if (!routes.length) {
  console.error("使い方: node scripts/overflow-check.mjs <ルート...> [--w <px>]");
  console.error("例: node scripts/overflow-check.mjs lessons/pi-and-approximation --w 360");
  process.exit(1);
}

const PORT = Number(process.env.SHOT_PORT || 4322);

const server = spawn("node", ["scripts/dev-server.mjs"], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ["ignore", "pipe", "inherit"],
});
await Promise.race([once(server.stdout, "data"), new Promise((r) => setTimeout(r, 2000))]);

async function measure(page, route) {
  const url = `http://localhost:${PORT}/#${route.replace(/^#?\/?/, "")}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => window.MathJax?.startup?.promise).catch(() => {});
  await page.waitForTimeout(250);
  return page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const scrollWidth = document.documentElement.scrollWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("*")) {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 && rect.width > 0 && rect.width <= scrollWidth) {
        const cls = typeof el.className === "string" ? el.className : "";
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: cls.slice(0, 40),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          text: (el.textContent || "").trim().slice(0, 44),
        });
      }
    }
    return { docWidth, scrollWidth, overflow: scrollWidth - docWidth, offenders };
  });
}

let browser = null;
let failures = 0;
try {
  browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: opts.w, height: opts.h }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  for (const route of routes) {
    const result = await measure(page, route);
    const bad = result.overflow > 1;
    if (bad) failures += 1;
    const head = `${bad ? "NG" : "ok"}  ${route}  scrollWidth=${result.scrollWidth} overflow=${result.overflow}px`;
    console.log(head);
    if (bad) {
      // テキストを持つ leaf を優先し、原因の当たりを付けやすくする。
      const leaves = result.offenders.filter((o, _i, arr) => !arr.some((b) => b !== o && b.text && b.text.length < o.text.length && o.text.startsWith(b.text)));
      const withText = leaves.filter((o) => o.text).slice(0, 4);
      for (const o of (withText.length ? withText : leaves.slice(0, 4))) {
        console.log(`     <${o.tag} class="${o.cls}"> right=${o.right} w=${o.width}  「${o.text}」`);
      }
    }
  }
  console.log(`\n${routes.length} ルート中 ${failures} 件で横はみ出し（viewport=${opts.w}px）`);
  process.exitCode = failures ? 2 : 0;
} catch (error) {
  console.error(`overflow-check 失敗: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill();
}
