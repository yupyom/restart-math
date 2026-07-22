// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "de-moivre",
    "name": "アブラーム・ド・モアブル",
    "reading": "Abraham de Moivre",
    "era": "1667–1754",
    "region": "フランス／イングランド",
    "achievement": "複素数と三角関数を結ぶ公式や、正規分布の先駆けを示した",
    "portrait": {
      "src": "assets/img/portraits/de-moivre.webp",
      "alt": "ド・モアブルのイメージイラスト",
      "caption": "アブラーム・ド・モアブル（1667–1754）"
    },
    "profile": [
      "フランスに生まれ、宗教的迫害を逃れてイングランドへ移り住んだ数学者です。ニュートンやハレーと親交がありました。",
      "生活のため個人教師や賭けの相談役をしながら、確率論の研究を続けたと伝えられます。"
    ],
    "contributions": [
      "\\((\\cos\\theta + i\\sin\\theta)^n\\) が \\(\\cos n\\theta + i\\sin n\\theta\\) に等しいという「ド・モアブルの定理」で、複素数と三角関数の深い関係を示しました。",
      "著書『偶然の理論』で確率論を発展させ、多数の試行における分布が釣鐘型の曲線に近づくこと（正規分布）を先駆的に扱いました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "newton",
        "bayes"
      ],
      "lessons": [
        "trig-extension",
        "probability-a"
      ],
      "labs": [
        "probability-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/De_Moivre/"
    }
  };
