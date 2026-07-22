// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "fermat",
    "name": "ピエール・ド・フェルマー",
    "reading": "Pierre de Fermat",
    "era": "1601–1665",
    "region": "フランス（トゥールーズ）",
    "achievement": "数論と確率論の礎を築き、「最終定理」で知られる",
    "portrait": {
      "src": "assets/img/portraits/fermat.webp",
      "alt": "フェルマーのイメージイラスト",
      "caption": "ピエール・ド・フェルマー（1601–1665）"
    },
    "profile": [
      "トゥールーズの法律家・裁判官を本業としながら、余暇に数学を研究した「アマチュアの数学者」として知られます。",
      "成果の多くは論文ではなく、他の数学者との手紙や本の余白の書き込みとして残されました。"
    ],
    "contributions": [
      "パスカルとの往復書簡で、賭けの分配などを題材に確率論の基礎を築きました。整数の性質を扱う数論でも「フェルマーの小定理」など多くの発見を残しています。",
      "「\\(x^n + y^n = z^n\\) は \\(n\\) が3以上のとき自然数解を持たない」と本の余白に記した主張は「フェルマーの最終定理」と呼ばれ、約350年後の1994年にワイルズによって証明されました。"
    ],
    "related": {
      "stories": [
        "pascal-fermat-probability"
      ],
      "figures": [
        "pascal",
        "descartes"
      ],
      "lessons": [
        "probability-a",
        "prime-factorization"
      ],
      "labs": [
        "probability-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Fermat/"
    }
  };
