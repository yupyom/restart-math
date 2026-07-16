// 数学者図鑑（figures）データ。肖像イラストと、事実に基づくプロフィール・数学的な貢献をまとめる。
// 一覧では portrait / name / achievement を、詳細では profile / contributions と関連リンクを使う。
// 肖像は史料をもとにした親しみやすいデフォルメ表現で、厳密な肖像資料ではない。
// related には既存の読み物(stories)・単元(lessons)・図解(labs)・他の数学者(figures)の id を入れる。
// era は生没年、region は主に活動した地域。source は伝記の参照先。
export const figures = [
  {
    "id": "pythagoras",
    "name": "ピタゴラス",
    "reading": "Pythagoras",
    "era": "前570頃–前495頃",
    "region": "古代ギリシャ（サモス島・南イタリア）",
    "achievement": "「万物は数」を掲げ、直角三角形の定理で知られる学派を築いた",
    "portrait": {
      "src": "assets/img/portraits/pythagoras.webp",
      "alt": "ピタゴラスのイメージイラスト",
      "caption": "ピタゴラス（前570頃–前495頃）"
    },
    "profile": [
      "エーゲ海のサモス島に生まれ、のちに南イタリアのクロトンへ移り、数・音楽・宇宙観を結びつけた学派（ピタゴラス教団）を率いたと伝えられます。",
      "本人が書いた著作は残っておらず、その業績の多くは弟子たちの成果を含む「学派全体のもの」として語り継がれています。伝説的な逸話も多く、人物像には不確かな部分があります。"
    ],
    "contributions": [
      "直角三角形で斜辺の平方が他の二辺の平方の和に等しいという「三平方の定理（ピタゴラスの定理）」が、この学派の名で広く知られています。同じ関係は古代バビロニアなどでも知られていました。",
      "弦の長さの比と音の高さの関係を調べ、数の比が自然界の調和を表すという考えを広めました。整数の比で表せない量（無理数）の存在は、この数論的な世界観に動揺を与えたと伝えられます。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "euclid",
        "archimedes"
      ],
      "lessons": [
        "pythagorean-theorem",
        "prime-factorization"
      ],
      "labs": [
        "geometry-properties-lab",
        "triangle-angle-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Pythagoras/"
    }
  },
  {
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
  },
  {
    "id": "archimedes",
    "name": "アルキメデス",
    "reading": "Archimedes",
    "era": "前287頃–前212",
    "region": "古代ギリシャ（シラクサ）",
    "achievement": "面積・体積を求める方法を工夫し、円周率を精密に評価した",
    "portrait": {
      "src": "assets/img/portraits/archimedes.webp",
      "alt": "アルキメデスのイメージイラスト",
      "caption": "アルキメデス（前287頃–前212）"
    },
    "profile": [
      "シチリア島のギリシャ都市シラクサに生まれ、数学者・技術者として活躍しました。てこや浮力の原理、投石機などの考案でも知られます。",
      "浮力を発見して「エウレカ（見つけた）」と叫んだという逸話や、シラクサ攻防戦の最中に亡くなったという伝えなど、多くの逸話が残っています。"
    ],
    "contributions": [
      "図形を細かく分けて足し合わせる「取り尽くし法」を用い、円・球・放物線で囲まれた面積や体積を求めました。これは後の積分の考え方の先駆けとされます。",
      "円に内接・外接する多角形を使って円周率が 3 + 10/71 と 3 + 1/7 の間にあることを示すなど、近似計算でも大きな成果を残しました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "euclid",
        "pythagoras",
        "newton"
      ],
      "lessons": [
        "geometry",
        "pythagorean-theorem"
      ],
      "labs": [
        "geometry-properties-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Archimedes/"
    }
  },
  {
    "id": "al-khwarizmi",
    "name": "アル＝フワーリズミ",
    "reading": "al-Khwārizmī",
    "era": "780頃–850頃",
    "region": "イスラーム世界（バグダード）",
    "achievement": "方程式を体系的に解く方法を著し、「代数（algebra）」の語源になった",
    "portrait": {
      "src": "assets/img/portraits/al-khwarizmi.webp",
      "alt": "アル＝フワーリズミのイメージイラスト",
      "caption": "アル＝フワーリズミ（780頃–850頃）"
    },
    "profile": [
      "アッバース朝時代のバグダードにあった学術機関「知恵の館」で活動した数学者・天文学者です。",
      "その名前はラテン語化して「アルゴリズム（algorithm）」の語源になったと言われ、著作はヨーロッパへも大きな影響を与えました。"
    ],
    "contributions": [
      "著書『約分と消約の計算の書』で、一次・二次方程式を「移項」と「同類項の整理」で解く手順を体系的にまとめました。書名の一部 al-jabr が「代数（algebra）」の語源です。",
      "インド由来の十進位取り記数法を紹介する著作も著し、ゼロを含む数字の書き方が西方へ広まる橋渡しをしました。"
    ],
    "related": {
      "stories": [
        "al-khwarizmi-algebra",
        "letters-are-labels"
      ],
      "figures": [
        "al-battani",
        "recorde"
      ],
      "lessons": [
        "linear-equations",
        "quadratic-equations",
        "equation-modeling"
      ],
      "labs": [
        "equation-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Al-Khwarizmi/"
    }
  },
  {
    "id": "al-battani",
    "name": "アル＝バッターニー",
    "reading": "al-Battānī",
    "era": "858頃–929",
    "region": "イスラーム世界（ラッカ・北メソポタミア）",
    "achievement": "精密な天文観測を行い、三角法の計算を大きく前進させた",
    "portrait": {
      "src": "assets/img/portraits/al-battani.webp",
      "alt": "アル＝バッターニーのイメージイラスト",
      "caption": "アル＝バッターニー（858頃–929）"
    },
    "profile": [
      "北メソポタミアのラッカなどで活動したイスラーム世界の天文学者・数学者です。ラテン語では「アルバテニウス」と呼ばれました。",
      "長年にわたる精密な天体観測で知られ、その成果はのちのヨーロッパの天文学にも参照されました。"
    ],
    "contributions": [
      "天文計算のために正弦（サイン）や正接（タンジェント）にあたる量を用い、三角法を実用的な計算体系として発展させました。角度と辺の関係を表す表を整えています。",
      "一年の長さや季節の変化などを観測から精密に求め、天文表を作成しました。三角比を天体の位置計算へ結びつけた点が大きな功績です。"
    ],
    "related": {
      "stories": [
        "al-battani-trigonometry"
      ],
      "figures": [
        "al-khwarizmi"
      ],
      "lessons": [
        "trig-ratios"
      ],
      "labs": [
        "trig-lab",
        "unit-semicircle-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Al-Battani/"
    }
  },
  {
    "id": "recorde",
    "name": "ロバート・レコード",
    "reading": "Robert Recorde",
    "era": "1512頃–1558",
    "region": "イングランド／ウェールズ",
    "achievement": "等号「=」を考案し、英語で数学を平易に説く教科書を書いた",
    "portrait": {
      "src": "assets/img/portraits/recorde.webp",
      "alt": "ロバート・レコードのイメージイラスト",
      "caption": "ロバート・レコード（1512頃–1558）"
    },
    "profile": [
      "ウェールズに生まれ、医学と数学を学んだイングランドの学者です。一般の読者に向けて英語で数学書を著しました。",
      "問答形式のわかりやすい教科書で、当時のイギリスに数学を広める役割を果たしました。"
    ],
    "contributions": [
      "1557年の著書『知恵の砥石』で、等しいことを表す記号として二本の平行線「=」を初めて用いました。「これほど等しいものはない」という理由から平行線を選んだと記しています。",
      "「+」「−」などの記号を英語圏に紹介し、記号を使って式を簡潔に書く習慣を広めました。"
    ],
    "related": {
      "stories": [
        "recorde-equal-sign",
        "equal-sign-keeps-balance"
      ],
      "figures": [
        "al-khwarizmi"
      ],
      "lessons": [
        "linear-equations",
        "equation-modeling"
      ],
      "labs": [
        "equation-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Recorde/"
    }
  },
  {
    "id": "descartes",
    "name": "ルネ・デカルト",
    "reading": "René Descartes",
    "era": "1596–1650",
    "region": "フランス／オランダ",
    "achievement": "座標を用いて図形の問題を式で扱う「解析幾何学」を開いた",
    "portrait": {
      "src": "assets/img/portraits/descartes.webp",
      "alt": "デカルトのイメージイラスト",
      "caption": "ルネ・デカルト（1596–1650）"
    },
    "profile": [
      "フランスに生まれ、人生の多くをオランダで過ごした哲学者・数学者です。「我思う、ゆえに我あり」で知られる近代哲学の祖でもあります。",
      "数学は、著書『方法序説』の付録『幾何学』などに現れます。"
    ],
    "contributions": [
      "平面上の点を数の組 (x, y) で表し、図形を式で、式を図形で調べる方法（解析幾何学）を示しました。代数と幾何を結ぶこの発想は、その後の数学の土台になりました。座標の発展は一人だけの発明ではありません。",
      "未知数に x・y・z、既知の数に a・b・c を使う表記や、指数の書き方など、現在に近い代数の記法を整える役割も果たしました。"
    ],
    "related": {
      "stories": [
        "descartes-algebra-meets-geometry",
        "letters-are-labels"
      ],
      "figures": [
        "fermat",
        "pascal"
      ],
      "lessons": [
        "functions",
        "function-notation"
      ],
      "labs": [
        "function-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/"
    }
  },
  {
    "id": "fermat",
    "name": "ピエール・ド・フェルマー",
    "reading": "Pierre de Fermat",
    "era": "1607–1665",
    "region": "フランス（トゥールーズ）",
    "achievement": "数論と確率論の礎を築き、「最終定理」で知られる",
    "portrait": {
      "src": "assets/img/portraits/fermat.webp",
      "alt": "フェルマーのイメージイラスト",
      "caption": "ピエール・ド・フェルマー（1607–1665）"
    },
    "profile": [
      "トゥールーズの法律家・裁判官を本業としながら、余暇に数学を研究した「アマチュアの数学者」として知られます。",
      "成果の多くは論文ではなく、他の数学者との手紙や本の余白の書き込みとして残されました。"
    ],
    "contributions": [
      "パスカルとの往復書簡で、賭けの分配などを題材に確率論の基礎を築きました。整数の性質を扱う数論でも「フェルマーの小定理」など多くの発見を残しています。",
      "「x^n + y^n = z^n は n が3以上のとき自然数解を持たない」と本の余白に記した主張は「フェルマーの最終定理」と呼ばれ、約350年後の1994年にワイルズによって証明されました。"
    ],
    "related": {
      "stories": [
        "pascal-fermat-probability"
      ],
      "figures": [
        "pascal",
        "descartes"
      ],
      "lessons": [
        "probability-a",
        "prime-factorization"
      ],
      "labs": [
        "probability-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Fermat/"
    }
  },
  {
    "id": "pascal",
    "name": "ブレーズ・パスカル",
    "reading": "Blaise Pascal",
    "era": "1623–1662",
    "region": "フランス",
    "achievement": "確率論を築き、「パスカルの三角形」や機械式計算機で知られる",
    "portrait": {
      "src": "assets/img/portraits/pascal.webp",
      "alt": "パスカルのイメージイラスト",
      "caption": "ブレーズ・パスカル（1623–1662）"
    },
    "profile": [
      "フランスの数学者・物理学者・思想家です。『パンセ』の「人間は考える葦である」でも知られます。",
      "若い頃から才能を示し、父の仕事を助けるために機械式の計算機を製作したと伝えられます。"
    ],
    "contributions": [
      "フェルマーとの手紙のやりとりを通じて、確率を数として扱う理論の基礎を築きました。賭けが途中で終わったときの分配問題がきっかけでした。",
      "二項係数を三角形状に並べた「パスカルの三角形」を研究し、組合せの数や二項定理と結びつけました。流体の圧力に関する「パスカルの原理」も残しています。"
    ],
    "related": {
      "stories": [
        "pascal-fermat-probability"
      ],
      "figures": [
        "fermat",
        "descartes"
      ],
      "lessons": [
        "probability-a",
        "combinations",
        "counting-principles"
      ],
      "labs": [
        "probability-lab",
        "lattice-path-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Pascal/"
    }
  },
  {
    "id": "seki-takakazu",
    "name": "関孝和",
    "reading": "Seki Takakazu",
    "era": "1642頃–1708",
    "region": "日本（江戸時代）",
    "achievement": "日本独自の数学「和算」を高め、行列式などを先駆けて研究した",
    "portrait": {
      "src": "assets/img/portraits/seki-takakazu.webp",
      "alt": "関孝和のイメージイラスト",
      "caption": "関孝和（1642頃–1708）"
    },
    "profile": [
      "江戸時代前期の日本の数学者で、「算聖」とも呼ばれます。武士として仕えながら数学を研究しました。",
      "当時の日本で発展した独自の数学「和算」を大きく前進させ、多くの弟子を育てました。"
    ],
    "contributions": [
      "文字や記号を使って未知数を扱う方法（傍書法・点竄術）を整え、方程式を筆算で扱えるようにしました。連立方程式を解く過程で、西洋とは独立に行列式にあたる考えへ到達しています。",
      "円周率の精密な近似や、円や弧の長さ・面積を求める研究（円理）でも成果を残しました。同時代の西洋の微積分に通じる問題を、和算の中で扱っていました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "newton",
        "leibniz"
      ],
      "lessons": [
        "prime-factorization",
        "geometry"
      ],
      "labs": []
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Seki/"
    }
  },
  {
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
        "pythagorean-theorem"
      ],
      "labs": [
        "function-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Newton/"
    }
  },
  {
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
      "ニュートンとは別に微分積分学を築き、積分記号 ∫ や微分の dx といった、現在も使われる見やすい記号を導入しました。記号の工夫が計算を大きく楽にしました。",
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
  },
  {
    "id": "de-moivre",
    "name": "アブラーム・ド・モアブル",
    "reading": "Abraham de Moivre",
    "era": "1667–1754",
    "region": "フランス／イングランド",
    "achievement": "複素数と三角関数を結ぶ公式や、正規分布の先駆けを示した",
    "portrait": {
      "src": "assets/img/portraits/de-moivre.webp",
      "alt": "ド・モアブルのイメージイラスト",
      "caption": "アブラーム・ド・モアブル（1667–1754）"
    },
    "profile": [
      "フランスに生まれ、宗教的迫害を逃れてイングランドへ移り住んだ数学者です。ニュートンやハレーと親交がありました。",
      "生活のため個人教師や賭けの相談役をしながら、確率論の研究を続けたと伝えられます。"
    ],
    "contributions": [
      "(cos θ + i sin θ) の n 乗が cos nθ + i sin nθ に等しいという「ド・モアブルの定理」で、複素数と三角関数の深い関係を示しました。",
      "著書『偶然の理論』で確率論を発展させ、多数の試行における分布が釣鐘型の曲線に近づくこと（正規分布）を先駆的に扱いました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "newton",
        "bayes"
      ],
      "lessons": [
        "trig-extension",
        "probability-a"
      ],
      "labs": [
        "probability-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/De_Moivre/"
    }
  },
  {
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
  },
  {
    "id": "maclaurin",
    "name": "コリン・マクローリン",
    "reading": "Colin Maclaurin",
    "era": "1698–1746",
    "region": "スコットランド",
    "achievement": "テイラー展開の特別な場合を広め、微積分を厳密に整理した",
    "portrait": {
      "src": "assets/img/portraits/maclaurin.webp",
      "alt": "マクローリンのイメージイラスト",
      "caption": "コリン・マクローリン（1698–1746）"
    },
    "profile": [
      "スコットランドの数学者で、非常に若くしてアバディーン大学の教授になった早熟の人物です。ニュートンに認められました。",
      "エディンバラ大学で教え、ニュートンの微積分を擁護し、わかりやすく整理することに努めました。"
    ],
    "contributions": [
      "0 のまわりでのテイラー展開は、彼の名から「マクローリン展開」と呼ばれます。彼自身はこれを独自の発見とは主張していません。",
      "著書『流率論』でニュートンの微積分を体系的にまとめ、当時あいまいだった議論を厳密にしようとしました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "taylor",
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
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Maclaurin/"
    }
  },
  {
    "id": "bayes",
    "name": "トマス・ベイズ",
    "reading": "Thomas Bayes",
    "era": "1701頃–1761",
    "region": "イングランド",
    "achievement": "観測から原因の確率を更新する「ベイズの定理」を残した",
    "portrait": {
      "src": "assets/img/portraits/bayes.webp",
      "alt": "ベイズのイメージイラスト",
      "caption": "トマス・ベイズ（1701頃–1761）"
    },
    "profile": [
      "イングランドの長老派の牧師でありながら、数学と確率を研究した人物です。生前に数学の論文はほとんど発表しませんでした。",
      "その考えは、死後に友人のプライスがまとめて発表したことで世に知られました。"
    ],
    "contributions": [
      "結果を観測したときに、その原因の確率をどう見直すかを示した「ベイズの定理」で知られます。条件つき確率を逆向きに使う考え方です。",
      "この考え方は「ベイズ統計」として発展し、データが増えるたびに確からしさを更新していく現代の統計・機械学習の土台になっています。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "de-moivre"
      ],
      "lessons": [
        "conditional-probability",
        "probability-a"
      ],
      "labs": [
        "probability-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Bayes/"
    }
  },
  {
    "id": "daniel-bernoulli",
    "name": "ダニエル・ベルヌーイ",
    "reading": "Daniel Bernoulli",
    "era": "1700–1782",
    "region": "スイス／オランダ",
    "achievement": "確率・統計を実問題に応用し、流体力学の基礎を築いた",
    "portrait": {
      "src": "assets/img/portraits/daniel-bernoulli.webp",
      "alt": "ダニエル・ベルヌーイのイメージイラスト",
      "caption": "ダニエル・ベルヌーイ（1700–1782）"
    },
    "profile": [
      "数学者を多く輩出したスイスのベルヌーイ家に生まれました。父ヨハン・ベルヌーイも著名な数学者です。",
      "サンクトペテルブルクで学者として活動したのち、バーゼル大学で教えました。オイラーとは親しい友人でした。"
    ],
    "contributions": [
      "流れる流体では速さが増すと圧力が下がるという「ベルヌーイの定理」を示し、流体力学の基礎を築きました。",
      "確率の期待値を金額そのものではなく満足度（効用）で考える「サンクトペテルブルクのパラドックス」の議論など、確率・統計を現実の問題へ応用しました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "euler"
      ],
      "lessons": [
        "probability-a"
      ],
      "labs": [
        "probability-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Bernoulli_Daniel/"
    }
  },
  {
    "id": "euler",
    "name": "レオンハルト・オイラー",
    "reading": "Leonhard Euler",
    "era": "1707–1783",
    "region": "スイス／ロシア／ドイツ",
    "achievement": "解析学を大きく発展させ、記号と公式を数多く残した",
    "portrait": {
      "src": "assets/img/portraits/euler.webp",
      "alt": "オイラーのイメージイラスト",
      "caption": "レオンハルト・オイラー（1707–1783）"
    },
    "profile": [
      "スイスのバーゼルに生まれ、サンクトペテルブルクやベルリンで活動した、歴史上もっとも多作な数学者の一人です。",
      "晩年は視力をほとんど失いながらも、記憶と口述で膨大な研究を続けたことで知られます。"
    ],
    "contributions": [
      "関数の記号 f(x)、円周率 π、自然対数の底 e、和の記号 Σ など、現在使われる多くの記法を広めました。e^{iθ} = cos θ + i sin θ という「オイラーの公式」も有名です。",
      "解析学・数論・グラフ理論など幅広い分野を切り開きました。橋を一筆書きできるかを論じた「ケーニヒスベルクの橋」の問題は、グラフ理論の出発点とされます。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "daniel-bernoulli",
        "gauss"
      ],
      "lessons": [
        "sigma-notation",
        "geometric-series-sum"
      ],
      "labs": [
        "sigma-stairs-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Euler/"
    }
  },
  {
    "id": "gauss",
    "name": "カール・フリードリヒ・ガウス",
    "reading": "Carl Friedrich Gauss",
    "era": "1777–1855",
    "region": "ドイツ",
    "achievement": "整数論を一分野にまとめ、「数学の王」と呼ばれた",
    "portrait": {
      "src": "assets/img/portraits/gauss.webp",
      "alt": "ガウスのイメージイラスト",
      "caption": "カール・フリードリヒ・ガウス（1777–1855）"
    },
    "profile": [
      "ドイツの数学者・天文学者・物理学者で、その広さと深さから「数学の王」とも称されます。",
      "少年時代に 1 から 100 までの和を、両端を組にする工夫ですばやく求めたという逸話が伝えられます。"
    ],
    "contributions": [
      "著書『整数論考究』で、合同（あまりの等しさ）を軸に整数の性質を体系化し、数論を一つの分野としてまとめ上げました。平方剰余の相互法則もこの中にあります。",
      "最小二乗法による観測データの処理、正十七角形が定規とコンパスで作図できることの発見、複素数を平面上の点として扱う見方など、多方面に成果を残しました。"
    ],
    "related": {
      "stories": [
        "gauss-patterns-in-integers"
      ],
      "figures": [
        "euler",
        "riemann",
        "cauchy"
      ],
      "lessons": [
        "prime-factorization",
        "arithmetic-sequences"
      ],
      "labs": [
        "sigma-stairs-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/"
    }
  },
  {
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
  },
  {
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
  },
  {
    "id": "de-morgan",
    "name": "オーガスタス・ド・モルガン",
    "reading": "Augustus De Morgan",
    "era": "1806–1871",
    "region": "イギリス（インド生まれ）",
    "achievement": "論理を記号で扱い、集合の「ド・モルガンの法則」を残した",
    "portrait": {
      "src": "assets/img/portraits/de-morgan.webp",
      "alt": "ド・モルガンのイメージイラスト",
      "caption": "オーガスタス・ド・モルガン（1806–1871）"
    },
    "profile": [
      "インドで生まれ、イギリスで学び、ロンドン大学（ユニバーシティ・カレッジ）で最初の数学教授を務めました。",
      "論理学と代数を結びつける研究で、ブールと並んで記号論理の発展に貢献しました。"
    ],
    "contributions": [
      "「かつ・または・でない」を記号で扱う論理の代数化を進めました。集合や論理で「和の補は補の積、積の補は補の和」となる関係は「ド・モルガンの法則」と呼ばれます。",
      "数学的帰納法という用語を広めるなど、数学の議論の言葉を整える役割も果たしました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "boole",
        "cantor"
      ],
      "lessons": [
        "sets-propositions",
        "venn-diagrams",
        "logic-converse"
      ],
      "labs": [
        "venn-lab",
        "set-sort-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/De_Morgan/"
    }
  },
  {
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
  },
  {
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
  },
  {
    "id": "nightingale",
    "name": "フローレンス・ナイチンゲール",
    "reading": "Florence Nightingale",
    "era": "1820–1910",
    "region": "イギリス",
    "achievement": "統計を図で示し、データで政策を動かした先駆者",
    "portrait": {
      "src": "assets/img/portraits/nightingale.webp",
      "alt": "ナイチンゲールのイメージイラスト",
      "caption": "フローレンス・ナイチンゲール（1820–1910）"
    },
    "profile": [
      "「近代看護の母」として知られるイギリスの看護師・社会改革者です。クリミア戦争での看護活動で有名になりました。",
      "統計にも深い関心を持ち、女性として初めて王立統計協会の会員に選ばれました。"
    ],
    "contributions": [
      "戦地での死因の多くが、負傷そのものより不衛生による病気であることを統計で示しました。データにもとづいて衛生状態の改善を訴え、多くの命を救いました。",
      "月ごとの死因を色分けした「鶏頭図（ローズダイアグラム）」など、数字を一目でわかる図にして人を説得する工夫をしました。データ可視化の先駆けです。"
    ],
    "related": {
      "stories": [
        "nightingale-data-for-explanation"
      ],
      "figures": [],
      "lessons": [
        "data",
        "data-analysis-i",
        "box-plots"
      ],
      "labs": [
        "box-plot-lab",
        "data-spread-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Nightingale/"
    }
  },
  {
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
  },
  {
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
  },
  {
    "id": "peano",
    "name": "ジュゼッペ・ペアノ",
    "reading": "Giuseppe Peano",
    "era": "1858–1932",
    "region": "イタリア",
    "achievement": "自然数を公理で定義し、数学を記号で厳密に書く道を開いた",
    "portrait": {
      "src": "assets/img/portraits/peano.webp",
      "alt": "ペアノのイメージイラスト",
      "caption": "ジュゼッペ・ペアノ（1858–1932）"
    },
    "profile": [
      "イタリアの数学者・論理学者で、トリノ大学で教えました。",
      "数学の主張を記号で正確に書き表す「記号論理」の発展に力を尽くしました。"
    ],
    "contributions": [
      "自然数を「0 と、次の数をつくる操作」から少数の約束（公理）で定義する「ペアノの公理」を示しました。数の体系を土台から組み立てる出発点です。",
      "「∈（属する）」など集合・論理の記号を整え、数学を厳密な記号で書く形式化を大きく進めました。"
    ],
    "related": {
      "stories": [],
      "figures": [
        "cantor",
        "boole"
      ],
      "lessons": [
        "sets-propositions",
        "number-classification",
        "mathematical-induction"
      ],
      "labs": [
        "set-sort-lab"
      ]
    },
    "source": {
      "publisher": "MacTutor History of Mathematics（セント・アンドルーズ大学）",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Peano/"
    }
  }
];

export const figureCatalog = Object.fromEntries(figures.map((figure) => [figure.id, figure]));
