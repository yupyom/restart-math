// 読み物データ（1件1ファイル）。編集後は npm run check。一覧は stories.js が合成する。
export const story = {
    id: "pacioli-recording-both-sides",
    type: "society",
    menuTitle: "パチョーリと簿記",
    title: "一つの取引を二方向から記録する：複式簿記",
    lead: "会計では利益の計算だけでなく、何が増え、代わりに何が減ったかを対応させて記録します。",
    lessonIds: ["functions", "exam-review"],
    labIds: ["accounting-balance-lab"],
    practiceIds: ["function-values", "distribute"],
    sections: [
      { heading: "商人の実務", body: "売買や支払いを確かめるには、現金・商品・借りた額などを別々の帳簿で追う必要があります。" },
      { heading: "パチョーリの記述", body: "1494年、パチョーリは当時使われていた複式簿記の方法を著書で説明しました。発明者と断定はしません。" },
      { heading: "この単元との接続", body: "売上・費用・利益を別の量として置き、等式の左右が対応するか確かめる姿勢は、式の検算にも通じます。" },
    ],
    sources: [
      { title: "Timeline of the history of ICAEW and the accountancy profession", publisher: "ICAEW", url: "https://www.icaew.com/library/historical-resources/timeline" },
      { title: "The Earliest Books on Bookkeeping", publisher: "ICAEW", url: "https://www.icaew.com/library/library-collection/historical-accounting-literature/earliest-books-on-bookkeeping" },
    ],
    factCheck: { status: "checked", note: "パチョーリを複式簿記の発明者とはせず、既存実務を印刷物で説明した人物として扱いました。" },
  };
