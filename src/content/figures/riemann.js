// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "riemann",
    "name": "ベルンハルト・リーマン",
    "reading": "Bernhard Riemann",
    "era": "1826–1866",
    "region": "ドイツ",
    "achievement": "積分の定義や曲がった空間の幾何学を切り開いた",
    "portrait": {
      "src": "assets/img/portraits/riemann.webp",
      "alt": "リーマンのイメージイラスト",
      "caption": "ベルンハルト・リーマン（1826–1866）"
    },
    "profile": [
      "ドイツの数学者で、ガウスのもとで学びました。39歳で病により亡くなりましたが、短い生涯で数学に深い影響を残しました。",
      "その名は積分・幾何・複素解析・数論など、数学の多くの分野に残っています。"
    ],
    "contributions": [
      "面積として積分を厳密に定義する「リーマン積分」を整えました。関数を細かい長方形の和で近づける、高校で学ぶ積分の考え方の土台です。",
      "曲がった空間を扱う「リーマン幾何学」を築き、これは後にアインシュタインの一般相対性理論で使われました。素数の分布に関する「リーマン予想」は今も未解決の難問です。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "gauss",
        "cauchy"
      ],
      "lessons": [
        "geometry"
      ],
      "labs": []
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Riemann/"
    }
  };
