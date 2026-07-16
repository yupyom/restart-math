import { access, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { units } from "../src/content/lessons.js";
import { labs, labCatalog, unitLabRefs } from "../src/content/labs.js";
import { practiceCatalog } from "../src/content/practice.js";
import { topics } from "../src/content/topics.js";
import { stories, storyCatalog, storySourcePolicy } from "../src/content/stories.js";
import { figures, figureCatalog } from "../src/content/figures.js";
import { glossaryTerms } from "../src/content/glossary.js";

const root = resolve(import.meta.dirname, "..");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertUnique(items, key, label) {
  const values = items.map((item) => item[key]);
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
  assert(!duplicates.length, `${label} の ID が重複しています: ${[...new Set(duplicates)].join(", ")}`);
}

const mathTextKeys = new Set([
  "summary",
  "points",
  "example",
  "check",
  "checkExample",
  "formula",
  "description",
  "question",
  "answer",
  "tryIt",
  "meaning",
  "boundary",
  "lead",
  "body",
  "objectIntro",
  "observe",
  "starterExample",
 "hint",
  "prompt",
  "explanation",
  "conclusion",
  "intro",
  "note",
  "text",
  "caption",
]);

function validateExample(example, unitId) {
  if (typeof example === "string") {
    assert(example.trim(), `単元 ${unitId} の例が空です。`);
    return;
  }

  assert(example && typeof example === "object", `単元 ${unitId} の例の形式が不正です。`);
  assert(["aligned-steps", "word-problem", "narrative", "walkthrough"].includes(example.type), `単元 ${unitId} の例の型が不正です。`);

  if (example.type === "aligned-steps") {
    assert(Array.isArray(example.rows) && example.rows.length >= 2, `単元 ${unitId} の段階式には二行以上必要です。`);
    example.rows.forEach((row) => {
      assert(typeof row === "string" && row.includes("=") && !row.includes(","), `単元 ${unitId} の段階式は一行ずつ等式で書いてください。`);
    });
  }

  if (example.type === "walkthrough") {
    assert(Array.isArray(example.steps) && example.steps.length >= 2, `単元 ${unitId} の心の声つき解答には二手以上必要です。`);
    example.steps.forEach((step) => {
      const hasEquation = typeof step?.equation === "string" && step.equation.trim();
      const hasText = typeof step?.text === "string" && step.text.trim();
      assert(hasEquation || hasText, `単元 ${unitId} の心の声つき解答の各手には式または文章が必要です。`);
      if (hasEquation) assert(!step.equation.includes(","), `単元 ${unitId} の心の声つき解答は一手ずつ書いてください。`);
    });
  }

  if (example.type === "word-problem") {
    assert(example.prompt && example.explanation, `単元 ${unitId} の文章題には状況と説明が必要です。`);
    assert(/^\\\([\s\S]+\\\)$/.test(example.equation || ""), `単元 ${unitId} の文章題には独立した TeX の式が必要です。`);
  }

  if (example.type === "narrative") {
    assert(example.body, `単元 ${unitId} の図の説明がありません。`);
    if (example.equation) assert(/^\\\([\s\S]+\\\)$/.test(example.equation), `単元 ${unitId} の結論式が不正です。`);
  }
}


function assertMathIsDelimited(text, path) {
  if (typeof text !== "string") return;
  const prose = text.replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, "");
  const rawFormula = /(?:\d|[a-z])\s*(?:[+\-−×÷=<>]|<=|>=)\s*(?:\(?[a-z\d−-])/i;
  assert(!rawFormula.test(prose), path + " に数式の区切り漏れがあります。\\(...\\) または \\[...\\] で囲んでください。");
}

function validateMathText(value, path = "content") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateMathText(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([key, child]) => {
    const childPath = `${path}.${key}`;
    if (mathTextKeys.has(key) && typeof child === "string") assertMathIsDelimited(child, childPath);
    if (child && typeof child === "object") validateMathText(child, childPath);
  });
}

