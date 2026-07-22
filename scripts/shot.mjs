// scripts/shot.mjs — 開発用スクリーンショット（ヘッドレスの system Chrome で src/ を撮る）。
// アプリ内ブラウザペインのスクショが不安定なとき用の確実な代替。要素単位の切り出しと
// MathJax の初期組版待ちに対応する。撮った PNG は Read / SendUserFile で確認・共有できる。
//
// 使い方:
//   npm run shot -- <ルート|URL> [セレクタ] [--out <file>] [--dark] [--w <px>] [--h <px>] [--full]
// 例:
//   npm run shot -- lessons/pi-and-approximation ".parabola-figure"
//   npm run shot -- practice/fraction-arithmetic --out .shots/frac.png
//   npm run shot -- https://example.com "main" --out .shots/ext.png
//
// <ルート> が http(s) で始まればその URL をそのまま撮る。そうでなければ dev-server を
// 専用ポートで起動し http://localhost:<port>/#<ルート> を撮る（アプリはハッシュルーティング）。
// システム Chrome を使う（channel:"chrome"）ので専用ブラウザのダウンロードは不要。
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

function parseArgs(argv) {
  const positional = [];
  const opts = { out: null, dark: false, w: 1280, h: 900, full: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--out") opts.out = argv[(i += 1)];
    else if (a === "--dark") opts.dark = true;
    else if (a === "--full") opts.full = true;
    else if (a === "--w") opts.w = Number(argv[(i += 1)]);
    else if (a === "--h") opts.h = Number(argv[(i += 1)]);
    else positional.push(a);
  }
  return { target: positional[0], selector: positional[1], opts };
}

const { target, selector, opts } = parseArgs(process.argv.slice(2));
if (!target) {
  console.error("使い方: npm run shot -- <ルート|URL> [セレクタ] [--out <file>] [--dark] [--w <px>] [--h <px>] [--full]");
  process.exit(1);
}

const PORT = Number(process.env.SHOT_PORT || 4321);
const isUrl = /^https?:\/\//.test(target);
const url = isUrl ? target : `http://localhost:${PORT}/#${target.replace(/^#?\/?/, "")}`;
const outPath = resolve(opts.out || ".shots/shot.png");

let server = null;
if (!isUrl) {
  server = spawn("node", ["scripts/dev-server.mjs"], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "inherit"],
  });
  // サーバの起動ログ（最初の stdout 行）を待つ。出なくても最大2秒で先へ進む。
  await Promise.race([once(server.stdout, "data"), new Promise((r) => setTimeout(r, 2000))]);
}

let browser = null;
try {
  browser = await chromium.launch({ channel: "chrome" });
  const context = await browser.newContext({
    viewport: { width: opts.w, height: opts.h },
    colorScheme: opts.dark ? "dark" : "light",
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  // MathJax v3 の初期組版を待つ（無ければ即 resolve）。その後わずかに待って版面を落ち着かせる。
  await page.evaluate(() => window.MathJax?.startup?.promise).catch(() => {});
  await page.waitForTimeout(300);
  await mkdir(dirname(outPath), { recursive: true });
  if (selector) {
    const el = page.locator(selector).first();
    await el.waitFor({ state: "visible", timeout: 5000 });
    await el.scrollIntoViewIfNeeded();
    await el.screenshot({ path: outPath });
  } else {
    await page.screenshot({ path: outPath, fullPage: opts.full });
  }
  console.log(`saved: ${outPath}`);
} catch (error) {
  console.error(`shot 失敗: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) server.kill();
}
