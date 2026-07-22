// 数学者図鑑（figures）データ。肖像イラストと、事実に基づくプロフィール・数学的な貢献をまとめる。
// 一覧では portrait / name / achievement を、詳細では profile / contributions と関連リンクを使う。
// 肖像は史料をもとにした親しみやすいデフォルメ表現で、厳密な肖像資料ではない。
// related には既存の読み物(stories)・単元(lessons)・図解(labs)・他の数学者(figures)の id を入れる。
// 本文中の数式は MathJax の TeX 記法（\\( ... \\)）で書く。era は生没年、region は主な活動地域。
// 数学者は1人1ファイル（figures/<id>.js）。ここは import と一覧・カタログの合成だけを持つ。
import { figure as pythagoras } from "./figures/pythagoras.js";
import { figure as euclid } from "./figures/euclid.js";
import { figure as archimedes } from "./figures/archimedes.js";
import { figure as alKhwarizmi } from "./figures/al-khwarizmi.js";
import { figure as alBattani } from "./figures/al-battani.js";
import { figure as recorde } from "./figures/recorde.js";
import { figure as descartes } from "./figures/descartes.js";
import { figure as fermat } from "./figures/fermat.js";
import { figure as pascal } from "./figures/pascal.js";
import { figure as sekiTakakazu } from "./figures/seki-takakazu.js";
import { figure as newton } from "./figures/newton.js";
import { figure as leibniz } from "./figures/leibniz.js";
import { figure as deMoivre } from "./figures/de-moivre.js";
import { figure as taylor } from "./figures/taylor.js";
import { figure as maclaurin } from "./figures/maclaurin.js";
import { figure as bayes } from "./figures/bayes.js";
import { figure as danielBernoulli } from "./figures/daniel-bernoulli.js";
import { figure as euler } from "./figures/euler.js";
import { figure as gauss } from "./figures/gauss.js";
import { figure as cauchy } from "./figures/cauchy.js";
import { figure as abel } from "./figures/abel.js";
import { figure as deMorgan } from "./figures/de-morgan.js";
import { figure as galois } from "./figures/galois.js";
import { figure as boole } from "./figures/boole.js";
import { figure as nightingale } from "./figures/nightingale.js";
import { figure as riemann } from "./figures/riemann.js";
import { figure as cantor } from "./figures/cantor.js";
import { figure as peano } from "./figures/peano.js";

export const figures = [
  pythagoras,
  euclid,
  archimedes,
  alKhwarizmi,
  alBattani,
  recorde,
  descartes,
  fermat,
  pascal,
  sekiTakakazu,
  newton,
  leibniz,
  deMoivre,
  taylor,
  maclaurin,
  bayes,
  danielBernoulli,
  euler,
  gauss,
  cauchy,
  abel,
  deMorgan,
  galois,
  boole,
  nightingale,
  riemann,
  cantor,
  peano,
];

export const figureCatalog = Object.fromEntries(figures.map((figure) => [figure.id, figure]));
