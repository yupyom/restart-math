// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "abel",
    "name": "ニールス・アーベル",
    "reading": "Niels Henrik Abel",
    "era": "1802–1829",
    "region": "ノルウェー",
    "achievement": "5次方程式が一般に解の公式を持たないことを証明した",
    "portrait": {
      "src": "assets/img/portraits/abel.webp",
      "alt": "アーベルのイメージイラスト",
      "caption": "ニールス・アーベル（1802–1829）"
    },
    "profile": [
      "ノルウェーの数学者で、貧しさと病に苦しみながら研究を続け、26歳の若さで亡くなりました。",
      "生前は正当に評価されませんでしたが、死後にその業績の大きさが広く認められました。可換な演算を「アーベル群」と呼ぶのは彼にちなみます。"
    ],
    "contributions": [
      "5次以上の一般の方程式には、四則と根号だけで表せる解の公式が存在しないことを証明しました（アーベル・ルフィニの定理）。長年の難問に決着をつけた成果です。",
      "楕円関数の理論でも先駆的な研究を行い、後の数学に大きな影響を与えました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "galois",
        "cauchy"
      ],
      "lessons": [
        "quadratic-equations",
        "factoring"
      ],
      "labs": []
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Abel/"
    }
  };
