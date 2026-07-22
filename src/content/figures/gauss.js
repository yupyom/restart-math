// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "gauss",
    "name": "カール・フリードリヒ・ガウス",
    "reading": "Carl Friedrich Gauss",
    "era": "1777–1855",
    "region": "ドイツ",
    "achievement": "整数論を一分野にまとめ、「数学の王」と呼ばれた",
    "portrait": {
      "src": "assets/img/portraits/gauss.webp",
      "alt": "ガウスのイメージイラスト",
      "caption": "カール・フリードリヒ・ガウス（1777–1855）"
    },
    "profile": [
      "ドイツの数学者・天文学者・物理学者で、その広さと深さから「数学の王」とも称されます。",
      "少年時代に 1 から 100 までの和を、両端を組にする工夫ですばやく求めたという逸話が伝えられます。"
    ],
    "contributions": [
      "著書『整数論考究』で、合同（あまりの等しさ）を軸に整数の性質を体系化し、数論を一つの分野としてまとめ上げました。平方剰余の相互法則もこの中にあります。",
      "最小二乗法による観測データの処理、正十七角形が定規とコンパスで作図できることの発見、複素数を平面上の点として扱う見方など、多方面に成果を残しました。"
    ],
    "related": {
      "stories": [
        "gauss-patterns-in-integers"
      ],
      "figures": [
        "euler",
        "riemann",
        "cauchy"
      ],
      "lessons": [
        "prime-factorization",
        "arithmetic-sequences"
      ],
      "labs": [
        "sigma-stairs-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/"
    }
  };
