// 読み物は単元本文とは別の補助線です。ここだけを読まなくても問題演習へ進めます。
export const storySourcePolicy = {
  rule: "計算の約束を説明する読み物は、具体例とその確かめ方を必ず添える。",
  history: "人物・年代・発見の事実には、一次資料、公的機関、博物館、大学のいずれかを出典として示す。",
  society: "社会・仕事・統計の数値には、作成者、公開日、対象範囲が分かる出典を示す。",
};

// 読み物は1件1ファイル（stories/<id>.js）。ここは import と storySourcePolicy・一覧・カタログの合成だけを持つ。
import { story as sharedCalculationOrder } from "./stories/shared-calculation-order.js";
import { story as parenthesesChangeTheReading } from "./stories/parentheses-change-the-reading.js";
import { story as distributeToEveryPart } from "./stories/distribute-to-every-part.js";
import { story as equalSignKeepsBalance } from "./stories/equal-sign-keeps-balance.js";
import { story as negativeNumbersHaveDirection } from "./stories/negative-numbers-have-direction.js";
import { story as notationChangesWithThePage } from "./stories/notation-changes-with-the-page.js";
import { story as lettersAreLabels } from "./stories/letters-are-labels.js";
import { story as descartesAlgebraMeetsGeometry } from "./stories/descartes-algebra-meets-geometry.js";
import { story as gaussPatternsInIntegers } from "./stories/gauss-patterns-in-integers.js";
import { story as nightingaleDataForExplanation } from "./stories/nightingale-data-for-explanation.js";
import { story as pacioliRecordingBothSides } from "./stories/pacioli-recording-both-sides.js";
import { story as recordeEqualSign } from "./stories/recorde-equal-sign.js";
import { story as alKhwarizmiAlgebra } from "./stories/al-khwarizmi-algebra.js";
import { story as cantorSetsAndInfinity } from "./stories/cantor-sets-and-infinity.js";
import { story as alBattaniTrigonometry } from "./stories/al-battani-trigonometry.js";
import { story as pascalFermatProbability } from "./stories/pascal-fermat-probability.js";
import { story as euclidElements } from "./stories/euclid-elements.js";

export const stories = [
  sharedCalculationOrder,
  parenthesesChangeTheReading,
  distributeToEveryPart,
  equalSignKeepsBalance,
  negativeNumbersHaveDirection,
  notationChangesWithThePage,
  lettersAreLabels,
  descartesAlgebraMeetsGeometry,
  gaussPatternsInIntegers,
  nightingaleDataForExplanation,
  pacioliRecordingBothSides,
  recordeEqualSign,
  alKhwarizmiAlgebra,
  cantorSetsAndInfinity,
  alBattaniTrigonometry,
  pascalFermatProbability,
  euclidElements,
];

export const storyCatalog = Object.fromEntries(stories.map((story) => [story.id, story]));
