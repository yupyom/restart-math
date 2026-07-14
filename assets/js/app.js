"use strict";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

let mathTypesetFrame = null;
const mathTypesetTargets = new Set();

function scheduleMathTypeset(target = document.body) {
  if (!window.MathJax || typeof window.MathJax.typesetPromise !== "function") return;
  mathTypesetTargets.add(target);
  if (mathTypesetFrame) return;
  mathTypesetFrame = window.requestAnimationFrame(() => {
    const targets = Array.from(mathTypesetTargets).filter(Boolean);
    mathTypesetTargets.clear();
    mathTypesetFrame = null;
    window.MathJax.typesetPromise(targets).catch((error) => {
      console.warn("MathJax typeset failed:", error);
    });
  });
}

const units = [
  {
    id: "integers-signs",
    stage: "整数 1",
    range: ["中1"],
    title: "正負の数と数直線",
    summary:
      "負の数は「小さい数」だけでなく、数直線上の左向き・反対向きとして考えると加減が見えやすくなります。",
    points: [
      "正の方向へ進むと数は大きくなる",
      "負の方向へ進むと数は小さくなる",
      "引き算は「反対向きに足す」と考えられる",
    ],
    example: "\\(-3+5=2\\)、\\(-3-5=-8\\)",
    check: "数直線ラボで a - b を選び、b の向きが反対になることを確認しよう。",
  },
  {
    id: "integer-rules",
    stage: "整数 2",
    range: ["中1"],
    title: "符号のルールと計算順序",
    summary:
      "乗除の符号は、負の向きを何回反転するかで決まります。計算順序は、式を誤読しないための交通ルールです。",
    points: [
      "同じ符号の積・商は正",
      "違う符号の積・商は負",
      "累乗・かっこ・乗除・加減の順に処理する",
    ],
    example: "\\(-2\\times(-3)=6\\)、\\(4-3^2=-5\\)",
    check: "「マイナスが2回出たら向きが戻る」と声に出すと、符号ミスが減ります。",
  },
  {
    id: "distribution-numbers",
    stage: "整数 3",
    range: ["中1", "中2"],
    title: "数で見る分配法則",
    summary:
      "分配法則は、まとまった幅を分けて計算しても全体の面積は変わらない、というルールです。",
    points: [
      "\\(a(b+c)=ab+ac\\)",
      "\\((a+b)c=ac+bc\\)",
      "暗算・展開・因数分解の共通エンジンになる",
    ],
    example: "\\(6\\times13=6(10+3)=60+18=78\\)",
    check: "分配法則ラボで b と c を変えて、左辺と右辺がいつも同じになることを見よう。",
  },
  {
    id: "powers-roots",
    stage: "ルート 1",
    range: ["中3", "数I"],
    title: "平方と平方根",
    summary:
      "平方は同じ数を2回かけること。平方根はその逆で、「2乗するとその数になるもの」を探す考え方です。",
    points: [
      "\\(5^2=25\\) なので \\(\\sqrt{25}=5\\)",
      "面積25の正方形の一辺は5",
      "\\(\\sqrt{2}\\) のように整数で表せない長さもある",
    ],
    example: "\\(\\sqrt{49}=7\\)、\\(\\sqrt{81}=9\\)",
    check: "平方数 1, 4, 9, 16, 25, ... はルート整理の足場になります。",
  },
  {
    id: "simplify-roots",
    stage: "ルート 2",
    range: ["中3", "数I"],
    title: "ルートを整理する",
    summary:
      "√の中に平方数の因数があれば、その平方数だけ外へ出せます。これは平方根の計算で最初に効くルールです。",
    points: [
      "\\(\\sqrt{a^2b}=a\\sqrt{b}\\)",
      "\\(\\sqrt{72}=\\sqrt{36\\times2}=6\\sqrt{2}\\)",
      "√の中をなるべく小さくして見通しをよくする",
    ],
    example: "\\(\\sqrt{50}=\\sqrt{25\\times2}=5\\sqrt{2}\\)",
    check: "ルートラボで n を動かし、どの平方数が外へ出るか観察しよう。",
  },
  {
    id: "root-operations",
    stage: "ルート 3",
    range: ["中3", "数I"],
    title: "ルートの足し算・かけ算",
    summary:
      "同じルート部分だけが足し引きできます。かけ算では \\(\\sqrt{a}\\sqrt{b}=\\sqrt{ab}\\) を使います。",
    points: [
      "\\(2\\sqrt{3}+5\\sqrt{3}=7\\sqrt{3}\\)",
      "\\(\\sqrt{2}+\\sqrt{3}\\) はこれ以上まとめられない",
      "\\(\\sqrt{6}\\times\\sqrt{3}=\\sqrt{18}=3\\sqrt{2}\\)",
    ],
    example: "\\(\\sqrt{12}+\\sqrt{27}=2\\sqrt{3}+3\\sqrt{3}=5\\sqrt{3}\\)",
    check: "文字式の同類項と似ています。\\(\\sqrt{3}\\) のまとまりを数えている、と考えましょう。",
  },
  {
    id: "letters-as-boxes",
    stage: "文字式 1",
    range: ["中1", "中2"],
    title: "文字はまだ決めていない数",
    summary:
      "x や y は特別な魔法ではなく、まだ値を決めていない数の箱です。整数で使ったルールは文字にも引き継がれます。",
    points: [
      "\\(3x\\) は \\(x\\) が3個あるという意味",
      "\\(x=4\\) なら \\(3x=12\\)",
      "式の値は、文字に数を入れて計算する",
    ],
    example: "\\(2x+5\\) に \\(x=3\\) を入れると \\(2\\times3+5=11\\)",
    check: "文字を箱として見ると、代入と式変形が同じ景色でつながります。",
  },
  {
    id: "like-terms",
    stage: "文字式 2",
    range: ["中1", "中2"],
    title: "同類項をまとめる",
    summary:
      "x の項どうし、定数どうしのように、同じ種類のまとまりだけを足し引きできます。",
    points: [
      "\\(3x+2x=5x\\)",
      "\\(3x+2\\) は違う種類なのでまとめられない",
      "係数は「何個分あるか」を表す",
    ],
    example: "\\(7x-2+3x+5=10x+3\\)",
    check: "同類項ラボで x の項と定数が別レーンに分かれることを見よう。",
  },
  {
    id: "distribution-letters",
    stage: "文字式 3",
    range: ["中1", "中2", "数I"],
    title: "文字式の分配法則",
    summary:
      "整数で見た分配法則は、文字式でもそのまま働きます。かっこの中の各項に外の数をかけます。",
    points: [
      "\\(a(x+b)=ax+ab\\)",
      "\\(-2(x-3)=-2x+6\\)",
      "符号ごと配るのがコツ",
    ],
    example: "\\(3(x+4)=3x+12\\)",
    check: "負の数を配ると符号が変わるところを、整数の符号ルールに戻って確認しましょう。",
  },
  {
    id: "identities-equations",
    stage: "式 1",
    range: ["中2", "中3", "数I"],
    title: "恒等式と方程式",
    summary:
      "恒等式はどんな値でも成り立つ式。方程式は成り立つ値を探す式です。同じ等号でも、役割が違います。",
    points: [
      "\\((x+2)^2=x^2+4x+4\\) は恒等式",
      "\\(x+2=7\\) は方程式",
      "方程式では、両辺に同じ操作をしても解は変わらない",
    ],
    example: "\\(2(x+3)=2x+6\\) はどの \\(x\\) でも成り立つ",
    check: "「いつでも同じ」なのか「ある値だけで同じ」なのかを分けて読みましょう。",
  },
  {
    id: "linear-equations",
    stage: "方程式",
    range: ["中1", "中2"],
    title: "一次方程式を解く",
    summary:
      "一次方程式は、天びんを水平に保つように両辺へ同じ操作をして、x を一人にする作業です。",
    points: [
      "足されている数は両辺から引く",
      "かけられている数は両辺を割る",
      "途中式は操作の記録として書く",
    ],
    example: "\\(3x-5=16\\Rightarrow3x=21\\Rightarrow x=7\\)",
    check: "方程式ラボで a, b, x を変えて、どの操作で x が一人になるか見よう。",
  },
  {
    id: "simultaneous-equations",
    stage: "方程式",
    range: ["中2"],
    title: "連立方程式と交点",
    summary:
      "2本の式を同時に満たす値は、2本の直線が交わる点としても見られます。",
    points: [
      "代入法は片方の式をもう片方へ入れる",
      "加減法は係数をそろえて消す",
      "グラフでは交点の座標が解になる",
    ],
    example: "\\(x+y=5\\)、\\(x-y=1\\) の解は \\(x=3,\\ y=2\\)",
    check: "式の操作とグラフの交点を行き来できると、理解がかなり安定します。",
  },
  {
    id: "functions",
    stage: "関数",
    range: ["中1", "中2", "中3", "数I"],
    title: "一次関数・二次関数",
    summary:
      "関数は、x を入れると y が決まるしくみです。係数を変えると、グラフの傾きや開き方が変わります。",
    points: [
      "\\(y=mx+b\\) の \\(m\\) は傾き、\\(b\\) は切片",
      "\\(y=ax^2\\) は \\(a\\) が大きいほど細くなる",
      "式・表・グラフは同じ関係の別表現",
    ],
    example: "\\(y=2x-1\\) では \\(x\\) が1増えると \\(y\\) は2増える",
    check: "関数ラボで係数を動かし、グラフの変化を言葉にしてみましょう。",
  },
  {
    id: "geometry",
    stage: "図形",
    range: ["中1", "中2", "中3", "数A"],
    title: "図形の基本量",
    summary:
      "図形では、長さ・角度・面積を関係で読むことが大切です。計算ルールはここでも支えになります。",
    points: [
      "三角形の内角の和は180°",
      "相似では対応する辺の比が等しい",
      "三平方の定理は直角三角形の辺を結ぶ",
    ],
    example: "\\(3^2+4^2=5^2\\)",
    check: "式で出した長さが、図の見た目と大きく矛盾していないか確認しましょう。",
  },
  {
    id: "data",
    stage: "データ",
    range: ["中1", "中2", "数I"],
    title: "平均・中央値・散らばり",
    summary:
      "データは、代表値と散らばりをセットで見ると性格が分かります。平均だけでは見落とすことがあります。",
    points: [
      "平均は全部をならした値",
      "中央値は真ん中の値",
      "標準偏差は散らばりの目安",
    ],
    example: "1, 2, 2, 5, 20 は平均6、中央値2",
    check: "外れ値があると平均が引っ張られる、という感覚を持ちましょう。",
  },
  {
    id: "exam-review",
    stage: "総合",
    range: ["中学総合", "数I/A入口"],
    title: "計算から文章題へ",
    summary:
      "文章題は、状況を文字式や方程式に翻訳する問題です。土台の計算ルールが安定しているほど楽になります。",
    points: [
      "分からない量を文字で置く",
      "同じ量を2通りで表して等号で結ぶ",
      "解いたあと、問題文に合うか戻って確認する",
    ],
    example: "1個 \\(x\\) 円の商品を3個買って50円の袋を足すと \\(3x+50\\)",
    check: "式を作ったら、単位と意味を声に出して確認するのがおすすめです。",
  },
];

