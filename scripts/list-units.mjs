// 単元番号（learningPath 順）→ id / タイトル / 本文ファイルの対応表。
// 使い方: npm run units            … 全単元を番号順に一覧
//         npm run units -- 26      … 番号で1件（本文ファイルのパス付き）
//         npm run units -- 二次     … id・タイトルの部分一致で絞り込み
import { units } from "../src/content/lessons.js";

const query = process.argv[2];
for (const unit of units) {
  const hit = !query || String(unit.order) === query || unit.id.includes(query) || unit.title.includes(query);
  if (!hit) continue;
  console.log(`${String(unit.order).padStart(2, " ")}  ${unit.id}  ${unit.title}`);
  if (query) console.log(`    src/content/lessons/${unit.id}.js`);
}
