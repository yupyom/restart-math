// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "negative-numbers-have-direction",
    type: "rule",
    menuTitle: "負の数と向き",
    title: "負の数は、反対向きも表せる",
    lead: "負の数は 0 より小さい数であるだけでなく、基準からの反対向きや不足を表すための道具です。数直線を使うと、加減の意味が見えやすくなります。",
    lessonIds: ["integers-signs", "integer-rules"],
    labIds: ["number-line-lab"],
    practiceIds: ["integer"],
    sections: [
      {
        heading: "困る場面",
        body: "気温、海面からの高さ、収支のように、基準より上と下を同じ物差しで書きたい場面があります。自然数だけでは、反対側を一続きに表せません。",
      },
      {
        heading: "共有する約束",
        body: "数直線で右を正、左を負と決めます。\\(-3\\) に \\(5\\) を足すことは、左の 3 から右へ 5 進むことなので \\(2\\) になります。",
      },
      {
        heading: "小さな確認",
        body: "\\(-3-5\\) は、\\(-3\\) から左へさらに \\(5\\) 進みます。引く数の向きを反対にして足すと考えると、\\(-3+(-5)\\) と同じ動きになります。",
      },
    ],
    sources: [],
    factCheck: { status: "checked", note: "歴史的事実や統計値を含まない、数直線のモデルです。" },
  };
