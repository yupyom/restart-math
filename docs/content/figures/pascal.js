// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "pascal",
    "name": "ブレーズ・パスカル",
    "reading": "Blaise Pascal",
    "era": "1623–1662",
    "region": "フランス",
    "achievement": "確率論を築き、「パスカルの三角形」や機械式計算機で知られる",
    "portrait": {
      "src": "assets/img/portraits/pascal.webp",
      "alt": "パスカルのイメージイラスト",
      "caption": "ブレーズ・パスカル（1623–1662）"
    },
    "profile": [
      "フランスの数学者・物理学者・思想家です。『パンセ』の「人間は考える葦である」でも知られます。",
      "若い頃から才能を示し、父の仕事を助けるために機械式の計算機を製作したと伝えられます。"
    ],
    "contributions": [
      "フェルマーとの手紙のやりとりを通じて、確率を数として扱う理論の基礎を築きました。賭けが途中で終わったときの分配問題がきっかけでした。",
      "二項係数を三角形状に並べた「パスカルの三角形」を研究し、組合せの数や二項定理と結びつけました。流体の圧力に関する「パスカルの原理」も残しています。"
    ],
    "related": {
      "stories": [
        "pascal-fermat-probability"
      ],
      "figures": [
        "fermat",
        "descartes"
      ],
      "lessons": [
        "probability-a",
        "combinations",
        "counting-principles"
      ],
      "labs": [
        "probability-lab",
        "lattice-path-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Pascal/"
    }
  };
