// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "bayes",
    "name": "トマス・ベイズ",
    "reading": "Thomas Bayes",
    "era": "1701頃–1761",
    "region": "イングランド",
    "achievement": "観測から原因の確率を更新する「ベイズの定理」を残した",
    "portrait": {
      "src": "assets/img/portraits/bayes.webp",
      "alt": "ベイズのイメージイラスト",
      "caption": "トマス・ベイズ（1701頃–1761）"
    },
    "profile": [
      "イングランドの長老派の牧師でありながら、数学と確率を研究した人物です。生前に数学の論文はほとんど発表しませんでした。",
      "その考えは、死後に友人のプライスがまとめて発表したことで世に知られました。"
    ],
    "contributions": [
      "結果を観測したときに、その原因の確率をどう見直すかを示した「ベイズの定理」で知られます。条件つき確率を逆向きに使う考え方です。",
      "この考え方は「ベイズ統計」として発展し、データが増えるたびに確からしさを更新していく現代の統計・機械学習の土台になっています。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "de-moivre"
      ],
      "lessons": [
        "conditional-probability",
        "probability-a"
      ],
      "labs": [
        "probability-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Bayes/"
    }
  };
