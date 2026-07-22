// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "descartes",
    "name": "ルネ・デカルト",
    "reading": "René Descartes",
    "era": "1596–1650",
    "region": "フランス／オランダ",
    "achievement": "座標を用いて図形の問題を式で扱う「解析幾何学」を開いた",
    "portrait": {
      "src": "assets/img/portraits/descartes.webp",
      "alt": "デカルトのイメージイラスト",
      "caption": "ルネ・デカルト（1596–1650）"
    },
    "profile": [
      "フランスに生まれ、人生の多くをオランダで過ごした哲学者・数学者です。「我思う、ゆえに我あり」で知られる近代哲学の祖でもあります。",
      "数学は、著書『方法序説』の付録『幾何学』などに現れます。"
    ],
    "contributions": [
      "平面上の点を数の組 \\((x,\\ y)\\) で表し、図形を式で、式を図形で調べる方法（解析幾何学）を示しました。代数と幾何を結ぶこの発想は、その後の数学の土台になりました。座標の発展は一人だけの発明ではありません。",
      "未知数に \\(x\\)・\\(y\\)・\\(z\\)、既知の数に \\(a\\)・\\(b\\)・\\(c\\) を使う表記や、指数の書き方など、現在に近い代数の記法を整える役割も果たしました。"
    ],
    "related": {
      "stories": [
        "descartes-algebra-meets-geometry",
        "letters-are-labels"
      ],
      "figures": [
        "fermat",
        "pascal"
      ],
      "lessons": [
        "functions",
        "function-notation"
      ],
      "labs": [
        "function-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/"
    }
  };