const topics = [
  ["number", 1, "自然数・整数", "数の範囲と正負の数を整理する", "integers-signs"],
  ["number", 1, "数直線", "加法・減法を移動として見る", "integers-signs"],
  ["number", 1, "絶対値", "0からの距離として負号と切り分ける", "integers-signs"],
  ["number", 2, "乗除の符号", "負の数どうしの積が正になる理由", "integer-rules"],
  ["number", 2, "計算順序", "かっこ・累乗・乗除・加減の優先順位", "integer-rules"],
  ["number", 2, "分配法則", "暗算から展開まで使う共通ルール", "distribution-numbers"],
  ["number", 2, "累乗", "同じ数を繰り返しかける表現", "powers-roots"],
  ["number", 3, "平方根", "2乗して戻る数として理解する", "powers-roots"],
  ["number", 3, "ルートの整理", "平方数の因数を外へ出す", "simplify-roots"],
  ["number", 3, "ルートの加減乗除", "同じルート部分と積のルール", "root-operations"],
  ["algebra", 1, "文字の意味", "まだ決めていない数として扱う", "letters-as-boxes"],
  ["algebra", 1, "式の値", "文字に数を代入して計算する", "letters-as-boxes"],
  ["algebra", 2, "係数と項", "何個分あるか、どんな種類かを見る", "like-terms"],
  ["algebra", 2, "同類項", "同じ種類の項だけまとめる", "like-terms"],
  ["algebra", 2, "文字式の分配法則", "かっこの中の各項へ配る", "distribution-letters"],
  ["algebra", 3, "展開", "積の形を和の形に直す", "distribution-letters"],
  ["algebra", 3, "因数分解", "和の形を積の形に戻す", "distribution-letters"],
  ["algebra", 3, "恒等式", "どんな値でも成り立つ等式", "identities-equations"],
  ["algebra", 3, "一次方程式", "両辺に同じ操作をして解く", "linear-equations"],
  ["algebra", 4, "連立方程式", "2つの条件を同時に満たす値", "simultaneous-equations"],
  ["function", 2, "比例・反比例", "一定の比や積でつながる関係", "functions"],
  ["function", 3, "一次関数", "傾きと切片で直線を読む", "functions"],
  ["function", 3, "二次関数", "放物線の開き方と移動を見る", "functions"],
  ["function", 4, "関数と方程式", "交点を解として読む", "functions"],
  ["geometry", 1, "角度", "直線・三角形・多角形の角", "geometry"],
  ["geometry", 2, "面積", "公式を分解して理解する", "geometry"],
  ["geometry", 2, "合同", "重ね合わせられる図形", "geometry"],
  ["geometry", 3, "相似", "拡大・縮小と比の計算", "geometry"],
  ["geometry", 3, "円", "中心角・円周角・接線", "geometry"],
  ["geometry", 3, "三平方の定理", "直角三角形の辺の関係", "geometry"],
  ["data", 1, "平均・中央値", "代表値を使い分ける", "data"],
  ["data", 2, "度数分布", "データを階級で整理する", "data"],
  ["data", 2, "確率の基本", "起こりやすさを数で表す", "data"],
  ["data", 3, "標準偏差", "散らばりを数値で読む", "data"],
  ["algebra", 4, "文章題の立式", "状況を文字式へ翻訳する", "exam-review"],
  ["algebra", 4, "総合演習", "計算・式・グラフをつなぐ", "exam-review"],
].map(([category, level, title, description, unitId]) => ({
  category,
  level,
  title,
  description,
  unitId,
}));

