// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "nightingale-data-for-explanation",
    type: "history",
    menuTitle: "ナイチンゲールと統計",
    title: "数字を図にして説明する：ナイチンゲールと統計",
    lead: "統計は平均を計算して終わりではなく、集めたデータから違いを見つけ、他の人へ根拠を示すためにも使われます。",
    portraits: [
      { src: "assets/img/portraits/nightingale.webp", alt: "ナイチンゲールのイメージイラスト", caption: "フローレンス・ナイチンゲール（1820–1910）" },
    ],
    lessonIds: ["data", "data-analysis-i"],
    labIds: ["data-spread-lab"],
    practiceIds: ["data-summary", "data-analysis"],
    sections: [
      { heading: "データを集める", body: "ナイチンゲールはクリミア戦争後、軍病院の死亡に関する記録を統計として調べました。" },
      { heading: "図で伝える", body: "原因別の死亡を極座標面積図で表し、数字の差を政府や軍へ説明する材料にしました。" },
      { heading: "この単元との接続", body: "代表値と散らばりを計算し、対象・単位・比較条件を添えて図にすると、傾向を確かめやすくなります。" },
    ],
    sources: [
      { title: "Florence Nightingale: The pioneer statistician", publisher: "Science Museum", url: "https://www.sciencemuseum.org.uk/objects-and-stories/florence-nightingale-pioneer-statistician" },
    ],
    factCheck: { status: "checked", note: "図だけで改革が決まったとはせず、統計を説明材料として用いた範囲で記述しました。" },
  };
