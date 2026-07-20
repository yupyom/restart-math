// 1単元の本文ファイルを丸ごと標準出力する（Read の代替・行番号ズレ対策）。
// Read が長文で乱れる環境でも、単元1ファイルは短いので確実に全文を得られる。
// 使い方:
//   node scripts/show-unit.mjs <id|番号>     例: node scripts/show-unit.mjs integer-rules / 3
//   npm run unit -- <id|番号>
// 番号は learningPath 順（= サイト表示の単元番号）。id 一覧は npm run units。
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { units } from "../src/content/lessons.js";

const arg = process.argv[2];
if (!arg) {
  console.error("usage: node scripts/show-unit.mjs <id|番号>   （番号は learningPath 順。一覧は npm run units）");
  process.exit(1);
}

const byNumber = /^\d+$/.test(arg) ? units.find((u) => String(u.order) === arg) : null;
const unit = byNumber || units.find((u) => u.id === arg);
if (!unit) {
  console.error(`単元 "${arg}" が見つかりません。npm run units で id と番号を確認してください。`);
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const path = join(here, "..", "src", "content", "lessons", `${unit.id}.js`);
process.stdout.write(readFileSync(path, "utf8"));
