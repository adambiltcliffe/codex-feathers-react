export const canAct = s =>
  s.game.current && s.game.states && s.game.states.length > 0;
export const playerCanAct = s => userId =>
  canAct(s) && userId == s.game.current.activePlayer;

export const getGame = s => s.game.current;
export const getShownIndex = s => s.game.shownIndex;
export const getShownState = s => {
  return s.game.states && s.game.states[s.game.shownIndex];
};
export const isShowingLatestState = s =>
  s.game.states && s.game.shownIndex == s.game.states.length - 1;
export const canRewind = s => s.game.shownIndex > 0;
export const canAdvance = s =>
  s.game.states && s.game.shownIndex < s.game.states.length - 1;