const categoryLabels = {
  number: "数と計算",
  algebra: "文字式・方程式",
  function: "関数",
  geometry: "図形",
  data: "データ・確率",
};

let activeUnit = 0;
let activePracticeMode = "integer";
let currentProblem = null;
let currentStepIndex = 0;
let activeMapPage = 0;

function signed(value) {
  return value < 0 ? `- ${Math.abs(value)}` : `+ ${value}`;
}

function compactSigned(value) {
  return value < 0 ? ` - ${Math.abs(value)}` : ` + ${value}`;
}

function term(coef, variable = "x") {
  if (coef === 0) return "0";
  if (coef === 1) return variable;
  if (coef === -1) return `-${variable}`;
  return `${coef}${variable}`;
}

function linearText(xCoef, constant) {
  const parts = [];
  if (xCoef !== 0) parts.push(term(xCoef));
  if (constant !== 0 || parts.length === 0) {
    parts.push(parts.length ? compactSigned(constant).trim() : `${constant}`);
  }
  return parts.join(" ").replace("+ -", "- ");
}

function rangeTags(unit) {
  return `<div class="range-tags">${unit.range.map((item) => `<span>${item}</span>`).join("")}</div>`;
}

function mathInline(text) {
  return `\\(${text}\\)`;
}

function normalizeText(value) {
  return String(value)
    .trim()
    .replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[Ａ-Ｚａ-ｚ]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0))
    .replace(/[−ー－]/g, "-")
    .replace(/[＋]/g, "+")
    .replace(/[＝]/g, "=")
    .replace(/[×・＊]/g, "*")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function parseLinearExpression(input) {
  let text = normalizeText(input).replace(/\*/g, "");
  if (!text) return null;
  text = text.replace(/--/g, "+").replace(/\+-/g, "-").replace(/-\+/g, "-");
  if (!/^[+-]/.test(text)) text = `+${text}`;

  let xCoef = 0;
  let constant = 0;
  const matches = text.matchAll(/([+-])([^+-]+)/g);

  for (const match of matches) {
    const sign = match[1] === "-" ? -1 : 1;
    const body = match[2];
    if (body.includes("x")) {
      const rawCoef = body.replace("x", "");
      if (rawCoef === "") xCoef += sign;
      else if (/^\d+$/.test(rawCoef)) xCoef += sign * Number(rawCoef);
      else return null;
    } else if (/^\d+$/.test(body)) {
      constant += sign * Number(body);
    } else {
      return null;
    }
  }

  return { xCoef, constant };
}

