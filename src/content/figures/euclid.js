// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "euclid",
    "name": "ユークリッド",
    "reading": "Euclid",
    "era": "前300頃",
    "region": "古代ギリシャ（アレクサンドリア）",
    "achievement": "『原論』で幾何学を定義・公理から積み上げる方法にまとめた",
    "portrait": {
      "src": "assets/img/portraits/euclid.webp",
      "alt": "ユークリッドのイメージイラスト",
      "caption": "ユークリッド（前300頃）"
    },
    "profile": [
      "プトレマイオス朝エジプトのアレクサンドリアで活動したとされますが、生涯についての確かな記録はほとんど残っていません。",
      "全13巻の数学書『原論（ストイケイア）』の著者として知られ、この本は二千年以上にわたり幾何学の教科書として読み継がれました。"
    ],
    "contributions": [
      "『原論』は、少数の定義・公準・公理から出発し、証明を一段ずつ積み上げて多くの定理を導く「公理的方法」の手本になりました。数学の議論の進め方そのものに大きな影響を与えています。",
      "二つの数の最大公約数を求める「ユークリッドの互除法」や、素数が無限に存在することの証明も『原論』に含まれます。平面幾何の基本定理の多くがここで整理されました。"
    ],
    "related": {
      "stories": [
        "euclid-elements"
      ],
      "figures": [
        "pythagoras",
        "archimedes"
      ],
      "lessons": [
        "geometry",
        "similarity",
        "parallel-lines-angles"
      ],
      "labs": [
        "euclidean-algorithm-lab",
        "triangle-angle-lab",
        "geometry-properties-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Euclid/"
    }
  };
