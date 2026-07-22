// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "newton",
    "name": "アイザック・ニュートン",
    "reading": "Isaac Newton",
    "era": "1643–1727",
    "region": "イングランド",
    "achievement": "微分積分学を創始し、力学と万有引力の理論を打ち立てた",
    "portrait": {
      "src": "assets/img/portraits/newton.webp",
      "alt": "ニュートンのイメージイラスト",
      "caption": "アイザック・ニュートン（1643–1727）"
    },
    "profile": [
      "イングランドの数学者・物理学者・天文学者で、科学革命を代表する人物です。ケンブリッジ大学で学び、教授を務めました。",
      "落下するリンゴの逸話でも知られますが、その研究は力学・光学・数学の広い範囲に及びます。"
    ],
    "contributions": [
      "変化の割合（微分）と面積・量の集まり（積分）を結びつける微分積分学を、ライプニッツとは独立に創始しました。だれが先かをめぐる論争は長く続きました。",
      "著書『プリンキピア』で運動の三法則と万有引力の法則を示し、天体と地上の運動を同じ数学で説明しました。二項定理を一般の指数へ広げる研究も残しています。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "leibniz",
        "de-moivre",
        "maclaurin"
      ],
      "lessons": [
        "functions",
        "sum-and-general-term"
      ],
      "labs": [
        "function-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Newton/"
    }
  };
