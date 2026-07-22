import { unitLabRefs } from "./labs.js";

// 単元の本文は lessons/<id>.js（1単元1ファイル）。本文の編集はそちらで行う。
// このファイルは目次と表示順（learningPath）・メタデータの合成だけを持つ。
import { unit as integersSigns } from "./lessons/integers-signs.js";
import { unit as integerRules } from "./lessons/integer-rules.js";
import { unit as absoluteValue } from "./lessons/absolute-value.js";
import { unit as distributionNumbers } from "./lessons/distribution-numbers.js";
import { unit as primeFactorization } from "./lessons/prime-factorization.js";
import { unit as powersRoots } from "./lessons/powers-roots.js";
import { unit as simplifyRoots } from "./lessons/simplify-roots.js";
import { unit as rootOperations } from "./lessons/root-operations.js";
import { unit as numberClassification } from "./lessons/number-classification.js";
import { unit as fractionArithmetic } from "./lessons/fraction-arithmetic.js";
import { unit as lettersAsBoxes } from "./lessons/letters-as-boxes.js";
import { unit as likeTerms } from "./lessons/like-terms.js";
import { unit as distributionLetters } from "./lessons/distribution-letters.js";
import { unit as exponentRules } from "./lessons/exponent-rules.js";
import { unit as expansionFormulas } from "./lessons/expansion-formulas.js";
import { unit as factoring } from "./lessons/factoring.js";
import { unit as setsPropositions } from "./lessons/sets-propositions.js";
import { unit as vennDiagrams } from "./lessons/venn-diagrams.js";
import { unit as logicConverse } from "./lessons/logic-converse.js";
import { unit as necessarySufficient } from "./lessons/necessary-sufficient.js";
import { unit as whatIsProof } from "./lessons/what-is-proof.js";
import { unit as proofPractice } from "./lessons/proof-practice.js";
import { unit as geometryProofs } from "./lessons/geometry-proofs.js";
import { unit as linearInequalities } from "./lessons/linear-inequalities.js";
import { unit as absoluteValueEquations } from "./lessons/absolute-value-equations.js";
import { unit as identitiesEquations } from "./lessons/identities-equations.js";
import { unit as linearEquations } from "./lessons/linear-equations.js";
import { unit as equationModeling } from "./lessons/equation-modeling.js";
import { unit as simultaneousEquations } from "./lessons/simultaneous-equations.js";
import { unit as functions } from "./lessons/functions.js";
import { unit as functionNotation } from "./lessons/function-notation.js";
import { unit as quadraticVertex } from "./lessons/quadratic-vertex.js";
import { unit as quadraticEquations } from "./lessons/quadratic-equations.js";
import { unit as quadraticInequalities } from "./lessons/quadratic-inequalities.js";
import { unit as trigRatios } from "./lessons/trig-ratios.js";
import { unit as sineCosineRule } from "./lessons/sine-cosine-rule.js";
import { unit as parallelLinesAngles } from "./lessons/parallel-lines-angles.js";
import { unit as trigExtension } from "./lessons/trig-extension.js";
import { unit as dataAnalysisI } from "./lessons/data-analysis-i.js";
import { unit as countingPrinciples } from "./lessons/counting-principles.js";
import { unit as permutations } from "./lessons/permutations.js";
import { unit as combinations } from "./lessons/combinations.js";
import { unit as combinationsRepetition } from "./lessons/combinations-repetition.js";
import { unit as circularPermutations } from "./lessons/circular-permutations.js";
import { unit as probabilityA } from "./lessons/probability-a.js";
import { unit as complementaryEvents } from "./lessons/complementary-events.js";
import { unit as conditionalProbability } from "./lessons/conditional-probability.js";
import { unit as geometryA } from "./lessons/geometry-a.js";
import { unit as mathHumanActivities } from "./lessons/math-human-activities.js";
import { unit as geometry } from "./lessons/geometry.js";
import { unit as piAndApproximation } from "./lessons/pi-and-approximation.js";
import { unit as pythagoreanTheorem } from "./lessons/pythagorean-theorem.js";
import { unit as similarity } from "./lessons/similarity.js";
import { unit as data } from "./lessons/data.js";
import { unit as boxPlots } from "./lessons/box-plots.js";
import { unit as arithmeticSequences } from "./lessons/arithmetic-sequences.js";
import { unit as geometricSequences } from "./lessons/geometric-sequences.js";
import { unit as sigmaNotation } from "./lessons/sigma-notation.js";
import { unit as geometricSeriesSum } from "./lessons/geometric-series-sum.js";
import { unit as sumAndGeneralTerm } from "./lessons/sum-and-general-term.js";
import { unit as differenceSequences } from "./lessons/difference-sequences.js";
import { unit as recurrenceRelations } from "./lessons/recurrence-relations.js";
import { unit as mathematicalInduction } from "./lessons/mathematical-induction.js";
import { unit as examReview } from "./lessons/exam-review.js";

const rawUnits = [
  integersSigns,
  integerRules,
  absoluteValue,
  distributionNumbers,
  primeFactorization,
  powersRoots,
  simplifyRoots,
  rootOperations,
  numberClassification,
  fractionArithmetic,
  lettersAsBoxes,
  likeTerms,
  distributionLetters,
  exponentRules,
  expansionFormulas,
  factoring,
  setsPropositions,
  vennDiagrams,
  logicConverse,
  necessarySufficient,
  whatIsProof,
  proofPractice,
  geometryProofs,
  linearInequalities,
  absoluteValueEquations,
  identitiesEquations,
  linearEquations,
  equationModeling,
  simultaneousEquations,
  functions,
  functionNotation,
  quadraticVertex,
  quadraticEquations,
  quadraticInequalities,
  trigRatios,
  sineCosineRule,
  parallelLinesAngles,
  trigExtension,
  dataAnalysisI,
  countingPrinciples,
  permutations,
  combinations,
  combinationsRepetition,
  circularPermutations,
  probabilityA,
  complementaryEvents,
  conditionalProbability,
  geometryA,
  mathHumanActivities,
  geometry,
  piAndApproximation,
  pythagoreanTheorem,
  similarity,
  data,
  boxPlots,
  arithmeticSequences,
  geometricSequences,
  sigmaNotation,
  geometricSeriesSum,
  sumAndGeneralTerm,
  differenceSequences,
  recurrenceRelations,
  mathematicalInduction,
  examReview,
];