function sameLinearExpression(input, xCoef, constant) {
  const parsed = parseLinearExpression(input);
  return parsed && parsed.xCoef === xCoef && parsed.constant === constant;
}

function parseEquation(input) {
  const text = normalizeText(input).replace(/\*/g, "");
  const parts = text.split("=");
  if (parts.length !== 2) return null;
  const left = parseLinearExpression(parts[0]);
  const right = parseLinearExpression(parts[1]);
  if (!left || !right) return null;
  return {
    xCoef: left.xCoef - right.xCoef,
    constant: left.constant - right.constant,
  };
}

function sameEquation(input, xCoef, constant) {
  const parsed = parseEquation(input);
  return parsed && parsed.xCoef === xCoef && parsed.constant === constant;
}

function largestSquareFactor(n) {
  for (let root = Math.floor(Math.sqrt(n)); root >= 1; root -= 1) {
    const square = root * root;
    if (n % square === 0) {
      return { root, square, rest: n / square };
    }
  }
  return { root: 1, square: 1, rest: n };
}

function radicalText(coef, radicand) {
  if (radicand === 1) return `${coef}`;
  if (coef === 1) return `√${radicand}`;
  return `${coef}√${radicand}`;
}

function radicalTeX(coef, radicand) {
  if (radicand === 1) return String(coef);
  if (coef === 1) return `\\sqrt{${radicand}}`;
  return `${coef}\\sqrt{${radicand}}`;
}

