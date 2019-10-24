export const canAct = s =>
  s.game.current &&
  s.game.states &&
  s.game.states.length == s.game.current.nextStep;
export const playerCanAct = s => userId =>
  canAct(s) && userId == s.game.current.activePlayer;

export const getGame = s => s.game.current;
export const getMaxIndex = s =>
  Math.max(s.game && s.game.states ? s.game.states.length - 1 : 1, 1);
export const getShownIndex = s => s.game.shownIndex || 0;
export const getShownState = s => {
  return s.game.states && s.game.states[s.game.shownIndex];
};
export const isShowingLatestState = s =>
  s.game.states && s.game.shownIndex == s.game.states.length - 1;
export const canRewind = s => s.game.shownIndex > 0;
export const canAdvance = s =>
  s.game.states && s.game.shownIndex < s.game.states.length - 1;