// 本文を読んでいて「なぜ？」で止まったときだけ開く補助線です。
const lessonContexts = {
  "fraction-arithmetic": {
    why: {
      question: "たし算とかけ算で、なぜ分母のあつかいが違うの？",
      answer:
        "分数は『1を何等分したいくつ分か』を表します。たし算・ひき算は同じ大きさの部品どうしでないと数えられないので、分母（＝1等分の大きさ）をそろえてから分子を足し引きします。かけ算は『全体の一部の、そのまた一部』を取り出す操作なので、分子どうし・分母どうしをそのまま掛けて新しい大きさを作れます。だから通分が要るのはたし算・ひき算だけです。",
      tryIt:
        "\\(\\frac12+\\frac13\\) を、まず分母を6にそろえて \\(\\frac36+\\frac26=\\frac56\\) と出す。かけ算 \\(\\frac12\\times\\frac13=\\frac16\\) は通分なしでよいことと見比べる",
    },
    definitions: [
      {
        term: "通分",
        meaning: "分母のちがう分数を、共通の分母（多くは最小公倍数）にそろえること。たし算・ひき算の前に行う",
        example: "\\(\\frac56\\) と \\(\\frac14\\) は分母を12にそろえて \\(\\frac{10}{12}\\) と \\(\\frac{3}{12}\\)",
        boundary: "通分しても分数の大きさは変わらない（分子と分母を同じ数で掛けているだけ）。かけ算・わり算では通分は不要",
      },
      {
        term: "約分",
        meaning: "分子と分母を同じ数で割って、より簡単な分数に直すこと。最大公約数で割ると一度で既約分数になる",
        example: "\\(\\frac{6}{36}\\) は分子分母を6で割って \\(\\frac16\\)",
        boundary: "約分できるのは分子と分母の共通の約数があるときだけ。値は変わらない",
      },
      {
        term: "逆数",
        meaning: "分子と分母を入れかえた数。もとの数に掛けると1になる。わり算はこの逆数のかけ算に直せる",
        example: "\\(\\frac49\\) の逆数は \\(\\frac94\\)。\\(\\frac23\\div\\frac49=\\frac23\\times\\frac94\\)",
        boundary: "0 に逆数はない（0 で割れないのと同じ理由）",
      },
    ],
    connections: [
      {
        kind: "practice",
        title: "分数の四則を反復する",
        summary:
          "練習『分数の四則』は、通分のたし引き・約分のかけ算・逆数のわり算に加えて、比の約分と概算まで一続きで出します。手を動かして型を体にいれましょう。",
        practiceId: "fraction-arithmetic",
      },
    ],
  },
  "pi-and-approximation": {
    why: {
      question: "どうして \\(\\pi\\) を最後まで記号のまま運ぶの？",
      answer:
        "\\(\\pi\\) は割り切れず循環もしない無理数なので、\\(3.14\\) と書いた時点で必ずわずかな誤差が入ります。途中で近似すると、その誤差が計算のたびに積もっていきます。記号のまま進めれば \\(25\\pi\\) のような正確な形を保て、近似は最後の一回だけで済むので、誤差を最小にできます。",
      tryIt:
        "半径 \\(5\\) の円の面積を、先に \\(\\pi\\approx3\\) として \\(75\\)、記号のまま \\(25\\pi\\) を出してから \\(3.14\\) で \\(78.5\\)、と二通りで出して差を比べる",
    },
    definitions: [
      {
        term: "円周率 \\(\\pi\\)",
        meaning:
          "どんな円でも変わらない『円周 ÷ 直径』の値。\\(3.14159\\ldots\\) と循環せず無限に続く無理数",
        example:
          "直径 \\(10\\) の円の円周は \\(10\\pi\\approx31.4\\)。直径が2倍になれば円周も2倍で、比 \\(\\pi\\) は変わらない",
        boundary:
          "\\(3.14\\) や \\(\\dfrac{22}{7}\\) は覚えやすい近似値であって \\(\\pi\\) 本人ではない。等号ではなく \\(\\approx\\) でつなぐ",
      },
      {
        term: "近似値",
        meaning: "正確な値のかわりに使う、けたを区切った近い数。記号（正確な形）とはっきり区別する",
        example:
          "\\(36\\pi\\) が正確な形、\\(113.04\\) が近似値。『\\(\\pi\\) を用いて答えよ』なら \\(36\\pi\\) のままが正解",
        boundary: "近似値どうしをさらに計算すると誤差が重なる。近似は『答えを出す最後の一歩』でだけ行う",
      },
      {
        term: "誤差",
        meaning: "近似値と正確な値とのずれ。丸めを早く始めるほど大きくなりやすい",
        example:
          "\\(\\pi\\) を \\(3\\) と置くと面積 \\(25\\pi\\) は \\(75\\)——正確な \\(78.5\\) からおよそ \\(3.5\\) もずれる",
        boundary:
          "小数第何位まで求めるかで \\(\\pi\\) を何けた使うかが決まる。必要なけたより一つ多く持って計算し、最後に丸める",
      },
    ],
    connections: [],
  },
  "exam-review": {
    why: {
      question: "答えが出たのに、どうしてもう一度「元の場面」に戻すの？",
      answer:
        "式は場面を写したものなので、答えの符号・大きさ・単位が場面と合っているかは、戻って初めて分かります。『個数なのに負』『割引後なのに元より高い』といった取り違えは、ここで気づけます。同じ理由で、示された平均やグラフも鵜呑みにせず自分で計算し直すと、見せ方のトリックに気づけるようになります。",
      tryIt:
        "利益の問題で出た \\(x=8\\) を式に戻し、売上 \\(600\\times8=4800\\)・費用 \\(300\\times8+1000=3400\\)・利益 \\(4800-3400=1400\\) と場面に合うか確かめる",
    },
    definitions: [
      {
        term: "重み付き平均",
        meaning:
          "項目ごとに『割合（重み）× 値』を足し合わせて出す平均。全部を同じ扱いにする単純平均とは別物",
        example:
          "中間が \\(40\\%\\)・期末が \\(60\\%\\) の配点で、中間70点・期末90点なら \\(0.4\\times70+0.6\\times90=82\\) 点",
        boundary:
          "重みを無視して \\((70+90)\\div2=80\\) とすると配点を取り違える。重みの合計が1（100%）になっているかも確かめる",
      },
      {
        term: "成長率",
        meaning:
          "『前と比べて何％増えたか』を表す割合。くり返すときは足すのではなく \\(\\times(1+r)\\) を重ねる",
        example:
          "毎月 \\(10\\%\\) 増が3か月続くと \\(1.1^3=1.331\\)——つまり合計33.1%増で、\\(10\\times3=30\\%\\) より大きい",
        boundary:
          "『10%増のあと10%減』は元に戻らない（\\(1.1\\times0.9=0.99\\)）。％は必ず『何に対しての％か』を確かめる",
      },
      {
        term: "グラフの軸",
        meaning:
          "棒や折れ線の高さを読むときの基準線。縦軸がどこから始まり、目盛りが何刻みかで見た目の差が大きく変わる",
        example:
          "縦軸を100から始めれば、102と104の棒は『2倍の差』のように見える。0から始めればほとんど同じ高さ",
        boundary:
          "『増えて見える／減って見える』と感じたら、まず縦軸の起点・目盛りの幅・割合か実数かを確かめる。印象でなく数値で判断する",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "会計ラボで式の各項を図に対応させる",
        summary:
          "会計ラボは売上・変動費・固定費・利益を別々のバーで見せます。方程式 \\(600x-(300x+1000)=1400\\) の各項がどのバーにあたるかを対応させ、式と図を行き来しましょう。",
        labId: "accounting-balance-lab",
      },
      {
        kind: "practice",
        title: "混合出題で往復を反復する",
        summary:
          "『学び直し総合』の練習は、方程式・分配など複数の型を混ぜて出します。文章→式→答え→確かめの往復を、手を動かして反復しましょう。",
        practiceId: "exam-review",
      },
    ],
  },
  "geometric-sequences": {
    why: {
      question: "等比数列は生活のどこに出てくるの？",
      answer:
        "銀行の複利は『残高 ×（1＋利率）』を毎期繰り返すしくみなので、残高そのものが等比数列になります。預金なら増える側、借金なら増やされる側です。『お金が2倍になるまでの年数 ≒ 72 ÷ 金利(%)』という有名な目安（72の法則）も、等比数列の増え方から来ています。",
      tryIt: "10万円を年利 \\(3\\%\\) の複利で預けたとき、2年後の \\(10\\times1.03^2\\approx10.6\\) 万円を電卓で確かめる。72の法則なら \\(72\\div3=24\\) 年でおよそ2倍",
    },
    definitions: [
      {
        term: "複利",
        meaning: "ついた利息を元金に組み入れ、次の期は『元金＋利息』の合計に利率をかける方式",
        example: "初項10万円・公比 \\(1.03\\) の等比数列。\\(n\\) 年後は \\(10\\times1.03^n\\) 万円",
        boundary: "単利は元金にだけ利息が付くので等差数列的にしか増えない。増え方のケタが違う",
      },
      {
        term: "リボ払い",
        meaning: "毎月の返済額を一定にし、残高に毎月手数料率（年15%程度が多い）がかかる返済方式",
        example: "手数料は残高全体に比例してかかり続けるため、定額返済だと元金がなかなか減らず、支払総額が想像以上に大きくなりやすい。このことは、家庭科の授業や金融広報中央委員会の資料でも注意が呼びかけられている",
        boundary: "毎月の支払額が同じでも、手数料は『残高全体』にかかり続ける——ここが等比数列の見どころ",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "返済ラボで単利と複利を見比べる",
        summary: "返済ラボは単利と複利を切り替えられます。同じ年率でも、期間を延ばすほど等比数列で増える複利との差が開いていく様子を見比べましょう。",
        labId: "loan-balance-lab",
      },
    ],
    storyIds: [],
  },
  "integers-signs": {
    why: {
      question: "どうして 0 より左にも数を広げるの？",
      answer: "基準より反対向きの量も、同じ一本の物差しで表せるようにするためです。",
      tryIt: "数直線で \\(-3\\) から右へ \\(5\\)、左へ \\(5\\) 進む動きを比べる",
    },
    definitions: [
      {
        term: "負の数",
        meaning: "\\(0\\) を基準にして、正の向きと反対側にある数",
        example: "\\(-3\\) は \\(0\\) から左へ \\(3\\) 進んだ位置",
        boundary: "負号は『数が負』を示す場合と『引く』操作を示す場合があるので、式の位置を見る",
      },
    ],
    connections: [
      { kind: "model", title: "数直線で向きを見る", summary: "温度や高さのように、基準からどちらへどれだけ離れたかを一つの数で表せます。", labId: "number-line-lab" },
    ],
    storyIds: ["negative-numbers-have-direction"],
  },
  "integer-rules": {
    why: {
      question: "どうして計算する順番を決めるの？",
      answer: "同じ式を読む人によって答えが変わらないよう、共通の読み方を決めているからです。",
      tryIt: "\\(2+3×4\\) を、先に足す場合と先にかける場合で比べる",
    },
    definitions: [
      {
        term: "式",
        meaning: "数や記号を、計算の約束に従って並べたもの",
        example: "\\(2+3×4\\) は、順番の約束に従って読める式",
        boundary: "等号で成り立つかを問うと、方程式や等式として別の役割を持つ",
      },
      {
        term: "かっこ",
        meaning: "いつもの計算順序の中で、先に一まとまりとして読む部分を示す印",
        example: "\\((2+3)×4\\) では \\(2+3\\) を先に計算する",
        boundary: "かっこがなければ、足し算より乗算を先に読む",
      },
    ],
    connections: [
      { kind: "shared-rule", title: "同じ式を同じ答えへ", summary: "計算順序をそろえると、途中式を見せ合ってどこを直すか確認できます。", storyId: "shared-calculation-order" },
      { kind: "model", title: "かっこを面積で確かめる", summary: "一まとまりを先に作る意味は、長方形を分けたり合わせたりする見方でも確かめられます。", storyId: "parentheses-change-the-reading" },
    ],
    storyIds: ["shared-calculation-order", "parentheses-change-the-reading", "notation-changes-with-the-page"],
  },
  "distribution-numbers": {
    why: {
      question: "どうして、かっこの外の数を中の全部にかけるの？",
      answer: "全体を同じ倍率にするなら、全体を作る各部分も同じ倍率にする必要があるからです。",
      tryIt: "\\(6×(10+3)\\) と \\(6×10+6×3\\) を、二つに分けた長方形で比べる",
    },
    definitions: [
      {
        term: "分配法則",
        meaning: "一つの数を和や差の各部分に配ってかけても、全体を先にまとめてかけても同じになる規則",
        example: "\\(6(10+3)=6×10+6×3\\)",
        boundary: "足し算そのものをかけ算に変える規則ではなく、かっこの外にあるかけ算を配る規則",
      },
    ],
    connections: [
      { kind: "daily-life", title: "暗算を分けて軽くする", summary: "\\(6×13\\) を \\(6×10\\) と \\(6×3\\) に分けると、小さい計算を足して求められます。", labId: "distribution-lab" },
    ],
    storyIds: ["parentheses-change-the-reading"],
  },
  "letters-as-boxes": {
    why: {
      question: "どうして文字を使い、どうして文字ごとに意味が違うの？",
      answer: "まだ決まっていない数や繰り返し使う量に短い名前を付けると、値が変わっても同じ関係を一つの式で表せるからです。文字の選び方は慣習で、問題ごとの定義が最優先です。",
      tryIt: "りんご1個の値段を \\(a\\) 円として、3個・5個の値段を \\(3a\\)、\\(5a\\) と書く",
    },
    definitions: [
      {
        term: "変数・未知数",
        meaning: "変数は変わり得る量を表す文字、未知数は条件から値を求める文字",
        example: "関数 \\(y=2x+1\\) の \\(x\\) は入力により変わり、方程式 \\(x+2=7\\) の \\(x\\) は求める数",
        boundary: "同じ文字でも、式の役割によって変数にも未知数にもなる",
      },
      {
        term: "係数と省略されたかけ算",
        meaning: "\\(3a\\) の \\(3\\) は係数で、\\(3\\times a\\) を表す",
        example: "\\(-a\\) は \\(-1\\times a\\)、\\(ab\\) は \\(a\\times b\\)",
        boundary: "数は文字の前に置くので \\(a\\times3\\) も \\(3a\\) と書く。\\(a_3\\) は3番目の \\(a\\) で積ではない",
      },
      {
        term: "文字の慣習",
        meaning: "\\(a,b,c\\) は一般の数、\\(x,y\\) は未知数や座標、\\(i,j,k\\) は番号によく使うという傾向",
        example: "物理では速度を \\(v\\)、時間を \\(t\\) と置くことが多い",
        boundary: "絶対の規則ではない。式の前後にある『とする』『ただし』を必ず読む",
      },
    ],
    connections: [
      { kind: "notation", title: "教科が変わっても記号を読めるようにする", summary: "よく使う文字の慣習、\\(3a\\) と \\(a_3\\) の違い、物理量の記号を読み分けます。", storyId: "letters-are-labels" },
      { kind: "model", title: "文字をカードとして数える", summary: "\\(x\\) カードを3枚並べ、\\(3x\\) が同じ量3個分であることを確かめます。", labId: "term-lab" },
    ],
    storyIds: ["letters-are-labels"],
  },
  "distribution-letters": {
    why: {
      question: "文字が入っても、分配法則は使えるの？",
      answer: "文字はまだ決まっていない数を表す箱なので、数で成り立つ規則は文字にもそのまま使えるからです。",
      tryIt: "\\(3(x+4)\\) を \\(x\\) カードと 1 カードの三組として数える",
    },
    definitions: [
      {
        term: "係数",
        meaning: "文字の前にある、同じ文字が何個分かを表す数",
        example: "\\(3x\\) の 3 は \\(x\\) が 3 個分という意味",
        boundary: "\\(x+3\\) の 3 は \\(x\\) の係数ではなく、別の定数項",
      },
    ],
    connections: [
      { kind: "model", title: "展開と面積は同じ考え", summary: "長方形を分ける見方は、文字式を展開するときにもそのまま使えます。", labId: "distribution-lab" },
    ],
    storyIds: ["distribute-to-every-part"],
  },
  "identities-equations": {
    why: {
      question: "同じ等号なのに、方程式と恒等式を分けるのはなぜ？",
      answer: "方程式では成り立つ値を探し、恒等式では二つの式がいつでも同じ量を表すことを確かめるからです。目的を分けると、代入するのか、展開・因数分解するのかを選びやすくなります。",
      tryIt: "\\(x+2=7\\) と \\(2(x+3)=2x+6\\) に、\\(x=0,1,5\\) を順に代入して比べる",
    },
    definitions: [
      {
        term: "等号",
        meaning: "左右の量が同じであることを示す印",
        example: "\\(3+4=7\\) では、左の量と右の量が等しい",
        boundary: "次の計算へ進む矢印ではない。式変形の途中でも左右が同じことを保つ",
      },
      {
        term: "方程式",
        meaning: "成り立つ文字の値を探す等式",
        example: "\\(x+2=7\\) は \\(x=5\\) のとき成り立つ",
        boundary: "\\((x+2)^2=x^2+4x+4\\) は、どの \\(x\\) でも成り立つ恒等式",
      },
      {
        term: "恒等式",
        meaning: "考えている範囲のどの文字の値でも成り立つ等式",
        example: "\\(2(x+3)=2x+6\\) は分配法則による展開の前後を表す",
        boundary: "いくつかの値で成り立つことを確かめただけでは、すべての値で成り立つ証明にはならない",
      },
    ],
    connections: [
      { kind: "model", title: "つり合いを図で見る", summary: "両辺へ同じ操作をする理由は、ブロックを載せた天びんのつり合いとして確かめられます。", labId: "equation-lab" },
      { kind: "history", title: "等号が文章を短くした", summary: "ロバート・レコードが二本の線を等号として用いた背景と、記号がすぐには定着しなかったことを読みます。", storyId: "recorde-equal-sign" },
    ],
    storyIds: ["equal-sign-keeps-balance", "recorde-equal-sign"],
  },
  "linear-equations": {
    why: {
      question: "移項とだけ覚えずに、両辺を操作するのはなぜ？",
      answer: "何をしたかが左右で分かるようにすると、符号だけを機械的に変えるより間違いを見つけやすいからです。",
      tryIt: "\\(3x−5=16\\) の両辺に 5 を足し、次に両辺を 3 で割る",
    },
    definitions: [
      {
        term: "解",
        meaning: "方程式を成り立たせる文字の値",
        example: "\\(3x−5=16\\) の解は \\(x=7\\)",
        boundary: "途中に出る \\(3x=21\\) は解ではなく、同じ解を持つ途中の等式",
      },
    ],
    connections: [
      { kind: "model", title: "天びんのつり合い", summary: "式を変形する操作は、左右から同じブロックを動かす操作と対応します。", labId: "equation-lab" },
      { kind: "history", title: "文章から始まった代数", summary: "アル＝フワーリズミが記号を使わず、実用上の問題を言葉と方程式で整理した仕事を読みます。", storyId: "al-khwarizmi-algebra" },
    ],
    storyIds: ["equal-sign-keeps-balance", "al-khwarizmi-algebra"],
  },
  "equation-modeling": {
    why: {
      question: "文章のどこを等号で結べばよいの？",
      answer: "左右に同じ種類・同じ単位の量を置きます。『鉛筆代と消しゴム代の合計』と『支払った500円』のように、同じ総量の二つの表し方を探します。",
      tryIt: "鉛筆3本と80円の消しゴムで合計500円という文に、円を表す部分へ下線を引く",
    },
    definitions: [
      {
        term: "立式",
        meaning: "文章や図にある数量の関係を、文字と演算記号を使った式に直すこと",
        example: "鉛筆1本を \\(x\\) 円と置き、\\(3x+80=500\\) と表す",
        boundary: "単位の違う量をそのまま等号で結ばない。円なら左右とも円、長さなら左右とも同じ長さの単位にそろえる",
      },
    ],
    connections: [
      { kind: "model", title: "同じ総量を天びんで見る", summary: "文章の左右が同じ量を表すことを、つり合ったブロックとして確かめます。", labId: "equation-lab" },
      { kind: "application", title: "速さ・時間・道のりへつなぐ", summary: "単位を確かめながら、道のりを二通りに表す文章題へ進めます。", labId: "speed-distance-lab" },
      { kind: "history", title: "生活の問題を方程式にする", summary: "相続・取引・測量などの問題を整理するために代数が使われた背景を読みます。", storyId: "al-khwarizmi-algebra" },
    ],
    storyIds: ["al-khwarizmi-algebra", "recorde-equal-sign"],
  },
  "linear-inequalities": {
    why: {
      question: "不等号の向きは、見た目だけで覚えてよいの？",
      answer: "向きは二つの数の大小関係を示しています。負の数をかけたり割ったりすると、数直線で左右の向きが反転するため、不等号も反対向きになります。",
      tryIt: "\\(2<5\\) の両辺に \\(−1\\) をかけ、\\(−2\\) と \\(−5\\) の位置を数直線で比べる",
    },
    definitions: [
      {
        term: "以上・以下",
        meaning: "境目の数を含める大小関係。\\(x\\le3\\) は \\(x=3\\) も含む",
        example: "\\(x\\le3\\) は『\\(x\\) は \\(3\\) 以下』と読む",
        boundary: "\\(<\\) と \\(\\le\\) は、境目の数を含むかどうかが違う",
      },
      {
        term: "不等式の解",
        meaning: "不等式を成り立たせる値すべて。多くの場合、一つの数ではなく範囲になる",
        example: "\\(x\\le3\\) の解には \\(3,2,0,-10\\) などがすべて含まれる",
        boundary: "回数や個数の文章題では、計算上の範囲から0以上の整数だけを選ぶ場合がある",
      },
    ],
    connections: [
      { kind: "notation", title: "記号の形と意味を分けて読む", summary: "\\(a\\leqq b\\)（2本線）と \\(a\\mathrel{\\unicode{x2264}} b\\)（1本線）のように字形が異なる場合もあります。どちらも「\\(a\\) は \\(b\\) 以下」と読むことを、式の前後で確かめましょう。", storyId: "notation-changes-with-the-page" },
    ],
    storyIds: ["notation-changes-with-the-page"],
  },
  "sets-propositions": {
    why: {
      question: "なぜ、条件に合うものを集合として箱に入れるの？",
      answer: "文章の『かつ』『または』『〜ならば』を、どの要素が条件を満たすかという形で見えるようにし、読み違いを減らすためです。",
      tryIt: "1から12までの数を、偶数の箱と3の倍数の箱へ分ける",
    },
    definitions: [
      {
        term: "共通部分と和集合",
        meaning: "\\(A\\cap B\\) は両方に入る要素、\\(A\\cup B\\) は少なくとも一方に入る要素の集合",
        example: "偶数と3の倍数の共通部分には \\(6\\) と \\(12\\) が入る",
        boundary: "和集合の『または』は両方に入る場合も含む",
      },
      {
        term: "命題と反例",
        meaning: "命題は真偽を決められる文。反例は『すべて成り立つ』という主張を崩す一例",
        example: "『偶数なら4の倍数』には、偶数 \\(2\\) という反例がある",
        boundary: "対偶や必要・十分条件は、集合と反例に慣れた後の段階で扱う",
      },
    ],
    connections: [
      { kind: "model", title: "数カードを条件で仕分ける", summary: "一枚ずつ条件を確かめると、\\(\\cap\\) と \\(\\cup\\) の違いが図として残ります。", labId: "set-sort-lab" },
      { kind: "history", title: "集合そのものを研究対象にした", summary: "カントールが有限の箱分けを越えて、無限集合の大きさまで調べた背景を読みます。", storyId: "cantor-sets-and-infinity" },
    ],
    storyIds: ["cantor-sets-and-infinity"],
  },
  functions: {
    why: {
      question: "なぜ同じ関係を、式・表・グラフの三つで表すの？",
      answer: "式は計算の規則、表は具体的な値、グラフは変化の全体像を見せます。同じ関係を別の表し方で確かめると、読み落としを見つけやすくなるからです。",
      tryIt: "関数ラボで係数を一つ動かし、式・入力と出力・グラフの変化を同時に見る",
    },
    definitions: [
      {
        term: "関数・入力・出力",
        meaning: "一つの入力を決めると、対応する出力がただ一つ決まる関係",
        example: "\\(y=2x+1\\) では、\\(x=3\\) を入れると \\(y=7\\) が一つに決まる",
        boundary: "一つの入力から出力が二つに分かれる関係は、ここでいう \\(y\\) を \\(x\\) の関数とする条件を満たさない",
      },
    ],
    connections: [
      { kind: "model", title: "入力と出力をグラフへ置く", summary: "係数を動かし、式・表・グラフが同時に変わる様子を確かめます。", labId: "function-lab" },
      { kind: "history", title: "式と図形を結ぶ座標", summary: "代数を幾何へ使う考えが、現在の座標とグラフへどうつながるかを読みます。", storyId: "descartes-algebra-meets-geometry" },
      { kind: "society", title: "売上・費用・利益を分けて記録する", summary: "会計で量を分け、対応関係を検算する考えを短く読みます。", storyId: "pacioli-recording-both-sides" },
    ],
    storyIds: ["descartes-algebra-meets-geometry", "pacioli-recording-both-sides"],
  },
  "trig-ratios": {
    why: {
      question: "なぜ辺の長さではなく、辺どうしの比を見るの？",
      answer: "同じ角をもつ直角三角形は相似で、大きさが変わっても対応する辺の比は一定だからです。その比を角度ごとの名前にしたものが三角比です。",
      tryIt: "三角比ラボで角度を35°に固定し、斜辺だけを変えて三つの比を比べる",
    },
    definitions: [
      {
        term: "対辺・隣辺・斜辺",
        meaning: "対辺と隣辺は注目する角 \\(\\theta\\) から見て決まり、斜辺は直角の向かいにある最長の辺",
        example: "3・4・5の三角形で、\\(\\theta\\) の向かいが3なら対辺3、となりが4、斜辺5",
        boundary: "別の鋭角に注目すると、対辺と隣辺は入れ替わるが斜辺は変わらない",
      },
      {
        term: "30°・45°・60°の代表値",
        meaning: "\\(\\sin30^\\circ=\\frac12\\)、\\(\\sin45^\\circ=\\frac{\\sqrt2}{2}\\)、\\(\\sin60^\\circ=\\frac{\\sqrt3}{2}\\)。cosは30°と60°の値が入れ替わる",
        example: "\\(\\tan30^\\circ=\\frac1{\\sqrt3}\\)、\\(\\tan45^\\circ=1\\)、\\(\\tan60^\\circ=\\sqrt3\\)",
        boundary: "値を暗記する前に、30°・60°は正三角形の半分、45°は正方形の半分から作れることを図で確かめる",
      },
    ],
    connections: [
      { kind: "model", title: "辺を色分けして比を見る", summary: "角から見た対辺・隣辺・斜辺を色分けし、拡大しても比が一定なことを確かめます。", labId: "trig-lab" },
      { kind: "history", title: "星を測るための三角法", summary: "アル＝バッターニーが天体観測と計算に三角法を用いた背景を読みます。", storyId: "al-battani-trigonometry" },
    ],
    storyIds: ["al-battani-trigonometry"],
  },
  "sine-cosine-rule": {
    why: {
      question: "正弦定理と余弦定理は、何を手がかりに選ぶの？",
      answer: "分かっている辺と角の組を図へ書き、向かい合う辺と角の組があるなら正弦定理、2辺とその間の角や3辺が分かるなら余弦定理を選びます。",
      tryIt: "三角形の辺 \\(a\\) と、その向かいの角 \\(A\\) を同じ色で印を付ける",
    },
    definitions: [
      {
        term: "向かい合う辺と角",
        meaning: "辺 \\(a\\) は角 \\(A\\) の正面、辺 \\(b\\) は角 \\(B\\) の正面という対応",
        example: "\\(a/\\sin A=b/\\sin B\\) では、必ず向かい合う組を縦にそろえる",
        boundary: "図の近くに見える辺ではなく、角の頂点に接していない向かい側の辺を選ぶ",
      },
    ],
    connections: [
      { kind: "model", title: "辺と角の対応を色で見る", summary: "三角比ラボへ戻り、角から見た辺の名前を確かめます。", labId: "trig-lab" },
      { kind: "history", title: "観測と三角法", summary: "星や月の位置を計算する必要が、三角法の方法を育てた例を読みます。", storyId: "al-battani-trigonometry" },
    ],
    storyIds: ["al-battani-trigonometry"],
  },
  data: {
    why: {
      question: "なぜ平均だけでなく、中央値や散らばりも見るの？",
      answer: "平均が同じデータでも、中央の位置や値の広がり方が違うことがあるからです。一つの代表値だけで全体を決めつけないために、複数の物差しを使います。",
      tryIt: "平均と散らばりラボで散らばりを変え、平均・中央値・範囲がどう動くか見る",
    },
    definitions: [
      {
        term: "平均",
        meaning: "すべての値を合計し、値の個数で割った数",
        example: "\\(2,4,9\\) の平均は \\((2+4+9)\\div3=5\\)",
        boundary: "平均はデータに実在する値とは限らず、極端な値の影響を受ける",
      },
      {
        term: "中央値",
        meaning: "値を小さい順に並べたときの中央。偶数個なら中央2個の平均",
        example: "\\(1,3,8,10\\) の中央値は \\((3+8)\\div2=5.5\\)",
        boundary: "並べる前の位置ではなく、必ず小さい順に並べた後の中央を見る",
      },
      {
        term: "範囲",
        meaning: "最大値から最小値を引いた、データ全体の幅",
        example: "\\(1,2,2,5,20\\) の範囲は \\(20-1=19\\)",
        boundary: "最小値と最大値だけで決まるので、途中の値の散らばりは表し切れない",
      },
    ],
    connections: [
      { kind: "model", title: "数直線で中心と広がりを見る", summary: "5個の値と平均の位置を同じ数直線に置き、定義と計算を結びます。", labId: "data-spread-lab" },
    ],
    storyIds: ["nightingale-data-for-explanation"],
  },
  "data-analysis-i": {
    why: {
      question: "なぜ偏差をそのまま足さず、2乗して平均するの？",
      answer: "平均より上の偏差と下の偏差をそのまま足すと0になるためです。2乗して正の大きさにそろえると、平均との差を打ち消さずにまとめられます。",
      tryIt: "\\(1,2,3\\) の偏差 \\(-1,0,1\\) の和と、2乗の和を比べる",
    },
    definitions: [
      {
        term: "分散と標準偏差",
        meaning: "分散は偏差の2乗の平均、標準偏差は分散の正の平方根",
        example: "\\(1,2,3\\) の分散は \\(2/3\\)、標準偏差は \\(\\sqrt{2/3}\\)",
        boundary: "分散の単位は元の単位の2乗。元と同じ単位で読むには標準偏差を使う",
      },
      {
        term: "相関",
        meaning: "2種類のデータが一緒に増える・一方が増えると他方が減るという直線的な傾向",
        example: "相関係数が \\(1\\) に近いほど右上がり、\\(-1\\) に近いほど右下がりの傾向が強い",
        boundary: "相関は因果関係の証明ではなく、外れ値で大きく変わることもある",
      },
    ],
    connections: [
      { kind: "model", title: "同じ平均でも散らばりを変える", summary: "値の位置、偏差、分散、標準偏差を一つの図で対応させます。", labId: "data-spread-lab" },
    ],
    storyIds: ["nightingale-data-for-explanation"],
  },
  "counting-principles": {
    why: {
      question: "なぜ、全部を書き出さずに数え方の法則を使うの？",
      answer: "選択肢が増えると書き漏らしや重複が起きるからです。樹形図で小さい例を確かめ、同じ枝分かれを足すか、段階ごとにかけるかを見分けます。",
      tryIt: "上着3種類とズボン2種類の組を樹形図で書き、枝の先が \\(3\\times2=6\\) 個になることを確かめる",
    },
    definitions: [
      {
        term: "和の法則と積の法則",
        meaning: "重ならない場合をどれか一つ選ぶときは足し、段階を続けて選ぶときはかける",
        example: "上着3種類から一つ、続けてズボン2種類から一つ選ぶ組合せは \\(3\\times2=6\\) 通り",
        boundary: "同じ結果を二重に数えていないか、順序を区別する場面かを先に確かめる",
      },
    ],
    connections: [
      { kind: "model", title: "枝分かれで数える", summary: "確率の木で選択を一段ずつたどり、積の法則を目で確かめます。", labId: "probability-lab" },
      { kind: "history", title: "ゲームの問いから確率へ", summary: "パスカルとフェルマーの往復書簡が、偶然を計算する方法の発展につながった例を読みます。", storyId: "pascal-fermat-probability" },
    ],
    storyIds: ["pascal-fermat-probability"],
  },
  "probability-a": {
    why: {
      question: "確率の分母は、なぜ問題ごとに変わるの？",
      answer: "分母は『今考えている、起こり得る結果の全体』だからです。条件が付いたり、玉を戻さなかったりすると、次に考える全体そのものが変わります。",
      tryIt: "赤3個・青5個から玉を1個取り、戻す場合と戻さない場合で2回目の全体数を比べる",
    },
    definitions: [
      {
        term: "事象と標本空間",
        meaning: "標本空間は考える結果の全体、事象はその中で条件に合う結果の集まり",
        example: "さいころの全体を \\(1\\) から \\(6\\)、偶数の事象を \\(\\{2,4,6\\}\\) とする",
        boundary: "どの結果も同じ起こりやすさとは限らない。場合の数の比を使う前に同様に確からしいかを確認する",
      },
    ],
    connections: [
      { kind: "model", title: "条件で分母が変わる", summary: "玉を戻す・戻さないを切り替え、2回目の全体がどう変わるか見ます。", labId: "probability-lab" },
      { kind: "history", title: "偶然を計算の対象にした", summary: "賭けの分配などの具体的な問いが、確率論の出発点の一つになった経緯を読みます。", storyId: "pascal-fermat-probability" },
    ],
    storyIds: ["pascal-fermat-probability"],
  },
  geometry: {
    why: {
      question: "なぜ三角比より先に、相似と三平方を確かめるの？",
      answer: "三角比が大きさを変えても同じなのは相似が土台にあり、斜辺や未知の辺を求める計算には三平方の定理を使うからです。辺の名前と基本関係を先に確かめると、比の式が意味のある式になります。",
      tryIt: "3・4・5の直角三角形で斜辺を指さし、\\(3^2+4^2=5^2\\) を図と対応させる",
    },
    definitions: [
      {
        term: "相似と対応",
        meaning: "形が同じ二つの図形で、対応する角が等しく、対応する辺の比がそろう関係",
        example: "一辺を2倍にした直角三角形では、三辺がすべて2倍になり、辺どうしの比は変わらない",
        boundary: "見た目が似ているだけでなく、どの頂点・辺が対応するかを順番までそろえる",
      },
    ],
    connections: [
      { kind: "model", title: "直角三角形の辺を見る", summary: "三角比ラボで、斜辺・対辺・隣辺を図と対応させます。", labId: "trig-lab" },
      { kind: "history", title: "定義から定理を積み上げる", summary: "ユークリッドの『原論』が、定義・公準・証明を順序立ててまとめた背景を読みます。", storyId: "euclid-elements" },
    ],
    storyIds: ["euclid-elements", "descartes-algebra-meets-geometry"],
  },
  "geometry-a": {
    why: {
      question: "なぜ図を見ただけで同じ角だと決めてはいけないの？",
      answer: "図は関係を考える手がかりで、正確な長さや角度を保証する測定図ではないからです。印・条件・定理を根拠として一つずつ確かめます。",
      tryIt: "円周角ラボで点を動かし、見た目の位置が変わっても同じ弧を見る角が等しいことを確かめる",
    },
    definitions: [
      {
        term: "円周角",
        meaning: "頂点が円周上にあり、2辺が円と交わってできる角",
        example: "同じ弧 \\(AC\\) を見込む \\(\\angle ABC\\) と \\(\\angle ADC\\) は等しい",
        boundary: "頂点が円の中心にある中心角とは別で、同じ弧に対する中心角は円周角の2倍",
      },
    ],
    connections: [
      { kind: "model", title: "同じ弧を見る位置を動かす", summary: "観察点が変わっても、見込む弧が同じなら角が変わらないことを確かめます。", labId: "geometry-properties-lab" },
      { kind: "history", title: "証明を順序立てて読む", summary: "定義と公準から一つずつ結論を導く『原論』の構成を、図形の根拠を読む姿勢へつなげます。", storyId: "euclid-elements" },
    ],
    storyIds: ["euclid-elements"],
  },
  "math-human-activities": {
    why: {
      question: "なぜ割り算の余りから最大公約数が分かるの？",
      answer: "\\(a=bq+r\\) のとき、\\(a\\) と \\(b\\) を割り切る数は余り \\(r=a-bq\\) も割り切り、逆も成り立つため、共通の約数が変わらないからです。",
      tryIt: "\\(84\\) と \\(30\\) を正方形で区切り、余った24と30を同じ幅で区切り直す",
    },
    definitions: [
      {
        term: "最大公約数と互除法",
        meaning: "2つ以上の整数をすべて割り切る最大の正の整数を、割り算の余りを繰り返して求める方法",
        example: "\\(84=30\\times2+24\\)、\\(30=24\\times1+6\\) なので最大公約数は \\(6\\)",
        boundary: "最後に出た余りではなく、余りが0になったときの割る数を答える",
      },
    ],
    connections: [
      { kind: "model", title: "長さを同じ幅で区切る", summary: "余りへ置き換えても最大の共通幅が残ることを、長方形と正方形で見ます。", labId: "euclidean-algorithm-lab" },
      { kind: "notation", title: "文字は場面ごとの名札", summary: "\\(a,b,q,r\\) の役割も、式の直前にある定義から読み取ります。", storyId: "letters-are-labels" },
      { kind: "history", title: "幾何と整数をまとめた『原論』", summary: "ユークリッドの書物には図形だけでなく、最大公約数を求める方法や整数の内容も含まれます。", storyId: "euclid-elements" },
    ],
    storyIds: ["letters-are-labels", "euclid-elements", "gauss-patterns-in-integers"],
  },
  "function-notation": {
    why: {
      question: "\\(y=\\) の書き方があるのに、なぜ \\(f(x)\\) をわざわざ使うの？",
      answer:
        "関数に『名前』を付けて、入力を式の中に残せるようにするためです。\\(y=7\\) と書くと『いつの \\(y\\)？』が消えてしまいますが、\\(f(2)=7\\) なら『\\(2\\) を入れたら \\(7\\) が出た』という入出力の記録がそのまま残ります。関数を2つ以上あつかう場面でも、\\(f\\) と \\(g\\) のように名前で区別できます。",
      tryIt: "\\(f(x)=2x+3\\) と \\(g(x)=x^2\\) に同じ \\(2\\) を入れて、\\(f(2)=7\\) と \\(g(2)=4\\) を並べて書いてみる",
    },
    definitions: [
      {
        term: "関数の記法 f(x)",
        meaning: "関数に \\(f\\) と名前を付け、入力 \\(x\\) に対する出力を \\(f(x)\\) と書く記法",
        example: "\\(f(x)=2x+3\\) のとき \\(f(2)=7\\)。かっこの中が入力、右辺が出力の作り方",
        boundary: "\\(f(x)\\) は \\(f\\times x\\) という掛け算ではない。\\(f\\) 単体は数ではなく『対応の名前』",
      },
      {
        term: "定義域",
        meaning: "関数に入力してよい \\(x\\) の値の範囲",
        example: "\\(f(x)=2x+3\\)（\\(1\\le x\\le4\\)）なら、定義域は \\(1\\le x\\le4\\)",
        boundary: "問題文で指定されるほか、式の都合（分母を \\(0\\) にしない等）で自然に狭まることもある",
      },
      {
        term: "値域",
        meaning: "定義域の中の \\(x\\) を動かしたとき、出力 \\(f(x)\\) が実際にとる値の範囲",
        example: "\\(f(x)=2x+3\\)（\\(1\\le x\\le4\\)）の値域は \\(5\\le f(x)\\le11\\)",
        boundary: "『出力になりうる値すべて』ではなく『実際にとる値』。定義域が変われば値域も変わる",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "グラフで定義域と値域を見る",
        summary: "関数ラボの直線のうち、定義域にあたる部分だけを目で切り取ると、縦軸に値域が現れます。",
        labId: "function-lab",
      },
      {
        kind: "notation",
        title: "文字は場面ごとの名札",
        summary: "\\(f\\) も『関数の名札』の一つです。記号の役割は、式の直前の宣言から読み取ります。",
        storyId: "letters-are-labels",
      },
    ],
    storyIds: ["letters-are-labels", "descartes-algebra-meets-geometry"],
  },
  "pythagorean-theorem": {
    why: {
      question: "なぜ2乗どうしを足すと、斜辺の2乗になるの?",
      answer:
        "2乗は『1辺がその長さの正方形の面積』だからです。定理は、直角をはさむ2辺の上に立つ正方形2枚の面積の合計が、斜辺の上に立つ正方形1枚の面積とちょうど等しい、という面積の等式です。合同な三角形4枚の並べ替えで、その等しさを目で確かめられます。",
      tryIt: "方眼紙に3・4・5の直角三角形をかき、各辺の上に正方形をかいて、マス目で \\(9+16=25\\) を数える",
    },
    definitions: [
      {
        term: "三平方の定理",
        meaning: "直角三角形で、直角をはさむ2辺 \\(a,b\\) と斜辺 \\(c\\) の間に \\(a^2+b^2=c^2\\) が成り立つという定理",
        example: "\\(3^2+4^2=25=5^2\\)。斜辺は \\(c=\\sqrt{a^2+b^2}\\) で求められる",
        boundary: "直角三角形限定。直角でない三角形では \\(-2ab\\cos C\\) の補正が付いた余弦定理になる",
      },
      {
        term: "斜辺",
        meaning: "直角三角形で、直角の向かい側にある一番長い辺",
        example: "3・4・5の三角形の斜辺は5",
        boundary: "『一番長い辺』とだけ覚えると直角の位置の確認を忘れる。まず直角、その向かいが斜辺",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "有名角の三角形で長さを確かめる",
        summary: "三角比ラボで \\(30^\\circ\\)・斜辺2にすると、辺が \\(1:2:\\sqrt3\\) になり、定理の等式を実際の長さで確かめられます。",
        labId: "trig-lab",
      },
      {
        kind: "history",
        title: "『原論』第1巻の到達点",
        summary: "ユークリッドの『原論』第1巻は、定義と公準から積み上げて、この定理の証明にたどり着く構成になっています。",
        storyId: "euclid-elements",
      },
      {
        kind: "notation",
        title: "座標平面の距離もこの定理",
        summary: "座標平面で2点の距離を求める式は、横の差と縦の差を2辺とする直角三角形への、三平方の定理の応用です。",
        storyId: "descartes-algebra-meets-geometry",
      },
    ],
    storyIds: ["euclid-elements", "descartes-algebra-meets-geometry"],
  },
  "geometric-series-sum": {
    why: {
      question: "等差数列で使った『逆順に足す』は、なぜ等比数列では使えないの？",
      answer:
        "逆順に足す工夫は、両端から順に組を作るとどの組も同じ和になる——等差数列だけの性質——を利用しているからです。等比数列で同じ組を作っても和はばらばらです。その代わり、等比数列には『公比を掛けると列全体が1つずれる』という性質があるので、ずらして引けばとちゅうの項が全部消えます。数列ごとの持ち味に合わせて、工夫を選び直すのです。",
      tryIt: "\\(1+2+4+8\\) で逆順の組の和（\\(1+8=9\\)、\\(2+4=6\\)）がそろわないことを確かめてから、2倍してずらして引く",
    },
    definitions: [
      {
        term: "等比数列の和の公式",
        meaning: "初項 \\(a\\)・公比 \\(r\\)（\\(r\\ne1\\)）の等比数列の、初項から第 \\(n\\) 項までの和 \\(S_n=\\dfrac{a(r^n-1)}{r-1}\\)",
        example: "\\(1+2+4+\\cdots+512=\\dfrac{1\\times(2^{10}-1)}{2-1}=1023\\)",
        boundary: "\\(r=1\\) では分母が \\(0\\) になるので使えず、\\(S_n=na\\) と場合分けする",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "複利の残高は等比数列",
        summary: "返済ラボを複利に切り替えると、残高が等比数列で増える様子を見られます。利息の合計を求める計算が、この単元の公式につながります。",
        labId: "loan-balance-lab",
      },
      {
        kind: "history",
        title: "ガウスの『逆順に足す』との対比",
        summary: "等差数列の和の工夫を振り返ると、『数列の性質に合わせて工夫を選ぶ』というこの単元の主題がはっきりします。",
        storyId: "gauss-patterns-in-integers",
      },
    ],
    storyIds: ["gauss-patterns-in-integers"],
  },
  "prime-factorization": {
    why: {
      question: "なぜ \\(1\\) は素数に入れないの？",
      answer:
        "素因数分解の結果を『ただ一通り』にするためです。もし \\(1\\) を素数と認めると、\\(6=2\\times3=1\\times2\\times3=1\\times1\\times2\\times3\\) と書き方が無限に増えて、設計図として役に立たなくなります。数学の定義は、あとに続く定理がいちばんきれいに成り立つように選ばれる——\\(1\\) の除外はその典型例です。",
      tryIt: "\\(6\\) の分解を、\\(1\\) を使ってよい場合と使わない場合で書き比べて、どちらが『一通り』になるか確かめる",
    },
    definitions: [
      {
        term: "素数",
        meaning: "約数が \\(1\\) とそれ自身だけの、\\(2\\) 以上の整数",
        example: "\\(2,3,5,7,11,13,\\dots\\)。\\(2\\) は唯一の偶数の素数",
        boundary: "\\(1\\) は素数でも合成数でもない、どちらにも入れない特別あつかい",
      },
      {
        term: "素因数分解",
        meaning: "整数を素数だけの積で表すこと。結果は順序を除いてただ一通りに決まる",
        example: "\\(60=2^2\\times3\\times5\\)",
        boundary: "\\(12=3\\times4\\) は途中——\\(4\\) がまだ割れる。素数だけになるまで分ける",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "ルートの整理を予言する",
        summary: "ルートラボで数を選ぶ前に素因数分解しておくと、どの平方数が外へ出るかを先に言い当てられます。",
        labId: "radical-lab",
      },
      {
        kind: "model",
        title: "最大公約数を2つの方法で",
        summary: "互除法ラボの答えを、素因数分解の共通部分からも求めて、同じになることを確かめられます。",
        labId: "euclidean-algorithm-lab",
      },
      {
        kind: "history",
        title: "整数の規則を調べる",
        summary: "ガウスが整数の世界の規則性を研究した話は、数を分解して構造を見るこの単元の延長にあります。",
        storyId: "gauss-patterns-in-integers",
      },
    ],
    storyIds: ["gauss-patterns-in-integers", "euclid-elements"],
  },
  similarity: {
    why: {
      question: "なぜ角が2つ等しいだけで、相似と言い切れるの？",
      answer:
        "三角形の内角の和は \\(180^\\circ\\) と決まっているので、2つの角が等しければ残りの1つも自動的に等しくなるからです。3つの角がすべて等しい三角形どうしは、形が完全に同じで大きさだけが違います。内角の和 \\(180^\\circ\\) は平行線の単元で証明済み——証明済みの定理が、次の定理の根拠として働く連鎖の一例です。",
      tryIt: "\\(30^\\circ\\) と \\(60^\\circ\\) の角を写し取って大きさの違う三角形を2つかき、3辺の比を測って比べる",
    },
    definitions: [
      {
        term: "相似",
        meaning: "対応する角がすべて等しく、対応する辺の比がすべて等しい関係。記号は \\(\\backsim\\)",
        example: "\\(\\triangle ABC\\backsim\\triangle DEF\\) なら \\(AB:DE=BC:EF=CA:FD\\)",
        boundary: "合同は相似比 \\(1:1\\) の特別な場合。『似ている』という日常語より条件が厳密",
      },
      {
        term: "相似比",
        meaning: "相似な図形の、対応する辺の比",
        example: "相似比 \\(1:2\\) なら、周の長さも \\(1:2\\)",
        boundary: "長さが \\(k\\) 倍でも面積は \\(k^2\\) 倍。2倍の拡大コピーで紙の面積は4倍になる",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "斜辺だけ動かして比を見る",
        summary: "三角比ラボで角度を固定して大きさだけ変えると、3辺が同じ倍率で動き、比が保たれることを確かめられます。",
        labId: "trig-lab",
      },
      {
        kind: "notation",
        title: "対応の順序は読み手への約束",
        summary: "\\(\\triangle ABC\\backsim\\triangle DEF\\) の頂点の並び順そのものが、どこが対応するかの宣言になっています。",
        storyId: "letters-are-labels",
      },
      {
        kind: "history",
        title: "影で測る知恵の古さ",
        summary: "影で高さを測る発想は古代から使われてきました。定義から積み上げる『原論』にも相似の理論が収められています。",
        storyId: "euclid-elements",
      },
    ],
    storyIds: ["euclid-elements", "letters-are-labels"],
  },
  "sum-and-general-term": {
    why: {
      question: "和の式から、なぜ引き算だけで各項が分かるの？",
      answer:
        "\\(S_n\\) は『\\(n\\) 段目までの積み上げの高さ』の記録だからです。1つ手前の高さ \\(S_{n-1}\\) との差は、ちょうど \\(n\\) 段目の一段ぶんの厚み \\(a_n\\)。積み上げの記録さえあれば、各段の厚みは差で復元できます。",
      tryIt: "\\(S_1=3\\)、\\(S_2=8\\)、\\(S_3=15\\) という具体的な数で、\\(a_2=8-3=5\\)、\\(a_3=15-8=7\\) を確かめる",
    },
    definitions: [
      {
        term: "数列の和 S_n",
        meaning: "数列の初項から第 \\(n\\) 項までを足した合計",
        example: "\\(S_3=a_1+a_2+a_3\\)。\\(S_1=a_1\\)",
        boundary: "\\(S_n\\) は『第 \\(n\\) 項』ではなく『\\(n\\) 項ぶんの合計』。\\(a_n\\) と読み分ける",
      },
      {
        term: "和と一般項の関係",
        meaning: "\\(a_1=S_1\\)、\\(a_n=S_n-S_{n-1}\\)（\\(n\\ge2\\)）",
        example: "\\(S_n=n^2\\) なら \\(a_n=n^2-(n-1)^2=2n-1\\)",
        boundary: "\\(n=1\\) では使えない（\\(S_0\\) は存在しない）。最後に \\(a_1\\) との一致を必ず照合する",
      },
    ],
    connections: [
      {
        kind: "notation",
        title: "大文字と小文字の役割分担",
        summary: "合計は大文字 \\(S\\)、一つひとつの項は小文字 \\(a\\)。文字の大小で役割を書き分ける慣習がここでも働いています。",
        storyId: "letters-are-labels",
      },
      {
        kind: "history",
        title: "和の工夫つながり",
        summary: "ガウスの『逆順に足す』は一般項から和へ、この単元の引き算は和から一般項へ。往復の道具がそろいます。",
        storyId: "gauss-patterns-in-integers",
      },
    ],
    storyIds: ["gauss-patterns-in-integers", "letters-are-labels"],
  },
  "circular-permutations": {
    why: {
      question: "なぜ円卓だと \\((n-1)!\\) に減るの？",
      answer:
        "円卓には『1番の席』がないからです。一列の並びでは端や席番号が区別の手がかりになりますが、円ではテーブルごと回して重なる配置はすべて同じあつかい。1人を固定して基準を作るのは、『残りの人の相対的な位置だけを数える』という宣言です。逆に言えば、席にレイアウトや上座の区別を持ち込んだ瞬間、ふつうの順列 \\(n!\\) に戻ります。",
      tryIt: "3人 A・B・C の円卓の座り方を全部絵にかいて、回すと重なるものを線で結び、2通りに束ねられることを確かめる",
    },
    definitions: [
      {
        term: "円順列",
        meaning: "円形に並べる並べ方のうち、回転して重なるものを同じとみなす数え方。異なる \\(n\\) 個なら \\((n-1)!\\) 通り",
        example: "5人の円卓は \\(4!=24\\) 通り",
        boundary: "席番号・上座など位置の区別があるなら、円形でもふつうの順列 \\(n!\\)",
      },
      {
        term: "数珠順列",
        meaning: "円順列のうち、裏返して重なるものも同じとみなす数え方。異なる \\(n\\) 個なら \\(\\dfrac{(n-1)!}{2}\\) 通り",
        example: "5個の珠のブレスレットは \\(4!\\div2=12\\) 通り",
        boundary: "裏返せないもの（円卓の人・時計回りに意味がある配置）は円順列のまま割らない",
      },
    ],
    connections: [
      {
        kind: "shared-rule",
        title: "『同じとみなす』は割り算になる",
        summary: "同じものを含む順列で \\(p!\\) で割ったのと同じ発想です。重複のぶんだけ割る——場合の数を貫く共通ルールです。",
      },
      {
        kind: "history",
        title: "数える工夫の積み重ね",
        summary: "場合の数と確率の道具は、賭けの問題を数え上げたパスカルとフェルマーの往復書簡でも磨かれました。",
        storyId: "pascal-fermat-probability",
      },
    ],
    storyIds: ["pascal-fermat-probability"],
  },
  "conditional-probability": {
    why: {
      question: "ふつうの確率と、条件付き確率は何が違うの？",
      answer:
        "分母だけです。確率は『注目する場合の数 ÷ 考えている世界全体』で、条件付き確率はその『世界全体』が \\(A\\) に縮んだもの。情報が増えるたびに世界が縮み、同じ \\(B\\) でも確率の値が変わります。逆に、情報 \\(A\\) を知っても \\(B\\) の確率が変わらないとき、\\(A\\) と \\(B\\) は独立と呼ばれます。",
      tryIt: "トランプ52枚から1枚。ハートの確率 \\(\\frac{13}{52}=\\frac14\\) と、『赤いカードだ』と分かったときのハートの確率 \\(\\frac{13}{26}=\\frac12\\) を比べる",
    },
    definitions: [
      {
        term: "条件付き確率",
        meaning: "\\(A\\) が起こったと分かっているときに \\(B\\) が起こる確率。\\(P_A(B)=\\dfrac{P(A\\cap B)}{P(A)}\\)",
        example: "赤3個・白2個から戻さず2回。1回目が赤のとき2回目も赤の確率は \\(\\frac24=\\frac12\\)",
        boundary: "\\(P_A(B)\\) と \\(P_B(A)\\) は別物。どちらが条件（分母）かを取り違えない",
      },
      {
        term: "乗法定理",
        meaning: "\\(P(A\\cap B)=P(A)\\times P_A(B)\\)。続けて起こる確率を、条件付き確率のかけ算で表す定理",
        example: "赤赤と続く確率は \\(\\frac35\\times\\frac24=\\frac{3}{10}\\)",
        boundary: "\\(P(A)\\times P(B)\\) とかけてよいのは独立のときだけ。『戻さない』なら独立ではない",
      },
    ],
    connections: [
      {
        kind: "model",
        title: "戻す・戻さないで枝の分数が変わる",
        summary: "確率の木ラボの切り替えは、独立（戻す）と条件付き（戻さない）の違いそのものです。",
        labId: "probability-lab",
      },
      {
        kind: "history",
        title: "確率論の出発点",
        summary: "賭けを途中でやめたときの分配問題など、具体的な問いから確率の計算が整えられていった経緯を読みます。",
        storyId: "pascal-fermat-probability",
      },
    ],
    storyIds: ["pascal-fermat-probability"],
  },
};

