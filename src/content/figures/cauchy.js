// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "cauchy",
    "name": "オーギュスタン＝ルイ・コーシー",
    "reading": "Augustin-Louis Cauchy",
    "era": "1789–1857",
    "region": "フランス",
    "achievement": "極限を用いて微積分を厳密にし、複素解析を築いた",
    "portrait": {
      "src": "assets/img/portraits/cauchy.webp",
      "alt": "コーシーのイメージイラスト",
      "caption": "オーギュスタン＝ルイ・コーシー（1789–1857）"
    },
    "profile": [
      "フランスの数学者で、非常に多くの論文を書いたことで知られます。エコール・ポリテクニークなどで教えました。",
      "その名は極限・連続・収束など、解析学の多くの概念や定理に残っています。"
    ],
    "contributions": [
      "「限りなく近づく」という極限の考えを厳密に定め、微積分をあいまいさなく組み立て直しました。連続や収束の定義を現在の形に近づけた中心人物です。",
      "複素数を変数とする関数の理論（複素解析）を築き、「コーシーの積分定理」など基本となる結果を残しました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "gauss",
        "abel",
        "riemann"
      ],
      "lessons": [
        "functions",
        "sum-and-general-term"
      ],
      "labs": []
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Cauchy/"
    }
  };
