import fromPairs from "lodash/fromPairs";

import { createSelector } from "reselect";
import { createDeepEqualSelector } from "../../deep-equal-selector";

export const canAct = s =>
  s.game.current &&
  s.game.states &&
  s.game.states.length == s.game.current.nextStep;
export const playerCanAct = s => userId =>
  canAct(s) && userId == s.game.current.activePlayer;

export const isGameLoaded = s => (s.game.current ? true : false);
export const getComment = s => (s.game.current || {}).comment;
export const getMaxIndex = s =>
  Math.max(s.game && s.game.states ? s.game.states.length - 1 : 1, 1);
export const getShownIndex = s => s.game.shownIndex || 0;
export const getShownState = createSelector(
  s => s.game.states,
  getShownIndex,
  (history, index) => (history ? history[index] : undefined)
);
export const isShowingLatestState = s =>
  s.game.states && s.game.shownIndex == s.game.states.length - 1;
export const canRewind = s => s.game.shownIndex > 0;
export const canAdvance = s =>
  s.game.states && s.game.shownIndex < s.game.states.length - 1;

export const actionIsPending = s => s.game.pendingAction;
export const getPlayerList = createSelector(
  getShownState,
  state => (state ? state.playerList : [])
);
export const getUsernameMap = createDeepEqualSelector(
  s =>
    Object.values((s.game.current || {}).players || {}).map(p => [
      p.user,
      p.username
    ]),
  fromPairs
);