async function validateAssetReferences(siteRoot) {
  const htmlPath = resolve(siteRoot, "index.html");
  const html = await readFile(htmlPath, "utf8");
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);

  for (const reference of references) {
    if (/^(#|https?:|mailto:)/.test(reference)) continue;
    try {
      await access(resolve(siteRoot, reference));
    } catch {
      throw new Error(`${siteRoot} から参照されるファイルが見つかりません: ${reference}`);
    }
  }
}

export async function validateContent({ outputRoot } = {}) {
  assertUnique(units, "id", "単元");
  assertUnique(labs, "id", "図解");
  assertUnique(practiceCatalog, "id", "問題モード");
  assertUnique(stories, "id", "読み物");
  assertUnique(topics, "id", "学習マップ");

  const lessonIds = new Set(units.map((unit) => unit.id));
  const practiceIds = new Set(practiceCatalog.map((practice) => practice.id));
  const labIds = new Set(labs.map((lab) => lab.id));

  validateMathText({ units, labs, stories });

  units.forEach((unit) => {
    assert(unit.order > 0, `単元 ${unit.id} に順番がありません。`);
    assert(unit.strand, `単元 ${unit.id} に分野がありません。`);
    assert(Array.isArray(unit.range) && unit.range.length, `単元 ${unit.id} に学習範囲がありません。`);
    validateExample(unit.example, unit.id);
    assert(unit.nextLessonId || unit.labIds.length || unit.practiceIds.length, `単元 ${unit.id} に次の一手がありません。`);
    unit.labIds.forEach((labId) => assert(labIds.has(labId), `単元 ${unit.id} が存在しない図解 ${labId} を参照しています。`));
    if (unit.labIds.length) {
      const primaryLab = labCatalog[unit.labIds[0]];
      assert(unit.checkExample || primaryLab?.starterExample, `単元 ${unit.id} の「動かして確認」に具体例がありません。`);
    }
    unit.practiceIds.forEach((practiceId) =>
      assert(practiceIds.has(practiceId), `単元 ${unit.id} が存在しない問題 ${practiceId} を参照しています。`),
    );
    if (unit.nextLessonId) assert(lessonIds.has(unit.nextLessonId), `単元 ${unit.id} の次の単元が見つかりません。`);
    if (unit.recommendedLabId) assert(labIds.has(unit.recommendedLabId), `単元 ${unit.id} のおすすめ図解が見つかりません。`);
    if (unit.recommendedPracticeId) assert(practiceIds.has(unit.recommendedPracticeId), `単元 ${unit.id} のおすすめ問題が見つかりません。`);
    if (unit.recommendedNextLessonId) assert(lessonIds.has(unit.recommendedNextLessonId), `単元 ${unit.id} のおすすめ次単元が見つかりません。`);
    assert(
      unit.recommendedLabId || unit.recommendedPracticeId || unit.recommendedNextLessonId,
      `単元 ${unit.id} におすすめの次の一手がありません。`,
    );
    if (unit.context) {
      assert(unit.context.why, `単元 ${unit.id} の context に why がありません。`);
      assert(Array.isArray(unit.context.definitions), `単元 ${unit.id} の context に definitions がありません。`);
      assert(Array.isArray(unit.context.connections), `単元 ${unit.id} の context に connections がありません。`);
      (unit.context.storyIds || []).forEach((storyId) =>
        assert(storyCatalog[storyId], `単元 ${unit.id} の読み物 ${storyId} が見つかりません。`),
      );
    }
  });

  Object.entries(unitLabRefs).forEach(([lessonId, linkedLabIds]) => {
    assert(lessonIds.has(lessonId), `図解リンクが存在しない単元 ${lessonId} を参照しています。`);
    linkedLabIds.forEach((labId) => assert(labIds.has(labId), `図解リンクが存在しない図解 ${labId} を参照しています。`));
  });

  Object.values(labCatalog).forEach((lab) => assert(labIds.has(lab.id), `図解カタログに不正な ID があります。`));

  labs.forEach((lab) => {
    assert(Array.isArray(lab.lessonIds) && lab.lessonIds.length, `図解 ${lab.id} に対応単元がありません。`);
    assert(Array.isArray(lab.practiceIds) && lab.practiceIds.length, `図解 ${lab.id} に対応問題がありません。`);
    assert(lab.starterExample, `図解 ${lab.id} に最初の操作例がありません。`);
    lab.lessonIds.forEach((lessonId) => assert(lessonIds.has(lessonId), `図解 ${lab.id} が存在しない単元 ${lessonId} を参照しています。`));
    lab.practiceIds.forEach((practiceId) => assert(practiceIds.has(practiceId), `図解 ${lab.id} が存在しない問題 ${practiceId} を参照しています。`));
  });

  practiceCatalog.forEach((practice) => {
    assert(practice.level && practice.numberPolicy, `問題 ${practice.id} に難度方針がありません。`);
    practice.lessonIds.forEach((lessonId) => assert(lessonIds.has(lessonId), `問題 ${practice.id} が存在しない単元 ${lessonId} を参照しています。`));
    practice.labIds.forEach((labId) => assert(labIds.has(labId), `問題 ${practice.id} が存在しない図解 ${labId} を参照しています。`));
  });

  topics.forEach((topic) => assert(lessonIds.has(topic.lessonId), `学習マップ ${topic.title} の単元 ${topic.lessonId} が見つかりません。`));

  const glossarySeen = new Set();
  glossaryTerms.forEach(({ term, lessonId }) => {
    assert(typeof term === "string" && term.trim().length >= 2, `用語集に短すぎる用語があります: ${term}`);
    assert(!glossarySeen.has(term), `用語集の用語が重複しています: ${term}`);
    glossarySeen.add(term);
    assert(lessonIds.has(lessonId), `用語集「${term}」の単元 ${lessonId} が見つかりません。`);
  });

  assert(storySourcePolicy.history && storySourcePolicy.society, "読み物の出典方針がありません。");
  stories.forEach((story) => {
    assert(story.type && story.title && story.lead, `読み物 ${story.id} の基本情報が不足しています。`);
    assert(Array.isArray(story.sections) && story.sections.length, `読み物 ${story.id} に本文がありません。`);
    assert(story.factCheck?.status === "checked", `読み物 ${story.id} の事実確認が完了していません。`);
    story.lessonIds.forEach((lessonId) => assert(lessonIds.has(lessonId), `読み物 ${story.id} が存在しない単元 ${lessonId} を参照しています。`));
    story.labIds.forEach((labId) => assert(labIds.has(labId), `読み物 ${story.id} が存在しない図解 ${labId} を参照しています。`));
    story.practiceIds.forEach((practiceId) => assert(practiceIds.has(practiceId), `読み物 ${story.id} が存在しない問題 ${practiceId} を参照しています。`));
    if (["history", "society"].includes(story.type)) {
      assert(story.sources?.length, `読み物 ${story.id} は出典を少なくとも一つ必要とします。`);
    }
    story.sources.forEach((source) => {
      assert(source.title && source.url, `読み物 ${story.id} に不完全な出典があります。`);
      assert(/^https:\/\//.test(source.url), `読み物 ${story.id} の出典 URL は HTTPS を使ってください。`);
    });
    (story.portraits || []).forEach((portrait) => {
      assert(portrait.src && portrait.alt && portrait.caption, `読み物 ${story.id} の肖像に src / alt / caption が必要です。`);
      assert(existsSync(resolve(root, "src", portrait.src)), `読み物 ${story.id} の肖像ファイルが見つかりません: ${portrait.src}`);
    });
  });

  assertUnique(figures, "id", "数学者");
  figures.forEach((figure) => {
    assert(figure.id && figure.name && figure.achievement, `数学者 ${figure.id} の基本情報が不足しています。`);
    assert(Array.isArray(figure.profile) && figure.profile.length, `数学者 ${figure.id} のプロフィールがありません。`);
    assert(Array.isArray(figure.contributions) && figure.contributions.length, `数学者 ${figure.id} の寄与の説明がありません。`);
    const portrait = figure.portrait;
    assert(portrait?.src && portrait?.alt, `数学者 ${figure.id} の肖像に src / alt が必要です。`);
    assert(portrait?.src && existsSync(resolve(root, "src", portrait.src)), `数学者 ${figure.id} の肖像ファイルが見つかりません: ${portrait?.src}`);
    (figure.related?.stories || []).forEach((storyId) => assert(storyCatalog[storyId], `数学者 ${figure.id} が存在しない読み物 ${storyId} を参照しています。`));
    (figure.related?.figures || []).forEach((refId) => assert(figureCatalog[refId], `数学者 ${figure.id} が存在しない人物 ${refId} を参照しています。`));
    (figure.related?.lessons || []).forEach((lessonId) => assert(lessonIds.has(lessonId), `数学者 ${figure.id} が存在しない単元 ${lessonId} を参照しています。`));
    (figure.related?.labs || []).forEach((labId) => assert(labIds.has(labId), `数学者 ${figure.id} が存在しない図解 ${labId} を参照しています。`));
  });

  const sourceFiles = ["content/lessons.js", "content/topics.js", "content/labs.js", "content/practice.js", "content/stories.js", "content/figures.js", "content/glossary.js"];
  for (const sourceFile of sourceFiles) {
    const source = await readFile(resolve(root, "src", sourceFile), "utf8");
    assert(
      !/<\s*\/?(?:article|button|div|em|h[1-6]|li|p|span|strong|ul)[\s/>]/i.test(source),
      `${sourceFile} に HTML タグらしい文字列があります。教材本文はプレーンテキストと TeX で書いてください。`,
    );
  }

  await validateAssetReferences(resolve(root, "src"));
  if (outputRoot) await validateAssetReferences(outputRoot);
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  await validateContent();
  console.log(`教材データを確認しました（単元 ${units.length}、図解 ${labs.length}、問題 ${practiceCatalog.length}、数学者 ${figures.length}）。`);
}
