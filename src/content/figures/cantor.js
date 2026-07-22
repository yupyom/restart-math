// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "cantor",
    "name": "ゲオルク・カントール",
    "reading": "Georg Cantor",
    "era": "1845–1918",
    "region": "ドイツ（ロシア生まれ）",
    "achievement": "無限にも大小があることを示し、集合論を創始した",
    "portrait": {
      "src": "assets/img/portraits/cantor.webp",
      "alt": "カントールのイメージイラスト",
      "caption": "ゲオルク・カントール（1845–1918）"
    },
    "profile": [
      "ロシアのサンクトペテルブルクに生まれ、ドイツで活動した数学者です。ハレ大学で教えました。",
      "その革新的な理論は当時激しい批判も受けましたが、現在では現代数学の共通の土台とされています。"
    ],
    "contributions": [
      "ものの集まり（集合）を数学の対象として扱う「集合論」を築きました。二つの集合の要素を一対一に対応づけられるかで「大きさ」を比べる方法を示しています。",
      "自然数と実数を対応づけようとしても必ずあふれが出ることを対角線論法で示し、無限にも異なる「大きさ」があることを明らかにしました。"
    ],
    "related": {
      "stories": [
        "cantor-sets-and-infinity"
      ],
      "figures": [
        "de-morgan",
        "peano"
      ],
      "lessons": [
        "sets-propositions",
        "venn-diagrams"
      ],
      "labs": [
        "venn-lab",
        "set-sort-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Cantor/"
    }
  };
