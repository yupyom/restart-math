// 練習問題の自己整合テスト（常設ハーネス）。
// 各モードの生成器を繰り返し実行し、次の4点を機械で確かめる：
//   1. 模範解答（answer）を入力欄の書き方に直したものが、自分の check を通る（受理バグの回帰防止）
//   2. でたらめな入力は check を通らない（採点の甘さの検出）
//   3. 問題文・設問・ヒント・答えに NaN / undefined などの生成事故がない
//   4. 数式が TeX の区切り \( ... \) からはみ出していない（素書き事故の検出）
// 答えの表示が複雑で機械変換できないステップには、生成器側で accept（正answerとして
// 受理されるべき入力例の文字列）を持たせる。ここはその変換規則の唯一の置き場所。

import { practiceCatalog } from "../src/content/practice.js";
import { practiceGenerators } from "../src/assets/js/practice-generators.js";
import { advancedPracticeGenerators } from "../src/assets/js/practice-advanced.js";
import { answerToInputText } from "../src/assets/js/math-utils.js";

const RUNS = Number(process.env.PRACTICE_TEST_RUNS || 120);

const brokenTextPattern = /NaN|undefined|null|Infinity|\[object/;

// 生成器の出力テキストに、TeX 区切りの外へ数式がはみ出していないかを見る
// （validate-content.mjs の assertMathIsDelimited と同じ発想の簡易版）。
function hasUndelimitedMath(text) {
  const prose = String(text).replace(/\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, "");
  return /(?:\d|[a-z])\s*(?:[+\-−×÷=<>]|<=|>=)\s*(?:\(?[a-z\d−-])/i.test(prose);
}

const garbageInputs = ["zzz", "そうですね", "99999999", "9999999,9999998"];

const failures = new Set();

function checkStep(modeId, level, runIndex, step, stepIndex) {
  const place = `${modeId}（${level}）step${stepIndex + 1}「${step.label}」`;

  for (const key of ["label", "question", "hint", "answer"]) {
    const value = step[key];
    if (typeof value !== "string" || !value.trim()) {
      failures.add(`${place}: ${key} が空です。`);
      return;
    }
    if (brokenTextPattern.test(value)) {
      failures.add(`${place}: ${key} に生成事故の痕跡があります → ${value}`);
      return;
    }
  }
  if (typeof step.check !== "function") {
    failures.add(`${place}: check が関数ではありません。`);
    return;
  }
  if (["question", "hint"].some((key) => hasUndelimitedMath(step[key]))) {
    failures.add(`${place}: question/hint に TeX 区切りの外の数式があります。`);
  }

  // 1. 模範解答の自己受理
  const input = step.accept ?? answerToInputText(step.answer);
  let accepted = false;
  try {
    accepted = step.check(input) === true;
  } catch (error) {
    failures.add(`${place}: 模範解答入力「${input}」で check が例外を投げました → ${error.message}`);
    return;
  }
  if (!accepted) {
    failures.add(`${place}: 模範解答入力「${input}」（answer: ${step.answer}）が不正解扱いです。`);
  }

  // 選択肢つきの設問は、正解扱いになる選択肢がちょうど1件であること
  // （0件は選んでも正解できない、2件以上は誤答が正解扱いになる事故）。
  if (Array.isArray(step.choices)) {
    const accepted = step.choices.filter((choice) => {
      try {
        return step.check(choice) === true;
      } catch {
        return false;
      }
    });
    if (accepted.length !== 1) {
      failures.add(`${place}: choices のうち正解扱いが ${accepted.length} 件です（1件であるべき）→ ${step.choices.join(" / ")}`);
    }
    if (step.choices.some((choice) => brokenTextPattern.test(String(choice)))) {
      failures.add(`${place}: choices に生成事故の痕跡があります → ${step.choices.join(" / ")}`);
    }
  }
  if (step.example !== undefined && (typeof step.example !== "string" || brokenTextPattern.test(step.example))) {
    failures.add(`${place}: example が不正です → ${step.example}`);
  }

  // 2. でたらめ入力の拒否（初回の run だけで十分）
  if (runIndex === 0) {
    for (const garbage of garbageInputs) {
      let wrongly = false;
      try {
        wrongly = step.check(garbage) === true;
      } catch {
        wrongly = false;
      }
      if (wrongly) failures.add(`${place}: でたらめな入力「${garbage}」が正解扱いです。`);
    }
  }
}

function checkGenerator(modeId, level, generator) {
  for (let run = 0; run < RUNS; run += 1) {
    let problem;
    try {
      problem = generator();
    } catch (error) {
      failures.add(`${modeId}（${level}）: 生成時に例外 → ${error.message}`);
      return;
    }
    for (const key of ["title", "prompt"]) {
      const value = problem[key];
      if (typeof value !== "string" || !value.trim() || brokenTextPattern.test(value)) {
        failures.add(`${modeId}（${level}）: ${key} が不正です → ${value}`);
        return;
      }
    }
    if (hasUndelimitedMath(problem.prompt)) {
      failures.add(`${modeId}（${level}）: prompt に TeX 区切りの外の数式があります → ${problem.prompt}`);
    }
    if (!Array.isArray(problem.steps) || !problem.steps.length) {
      failures.add(`${modeId}（${level}）: steps が空です。`);
      return;
    }
    problem.steps.forEach((step, index) => checkStep(modeId, level, run, step, index));
    if (failures.size > 40) return; // 出力が溢れないよう早めに打ち切る
  }
}

export async function testPractice() {
  for (const mode of practiceCatalog) {
    const starter = practiceGenerators[mode.id];
    if (typeof starter !== "function") {
      failures.add(`${mode.id}: 「はじめの一問」の生成器がありません。`);
      continue;
    }
    checkGenerator(mode.id, "はじめの一問", starter);
    const advanced = advancedPracticeGenerators[mode.id];
    if (typeof advanced === "function") checkGenerator(mode.id, "少し進んだ問題", advanced);
    if (failures.size > 40) break;
  }

  if (failures.size) {
    console.error(`練習問題の自己整合テストで ${failures.size} 種類の問題が見つかりました:`);
    [...failures].slice(0, 40).forEach((failure) => console.error(`  - ${failure}`));
    process.exit(1);
  }

  const advancedCount = practiceCatalog.filter((mode) => advancedPracticeGenerators[mode.id]).length;
  console.log(
    `練習問題を確認しました（${practiceCatalog.length} モード × 各${RUNS}回生成、うち発展問題つき ${advancedCount}）。`,
  );
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  await testPractice();
}
