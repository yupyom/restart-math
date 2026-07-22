// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "recorde-equal-sign",
    type: "history",
    menuTitle: "レコードと等号",
    title: "二本の線で「同じ」を書く：ロバート・レコードと等号",
    lead: "いまでは当たり前の等号も、初めから世界共通だったわけではありません。記号は、長い説明を短く共有するために育ってきました。",
    portraits: [
      { src: "assets/img/portraits/recorde.webp", alt: "ロバート・レコードのイメージイラスト", caption: "ロバート・レコード（1512頃–1558）" },
    ],
    lessonIds: ["linear-equations", "equation-modeling", "identities-equations"],
    labIds: ["equation-lab"],
    practiceIds: ["equation", "identities"],
    sections: [
      { heading: "文章で書いていた", body: "等しいことを言葉で書き続けると、計算のどこが左右の比較なのか見えにくくなります。" },
      { heading: "1557年の等号", body: "ウェールズの医師・数学者ロバート・レコードは、1557年の著書で長さの等しい二本線を等号として用いました。ただし、この記号はすぐ全員に広まったわけではありません。" },
      { heading: "この単元との接続", body: "\\(=\\) は『答えを書く合図』ではなく、左右が同じ量だという主張です。方程式でも恒等式でも、この意味は変わりません。" },
    ],
    sources: [
      { title: "Robert Recorde (c. 1512–1558)", publisher: "MacTutor History of Mathematics, University of St Andrews", url: "https://mathshistory.st-andrews.ac.uk/Biographies/Recorde/" },
    ],
    factCheck: { status: "checked", note: "1557年の著書での等号使用と、記号が直ちに定着しなかった点を出典の範囲で記述しました。" },
  };
