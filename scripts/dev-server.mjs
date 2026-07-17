// src/ を Cache-Control: no-store で配信する確認用サーバ。
// ブラウザキャッシュで古い JS を見てしまう事故を防ぐ（ポートは PORT 環境変数で変更可）。
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(import.meta.url), "..", "..", "src");
const port = Number(process.env.PORT || 4319);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
  const filePath = normalize(join(root, path === "/" ? "index.html" : path));
  if (!filePath.startsWith(root)) {
    response.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("not found");
  }
}).listen(port, () => {
  console.log(`src preview: http://localhost:${port}/ (no-store)`);
});