const lessonMetadata = {
  "integers-signs": { strand: "数と式", practiceIds: ["integer"] },
  "absolute-value": { strand: "数と式", practiceIds: ["absolute-value"] },
  "integer-rules": { strand: "数と式", practiceIds: ["integer"] },
  "number-classification": { strand: "数と式", practiceIds: ["number-classification", "square-root-meaning"] },
  "fraction-arithmetic": { strand: "数と式", practiceIds: ["fraction-arithmetic"] },
  "exponent-rules": { strand: "数と式", practiceIds: ["exponent"] },
  "expansion-formulas": { strand: "数と式", practiceIds: ["expansion", "distribute"] },
  factoring: { strand: "数と式", practiceIds: ["factoring", "distribute"] },
  "quadratic-equations": { strand: "数と式", practiceIds: ["quadratic-solve", "quadratic-sign"] },
  "absolute-value-equations": { strand: "数と式", practiceIds: ["absolute-value", "inequality"] },
  "distribution-numbers": { strand: "数と式", practiceIds: ["distribute"] },
  "powers-roots": { strand: "数と式", practiceIds: ["square-root-meaning"] },
  "simplify-roots": { strand: "数と式", practiceIds: ["radical"] },
  "root-operations": { strand: "数と式", practiceIds: ["root-operations"] },
  "letters-as-boxes": { strand: "数と式", practiceIds: ["substitution"] },
  "like-terms": { strand: "数と式", practiceIds: ["combine"] },
  "distribution-letters": { strand: "数と式", practiceIds: ["distribute"] },
  "sets-propositions": { strand: "数と式", practiceIds: ["sets"] },
  "venn-diagrams": { strand: "数と式", practiceIds: ["venn-count", "sets"] },
  "logic-converse": { strand: "論理と証明", practiceIds: ["logic-converse", "sets"] },
  "necessary-sufficient": { strand: "論理と証明", practiceIds: ["necessary-sufficient", "sets"] },
  "what-is-proof": { strand: "論理と証明", practiceIds: ["proof-fill"] },
  "proof-practice": { strand: "論理と証明", practiceIds: ["proof-fill", "distribute"] },
  "geometry-proofs": { strand: "図形の性質", practiceIds: ["geometry-proofs", "geometry-basics"] },
  "linear-inequalities": { strand: "数と式", practiceIds: ["inequality"] },
  "identities-equations": { strand: "数と式", practiceIds: ["identities"] },
  "linear-equations": { strand: "数と式", practiceIds: ["equation"] },
  "equation-modeling": { strand: "数と式", practiceIds: ["equation"] },
  "simultaneous-equations": { strand: "数と式", practiceIds: ["simultaneous-equations", "equation"] },
  functions: { strand: "関数", practiceIds: ["function-values"] },
  "function-notation": { strand: "関数", practiceIds: ["function-notation", "function-values"] },
  "pythagorean-theorem": { strand: "図形", practiceIds: ["pythagorean-theorem", "geometry-basics", "trig"] },
  "geometric-series-sum": { strand: "数列", practiceIds: ["sequence-sum"] },
  "prime-factorization": { strand: "数と式", practiceIds: ["prime-factorization", "number-theory", "radical"] },
  similarity: { strand: "図形", practiceIds: ["similarity", "geometry-basics", "trig-survey"] },
  "sum-and-general-term": { strand: "数列", practiceIds: ["sum-and-general-term", "sequence-sum"] },
  "circular-permutations": { strand: "場合の数と確率", practiceIds: ["perm-comb", "counting"] },
  "conditional-probability": { strand: "場合の数と確率", practiceIds: ["conditional-probability", "probability"] },
  "quadratic-vertex": { strand: "関数", practiceIds: ["quadratic"] },
  "quadratic-inequalities": { strand: "関数", practiceIds: ["quadratic-sign"] },
  "trig-ratios": { strand: "図形と計量", practiceIds: ["trig", "trig-survey"] },
  "parallel-lines-angles": { strand: "図形", practiceIds: ["parallel-lines-angles", "geometry-basics"] },
  "trig-extension": { strand: "図形と計量", practiceIds: ["trig-extension", "sine-cosine-rule"] },
  "sine-cosine-rule": { strand: "図形と計量", practiceIds: ["sine-cosine-rule"] },
  "data-analysis-i": { strand: "データの分析", practiceIds: ["data-analysis"] },
  "counting-principles": { strand: "場合の数と確率", practiceIds: ["counting"] },
  permutations: { strand: "場合の数と確率", practiceIds: ["perm-comb", "counting"] },
  combinations: { strand: "場合の数と確率", practiceIds: ["perm-comb", "counting"] },
  "combinations-repetition": { strand: "場合の数と確率", practiceIds: ["combinations-repetition", "counting", "perm-comb"] },
  "probability-a": { strand: "場合の数と確率", practiceIds: ["probability"] },
  "complementary-events": { strand: "場合の数と確率", practiceIds: ["complementary-events", "probability"] },
  "box-plots": { strand: "データの分析", practiceIds: ["quartiles", "data-summary"] },
  "geometry-a": { strand: "図形の性質", practiceIds: ["geometry-properties"] },
  "math-human-activities": { strand: "数学と人間の活動", practiceIds: ["number-theory"] },
  "arithmetic-sequences": { strand: "数列", practiceIds: ["arithmetic-sequence"] },
  "geometric-sequences": { strand: "数列", practiceIds: ["sequence-sum"] },
  "sigma-notation": { strand: "数列", practiceIds: ["sequence-sum"] },
  "difference-sequences": { strand: "数列", practiceIds: ["difference-sequences", "arithmetic-sequence"] },
  "recurrence-relations": { strand: "数列", practiceIds: ["recurrence-relations", "sequence-sum"] },
  "mathematical-induction": { strand: "数列", practiceIds: ["mathematical-induction", "proof-fill"] },
  geometry: { strand: "図形", practiceIds: ["geometry-basics"] },
  "pi-and-approximation": { strand: "数と式", practiceIds: [] },
  data: { strand: "データ", practiceIds: ["data-summary"] },
  "exam-review": { strand: "総合", practiceIds: ["exam-review", "equation", "distribute"] },
};

