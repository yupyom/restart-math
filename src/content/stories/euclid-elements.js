// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "euclid-elements",
    type: "history",
    menuTitle: "ユークリッド『原論』",
    title: "定義から一段ずつ積み上げる：ユークリッドの『原論』",
    lead: "数学の証明は、答えを知っている人だけの話術ではありません。出発点を共有し、前に確かめたことだけを使って結論まで進むための記録です。",
    portraits: [
      { src: "assets/img/portraits/euclid.webp", alt: "ユークリッドのイメージイラスト", caption: "ユークリッド（紀元前300年ごろ）" },
    ],
    lessonIds: ["geometry", "geometry-a", "math-human-activities"],
    labIds: ["geometry-properties-lab", "euclidean-algorithm-lab"],
    practiceIds: ["geometry-basics", "geometry-properties", "number-theory"],
    sections: [
      { heading: "順序立ててまとめる", body: "紀元前300年ごろのユークリッドの『原論』は、定義と公準から図形や整数の結果を順序立ててまとめました。多くの結果は先人の仕事も取り込んでいます。" },
      { heading: "図形だけではない", body: "『原論』には平面・立体図形だけでなく、整数や最大公約数を求める方法に関わる内容も含まれます。" },
      { heading: "この単元との接続", body: "図の見た目で決めず、条件・すでに分かっている定理・結論を分けて読むことが、証明を一段ずつ追う第一歩です。" },
    ],
    sources: [
      { title: "Euclid of Alexandria", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Euclid/" },
    ],
    factCheck: { status: "checked", note: "『原論』の構成と範囲を説明し、収録された結果をすべてユークリッド自身の発見とはしていません。" },
  };
