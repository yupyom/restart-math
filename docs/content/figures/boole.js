// 数学者図鑑データ（1人1ファイル）。編集後は npm run check。一覧・関連は figures.js が合成する。
export const figure = {
    "id": "boole",
    "name": "ジョージ・ブール",
    "reading": "George Boole",
    "era": "1815–1864",
    "region": "イングランド／アイルランド",
    "achievement": "論理を数式で表す「ブール代数」を作り上げた",
    "portrait": {
      "src": "assets/img/portraits/boole.webp",
      "alt": "ブールのイメージイラスト",
      "caption": "ジョージ・ブール（1815–1864）"
    },
    "profile": [
      "イングランドに生まれ、独学で数学を身につけ、のちにアイルランドのクイーンズ・カレッジ・コークの教授になりました。",
      "正規の高等教育をほとんど受けずに、論理と代数を結びつける独創的な研究を成し遂げました。"
    ],
    "contributions": [
      "「真・偽」や「かつ・または・でない」といった論理を、記号と計算で扱う体系（ブール代数）を作りました。著書『思考の法則』にまとめられています。",
      "この考え方は、0 と 1 で動くデジタル回路やコンピュータの設計の基礎になり、現代の情報技術を支えています。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "de-morgan",
        "peano"
      ],
      "lessons": [
        "sets-propositions",
        "logic-converse",
        "necessary-sufficient"
      ],
      "labs": [
        "venn-lab",
        "set-sort-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Boole/"
    }
  };
