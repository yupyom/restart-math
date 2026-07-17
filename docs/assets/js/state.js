// 画面間で共有する表示状態。書き換えは各画面とルーターだけが行う。
export const state = {
  activeUnit: 0,
  activeLabId: "number-line-lab",
  activePracticeMode: "integer",
  activePracticeLevel: "starter",
  currentProblem: null,
  currentStepIndex: 0,
  activeMapPage: 0,
  activeLessonRange: null,
  activeStoryId: "shared-calculation-order",
  activeFigureId: "pythagoras",
};
