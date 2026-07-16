// 読み物は単元本文とは別の補助線です。ここだけを読まなくても問題演習へ進めます。
export const storySourcePolicy = {
  rule: "計算の約束を説明する読み物は、具体例とその確かめ方を必ず添える。",
  history: "人物・年代・発見の事実には、一次資料、公的機関、博物館、大学のいずれかを出典として示す。",
  society: "社会・仕事・統計の数値には、作成者、公開日、対象範囲が分かる出典を示す。",
};

export const stories = [
  {
    id: "shared-calculation-order",
    type: "rule",
    menuTitle: "計算順序",
    title: "同じ式を、みんなで同じように読むために",
    lead: "計算順序は、速く計算するためだけの順位表ではありません。式を見た人どうしが同じ答えへたどり着くための共通の読み方です。",
    lessonIds: ["integer-rules"],
    labIds: [],
    practiceIds: ["integer"],
    sections: [
      {
        heading: "困る場面",
        body: "\\(2+3\\times4\\) を、先に足す人と先にかける人がいたら、同じ式なのに答えが \\(20\\) と \\(14\\) に分かれます。式は短いメモなので、読む順番を共有しないと意味が一つに決まりません。",
      },
      {
        heading: "共有する約束",
        body: "かっこ、累乗、乗除、加減の順に計算します。先にかけると決めることで、\\(2+3\\times4\\) は \\(2+12\\) と読めます。",
      },
      {
        heading: "小さな確認",
        body: "\\(3+2\\times5\\) を、かっこなしと \\((3+2)\\times5\\) で比べてみましょう。かっこは、いつもの読み方を意図して変える印だと分かります。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、計算規約の説明です。" },
  },
  {
    id: "parentheses-change-the-reading",
    type: "rule",
    menuTitle: "かっこの役割",
    title: "かっこは、読む順番を変える印",
    lead: "かっこは飾りではなく、式をどう読むかを指定する記号です。見た目が少し変わるだけで、答えが変わることがあります。",
    lessonIds: ["integer-rules", "distribution-numbers"],
    labIds: ["distribution-lab"],
    practiceIds: ["integer", "distribute"],
    sections: [
      {
        heading: "困る場面",
        body: "\\(6\\times10+3\\) と \\(6\\times(10+3)\\) は、数字が同じでも別の仕事をしています。前者は \\(60\\) に \\(3\\) を足し、後者は \\(13\\) を \\(6\\) 倍します。",
      },
      {
        heading: "約束の役割",
        body: "かっこは「この部分を先に一まとまりとして読んでください」という目印です。計算順序を全て書き直さずに、式の読み方だけを変えられます。",
      },
      {
        heading: "小さな確認",
        body: "\\(6\\times(10+3)\\) を、横 \\(10\\) と横 \\(3\\) の長方形二つとして考えます。二つを先に足しても、別々に \\(6\\) 倍しても、全体の面積は同じです。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、式の読み方の説明です。" },
  },
  {
    id: "distribute-to-every-part",
    type: "rule",
    menuTitle: "分配法則",
    title: "分配法則は、全員に同じ数を配る考え方",
    lead: "分配法則は文字式だけの難しい技ではありません。一つのまとまりを同じ大きさで増やすとき、全ての部分に同じ数がかかることを表しています。",
    lessonIds: ["distribution-numbers", "distribution-letters"],
    labIds: ["distribution-lab"],
    practiceIds: ["distribute"],
    sections: [
      {
        heading: "困る場面",
        body: "3 個入りの袋を、りんご 4 個とみかん 2 個の二種類にそれぞれ用意するとします。合計 6 個の袋を 3 倍するなら、りんごにもみかんにも 3 がかかります。",
      },
      {
        heading: "共有する約束",
        body: "まず \\(6\\times13\\) を考えます。\\(13\\) を \\(10+3\\) と見れば、\\(6\\times13=6\\times10+6\\times3\\) と分けられます。文字では同じ考えを \\(a(b+c)=ab+ac\\) と書きます。",
      },
      {
        heading: "小さな確認",
        body: "\\(3(x+4)\\) を、\\(x\\) カードと \\(1\\) カード 4 枚の三組として並べてみましょう。\\(x\\) カードは \\(3x\\) 枚、\\(1\\) カードは \\(12\\) 枚になります。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、面積と配布のモデルです。" },
  },
  {
    id: "equal-sign-keeps-balance",
    type: "rule",
    menuTitle: "等号とつり合い",
    title: "等号は、左右がつり合っているという印",
    lead: "等号は「次に計算する」という矢印ではありません。左右が同じ量だと伝える、つり合いの印です。",
    lessonIds: ["identities-equations", "linear-equations", "equation-modeling"],
    labIds: ["equation-lab"],
    practiceIds: ["equation"],
    sections: [
      {
        heading: "困る場面",
        body: "\\(3x-5=16\\) の左だけに \\(5\\) を足すと、左右は同じ量ではなくなります。等号のまま書けば、読み手はまだつり合っていると受け取ってしまいます。",
      },
      {
        heading: "共有する約束",
        body: "左右に同じ操作をすれば、つり合いは保たれます。両辺に \\(5\\) を足して \\(3x=21\\)、両辺を \\(3\\) で割って \\(x=7\\) と進めます。",
      },
      {
        heading: "小さな確認",
        body: "左右に 1 ブロックずつ置いた天びんを想像します。両側から同時に 1 ブロックずつ取っても、天びんは傾きません。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、等式変形の説明です。" },
  },
  {
    id: "negative-numbers-have-direction",
    type: "rule",
    menuTitle: "負の数と向き",
    title: "負の数は、反対向きも表せる",
    lead: "負の数は 0 より小さい数であるだけでなく、基準からの反対向きや不足を表すための道具です。数直線を使うと、加減の意味が見えやすくなります。",
    lessonIds: ["integers-signs", "integer-rules"],
    labIds: ["number-line-lab"],
    practiceIds: ["integer"],
    sections: [
      {
        heading: "困る場面",
        body: "気温、海面からの高さ、収支のように、基準より上と下を同じ物差しで書きたい場面があります。自然数だけでは、反対側を一続きに表せません。",
      },
      {
        heading: "共有する約束",
        body: "数直線で右を正、左を負と決めます。\\(-3\\) に \\(5\\) を足すことは、左の 3 から右へ 5 進むことなので \\(2\\) になります。",
      },
      {
        heading: "小さな確認",
        body: "\\(-3-5\\) は、\\(-3\\) から左へさらに \\(5\\) 進みます。引く数の向きを反対にして足すと考えると、\\(-3+(-5)\\) と同じ動きになります。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、数直線のモデルです。" },
  },
  {
    id: "notation-changes-with-the-page",
    type: "notation",
    menuTitle: "記号の読み方",
    title: "教科書の式と、いろいろな表記",
    lead: "式を縦に並べて等号をそろえる書き方は、次の一手が何を変えたかを読みやすくするための形です。資料や教科書によって記号の字形が違うこともあるので、まず式全体の意味を読む習慣をつけましょう。",
    lessonIds: ["integer-rules", "linear-inequalities", "identities-equations"],
    labIds: [],
    practiceIds: ["integer", "inequality"],
    sections: [
      {
        heading: "等号を縦にそろえる",
        body: "一つの式変形を一行ずつ書き、等号を同じ位置にそろえると、どの量が残り、どこが変わったかを追いやすくなります。英語で書かれた数学組版でも、複数行の式を等号の列でそろえる仕組みが使われます。",
      },
      {
        heading: "「以下」の記号は見た目が少し違うことがある",
        body: "教科書や資料では、\\(a\\leqq b\\) のようにイコールの線が2本の記号と、\\(a\\mathrel{\\unicode{x2264}} b\\) のように1本の記号を目にすることがあります。どちらも「\\(a\\) は \\(b\\) 以下」、つまり \\(a=b\\) も含む同じ意味です。日本の高校の教科書では2本線、大学や海外の本では1本線が主流という慣習の違いだけです。このサイトでは高校式の \\(\\leqq\\)、\\(\\geqq\\) を基本にします。",
      },
      {
        heading: "社会に出てからの読み方",
        body: "プログラムやプレーンテキストでは、\\(a\\le b\\) を \\(\\mathtt{a\\ <=\\ b}\\)、\\(a\\ge b\\) を \\(\\mathtt{a\\ >=\\ b}\\) と書くこともあります。記号の形だけで新しい意味だと決めず、資料の定義と周りの式を確認する習慣を持ちましょう。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "ここでは、教科書で出会う記法を読み分けるための説明にとどめています。" },
  },
  {
    id: "letters-are-labels",
    type: "notation",
    menuTitle: "文字の使い方",
    title: "文字は量に付ける名前：教科ごとの記号に迷わないために",
    lead: "数学の文字は、種類ごとに意味が固定された暗号ではありません。式や問題の中で量に名前を付け、同じ量を繰り返し指せるようにする札です。よく使う文字には慣習がありますが、最初の定義が慣習より優先されます。",
    lessonIds: ["letters-as-boxes", "functions", "math-human-activities"],
    labIds: ["term-lab", "function-lab"],
    practiceIds: ["substitution", "function-values"],
    sections: [
      {
        heading: "a・b・c、x・y、i・j・k は何が違う？",
        body: "\\(a,b,c\\) は一般の数や三角形の辺、\\(x,y\\) は未知数・変数・座標によく使われます。\\(i,j,k\\) は順番を数える番号に使われるほか、\\(i\\) が虚数単位、太字の \\(\\mathbf{i},\\mathbf{j},\\mathbf{k}\\) が方向を表すこともあります。どれも絶対の割り当てではないので、『ここでは何を表すか』という宣言を探します。",
      },
      {
        heading: "3a はよくて a3 と書かないのはなぜ？",
        body: "\\(3a\\) は \\(3\\times a\\) のかけ算記号を省いた書き方です。学校数学では数の係数を文字の前に置くと決めるので、\\(a\\times3\\) も順番を入れ替えて \\(3a\\) と書きます。\\(a3\\) では、添字や一つの名前に見えて積だと共有しにくいため、積の標準的な書き方にはしません。",
      },
      {
        heading: "添字は、別の文字を区別する名札",
        body: "たくさんの値を順番に並べるときは、\\(a_1,a_2,a_3\\) のように右下へ小さな番号を付けます。\\(a_3\\) は『3番目の \\(a\\)』という一つの記号で、\\(a\\times3\\) ではありません。見た目の位置が意味を分けています。",
      },
      {
        heading: "物理では量の英語名に合わせることが多い",
        body: "物理では速度に \\(v\\)、時間に \\(t\\)、質量に \\(m\\) のような文字がよく使われます。同じ \\(m\\) が数学では傾きを表すこともあります。教科が変わったら意味も変わり得るので、公式だけを切り離さず、単位・図・『ただし』の説明まで一緒に読みます。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "特定の歴史的起源を断定せず、初等数学と物理で一般に出会う記法の読み分けを説明しています。" },
  },
  {
    id: "descartes-algebra-meets-geometry",
    type: "history",
    menuTitle: "デカルトと座標",
    title: "式と図を行き来する：デカルトと座標",
    lead: "座標は、図形の位置を数の組で表し、図形の問題を式として考える橋になります。",
    portraits: [
      { src: "assets/img/portraits/descartes.webp", alt: "デカルトのイメージイラスト", caption: "ルネ・デカルト（1596–1650）" },
    ],
    lessonIds: ["functions", "geometry"],
    labIds: ["function-lab"],
    practiceIds: ["function-values", "geometry-basics"],
    sections: [
      { heading: "当時の問い", body: "図形と代数は別々の道具として発達していました。点の位置を数で表せれば、曲線を式で調べられます。" },
      { heading: "デカルトの仕事", body: "デカルトの『幾何学』には、代数を幾何へ使う考えが示されました。座標の発展は一人だけの発明ではありません。" },
      { heading: "この単元との接続", body: "\\(x\\) を入れると \\(y\\) が決まる関係を点 \\((x,y)\\) にすると、式・表・グラフが同じ関係を表します。" },
    ],
    sources: [
      { title: "René Descartes (1596–1650)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/" },
    ],
    factCheck: { status: "checked", note: "デカルトを座標の唯一の発明者とはせず、代数を幾何へ応用した仕事に限定して記述しました。" },
  },
  {
    id: "gauss-patterns-in-integers",
    type: "history",
    menuTitle: "ガウスと整数",
    title: "整数の規則を一つの分野へ：ガウス",
    lead: "割り算の余りや素数の規則は、ばらばらな計算ではなく、整数を調べる数論という分野につながります。",
    portraits: [
      { src: "assets/img/portraits/gauss.webp", alt: "ガウスのイメージイラスト", caption: "カール・フリードリヒ・ガウス（1777–1855）" },
    ],
    lessonIds: ["math-human-activities"],
    labIds: ["euclidean-algorithm-lab"],
    practiceIds: ["number-theory"],
    sections: [
      { heading: "扱った範囲", body: "ガウスは数論だけでなく、天文学・測地学・物理など幅広い問題を研究しました。" },
      { heading: "数論での仕事", body: "整数の合同や二次形式などを体系的に扱い、整数の規則を深く調べる土台を築きました。" },
      { heading: "この単元との接続", body: "互除法で余りを追う操作は、同じ数で割った余りに注目する考えへの入口です。" },
    ],
    sources: [
      { title: "Carl Friedrich Gauss (1777–1855)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/" },
    ],
    factCheck: { status: "checked", note: "業績を数論だけへ単純化せず、複数分野にまたがる研究だったことを併記しました。" },
  },
  {
    id: "nightingale-data-for-explanation",
    type: "history",
    menuTitle: "ナイチンゲールと統計",
    title: "数字を図にして説明する：ナイチンゲールと統計",
    lead: "統計は平均を計算して終わりではなく、集めたデータから違いを見つけ、他の人へ根拠を示すためにも使われます。",
    portraits: [
      { src: "assets/img/portraits/nightingale.webp", alt: "ナイチンゲールのイメージイラスト", caption: "フローレンス・ナイチンゲール（1820–1910）" },
    ],
    lessonIds: ["data", "data-analysis-i"],
    labIds: ["data-spread-lab"],
    practiceIds: ["data-summary", "data-analysis"],
    sections: [
      { heading: "データを集める", body: "ナイチンゲールはクリミア戦争後、軍病院の死亡に関する記録を統計として調べました。" },
      { heading: "図で伝える", body: "原因別の死亡を極座標面積図で表し、数字の差を政府や軍へ説明する材料にしました。" },
      { heading: "この単元との接続", body: "代表値と散らばりを計算し、対象・単位・比較条件を添えて図にすると、傾向を確かめやすくなります。" },
    ],
    sources: [
      { title: "Florence Nightingale: The pioneer statistician", publisher: "Science Museum", url: "https://www.sciencemuseum.org.uk/objects-and-stories/florence-nightingale-pioneer-statistician" },
    ],
    factCheck: { status: "checked", note: "図だけで改革が決まったとはせず、統計を説明材料として用いた範囲で記述しました。" },
  },
  {
    id: "pacioli-recording-both-sides",
    type: "society",
    menuTitle: "パチョーリと簿記",
    title: "一つの取引を二方向から記録する：複式簿記",
    lead: "会計では利益の計算だけでなく、何が増え、代わりに何が減ったかを対応させて記録します。",
    lessonIds: ["functions", "exam-review"],
    labIds: ["accounting-balance-lab"],
    practiceIds: ["function-values", "distribute"],
    sections: [
      { heading: "商人の実務", body: "売買や支払いを確かめるには、現金・商品・借りた額などを別々の帳簿で追う必要があります。" },
      { heading: "パチョーリの記述", body: "1494年、パチョーリは当時使われていた複式簿記の方法を著書で説明しました。発明者と断定はしません。" },
      { heading: "この単元との接続", body: "売上・費用・利益を別の量として置き、等式の左右が対応するか確かめる姿勢は、式の検算にも通じます。" },
    ],
    sources: [
      { title: "Timeline of the history of ICAEW and the accountancy profession", publisher: "ICAEW", url: "https://www.icaew.com/library/historical-resources/timeline" },
      { title: "The Earliest Books on Bookkeeping", publisher: "ICAEW", url: "https://www.icaew.com/library/library-collection/historical-accounting-literature/earliest-books-on-bookkeeping" },
    ],
    factCheck: { status: "checked", note: "パチョーリを複式簿記の発明者とはせず、既存実務を印刷物で説明した人物として扱いました。" },
  },
  {
    id: "recorde-equal-sign",
    type: "history",
    menuTitle: "レコードと等号",
    title: "二本の線で「同じ」を書く：ロバート・レコードと等号",
    lead: "いまでは当たり前の等号も、初めから世界共通だったわけではありません。記号は、長い説明を短く共有するために育ってきました。",
    portraits: [
      { src: "assets/img/portraits/recorde.webp", alt: "ロバート・レコードのイメージイラスト", caption: "ロバート・レコード（1510–1558）" },
    ],
    lessonIds: ["linear-equations", "equation-modeling", "identities-equations"],
    labIds: ["equation-lab"],
    practiceIds: ["equation", "identities"],
    sections: [
      { heading: "文章で書いていた", body: "等しいことを言葉で書き続けると、計算のどこが左右の比較なのか見えにくくなります。" },
      { heading: "1557年の等号", body: "ウェールズの医師・数学者ロバート・レコードは、1557年の著書で長さの等しい二本線を等号として用いました。ただし、この記号はすぐ全員に広まったわけではありません。" },
      { heading: "この単元との接続", body: "\\(=\\) は『答えを書く合図』ではなく、左右が同じ量だという主張です。方程式でも恒等式でも、この意味は変わりません。" },
    ],
    sources: [
      { title: "Robert Recorde (1510–1558)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Recorde/" },
    ],
    factCheck: { status: "checked", note: "1557年の著書での等号使用と、記号が直ちに定着しなかった点を出典の範囲で記述しました。" },
  },
  {
    id: "al-khwarizmi-algebra",
    type: "history",
    menuTitle: "代数のはじまり",
    title: "文章の問題を共通の方法で解く：アル＝フワーリズミと代数",
    lead: "方程式は、意味のない文字操作から始まったのではありません。相続・取引・測量など、生活の問題を同じ方法で解くための道具として整理されました。",
    portraits: [
      { src: "assets/img/portraits/al-khwarizmi.webp", alt: "アル＝フワーリズミのイメージイラスト", caption: "アル＝フワーリズミ（790頃–850頃）" },
    ],
    lessonIds: ["linear-equations", "equation-modeling", "quadratic-inequalities"],
    labIds: ["equation-lab"],
    practiceIds: ["equation", "quadratic-sign"],
    sections: [
      { heading: "実用の問題", body: "9世紀ごろのアル＝フワーリズミの代数書は、相続、取引、土地の測量などで必要になる計算を扱いました。" },
      { heading: "文字記号より先に方法があった", body: "そこでは現在の \\(x\\) のような記号を使わず、一次・二次方程式の形と解き方を言葉で説明しています。" },
      { heading: "この単元との接続", body: "文章から同じ量を二通りに表し、方程式の形に整理すれば、題材が変わっても同じ解き方を使えます。" },
    ],
    sources: [
      { title: "Al-Khwarizmi (790–850)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Al-Khwarizmi/" },
    ],
    factCheck: { status: "checked", note: "代数書の実用的目的、言葉による記述、一次・二次方程式の扱いに限定して記述しました。" },
  },
  {
    id: "cantor-sets-and-infinity",
    type: "history",
    menuTitle: "カントールと集合",
    title: "集まりの大きさを比べる：カントールと集合",
    lead: "集合は、数カードを箱に分けるだけの記号ではありません。何を一つの集まりと見るかを決めることで、有限から無限まで同じ言葉で考えられます。",
    portraits: [
      { src: "assets/img/portraits/cantor.webp", alt: "カントールのイメージイラスト", caption: "ゲオルク・カントール（1845–1918）" },
    ],
    lessonIds: ["sets-propositions"],
    labIds: ["set-sort-lab"],
    practiceIds: ["sets"],
    sections: [
      { heading: "有限の集合から始める", body: "この教材では、まず1から12までの数を条件ごとに分け、共通部分や和集合を目で確かめます。" },
      { heading: "無限にも大きさがある", body: "19世紀のゲオルク・カントールは集合論を築き、無限集合の大きさを比べる考えを発展させました。" },
      { heading: "この単元との接続", body: "今扱う有限集合は入口です。『条件に合うものを一まとまりとして考える』見方が、確率や関数など多くの分野をつなぎます。" },
    ],
    sources: [
      { title: "Georg Cantor (1845–1918)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/" },
    ],
    factCheck: { status: "checked", note: "カントールを集合論の創始者とし、無限数・濃度の研究へつなげた範囲で記述しました。" },
  },
  {
    id: "al-battani-trigonometry",
    type: "history",
    menuTitle: "天文学と三角法",
    title: "星の位置を計算する：アル＝バッターニーと三角法",
    lead: "三角比は、教室の直角三角形だけの計算ではありません。直接手が届かない天体の位置や動きを、角度と比から調べる必要にも支えられてきました。",
    portraits: [
      { src: "assets/img/portraits/al-battani.webp", alt: "アル＝バッターニーのイメージイラスト", caption: "アル＝バッターニー（850頃–929）" },
    ],
    lessonIds: ["trig-ratios", "sine-cosine-rule"],
    labIds: ["trig-lab"],
    practiceIds: ["trig", "sine-cosine-rule"],
    sections: [
      { heading: "観測した値を結ぶ", body: "アル＝バッターニーは9〜10世紀に天体を観測し、星・月・惑星などの位置や動きを詳しく調べました。" },
      { heading: "三角法を計算に使う", body: "その天文書では三角関数を計算の道具として用い、直角三角形に関する公式も示しました。" },
      { heading: "この単元との接続", body: "測れる角度と長さの比を使えば、直接測れない辺や距離を計算できます。まずは図の辺と角の対応から始めます。" },
    ],
    sources: [
      { title: "Al-Battani (about 850–929)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Al-Battani/" },
    ],
    factCheck: { status: "checked", note: "天体観測、三角関数の利用、直角三角形の公式に限定し、近代的三角法の単独発明とは記述していません。" },
  },
  {
    id: "pascal-fermat-probability",
    type: "history",
    menuTitle: "確率のはじまり",
    title: "途中で終わったゲームをどう分ける？：パスカル、フェルマーと確率",
    lead: "偶然を数学で考えるきっかけの一つは、遊びの結果を予言することではなく、途中で終わったゲームの賭け金を公平に分ける問いでした。",
    portraits: [
      { src: "assets/img/portraits/pascal.webp", alt: "パスカルのイメージイラスト", caption: "ブレーズ・パスカル（1623–1662）" },
      { src: "assets/img/portraits/fermat.webp", alt: "フェルマーのイメージイラスト", caption: "ピエール・ド・フェルマー（1601–1665）" },
    ],
    lessonIds: ["counting-principles", "probability-a"],
    labIds: ["probability-lab"],
    practiceIds: ["counting", "probability"],
    sections: [
      { heading: "具体的な問い", body: "勝負が途中で終わったとき、残りの勝ち方を数えて賭け金をどう分けるかという問題がありました。" },
      { heading: "1654年の往復書簡", body: "パスカルとフェルマーは1654年の書簡で確率の問題を議論しました。確率論の起源は、それ以前の研究も含むため二人だけに限られません。" },
      { heading: "この単元との接続", body: "起こり得る結果を漏れなく数え、そのうち条件に合う結果がいくつかを見る考えが、場合の数から確率への橋になります。" },
    ],
    sources: [
      { title: "Earliest Known Uses of Some of the Words of Mathematics: Probability", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Miller/mathword/p/" },
      { title: "Pierre Fermat (1601–1665)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Fermat/" },
    ],
    factCheck: { status: "checked", note: "1654年の書簡を重要な起点の一つとし、確率論の起源を二人だけへ単純化しない記述にしました。" },
  },
  {
    id: "euclid-elements",
    type: "history",
    menuTitle: "ユークリッド『原論』",
    title: "定義から一段ずつ積み上げる：ユークリッドの『原論』",
    lead: "数学の証明は、答えを知っている人だけの話術ではありません。出発点を共有し、前に確かめたことだけを使って結論まで進むための記録です。",
    portraits: [
      { src: "assets/img/portraits/euclid.webp", alt: "ユークリッドのイメージイラスト", caption: "ユークリッド（紀元前300年ごろ）" },
    ],
    lessonIds: ["geometry", "geometry-a", "math-human-activities"],
    labIds: ["geometry-properties-lab", "euclidean-algorithm-lab"],
    practiceIds: ["geometry-basics", "geometry-properties", "number-theory"],
    sections: [
      { heading: "順序立ててまとめる", body: "紀元前300年ごろのユークリッドの『原論』は、定義と公準から図形や整数の結果を順序立ててまとめました。多くの結果は先人の仕事も取り込んでいます。" },
      { heading: "図形だけではない", body: "『原論』には平面・立体図形だけでなく、整数や最大公約数を求める方法に関わる内容も含まれます。" },
      { heading: "この単元との接続", body: "図の見た目で決めず、条件・すでに分かっている定理・結論を分けて読むことが、証明を一段ずつ追う第一歩です。" },
    ],
    sources: [
      { title: "Euclid of Alexandria", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Euclid/" },
    ],
    factCheck: { status: "checked", note: "『原論』の構成と範囲を説明し、収録された結果をすべてユークリッド自身の発見とはしていません。" },
  },
];

export const storyCatalog = Object.fromEntries(stories.map((story) => [story.id, story]));