// 学校の章順ではなく、本文中で使う概念が先に現れるように並べる。
// 原稿の置き場所と学習順を分け、順序の見直しで本文を大きく移動しなくてよい形にする。
export const learningPath = [
  "integers-signs",
  "absolute-value",
  "integer-rules",
  "number-classification",
  "fraction-arithmetic",
  "distribution-numbers",
  "letters-as-boxes",
  "like-terms",
  "distribution-letters",
  "exponent-rules",
  "expansion-formulas",
  "factoring",
  "linear-equations",
  "equation-modeling",
  "functions",
  "function-notation",
  "simultaneous-equations",
  "linear-inequalities",
  "absolute-value-equations",
  "identities-equations",
  "prime-factorization",
  "powers-roots",
  "simplify-roots",
  "root-operations",
  "quadratic-vertex",
  "quadratic-equations",
  "quadratic-inequalities",
  "parallel-lines-angles",
  "geometry",
  "pi-and-approximation",
  "pythagorean-theorem",
  "similarity",
  "trig-ratios",
  "trig-extension",
  "sine-cosine-rule",
  "geometry-a",
  "data",
  "box-plots",
  "data-analysis-i",
  "sets-propositions",
  "venn-diagrams",
  "logic-converse",
  "necessary-sufficient",
  "what-is-proof",
  "proof-practice",
  "geometry-proofs",
  "counting-principles",
  "permutations",
  "combinations",
  "combinations-repetition",
  "circular-permutations",
  "probability-a",
  "complementary-events",
  "conditional-probability",
  "math-human-activities",
  "arithmetic-sequences",
  "geometric-sequences",
  "sigma-notation",
  "geometric-series-sum",
  "sum-and-general-term",
  "difference-sequences",
  "recurrence-relations",
  "mathematical-induction",
  "exam-review",
];

const rawUnitCatalog = Object.fromEntries(rawUnits.map((unit) => [unit.id, unit]));
const learningPathHasEveryUnit =
  learningPath.length === rawUnits.length &&
  new Set(learningPath).size === learningPath.length &&
  learningPath.every((id) => rawUnitCatalog[id]);

if (!learningPathHasEveryUnit) {
  throw new Error("learningPath と単元データの ID が一致していません。");
}

const orderedUnits = learningPath.map((id) => rawUnitCatalog[id]);

export const units = orderedUnits.map((unit, index) => ({
  ...unit,
  order: index + 1,
  nextLessonId: orderedUnits[index + 1]?.id ?? null,
  labIds: unitLabRefs[unit.id] || [],
  ...(lessonMetadata[unit.id] || { strand: "数学", practiceIds: [] }),
  context: lessonContexts[unit.id] ?? null,
  // 表示側はこの三つだけを「次の一手」として使う。複数の関連教材は補助導線に回す。
  recommendedLabId: unitLabRefs[unit.id]?.[0] ?? null,
  recommendedPracticeId: lessonMetadata[unit.id]?.practiceIds?.[0] ?? null,
  recommendedNextLessonId: orderedUnits[index + 1]?.id ?? null,
}));
