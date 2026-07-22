// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "taylor",
    "name": "ブルック・テイラー",
    "reading": "Brook Taylor",
    "era": "1685–1731",
    "region": "イングランド",
    "achievement": "関数を多項式で近似する「テイラー展開」を示した",
    "portrait": {
      "src": "assets/img/portraits/taylor.webp",
      "alt": "テイラーのイメージイラスト",
      "caption": "ブルック・テイラー（1685–1731）"
    },
    "profile": [
      "イングランドの数学者で、王立協会の会員として活動しました。音楽や絵画（遠近法）にも関心を持ちました。",
      "微積分をめぐるニュートン側の立場から研究を進めた人物の一人です。"
    ],
    "contributions": [
      "関数を、ある点のまわりで多項式（べき級数）として表す「テイラー展開」を示しました。複雑な関数を近くの多項式で近似する強力な道具です。",
      "遠近法の数学的な理論にも取り組み、絵画に現れる直線や点の性質を数学的に扱いました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "maclaurin",
        "newton"
      ],
      "lessons": [
        "functions",
        "sum-and-general-term"
      ],
      "labs": []
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Taylor/"
    }
  };