function sameRadical(input, coef, radicand) {
  let text = normalizeText(input)
    .replace(/\*/g, "")
    .replace(/sqrt\((\d+)\)/g, "√$1")
    .replace(/sqrt(\d+)/g, "√$1");

  if (radicand === 1) return Number(text) === coef;

  const patterns = [
    new RegExp(`^${coef}√${radicand}$`),
    new RegExp(`^${coef}root${radicand}$`),
  ];
  if (coef === 1) patterns.push(new RegExp(`^√${radicand}$`));
  return patterns.some((pattern) => pattern.test(text));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choose(values) {
  return values[randomInt(0, values.length - 1)];
}

function setHashForUnit(index) {
  const unit = units[index];
  if (!unit) return;
  history.replaceState(null, "", `#${unit.id}`);
}

function renderUnitButtons() {
  const wrap = $("#unit-buttons");
  wrap.innerHTML = "";
  units.forEach((unit, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `unit-button${index === activeUnit ? " active" : ""}`;
    button.innerHTML = `<strong>${index + 1}. ${unit.title}</strong><span>${unit.stage} / ${unit.range.join("・")}</span>`;
    button.addEventListener("click", () => {
      activeUnit = index;
      renderUnit();
      setHashForUnit(index);
      $("#lessons").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    wrap.append(button);
  });
}

function renderDots() {
  const wrap = $("#unit-dots");
  wrap.innerHTML = "";
  units.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `dot-button${index === activeUnit ? " active" : ""}`;
    button.textContent = String(index + 1);
    button.setAttribute("aria-label", `${index + 1}ページへ`);
    button.addEventListener("click", () => {
      activeUnit = index;
      renderUnit();
      setHashForUnit(index);
    });
    wrap.append(button);
  });
}

function renderUnit() {
  const unit = units[activeUnit];
  $("#unit-progress-label").textContent = `${activeUnit + 1} / ${units.length}`;
  $("#unit-progress-bar").style.width = `${((activeUnit + 1) / units.length) * 100}%`;
  $("#unit-content").innerHTML = `
    <span class="unit-stage">${unit.stage}</span>
    ${rangeTags(unit)}
    <h3>${unit.title}</h3>
    <p class="unit-summary">${unit.summary}</p>
    <div class="unit-content-grid">
      <div class="note-box">
        <h4>おさらいポイント</h4>
        <ul>${unit.points.map((point) => `<li>${point}</li>`).join("")}</ul>
      </div>
      <div class="example-box">
        <h4>例</h4>
        <p class="big-formula">${unit.example}</p>
      </div>
      <div class="mini-check">
        <h4>動かして確認</h4>
        <p>${unit.check}</p>
      </div>
    </div>
  `;

  $("#prev-unit").disabled = activeUnit === 0;
  $("#next-unit").disabled = activeUnit === units.length - 1;
  renderUnitButtons();
  renderDots();
  scheduleMathTypeset($("#unit-content"));
}

function setupLessons() {
  const hash = decodeURIComponent(location.hash.replace("#", ""));
  const hashIndex = units.findIndex((unit) => unit.id === hash);
  if (hashIndex >= 0) activeUnit = hashIndex;

  $("#prev-unit").addEventListener("click", () => {
    activeUnit = Math.max(0, activeUnit - 1);
    renderUnit();
    setHashForUnit(activeUnit);
  });
  $("#next-unit").addEventListener("click", () => {
    activeUnit = Math.min(units.length - 1, activeUnit + 1);
    renderUnit();
    setHashForUnit(activeUnit);
  });

  renderUnit();
}

function setupNumberLine() {
  ["#int-a", "#int-b", "#int-op"].forEach((selector) => {
    $(selector).addEventListener("input", drawNumberLine);
  });
  drawNumberLine();
}

function drawArrow(ctx, x1, y1, x2, y2, color) {
  const head = 10;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - head * Math.cos(angle - Math.PI / 6), y2 - head * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - head * Math.cos(angle + Math.PI / 6), y2 - head * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
}

function drawNumberLine() {
  const canvas = $("#number-line");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const a = Number($("#int-a").value);
  const b = Number($("#int-b").value);
  const op = $("#int-op").value;
  const move = op === "+" ? b : -b;
  const result = a + move;
  const min = -16;
  const max = 16;
  const y = height * 0.56;
  const map = (value) => 48 + ((value - min) / (max - min)) * (width - 96);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#22313a";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(map(min), y);
  ctx.lineTo(map(max), y);
  ctx.stroke();

  ctx.font = "700 18px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let value = min; value <= max; value += 2) {
    const x = map(value);
    ctx.strokeStyle = value === 0 ? "#2f6f73" : "#9b8f82";
    ctx.lineWidth = value === 0 ? 4 : 2;
    ctx.beginPath();
    ctx.moveTo(x, y - 12);
    ctx.lineTo(x, y + 12);
    ctx.stroke();
    ctx.fillStyle = value === 0 ? "#2f6f73" : "#6b7280";
    ctx.fillText(String(value), x, y + 18);
  }

  drawArrow(ctx, map(0), y - 70, map(a), y - 70, "#407bff");
  drawArrow(ctx, map(a), y - 118, map(result), y - 118, "#f2994a");

  ctx.font = "900 22px system-ui";
  ctx.textBaseline = "bottom";
  ctx.fillStyle = "#407bff";
  ctx.fillText(`a = ${a}`, (map(0) + map(a)) / 2, y - 78);
  ctx.fillStyle = "#b75f00";
  ctx.fillText(op === "+" ? `b = ${b}` : `-b = ${move}`, (map(a) + map(result)) / 2, y - 126);

  ctx.fillStyle = "#1f2933";
  ctx.beginPath();
  ctx.arc(map(result), y, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText(`結果 ${result}`, map(result), y - 18);

  $("#number-line-result").textContent =
    op === "+"
      ? `\\(${a}+(${b})=${result}\\)。右向きはプラス、左向きはマイナスです。`
      : `\\(${a}-(${b})=${a}+(${-b})=${result}\\)。引き算は「反対向きに足す」と見られます。`;
  scheduleMathTypeset($("#number-line-result"));
}

function setupDistribution() {
  ["#dist-a", "#dist-b", "#dist-c"].forEach((selector) => {
    $(selector).addEventListener("input", renderDistribution);
  });
  renderDistribution();
}

function renderDistribution() {
  const a = Number($("#dist-a").value);
  const b = Number($("#dist-b").value);
  const c = Number($("#dist-c").value);
  const model = $("#area-model");
  model.innerHTML = `
    <div class="area-row" style="grid-template-columns: ${b}fr ${c}fr; min-height: ${110 + a * 8}px">
      <div class="area-part">\\(${a}\\times${b}\\)<br>\\(${a * b}\\)</div>
      <div class="area-part">\\(${a}\\times${c}\\)<br>\\(${a * c}\\)</div>
    </div>
  `;
  $("#distribution-result").textContent = `\\(${a}(${b}+${c})=${a}\\times${b}+${a}\\times${c}=${a * (b + c)}\\)。分けても全体は同じです。`;
  scheduleMathTypeset($("#area-model"));
  scheduleMathTypeset($("#distribution-result"));
}

function setupRadicals() {
  $("#radical-n").addEventListener("input", renderRadical);
  renderRadical();
}

function renderRadical() {
  const n = Number($("#radical-n").value);
  const factor = largestSquareFactor(n);
  const simplified = radicalText(factor.root, factor.rest);
  const simplifiedTeX = radicalTeX(factor.root, factor.rest);
  $("#radical-expression").textContent = `\\(\\sqrt{${n}}=${simplifiedTeX}\\)`;
  $("#radical-result").textContent =
    factor.square === 1
      ? `${n} の中には 1 以外の平方数因子がありません。これ以上は整数を外へ出せません。`
      : `\\(${n}=${factor.square}\\times${factor.rest}\\) なので、\\(\\sqrt{${factor.square}}=${factor.root}\\) を外へ出して \\(${simplifiedTeX}\\)。`;

  const tiles = $("#radical-tiles");
  const size = Math.min(factor.root, 12);
  const cells = Array.from({ length: size * size }, () => `<span class="square-cell"></span>`).join("");
  tiles.innerHTML = `
    <div>
      <div class="square-grid" style="grid-template-columns: repeat(${size}, 8px);">${cells}</div>
      <p class="lab-result" style="margin-top: .7rem;">平方数 \\(${factor.square}\\) ${factor.rest > 1 ? `が \\(${factor.rest}\\) 組` : ""}</p>
    </div>
  `;
  scheduleMathTypeset($("#radical-expression"));
  scheduleMathTypeset($("#radical-result"));
  scheduleMathTypeset($("#radical-tiles"));
}

function setupTerms() {
  ["#term-p", "#term-q", "#term-r", "#term-s"].forEach((selector) => {
    $(selector).addEventListener("input", renderTerms);
  });
  renderTerms();
}

function chip(value, label, extraClass = "") {
  const negative = value < 0 ? " negative" : "";
  return `<span class="term-chip ${extraClass}${negative}">${label}</span>`;
}

function renderTermChips(value, variable) {
  if (value === 0) return chip(0, "0");
  const count = Math.min(Math.abs(value), 9);
  return Array.from({ length: count }, () =>
    chip(value, `${value < 0 ? "-" : "+"}${variable}`, variable === "1" ? "constant" : ""),
  ).join("");
}

function renderTerms() {
  const p = Number($("#term-p").value);
  const q = Number($("#term-q").value);
  const r = Number($("#term-r").value);
  const s = Number($("#term-s").value);
  const xSum = p + q;
  const cSum = r + s;
  const originalParts = [];
  if (p !== 0) originalParts.push(term(p));
  if (q !== 0) originalParts.push(`${q < 0 ? "- " : "+ "}${Math.abs(q)}x`);
  if (r !== 0) originalParts.push(`${r < 0 ? "- " : "+ "}${Math.abs(r)}`);
  if (s !== 0) originalParts.push(`${s < 0 ? "- " : "+ "}${Math.abs(s)}`);
  const original = (originalParts.join(" ") || "0").replace(/^\+ /, "");
  $("#term-board").innerHTML = `
    <div class="term-lane">
      <h4>x の項</h4>
      <div class="term-chips">${renderTermChips(p, "x")}${renderTermChips(q, "x")}</div>
    </div>
    <div class="term-lane">
      <h4>定数項</h4>
      <div class="term-chips">${renderTermChips(r, "1")}${renderTermChips(s, "1")}</div>
    </div>
  `;
  $("#term-result").textContent = `\\(${original}=${linearText(xSum, cSum)}\\)`;
  scheduleMathTypeset($("#term-result"));
}

function setupEquation() {
  ["#eq-a", "#eq-x", "#eq-b"].forEach((selector) => {
    $(selector).addEventListener("input", renderEquation);
  });
  renderEquation();
}

function renderEquation() {
  const a = Number($("#eq-a").value);
  const x = Number($("#eq-x").value);
  const b = Number($("#eq-b").value);
  const c = a * x + b;
  const equation = `${term(a)} ${b < 0 ? "- " + Math.abs(b) : "+ " + b} = ${c}`;
  $("#balance-stage").innerHTML = `
    <div class="balance-beam">
      <div class="pan">\\(${equation}\\)<br><small>\\(x=${x}\\) のとき \\(${c}\\)</small></div>
      <div class="fulcrum" aria-hidden="true"></div>
      <div class="pan">\\(${c}\\)</div>
    </div>
  `;
  const first = b === 0 ? `${term(a)} = ${c}` : `${term(a)} = ${c - b}`;
  $("#equation-result").textContent = `\\(${equation}\\)。まず両辺に ${b < 0 ? `\\(${Math.abs(b)}\\) を足す` : `\\(${b}\\) を引く`} と \\(${first}\\)、次に \\(${a}\\) で割ると \\(x=${x}\\)。`;
  scheduleMathTypeset($("#balance-stage"));
  scheduleMathTypeset($("#equation-result"));
}

function setupGraph() {
  ["#graph-type", "#graph-a", "#graph-b", "#graph-c"].forEach((selector) => {
    $(selector).addEventListener("input", drawGraph);
  });
  drawGraph();
}

function drawGraph() {
  const canvas = $("#function-graph");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const type = $("#graph-type").value;
  const a = Number($("#graph-a").value);
  const b = Number($("#graph-b").value);
  const c = Number($("#graph-c").value);
  const min = -10;
  const max = 10;
  const mapX = (x) => ((x - min) / (max - min)) * width;
  const mapY = (y) => height - ((y - min) / (max - min)) * height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#e4d9c8";
  ctx.lineWidth = 1;
  for (let i = min; i <= max; i += 1) {
    ctx.beginPath();
    ctx.moveTo(mapX(i), 0);
    ctx.lineTo(mapX(i), height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, mapY(i));
    ctx.lineTo(width, mapY(i));
    ctx.stroke();
  }

  ctx.strokeStyle = "#1f2933";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(mapX(min), mapY(0));
  ctx.lineTo(mapX(max), mapY(0));
  ctx.moveTo(mapX(0), mapY(min));
  ctx.lineTo(mapX(0), mapY(max));
  ctx.stroke();

  const f = type === "linear" ? (x) => a * x + b : (x) => a * x * x + b * x + c;
  ctx.strokeStyle = "#2f6f73";
  ctx.lineWidth = 5;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= width; px += 3) {
    const x = min + (px / width) * (max - min);
    const y = f(x);
    const py = mapY(y);
    if (py < -height || py > height * 2) {
      started = false;
      continue;
    }
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();

  $("#graph-result").textContent =
    type === "linear"
      ? `\\(y=${a}x${b < 0 ? "-" + Math.abs(b) : "+" + b}\\)。係数 \\(${a}\\) は傾き、\\(${b}\\) は \\(y\\) 軸との交点です。`
      : `\\(y=${a}x^2${b < 0 ? "-" + Math.abs(b) + "x" : "+" + b + "x"}${c < 0 ? "-" + Math.abs(c) : "+" + c}\\)。\\(x^2\\) の係数で開き方と上下の向きが変わります。`;
  scheduleMathTypeset($("#graph-result"));
}

const practiceModes = [
  { id: "integer", label: "整数の計算", generator: generateIntegerProblem },
  { id: "radical", label: "ルート整理", generator: generateRadicalProblem },
  { id: "substitution", label: "式の値", generator: generateSubstitutionProblem },
  { id: "combine", label: "同類項", generator: generateCombineProblem },
  { id: "distribute", label: "分配法則", generator: generateDistributeProblem },
  { id: "equation", label: "一次方程式", generator: generateEquationProblem },
];

function generateIntegerProblem() {
  const a = randomInt(-9, 9);
  const b = choose([-6, -5, -4, -3, 3, 4, 5, 6]);
  const c = randomInt(-9, 9);
  const product = b * c;
  const answer = a + product;
  return {
    modeLabel: "整数",
    title: "計算順序と符号",
    prompt: `\\(${a}+(${b})\\times(${c})\\)`,
    steps: [
      {
        label: "先に乗法を計算する",
        question: `\\((${b})\\times(${c})\\) は？`,
        hint: "同じ符号なら正、違う符号なら負です。",
        check: (input) => Number(normalizeText(input)) === product,
        answer: String(product),
      },
      {
        label: "残った加法を計算する",
        question: `\\(${a}+(${product})\\) は？`,
        hint: "数直線で、a から product だけ移動します。",
        check: (input) => Number(normalizeText(input)) === answer,
        answer: String(answer),
      },
    ],
  };
}

function generateRadicalProblem() {
  const base = randomInt(2, 9);
  const rest = choose([2, 3, 5, 6, 7, 10, 11, 13]);
  const n = base * base * rest;
  return {
    modeLabel: "ルート",
    title: "平方数を外へ出す",
    prompt: `\\(\\sqrt{${n}}\\) を簡単にする`,
    steps: [
      {
        label: "平方数の因数を見つける",
        question: `\\(${n}=\\Box\\times${rest}\\)。\\(\\Box\\) に入る平方数は？`,
        hint: `\\(${base}^2\\) を探してみましょう。`,
        check: (input) => Number(normalizeText(input)) === base * base,
        answer: String(base * base),
      },
      {
        label: "√の外へ出す",
        question: `\\(\\sqrt{${n}}=?\\)`,
        hint: `\\(\\sqrt{${base * base}}=${base}\\) です。`,
        check: (input) => sameRadical(input, base, rest),
        answer: radicalText(base, rest),
      },
    ],
  };
}

function generateSubstitutionProblem() {
  const a = randomInt(2, 6);
  const b = randomInt(-5, 5);
  const x = randomInt(-4, 6);
  const answer = a * x + b;
  return {
    modeLabel: "文字式",
    title: "式の値",
    prompt: `\\(${term(a)}${b < 0 ? "-" + Math.abs(b) : "+" + b}\\) に \\(x=${x}\\) を代入する`,
    steps: [
      {
        label: "文字を数に置き換える",
        question: `\\(${term(a)}${b < 0 ? "-" + Math.abs(b) : "+" + b}\\) は、\\(x=${x}\\) のときどんな式？`,
        hint: `\\(${term(a)}\\) は \\(${a}\\times x\\) です。`,
        check: (input) => {
          const text = normalizeText(input);
          const acceptable = [`${a}*${x}${b < 0 ? b : `+${b}`}`, `${a}(${x})${b < 0 ? b : `+${b}`}`].map(normalizeText);
          return acceptable.includes(text);
        },
        answer: `${a}×(${x}) ${b < 0 ? "- " + Math.abs(b) : "+ " + b}`,
      },
      {
        label: "数として計算する",
        question: "式の値は？",
        hint: "符号に注意して、先にかけ算をします。",
        check: (input) => Number(normalizeText(input)) === answer,
        answer: String(answer),
      },
    ],
  };
}

function generateCombineProblem() {
  const p = randomInt(-7, 7) || 2;
  const q = randomInt(-7, 7) || -3;
  const r = randomInt(-9, 9);
  const s = randomInt(-9, 9);
  const xSum = p + q;
  const cSum = r + s;
  return {
    modeLabel: "文字式",
    title: "同類項をまとめる",
    prompt: `\\(${term(p)}${q < 0 ? "-" + Math.abs(q) + "x" : "+" + q + "x"}${compactSigned(r).replaceAll(" ", "")}${compactSigned(s).replaceAll(" ", "")}\\)`,
    steps: [
      {
        label: "x の係数だけをまとめる",
        question: `\\(${p}+(${q})\\) は？`,
        hint: "\\(x\\) が何個分あるかを数えます。",
        check: (input) => Number(normalizeText(input)) === xSum,
        answer: String(xSum),
      },
      {
        label: "定数だけをまとめる",
        question: `\\(${r}+(${s})\\) は？`,
        hint: "\\(x\\) が付かない数どうしを計算します。",
        check: (input) => Number(normalizeText(input)) === cSum,
        answer: String(cSum),
      },
      {
        label: "ひとつの文字式にする",
        question: "整理した式は？",
        hint: `\\(${xSum}x\\) と \\(${cSum}\\) を並べます。`,
        check: (input) => sameLinearExpression(input, xSum, cSum),
        answer: linearText(xSum, cSum),
      },
    ],
  };
}

function generateDistributeProblem() {
  const a = choose([-5, -4, -3, -2, 2, 3, 4, 5]);
  const b = randomInt(-8, 8) || 3;
  const xCoef = a;
  const constant = a * b;
  return {
    modeLabel: "分配法則",
    title: "かっこを外す",
    prompt: `\\(${a}(${b < 0 ? "x-" + Math.abs(b) : "x+" + b})\\) を展開する`,
    steps: [
      {
        label: "x の項へ配る",
        question: `\\(${a}\\times x\\) は？`,
        hint: "係数がそのまま x の係数になります。",
        check: (input) => sameLinearExpression(input, xCoef, 0),
        answer: term(xCoef),
      },
      {
        label: "定数項へ配る",
        question: `\\(${a}\\times(${b})\\) は？`,
        hint: "負の数をかけるときは符号に注意。",
        check: (input) => Number(normalizeText(input)) === constant,
        answer: String(constant),
      },
      {
        label: "展開した式を書く",
        question: "展開した結果は？",
        hint: `\\(${term(xCoef)}\\) と \\(${constant}\\) を足した形です。`,
        check: (input) => sameLinearExpression(input, xCoef, constant),
        answer: linearText(xCoef, constant),
      },
    ],
  };
}

function generateEquationProblem() {
  const a = randomInt(2, 7);
  const x = randomInt(-5, 8);
  const b = randomInt(-9, 9);
  const c = a * x + b;
  return {
    modeLabel: "方程式",
    title: "x を一人にする",
    prompt: `\\(${term(a)}${b < 0 ? "-" + Math.abs(b) : "+" + b}=${c}\\)`,
    steps: [
      {
        label: "定数項を反対側へ移す",
        question: `両辺に同じ操作をして、\\(${term(a)}=?\\) の形にすると？`,
        hint: b < 0 ? `\\(${Math.abs(b)}\\) を両辺に足します。` : `\\(${b}\\) を両辺から引きます。`,
        check: (input) => Number(normalizeText(input).replace(`${a}x=`, "")) === c - b || sameEquation(input, a, -(c - b)),
        answer: `${term(a)} = ${c - b}`,
      },
      {
        label: "係数で割る",
        question: "\\(x\\) は？",
        hint: `両辺を \\(${a}\\) で割ります。`,
        check: (input) => normalizeText(input) === `x=${x}` || Number(normalizeText(input)) === x,
        answer: `x = ${x}`,
      },
    ],
  };
}

function setupPractice() {
  const wrap = $("#practice-modes");
  wrap.innerHTML = "";
  practiceModes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `mode-button${mode.id === activePracticeMode ? " active" : ""}`;
    button.textContent = mode.label;
    button.addEventListener("click", () => {
      activePracticeMode = mode.id;
      renderPracticeModes();
      newProblem();
    });
    wrap.append(button);
  });

  $("#new-problem").addEventListener("click", newProblem);
  $("#answer-form").addEventListener("submit", (event) => {
    event.preventDefault();
    checkCurrentStep();
  });
  newProblem();
}

