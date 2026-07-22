// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "al-battani-trigonometry",
    type: "history",
    menuTitle: "天文学と三角法",
    title: "星の位置を計算する：アル＝バッターニーと三角法",
    lead: "三角比は、教室の直角三角形だけの計算ではありません。直接手が届かない天体の位置や動きを、角度と比から調べる必要にも支えられてきました。",
    portraits: [
      { src: "assets/img/portraits/al-battani.webp", alt: "アル＝バッターニーのイメージイラスト", caption: "アル＝バッターニー（858頃–929）" },
    ],
    lessonIds: ["trig-ratios", "sine-cosine-rule"],
    labIds: ["trig-lab"],
    practiceIds: ["trig", "sine-cosine-rule"],
    sections: [
      { heading: "観測した値を結ぶ", body: "アル＝バッターニーは9〜10世紀に天体を観測し、星・月・惑星などの位置や動きを詳しく調べました。" },
      { heading: "三角法を計算に使う", body: "その天文書では三角関数を計算の道具として用い、直角三角形に関する公式も示しました。" },
      { heading: "この単元との接続", body: "測れる角度と長さの比を使えば、直接測れない辺や距離を計算できます。まずは図の辺と角の対応から始めます。" },
    ],
    sources: [
      { title: "Al-Battani (c. 858–929)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Al-Battani/" },
    ],
    factCheck: { status: "checked", note: "天体観測、三角関数の利用、直角三角形の公式に限定し、近代的三角法の単独発明とは記述していません。" },
  };
