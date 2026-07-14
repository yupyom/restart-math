import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateContent } from "./validate-content.mjs";

const root = resolve(import.meta.dirname, "..");
const sourceRoot = resolve(root, "src");
const outputRoot = resolve(root, "docs");

await validateContent();
await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });
await cp(sourceRoot, outputRoot, { recursive: true });
await writeFile(resolve(outputRoot, ".nojekyll"), "", "utf8");
await validateContent({ outputRoot });

console.log("docs/ を公開用に更新しました。");