function renderPracticeModes() {
  $$(".mode-button").forEach((button, index) => {
    button.classList.toggle("active", practiceModes[index].id === activePracticeMode);
  });
}

function newProblem() {
  const mode = practiceModes.find((item) => item.id === activePracticeMode);
  currentProblem = mode.generator();
  currentStepIndex = 0;
  $("#problem-mode-label").textContent = currentProblem.modeLabel;
  $("#problem-title").textContent = currentProblem.title;
  $("#problem-prompt").textContent = currentProblem.prompt;
  $("#feedback").textContent = "";
  $("#feedback").className = "feedback";
  $("#answer-input").value = "";
  renderSteps();
  scheduleMathTypeset($(".problem-card"));
}

function renderSteps() {
  const list = $("#step-list");
  list.innerHTML = "";
  currentProblem.steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = index < currentStepIndex ? "done" : index === currentStepIndex ? "current" : "";
    li.textContent =
      index < currentStepIndex
        ? `${step.label}：${step.answer}`
        : index === currentStepIndex
          ? `${step.label}：${step.question}`
          : step.label;
    list.append(li);
  });
  const current = currentProblem.steps[currentStepIndex];
  $("#answer-label").textContent = current ? current.question : "完了";
  $("#hint-text").textContent = current ? current.hint : "よくできました。新しい問題へ進みましょう。";
  scheduleMathTypeset($(".problem-card"));
}

