// エントリポイント。各画面の初期化だけを行う。
import { setupContentMenuToggles, setupMathChoiceGroups } from "./utils.js";
import { setupLessons } from "./lessons-view.js";
import { setupAppliedLabs, setupBoxPlotLab, setupDistribution, setupEquation, setupEuclideanAlgorithmLab, setupGeometryPropertiesLab, setupGraph, setupInequalityLab, setupLabs, setupLatticePathLab, setupNumberLine, setupProbabilityLab, setupQuadraticVertex, setupRadicals, setupRangeValueLabels, setupSetSortLab, setupSigmaStairsLab, setupTerms, setupTriangleAngleLab, setupTrigLab, setupUnitSemicircleLab, setupVennLab } from "./labs-view.js";
import { setupPractice } from "./practice-view.js";
import { setupStories } from "./stories-view.js";
import { setupFigures } from "./figures-view.js";
import { setupMap } from "./map-view.js";
import { setupSearch } from "./search-view.js";
import { setupNavigation } from "./router.js";

export function init() {
  setupMathChoiceGroups();
  setupContentMenuToggles();
  setupLessons();
  setupNumberLine();
  setupInequalityLab();
  setupDistribution();
  setupRadicals();
  setupTerms();
  setupEquation();
  setupGraph();
  setupQuadraticVertex();
  setupTrigLab();
  setupProbabilityLab();
  setupSetSortLab();
  setupVennLab();
  setupTriangleAngleLab();
  setupGeometryPropertiesLab();
  setupEuclideanAlgorithmLab();
  setupUnitSemicircleLab();
  setupLatticePathLab();
  setupBoxPlotLab();
  setupSigmaStairsLab();
  setupAppliedLabs();
  setupRangeValueLabels();
  setupLabs();
  setupPractice();
  setupStories();
  setupFigures();
  setupMap();
  setupSearch();
  setupNavigation();
}

document.addEventListener("DOMContentLoaded", init);
