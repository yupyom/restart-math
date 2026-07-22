// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "leibniz",
    "name": "ゴットフリート・ライプニッツ",
    "reading": "Gottfried Wilhelm Leibniz",
    "era": "1646–1716",
    "region": "ドイツ",
    "achievement": "微分積分学を独立に創始し、今も使う記号を整えた",
    "portrait": {
      "src": "assets/img/portraits/leibniz.webp",
      "alt": "ライプニッツのイメージイラスト",
      "caption": "ゴットフリート・ライプニッツ（1646–1716）"
    },
    "profile": [
      "ドイツの数学者・哲学者で、法学・外交・歴史など幅広い分野で活動した万能の学者です。",
      "微積分の発見をめぐってニュートンと優先権を争いましたが、現在では二人が独立に到達したと考えられています。"
    ],
    "contributions": [
      "ニュートンとは別に微分積分学を築き、積分記号 \\(\\int\\) や微分の \\(dx\\) といった、現在も使われる見やすい記号を導入しました。記号の工夫が計算を大きく楽にしました。",
      "0 と 1 だけで数を表す二進法を研究し、機械的な計算や論理の形式化にも関心を寄せました。これは後の計算機の考え方につながります。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "newton",
        "seki-takakazu"
      ],
      "lessons": [
        "functions"
      ],
      "labs": []
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Leibniz/"
    }
  };