function checkCurrentStep() {
  const current = currentProblem.steps[currentStepIndex];
  if (!current) {
    newProblem();
    return;
  }

  const input = $("#answer-input").value;
  if (current.check(input)) {
    currentStepIndex += 1;
    $("#answer-input").value = "";
    if (currentStepIndex >= currentProblem.steps.length) {
      $("#feedback").textContent = "正解！この問題は完了です。";
      $("#feedback").className = "feedback good";
    } else {
      $("#feedback").textContent = "いい感じ。次のステップへ進みましょう。";
      $("#feedback").className = "feedback good";
    }
    renderSteps();
  } else {
    $("#feedback").textContent = "惜しいです。ヒントを見ながら、符号・種類・順序をもう一度確認してみましょう。";
    $("#feedback").className = "feedback try";
  }
}

function setupMap() {
  ["#map-category", "#map-level"].forEach((selector) => {
    $(selector).addEventListener("change", () => {
      activeMapPage = 0;
      renderMap();
    });
  });
  $("#prev-map").addEventListener("click", () => {
    activeMapPage = Math.max(0, activeMapPage - 1);
    renderMap();
  });
  $("#next-map").addEventListener("click", () => {
    activeMapPage += 1;
    renderMap();
  });
  renderMap();
}

function filteredTopics() {
  const category = $("#map-category").value;
  const level = $("#map-level").value;
  return topics.filter((topic) => {
    const categoryOk = category === "all" || topic.category === category;
    const levelOk = level === "all" || String(topic.level) === level;
    return categoryOk && levelOk;
  });
}

