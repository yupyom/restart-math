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
    id: "sets-propositions",
    stage: "数I",
    range: ["数I"],
    title: "集合と命題",
    summary:
      "数学Iでは、計算だけでなく「条件を正確に読む」力が必要になります。集合・命題・反例は、そのための言葉です。",
    points: [
      "\\(A\\cap B\\) は共通部分、\\(A\\cup B\\) は和集合",
      "命題は真偽を判断できる文",
      "「ならば」を読むときは、逆・裏・対偶を区別する",
      "必要条件・十分条件は、矢印の向きで確認する",
    ],
    example: "\\(x>2\\Rightarrow x>0\\) は真だが、逆は真とは限らない",
    check: "一つでも反例があれば、その命題は偽です。反例を探す習慣が論理の足腰になります。",
  },
  {
    id: "linear-inequalities",
    stage: "数I",
    range: ["中2", "数I"],
    title: "不等式の基本",
    summary:
      "不等式は、等式と同じように両辺へ同じ操作ができます。ただし、負の数をかけたり割ったりすると不等号の向きが変わります。",
    points: [
      "\\(a<b\\) なら \\(a+c<b+c\\)",
      "\\(a<b\\)、\\(c>0\\) なら \\(ac<bc\\)",
      "\\(a<b\\)、\\(c<0\\) なら \\(ac>bc\\)",
      "解は数直線上の範囲として表す",
    ],
    example: "\\(-2x<6\\Rightarrow x>-3\\)",
    check: "負の数で割る場面だけ、赤信号みたいに一度止まって不等号の向きを確認しましょう。",
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
      "一次方程式は、左右から同じブロックを取り、残ったブロックをx袋の数で分けて、x袋1つの中身を調べる作業です。",
    points: [
      "足されている数は両辺から引く",
      "かけられている数は両辺を割る",
      "途中式は操作の記録として書く",
    ],
    example: "\\(3x-5=16\\Rightarrow3x=21\\Rightarrow x=7\\)",
    check: "方程式ラボで x袋と1ブロックを動かし、ブロック操作が式の操作に変わる様子を見よう。",
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
    id: "quadratic-vertex",
    stage: "数I",
    range: ["数I"],
    title: "二次関数の頂点と最大・最小",
    summary:
      "二次関数は、頂点を見るとグラフ全体の動きが一気に分かります。平方完成は、式から頂点を読むための技術です。",
    points: [
      "頂点形式 \\(y=a(x-p)^2+q\\) では、\\(p\\) が横位置、\\(q\\) が高さ",
      "\\(a>0\\) なら下に凸で最小値をもつ",
      "\\(a<0\\) なら上に凸で最大値をもつ",
      "平方完成で \\(x^2+bx+c\\) を頂点形式へ直す",
    ],
    example: "\\(y=(x-2)^2-3\\) は「横位置 \\(2\\)、高さ \\(-3\\)」なので、頂点は \\((2,-3)\\)",
    check: "二次関数の頂点ラボで、\\(a\\) の符号と頂点の位置が最大・最小にどう効くか見ましょう。",
  },
  {
    id: "quadratic-inequalities",
    stage: "数I",
    range: ["数I"],
    title: "二次方程式・二次不等式とグラフ",
    summary:
      "二次方程式の解は、放物線と \\(x\\) 軸の交点です。二次不等式は、グラフが \\(x\\) 軸より上か下かを読む問題です。",
    points: [
      "\\(ax^2+bx+c=0\\) の解はグラフの \\(x\\) 切片",
      "判別式 \\(D=b^2-4ac\\) で交点の個数が分かる",
      "\\(y>0\\) はグラフが \\(x\\) 軸より上の範囲",
      "因数分解できると符号表で解ける",
    ],
    example: "\\((x-1)(x-4)>0\\) の解は \\(x<1,\\ 4<x\\)",
    check: "根の間は符号が変わる、というグラフの見方を持つと不等式が軽くなります。",
  },
  {
    id: "trig-ratios",
    stage: "数I",
    range: ["数I"],
    title: "三角比 \\(\\sin,\\cos,\\tan\\)",
    summary:
      "三角比は、直角三角形の辺の比を角度の言葉で表したものです。長さそのものではなく、形の比を見ます。",
    points: [
      "\\(\\sin\\theta=\\dfrac{\\text{対辺}}{\\text{斜辺}}\\)",
      "\\(\\cos\\theta=\\dfrac{\\text{隣辺}}{\\text{斜辺}}\\)",
      "\\(\\tan\\theta=\\dfrac{\\text{対辺}}{\\text{隣辺}}\\)",
      "斜辺を変えても、角度が同じなら三角比は変わらない",
    ],
    example: "直角三角形の辺が \\(3,4,5\\) なら、\\(\\sin\\theta=\\frac{3}{5}\\)、\\(\\cos\\theta=\\frac{4}{5}\\)",
    check: "三角比ラボで斜辺を変え、角度が同じなら比が変わらないことを見ましょう。",
  },
  {
    id: "sine-cosine-rule",
    stage: "数I",
    range: ["数I"],
    title: "正弦定理・余弦定理の入口",
    summary:
      "直角三角形でなくても、辺と角の関係を扱えるのが正弦定理・余弦定理です。三平方の定理が広がった景色として見ると入りやすいです。",
    points: [
      "正弦定理：\\(\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}\\)",
      "余弦定理：\\(a^2=b^2+c^2-2bc\\cos A\\)",
      "\\(A=90^\\circ\\) なら余弦定理は三平方の定理になる",
      "分かっている辺・角から、使う定理を選ぶ",
    ],
    example: "\\(a^2=b^2+c^2-2bc\\cos A\\)",
    check: "まずは「どの角の向かいがどの辺か」を図に書き込むのが一番の近道です。",
  },
  {
    id: "data-analysis-i",
    stage: "数I",
    range: ["数I"],
    title: "分散・標準偏差・相関",
    summary:
      "数学Iのデータ分析では、平均だけでなく散らばりや2つのデータの関係を見ます。数字で傾向を言葉にする単元です。",
    points: [
      "偏差は \\(\\text{値}-\\text{平均}\\)",
      "分散は偏差の2乗の平均",
      "標準偏差は分散の平方根",
      "散布図と相関係数で2つの変量の関係を見る",
    ],
    example: "\\(1,2,3\\) の平均は \\(2\\)、分散は \\(\\frac{2}{3}\\)",
    check: "標準偏差は「平均との差がだいたいどれくらいか」の物差しです。",
  },
  {
    id: "counting-principles",
    stage: "数A",
    range: ["数A"],
    title: "場合の数：和の法則・積の法則",
    summary:
      "場合の数は、ただ数える単元ではありません。重ならない選択なのか、連続する選択なのかを見分ける単元です。",
    points: [
      "どちらか一方を選ぶなら和の法則",
      "順に両方を選ぶなら積の法則",
      "順序を区別するなら順列",
      "順序を区別しないなら組合せ",
    ],
    example: "\\({}_5P_2=5\\times4=20\\)、\\({}_5C_2=\\dfrac{5\\times4}{2\\times1}=10\\)",
    check: "「AしてからBする」のか、「AまたはB」なのかを日本語から読み取るのが最初の勝負です。",
  },
  {
    id: "probability-a",
    stage: "数A",
    range: ["数A"],
    title: "確率：独立・条件付き・期待値",
    summary:
      "確率は、場合の数を土台にして起こりやすさを比で表します。条件が変わると分母が変わる、という感覚が大切です。",
    points: [
      "\\(P(A)=\\dfrac{A\\text{が起こる場合の数}}{\\text{すべての場合の数}}\\)",
      "独立な試行では確率をかける",
      "条件付き確率では、条件を満たす世界だけで考える",
      "期待値は、値と確率をかけて足した平均的な値",
    ],
    example: "赤3個・青5個の袋から戻して2回引くと、赤赤の確率は \\(\\frac{3}{8}\\times\\frac{3}{8}=\\frac{9}{64}\\)",
    check: "確率の木ラボで、戻す・戻さないで2回目の分母が変わることを確認しましょう。",
  },
  {
    id: "geometry-a",
    stage: "数A",
    range: ["数A"],
    title: "図形の性質",
    summary:
      "数学Aの図形では、三角形・円・作図・空間図形の性質を、証明や関係式として読む力を育てます。",
    points: [
      "三角形では角の二等分線、外心・内心・重心などを見る",
      "円では円周角、接線、方べきの関係が重要",
      "図形の性質は、補助線で見える形に変える",
      "コンピュータで動かすと不変な関係を発見しやすい",
    ],
    example: "同じ弧に対する円周角は等しい",
    check: "図を動かしても変わらない量を探すと、証明したいことが見えてきます。",
  },
  {
    id: "math-human-activities",
    stage: "数A",
    range: ["数A"],
    title: "数学と人間の活動：整数としくみ",
    summary:
      "数学Aには、歴史や生活の中で生まれた数学的なしくみを見る単元があります。整数の性質や互除法はその入口です。",
    points: [
      "約数・倍数・素因数分解で整数を分解して見る",
      "最大公約数はユークリッドの互除法で求められる",
      "記数法を変えると、同じ数の表し方が変わる",
      "暗号・暦・測量など、人間の活動と数学は深くつながる",
    ],
    example: "\\(84=30\\times2+24,\\ 30=24\\times1+6,\\ 24=6\\times4\\) より \\(\\gcd(84,30)=6\\)",
    check: "計算をただ進めるだけでなく、「なぜ余りを使うと最大公約数が残るのか」を見ていきましょう。",
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
  ["algebra", 3, "集合", "共通部分・和集合・補集合で条件を整理する", "sets-propositions"],
  ["algebra", 3, "命題", "真偽・逆・裏・対偶・反例を読む", "sets-propositions"],
  ["algebra", 3, "一次不等式", "負の数で割ると向きが変わる", "linear-inequalities"],
  ["algebra", 3, "恒等式", "どんな値でも成り立つ等式", "identities-equations"],
  ["algebra", 3, "一次方程式", "両辺に同じ操作をして解く", "linear-equations"],
  ["algebra", 4, "連立方程式", "2つの条件を同時に満たす値", "simultaneous-equations"],
  ["function", 2, "比例・反比例", "一定の比や積でつながる関係", "functions"],
  ["function", 3, "一次関数", "傾きと切片で直線を読む", "functions"],
  ["function", 3, "二次関数", "放物線の開き方と移動を見る", "functions"],
  ["function", 3, "二次関数の頂点", "平方完成で頂点と最大・最小を読む", "quadratic-vertex"],
  ["function", 4, "二次方程式とグラフ", "解を x 軸との交点として読む", "quadratic-inequalities"],
  ["function", 4, "二次不等式", "放物線が x 軸より上か下かを見る", "quadratic-inequalities"],
  ["function", 4, "関数と方程式", "交点を解として読む", "functions"],
  ["geometry", 1, "角度", "直線・三角形・多角形の角", "geometry"],
  ["geometry", 2, "面積", "公式を分解して理解する", "geometry"],
  ["geometry", 2, "合同", "重ね合わせられる図形", "geometry"],
  ["geometry", 3, "相似", "拡大・縮小と比の計算", "geometry"],
  ["geometry", 3, "円", "中心角・円周角・接線", "geometry"],
  ["geometry", 3, "三平方の定理", "直角三角形の辺の関係", "geometry"],
  ["geometry", 4, "三角比", "直角三角形の辺の比を角度で読む", "trig-ratios"],
  ["geometry", 4, "正弦定理・余弦定理", "直角でない三角形の辺と角を結ぶ", "sine-cosine-rule"],
  ["geometry", 4, "図形の性質", "三角形・円の不変な関係を見る", "geometry-a"],
  ["data", 1, "平均・中央値", "代表値を使い分ける", "data"],
  ["data", 2, "度数分布", "データを階級で整理する", "data"],
  ["data", 2, "確率の基本", "起こりやすさを数で表す", "data"],
  ["data", 3, "標準偏差", "散らばりを数値で読む", "data"],
  ["data", 4, "分散と標準偏差", "平均との差の大きさを数値化する", "data-analysis-i"],
  ["data", 4, "散布図と相関", "2つの変量の関係を見る", "data-analysis-i"],
  ["data", 3, "場合の数", "和の法則・積の法則で数える", "counting-principles"],
  ["data", 4, "順列・組合せ", "順序を区別するかで式が変わる", "counting-principles"],
  ["data", 4, "条件付き確率", "条件を満たす世界だけで確率を見る", "probability-a"],
  ["data", 4, "期待値", "値と確率をかけて平均的な値を見る", "probability-a"],
  ["algebra", 4, "整数と互除法", "最大公約数を余りで追う", "math-human-activities"],
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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function fractionText(numerator, denominator) {
  if (denominator === 0) return "未定義";
  const sign = numerator * denominator < 0 ? "-" : "";
  const n = Math.abs(numerator);
  const d = Math.abs(denominator);
  const divisor = gcd(n, d);
  const reducedN = n / divisor;
  const reducedD = d / divisor;
  if (reducedD === 1) return `${sign}${reducedN}`;
  return `${sign}\\frac{${reducedN}}{${reducedD}}`;
}

function parseFraction(input) {
  const text = normalizeText(input);
  if (/^-?\d+\/-?\d+$/.test(text)) {
    const [n, d] = text.split("/").map(Number);
    if (d === 0) return null;
    return n / d;
  }
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return null;
}

function sameRational(input, numerator, denominator) {
  const value = parseFraction(input);
  if (value === null) return false;
  return Math.abs(value - numerator / denominator) < 1e-9;
}

function factorial(n) {
  return Array.from({ length: n }, (_, index) => index + 1).reduce((acc, value) => acc * value, 1);
}

function permutation(n, r) {
  let total = 1;
  for (let value = n; value > n - r; value -= 1) total *= value;
  return total;
}

function combination(n, r) {
  return permutation(n, r) / factorial(r);
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

function renderTermChips(count, label, kind = "") {
  if (count === 0) return `<span class="term-chip muted">なし</span>`;
  return Array.from({ length: Math.min(count, 9) }, () => `<span class="term-chip ${kind}">${label}</span>`).join("");
}

function cardExpression(posX, negX, posOne, negOne) {
  const parts = [];
  if (posX) parts.push(term(posX));
  if (negX) parts.push(`- ${negX === 1 ? "x" : `${negX}x`}`);
  if (posOne) parts.push(parts.length ? `+ ${posOne}` : `${posOne}`);
  if (negOne) parts.push(`- ${negOne}`);
  return parts.join(" ") || "0";
}

function renderTerms() {
  const posX = Number($("#term-p").value);
  const negX = Number($("#term-q").value);
  const posOne = Number($("#term-r").value);
  const negOne = Number($("#term-s").value);
  const xSum = posX - negX;
  const cSum = posOne - negOne;
  const original = cardExpression(posX, negX, posOne, negOne);
  $("#term-p-count").textContent = `${posX}枚`;
  $("#term-q-count").textContent = `${negX}枚`;
  $("#term-r-count").textContent = `${posOne}枚`;
  $("#term-s-count").textContent = `${negOne}枚`;
  $("#term-board").innerHTML = `
    <div class="term-lane">
      <h4>xカードの箱</h4>
      <p>同じ \\(x\\) のカードだけを数えます。</p>
      <div class="term-chips">${renderTermChips(posX, "+x", "positive-x")}${renderTermChips(negX, "-x", "negative-x")}</div>
      <div class="term-explain">\\(+x\\) と \\(-x\\) は1組で \\(0\\)。残りは \\(${term(xSum)}\\)</div>
    </div>
    <div class="term-lane">
      <h4>1カードの箱</h4>
      <p>数字だけのカードは、\\(x\\) カードとは別に数えます。</p>
      <div class="term-chips">${renderTermChips(posOne, "+1", "constant")}${renderTermChips(negOne, "-1", "constant negative-one")}</div>
      <div class="term-explain">\\(+1\\) と \\(-1\\) は1組で \\(0\\)。残りは \\(${cSum}\\)</div>
    </div>
  `;
  $("#term-result").textContent = `\\(${original}=${linearText(xSum, cSum)}\\)`;
  scheduleMathTypeset($("#term-board"));
  scheduleMathTypeset($("#term-result"));
}

function renderUnitBlocks(count, options = {}) {
  const { markFirst = 0, maxVisible = 18 } = options;
  const visible = Math.min(count, maxVisible);
  const blocks = Array.from({ length: visible }, (_, index) => {
    const className = index < markFirst ? "unit-block take-away" : "unit-block";
    return `<span class="${className}">1</span>`;
  }).join("");
  const more = count > visible ? `<span class="more-blocks">+${count - visible}</span>` : "";
  if (count === 0) return `<span class="more-blocks">0こ</span>`;
  return blocks + more;
}

function renderXBags(count) {
  return Array.from({ length: count }, (_, index) => `<span class="x-bag" aria-label="x袋 ${index + 1}">x袋</span>`).join("");
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
  const equation = `${term(a)}+${b}=${c}`;
  const rightAfterRemove = c - b;
  $("#balance-stage").innerHTML = `
    <div class="equation-model">
      <div class="equation-side">
        <h4>左：x袋が ${a}こ、1ブロックが ${b}こ</h4>
        <div class="object-row">${renderXBags(a)}${renderUnitBlocks(b, { markFirst: b })}</div>
      </div>
      <div class="equation-equals">=</div>
      <div class="equation-side">
        <h4>右：1ブロックが ${c}こ</h4>
        <div class="object-row">${renderUnitBlocks(c, { markFirst: b })}</div>
      </div>
    </div>
    <div class="equation-step-cards">
      <div class="equation-step-card">
        <strong>1</strong>
        <div>
          <p>左右から同じ \\(${b}\\) この1ブロックを取りのぞきます。</p>
          <div class="equation-formula">\\(${equation}\\Rightarrow ${term(a)}=${rightAfterRemove}\\)</div>
        </div>
      </div>
      <div class="equation-step-card">
        <strong>2</strong>
        <div>
          <p>残った \\(${rightAfterRemove}\\) このブロックを、\\(${a}\\) このx袋に同じ数ずつ分けます。</p>
          <div class="equation-formula">\\(${rightAfterRemove}\\div ${a}=${x}\\)</div>
        </div>
      </div>
      <div class="equation-step-card">
        <strong>3</strong>
        <div>
          <p>x袋1こには \\(${x}\\) こ入っています。</p>
          <div class="equation-formula">\\(x=${x}\\)</div>
        </div>
      </div>
    </div>
  `;
  $("#equation-result").textContent = `ブロックで見ると、\\(${b}\\) この余分な1ブロックを左右から同じように取るだけです。式では \\(${equation}\\Rightarrow ${term(a)}=${rightAfterRemove}\\Rightarrow x=${x}\\)。`;
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

function setupQuadraticVertex() {
  ["#quad-a", "#quad-h", "#quad-k"].forEach((selector) => {
    $(selector).addEventListener("input", drawQuadraticVertex);
  });
  drawQuadraticVertex();
}

function drawQuadraticVertex() {
  const canvas = $("#quadratic-vertex");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const rawA = Number($("#quad-a").value);
  const a = rawA === 0 ? 1 : rawA;
  const h = Number($("#quad-h").value);
  const k = Number($("#quad-k").value);
  const min = -10;
  const max = 10;
  const mapX = (x) => ((x - min) / (max - min)) * width;
  const mapY = (y) => height - ((y - min) / (max - min)) * height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "#e4d9c8";
  ctx.lineWidth = 1;
  for (let value = min; value <= max; value += 1) {
    ctx.beginPath();
    ctx.moveTo(mapX(value), 0);
    ctx.lineTo(mapX(value), height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, mapY(value));
    ctx.lineTo(width, mapY(value));
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

  ctx.strokeStyle = "#d9468a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= width; px += 3) {
    const x = min + (px / width) * (max - min);
    const y = a * (x - h) ** 2 + k;
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

  ctx.fillStyle = "#1f2933";
  ctx.beginPath();
  ctx.arc(mapX(h), mapY(k), 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "900 22px system-ui";
  ctx.textAlign = "left";
  ctx.fillText(`頂点 (${h}, ${k})`, Math.min(mapX(h) + 14, width - 170), Math.max(mapY(k) - 14, 28));

  const kind = a > 0 ? "下に凸なので最小値" : "上に凸なので最大値";
  const zeroNote = rawA === 0 ? "（a=0 は二次関数ではないため、表示は a=1 として扱っています。）" : "";
  $("#quadratic-result").textContent = `\\(y=${a}(x-${h})^2${k < 0 ? k : `+${k}`}\\)。頂点は \\((${h},${k})\\)、${kind} は \\(${k}\\) です。${zeroNote}`;
  scheduleMathTypeset($("#quadratic-result"));
}

function setupTrigLab() {
  ["#trig-angle", "#trig-hyp", "#trig-focus"].forEach((selector) => {
    $(selector).addEventListener("input", drawTrigLab);
  });
  drawTrigLab();
}

function drawTrigLab() {
  const canvas = $("#trig-canvas");
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const degree = Number($("#trig-angle").value);
  const hyp = Number($("#trig-hyp").value);
  const focus = $("#trig-focus").value;
  const rad = (degree * Math.PI) / 180;
  const adjacent = hyp * Math.cos(rad);
  const opposite = hyp * Math.sin(rad);
  const scale = Math.min(62, (width - 230) / adjacent, (height - 90) / opposite);
  const ax = 110;
  const ay = height - 55;
  const bx = ax + adjacent * scale;
  const by = ay;
  const cx = bx;
  const cy = ay - opposite * scale;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdf7";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(47,111,115,0.12)";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.closePath();
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = focus === "cos" || focus === "all" ? "#407bff" : "#b9c2cf";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.strokeStyle = focus === "sin" || focus === "all" ? "#d9468a" : "#b9c2cf";
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  ctx.strokeStyle = focus === "all" ? "#2f6f73" : "#b9c2cf";
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  ctx.strokeStyle = "#1f2933";
  ctx.lineWidth = 3;
  ctx.strokeRect(bx - 24, by - 24, 24, 24);

  ctx.font = "900 22px system-ui";
  ctx.fillStyle = "#1f2933";
  ctx.fillText(`θ = ${degree}°`, ax + 26, ay - 18);
  ctx.fillStyle = "#407bff";
  ctx.fillText(`隣辺 ≒ ${adjacent.toFixed(2)}`, (ax + bx) / 2 - 60, ay + 34);
  ctx.fillStyle = "#d9468a";
  ctx.fillText(`対辺 ≒ ${opposite.toFixed(2)}`, bx + 18, (by + cy) / 2);
  ctx.fillStyle = "#2f6f73";
  ctx.fillText(`斜辺 = ${hyp}`, (ax + cx) / 2 - 30, (ay + cy) / 2 - 14);

  $("#trig-result").textContent =
    `\\(\\sin${degree}^{\\circ}\\approx${(opposite / hyp).toFixed(3)}\\)、` +
    `\\(\\cos${degree}^{\\circ}\\approx${(adjacent / hyp).toFixed(3)}\\)、` +
    `\\(\\tan${degree}^{\\circ}\\approx${(opposite / adjacent).toFixed(3)}\\)。斜辺を変えても、角度が同じなら比は同じです。`;
  scheduleMathTypeset($("#trig-result"));
}

function setupProbabilityLab() {
  ["#prob-red", "#prob-blue", "#prob-mode"].forEach((selector) => {
    $(selector).addEventListener("input", renderProbabilityLab);
  });
  renderProbabilityLab();
}

function renderProbabilityLab() {
  const red = Number($("#prob-red").value);
  const blue = Number($("#prob-blue").value);
  const total = red + blue;
  const mode = $("#prob-mode").value;
  const secondRedNumerator = mode === "replace" ? red : red - 1;
  const secondTotal = mode === "replace" ? total : total - 1;
  const rrNumerator = red * secondRedNumerator;
  const rrDenominator = total * secondTotal;
  const rbNumerator = red * (mode === "replace" ? blue : blue);
  const rbDenominator = total * secondTotal;

  $("#probability-stage").innerHTML = `
    <div class="probability-tree">
      <div class="tree-node root">袋<br>R:${red} B:${blue}</div>
      <div class="tree-column">
        <div class="tree-branch red">1回目 R<br>\\(${fractionText(red, total)}\\)</div>
        <div class="tree-branch blue">1回目 B<br>\\(${fractionText(blue, total)}\\)</div>
      </div>
      <div class="tree-column">
        <div class="tree-branch red">R の後に R<br>\\(${fractionText(secondRedNumerator, secondTotal)}\\)</div>
        <div class="tree-branch blue">R の後に B<br>\\(${fractionText(mode === "replace" ? blue : blue, secondTotal)}\\)</div>
      </div>
    </div>
    <p class="tree-note">枝をたどるときは確率をかけます。</p>
  `;
  $("#probability-result").textContent =
    mode === "replace"
      ? `戻して2回なので、赤赤の確率は \\(${fractionText(red, total)}\\times${fractionText(red, total)}=${fractionText(rrNumerator, rrDenominator)}\\)。`
      : `戻さず2回なので、赤赤の確率は \\(${fractionText(red, total)}\\times${fractionText(red - 1, total - 1)}=${fractionText(rrNumerator, rrDenominator)}\\)。2回目の分母が変わります。`;
  scheduleMathTypeset($("#probability-stage"));
  scheduleMathTypeset($("#probability-result"));
}

const practiceModes = [
  { id: "integer", label: "整数の計算", generator: generateIntegerProblem },
  { id: "radical", label: "ルート整理", generator: generateRadicalProblem },
  { id: "substitution", label: "式の値", generator: generateSubstitutionProblem },
  { id: "combine", label: "同類項", generator: generateCombineProblem },
  { id: "distribute", label: "分配法則", generator: generateDistributeProblem },
  { id: "equation", label: "一次方程式", generator: generateEquationProblem },
  { id: "inequality", label: "一次不等式", generator: generateInequalityProblem },
  { id: "quadratic", label: "二次関数", generator: generateQuadraticVertexProblem },
  { id: "trig", label: "三角比", generator: generateTrigProblem },
  { id: "counting", label: "場合の数", generator: generateCountingProblem },
  { id: "probability", label: "確率", generator: generateProbabilityProblem },
];

function generateIntegerProblem() {
  const a = randomInt(-6, 6);
  const b = choose([-5, -4, -3, -2, 2, 3, 4, 5]);
  const c = choose([-5, -4, -3, -2, 2, 3, 4, 5]);
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
  const radicalCases = [
    { n: 8, base: 2, rest: 2 },
    { n: 12, base: 2, rest: 3 },
    { n: 18, base: 3, rest: 2 },
    { n: 20, base: 2, rest: 5 },
    { n: 24, base: 2, rest: 6 },
    { n: 27, base: 3, rest: 3 },
    { n: 28, base: 2, rest: 7 },
    { n: 32, base: 4, rest: 2 },
    { n: 45, base: 3, rest: 5 },
    { n: 48, base: 4, rest: 3 },
    { n: 50, base: 5, rest: 2 },
    { n: 72, base: 6, rest: 2 },
    { n: 75, base: 5, rest: 3 },
    { n: 80, base: 4, rest: 5 },
    { n: 98, base: 7, rest: 2 },
  ];
  const { n, base, rest } = choose(radicalCases);
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
  const a = randomInt(2, 4);
  const b = randomInt(-5, 5);
  const x = randomInt(-3, 5);
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
  const p = randomInt(-5, 5) || 2;
  const q = randomInt(-5, 5) || -3;
  const r = randomInt(-6, 6);
  const s = randomInt(-6, 6);
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
  const a = choose([-4, -3, -2, 2, 3, 4]);
  const b = choose([-5, -4, -3, -2, 2, 3, 4, 5]);
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
  const a = randomInt(2, 5);
  const x = randomInt(1, 6);
  const b = randomInt(1, 6);
  const c = a * x + b;
  return {
    modeLabel: "方程式",
    title: "x袋を一人にする",
    prompt: `\\(${term(a)}${b < 0 ? "-" + Math.abs(b) : "+" + b}=${c}\\)`,
    steps: [
      {
        label: "余分な1ブロックを取る",
        question: `左右から \\(${b}\\) この1ブロックを取ると、右辺は？`,
        hint: `式では、両辺から \\(${b}\\) を引きます。ブロックで見ると、同じ数だけ取りのぞきます。`,
        check: (input) => Number(normalizeText(input).replace(`${a}x=`, "")) === c - b || sameEquation(input, a, -(c - b)),
        answer: `${term(a)} = ${c - b}`,
      },
      {
        label: "x袋の数で分ける",
        question: "\\(x\\) 袋1つの中身は？",
        hint: `残ったブロックを \\(${a}\\) このx袋に同じ数ずつ分けます。式では両辺を \\(${a}\\) で割ります。`,
        check: (input) => normalizeText(input) === `x=${x}` || Number(normalizeText(input)) === x,
        answer: `x = ${x}`,
      },
    ],
  };
}

function sameInequalityAnswer(input, sign, boundary) {
  const text = normalizeText(input).replace("＜", "<").replace("＞", ">");
  const compact = text.replace(/^x/, "");
  return (
    text === `x${sign}${boundary}` ||
    compact === `${sign}${boundary}` ||
    text === `${boundary}${sign === "<" ? ">x" : "<x"}`
  );
}

function generateInequalityProblem() {
  const a = choose([-4, -3, -2, 2, 3, 4]);
  const boundary = randomInt(-4, 5);
  const b = randomInt(-5, 5);
  const c = a * boundary + b;
  const right = c - b;
  const sign = a > 0 ? "<" : ">";
  return {
    modeLabel: "数I",
    title: "一次不等式",
    prompt: `\\(${term(a)}${b < 0 ? "-" + Math.abs(b) : "+" + b}<${c}\\)`,
    steps: [
      {
        label: "定数項を右辺へ移す",
        question: `\\(${term(a)}<?\\) の右辺は？`,
        hint: b < 0 ? `両辺に \\(${Math.abs(b)}\\) を足します。` : `両辺から \\(${b}\\) を引きます。`,
        check: (input) => Number(normalizeText(input)) === right,
        answer: String(right),
      },
      {
        label: "係数で割る",
        question: "\\(x\\) の範囲は？",
        hint: a < 0 ? "負の数で割るので、不等号の向きが変わります。" : "正の数で割るので、不等号の向きはそのままです。",
        check: (input) => sameInequalityAnswer(input, sign, boundary),
        answer: `\\(x${sign}${boundary}\\)`,
      },
    ],
  };
}

function samePoint(input, x, y) {
  const text = normalizeText(input).replace(/[()（）]/g, "");
  return text === `${x},${y}` || text === `${x}、${y}`;
}

function generateQuadraticVertexProblem() {
  const a = choose([-2, -1, 1, 2]);
  const h = randomInt(-3, 4);
  const k = randomInt(-5, 5);
  return {
    modeLabel: "数I",
    title: "頂点と最大・最小",
    prompt: `\\(y=${a}(x-${h})^2${k < 0 ? k : `+${k}`}\\)`,
    steps: [
      {
        label: "頂点を読む",
        question: "頂点の座標は？",
        hint: "頂点形式 \\(y=a(x-p)^2+q\\) では、\\(p\\) が横位置、\\(q\\) が高さです。",
        check: (input) => samePoint(input, h, k),
        answer: `\\((${h},${k})\\)`,
      },
      {
        label: a > 0 ? "最小値を読む" : "最大値を読む",
        question: a > 0 ? "最小値は？" : "最大値は？",
        hint: a > 0 ? "下に凸なので頂点の y 座標が最小値です。" : "上に凸なので頂点の y 座標が最大値です。",
        check: (input) => Number(normalizeText(input)) === k,
        answer: String(k),
      },
    ],
  };
}

function generateTrigProblem() {
  const triangles = [
    { opposite: 3, adjacent: 4, hyp: 5 },
    { opposite: 5, adjacent: 12, hyp: 13 },
    { opposite: 8, adjacent: 15, hyp: 17 },
  ];
  const tri = choose(triangles);
  return {
    modeLabel: "数I",
    title: "三角比",
    prompt: `直角三角形で、角 \\(\\theta\\) の対辺が \\(${tri.opposite}\\)、隣辺が \\(${tri.adjacent}\\)、斜辺が \\(${tri.hyp}\\)`,
    steps: [
      {
        label: "\\(\\sin\\theta\\)",
        question: "\\(\\sin\\theta\\) は？",
        hint: "\\(\\sin\\theta=\\dfrac{\\text{対辺}}{\\text{斜辺}}\\) です。",
        check: (input) => sameRational(input, tri.opposite, tri.hyp),
        answer: `\\(${fractionText(tri.opposite, tri.hyp)}\\)`,
      },
      {
        label: "\\(\\cos\\theta\\)",
        question: "\\(\\cos\\theta\\) は？",
        hint: "\\(\\cos\\theta=\\dfrac{\\text{隣辺}}{\\text{斜辺}}\\) です。",
        check: (input) => sameRational(input, tri.adjacent, tri.hyp),
        answer: `\\(${fractionText(tri.adjacent, tri.hyp)}\\)`,
      },
      {
        label: "\\(\\tan\\theta\\)",
        question: "\\(\\tan\\theta\\) は？",
        hint: "\\(\\tan\\theta=\\dfrac{\\text{対辺}}{\\text{隣辺}}\\) です。",
        check: (input) => sameRational(input, tri.opposite, tri.adjacent),
        answer: `\\(${fractionText(tri.opposite, tri.adjacent)}\\)`,
      },
    ],
  };
}

function generateCountingProblem() {
  const cases = [
    { mode: "permutation", n: 4, r: 2 },
    { mode: "permutation", n: 5, r: 2 },
    { mode: "permutation", n: 6, r: 2 },
    { mode: "permutation", n: 4, r: 3 },
    { mode: "permutation", n: 5, r: 3 },
    { mode: "combination", n: 4, r: 2 },
    { mode: "combination", n: 5, r: 2 },
    { mode: "combination", n: 6, r: 2 },
    { mode: "combination", n: 5, r: 3 },
    { mode: "combination", n: 6, r: 3 },
  ];
  const { mode, n, r } = choose(cases);
  const total = mode === "permutation" ? permutation(n, r) : combination(n, r);
  return {
    modeLabel: "数A",
    title: mode === "permutation" ? "順列" : "組合せ",
    prompt:
      mode === "permutation"
        ? `\\(${n}\\) 人から \\(${r}\\) 人を選んで一列に並べる`
        : `\\(${n}\\) 人から \\(${r}\\) 人を選ぶ`,
    steps: [
      {
        label: "順序を区別するか",
        question: "使う考え方は？（順列 / 組合せ）",
        hint: mode === "permutation" ? "並べるので順序を区別します。" : "選ぶだけなので順序を区別しません。",
        check: (input) => {
          const text = normalizeText(input);
          return mode === "permutation" ? text.includes("順列") || text === "p" : text.includes("組合") || text === "c";
        },
        answer: mode === "permutation" ? "順列" : "組合せ",
      },
      {
        label: "総数を求める",
        question: "全部で何通り？",
        hint:
          mode === "permutation"
            ? `\\({}_{${n}}P_{${r}}\\) を計算します。`
            : `\\({}_{${n}}C_{${r}}\\) を計算します。`,
        check: (input) => Number(normalizeText(input)) === total,
        answer: String(total),
      },
    ],
  };
}

function generateProbabilityProblem() {
  const ballCases = [
    { red: 2, blue: 3 },
    { red: 3, blue: 2 },
    { red: 3, blue: 4 },
    { red: 4, blue: 3 },
    { red: 2, blue: 4 },
    { red: 4, blue: 2 },
  ];
  const { red, blue } = choose(ballCases);
  const total = red + blue;
  const replace = choose([true, false]);
  const secondRed = replace ? red : red - 1;
  const secondTotal = replace ? total : total - 1;
  const rrNumerator = red * secondRed;
  const rrDenominator = total * secondTotal;
  return {
    modeLabel: "数A",
    title: replace ? "独立な試行" : "戻さない確率",
    prompt: `赤玉 \\(${red}\\) 個、青玉 \\(${blue}\\) 個の袋から、${replace ? "戻して" : "戻さず"}2回取り出す。赤赤の確率を求める。`,
    steps: [
      {
        label: "1回目が赤",
        question: "1回目が赤の確率は？",
        hint: "赤玉の数を全体の数で割ります。",
        check: (input) => sameRational(input, red, total),
        answer: `\\(${fractionText(red, total)}\\)`,
      },
      {
        label: "2回目も赤",
        question: "1回目に赤が出た後、2回目も赤の確率は？",
        hint: replace ? "戻すので袋の中身は最初と同じです。" : "戻さないので、赤玉も全体も1つずつ減ります。",
        check: (input) => sameRational(input, secondRed, secondTotal),
        answer: `\\(${fractionText(secondRed, secondTotal)}\\)`,
      },
      {
        label: "枝をかける",
        question: "赤赤の確率は？",
        hint: "1回目の確率と2回目の確率をかけます。",
        check: (input) => sameRational(input, rrNumerator, rrDenominator),
        answer: `\\(${fractionText(rrNumerator, rrDenominator)}\\)`,
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
  setupQuadraticVertex();
  setupTrigLab();
  setupProbabilityLab();
  setupPractice();
  setupMap();
  setupSmoothUnitLinks();
}

document.addEventListener("DOMContentLoaded", init);
