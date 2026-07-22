// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "de-morgan",
    "name": "オーガスタス・ド・モルガン",
    "reading": "Augustus De Morgan",
    "era": "1806–1871",
    "region": "イギリス（インド生まれ）",
    "achievement": "論理を記号で扱い、集合の「ド・モルガンの法則」を残した",
    "portrait": {
      "src": "assets/img/portraits/de-morgan.webp",
      "alt": "ド・モルガンのイメージイラスト",
      "caption": "オーガスタス・ド・モルガン（1806–1871）"
    },
    "profile": [
      "インドで生まれ、イギリスで学び、ロンドン大学（ユニバーシティ・カレッジ）で最初の数学教授を務めました。",
      "論理学と代数を結びつける研究で、ブールと並んで記号論理の発展に貢献しました。"
    ],
    "contributions": [
      "「かつ・または・でない」を記号で扱う論理の代数化を進めました。集合や論理で「和の補は補の積、積の補は補の和」となる関係は「ド・モルガンの法則」と呼ばれます。",
      "数学的帰納法という用語を広めるなど、数学の議論の言葉を整える役割も果たしました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "boole",
        "cantor"
      ],
      "lessons": [
        "sets-propositions",
        "venn-diagrams",
        "logic-converse"
      ],
      "labs": [
        "venn-lab",
        "set-sort-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/De_Morgan/"
    }
  };
