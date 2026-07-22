// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "peano",
    "name": "ジュゼッペ・ペアノ",
    "reading": "Giuseppe Peano",
    "era": "1858–1932",
    "region": "イタリア",
    "achievement": "自然数を公理で定義し、数学を記号で厳密に書く道を開いた",
    "portrait": {
      "src": "assets/img/portraits/peano.webp",
      "alt": "ペアノのイメージイラスト",
      "caption": "ジュゼッペ・ペアノ（1858–1932）"
    },
    "profile": [
      "イタリアの数学者・論理学者で、トリノ大学で教えました。",
      "数学の主張を記号で正確に書き表す「記号論理」の発展に力を尽くしました。"
    ],
    "contributions": [
      "自然数を「0 と、次の数をつくる操作」から少数の約束（公理）で定義する「ペアノの公理」を示しました。数の体系を土台から組み立てる出発点です。",
      "「\\(\\in\\)（属する）」など集合・論理の記号を整え、数学を厳密な記号で書く形式化を大きく進めました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "cantor",
        "boole"
      ],
      "lessons": [
        "sets-propositions",
        "number-classification",
        "mathematical-induction"
      ],
      "labs": [
        "set-sort-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Peano/"
    }
  };
