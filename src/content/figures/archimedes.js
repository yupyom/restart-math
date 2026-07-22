// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "archimedes",
    "name": "アルキメデス",
    "reading": "Archimedes",
    "era": "前287頃–前212",
    "region": "古代ギリシャ（シラクサ）",
    "achievement": "面積・体積を求める方法を工夫し、円周率を精密に評価した",
    "portrait": {
      "src": "assets/img/portraits/archimedes.webp",
      "alt": "アルキメデスのイメージイラスト",
      "caption": "アルキメデス（前287頃–前212）"
    },
    "profile": [
      "シチリア島のギリシャ都市シラクサに生まれ、数学者・技術者として活躍しました。てこや浮力の原理、投石機などの考案でも知られます。",
      "浮力を発見して「エウレカ（見つけた）」と叫んだという逸話や、シラクサ攻防戦の最中に亡くなったという伝えなど、多くの逸話が残っています。"
    ],
    "contributions": [
      "図形を細かく分けて足し合わせる「取り尽くし法」を用い、円・球・放物線で囲まれた面積や体積を求めました。これは後の積分の考え方の先駆けとされます。",
      "円に内接・外接する多角形を使って円周率が \\(3 + \\frac{10}{71}\\) と \\(3 + \\frac{1}{7}\\) の間にあることを示すなど、近似計算でも大きな成果を残しました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "euclid",
        "pythagoras",
        "newton"
      ],
      "lessons": [
        "geometry",
        "pi-and-approximation",
        "pythagorean-theorem"
      ],
      "labs": [
        "geometry-properties-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Archimedes/"
    }
  };
