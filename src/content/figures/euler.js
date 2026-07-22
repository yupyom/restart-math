// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "euler",
    "name": "レオンハルト・オイラー",
    "reading": "Leonhard Euler",
    "era": "1707–1783",
    "region": "スイス／ロシア／ドイツ",
    "achievement": "解析学を大きく発展させ、記号と公式を数多く残した",
    "portrait": {
      "src": "assets/img/portraits/euler.webp",
      "alt": "オイラーのイメージイラスト",
      "caption": "レオンハルト・オイラー（1707–1783）"
    },
    "profile": [
      "スイスのバーゼルに生まれ、サンクトペテルブルクやベルリンで活動した、歴史上もっとも多作な数学者の一人です。",
      "晩年は視力をほとんど失いながらも、記憶と口述で膨大な研究を続けたことで知られます。"
    ],
    "contributions": [
      "関数の記号 \\(f(x)\\)、円周率 \\(\\pi\\)、自然対数の底 \\(e\\)、和の記号 \\(\\Sigma\\) など、現在使われる多くの記法を広めました。\\(e^{i\\theta} = \\cos\\theta + i\\sin\\theta\\) という「オイラーの公式」も有名です。",
      "解析学・数論・グラフ理論など幅広い分野を切り開きました。橋を一筆書きできるかを論じた「ケーニヒスベルクの橋」の問題は、グラフ理論の出発点とされます。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "daniel-bernoulli",
        "gauss"
      ],
      "lessons": [
        "sigma-notation",
        "geometric-series-sum"
      ],
      "labs": [
        "sigma-stairs-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Euler/"
    }
  };