function renderMap() {
  const pageSize = 8;
  const items = filteredTopics();
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  activeMapPage = Math.min(activeMapPage, totalPages - 1);
  const pageItems = items.slice(activeMapPage * pageSize, activeMapPage * pageSize + pageSize);
  $("#topic-grid").innerHTML = pageItems
    .map(
      (topic) => `
        <article class="topic-card">
          <div>
            <div class="topic-meta">
              <span class="pill">LEVEL ${topic.level}</span>
              <span class="pill">${categoryLabels[topic.category]}</span>
            </div>
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
          </div>
          <a href="#${topic.unitId}" data-unit-link="${topic.unitId}">関連単元へ</a>
        </article>
      `,
    )
    .join("");

  $$("[data-unit-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const unitId = event.currentTarget.dataset.unitLink;
      const index = units.findIndex((unit) => unit.id === unitId);
      if (index >= 0) {
        activeUnit = index;
        renderUnit();
        setHashForUnit(index);
        $("#lessons").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  $("#map-page-label").textContent = `${activeMapPage + 1} / ${totalPages}`;
  $("#prev-map").disabled = activeMapPage === 0;
  $("#next-map").disabled = activeMapPage >= totalPages - 1;
}

function setupSmoothUnitLinks() {
  window.addEventListener("hashchange", () => {
    const unitId = decodeURIComponent(location.hash.replace("#", ""));
    const index = units.findIndex((unit) => unit.id === unitId);
    if (index >= 0) {
      activeUnit = index;
      renderUnit();
    }
  });
}

function init() {
  setupLessons();
  setupNumberLine();
  setupDistribution();
  setupRadicals();
  setupTerms();
  setupEquation();
  setupGraph();
  setupPractice();
  setupMap();
  setupSmoothUnitLinks();
}

document.addEventListener("DOMContentLoaded", init);
