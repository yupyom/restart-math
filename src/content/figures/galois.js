// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "galois",
    "name": "エヴァリスト・ガロア",
    "reading": "Évariste Galois",
    "era": "1811–1832",
    "region": "フランス",
    "achievement": "方程式の解ける条件を「群」の考えで説明する理論を築いた",
    "portrait": {
      "src": "assets/img/portraits/galois.webp",
      "alt": "ガロアのイメージイラスト",
      "caption": "エヴァリスト・ガロア（1811–1832）"
    },
    "profile": [
      "フランスの数学者で、政治活動にも身を投じ、決闘により20歳という若さで亡くなりました。",
      "生前は理解されませんでしたが、決闘の前夜に書き残した手紙などから、その先進的な理論が後に評価されました。"
    ],
    "contributions": [
      "方程式が根号で解けるかどうかを、解の入れ替え（対称性）がつくる「群」の性質によって説明しました。これは群論の出発点であり、現代代数学の基礎になっています。",
      "彼の理論は「ガロア理論」と呼ばれ、5次以上の方程式が一般には根号で解けない理由を、対称性の言葉で明らかにしました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "abel",
        "cauchy"
      ],
      "lessons": [
        "quadratic-equations",
        "sets-propositions"
      ],
      "labs": []
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Galois/"
    }
  };
