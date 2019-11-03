import CodexGame from "@adam.biltcliffe/codex";

import forEach from "lodash/forEach";
import produce from "immer";

export function annotateDisplayNames(state) {
  const counts = {};
  forEach(state.entities, e => {
    counts[e.current.name] = (counts[e.current.name] || 0) + 1;
  });
  return produce(state, draft => {
    forEach(draft.entities, e => {
      if (counts[e.current.name] > 1) {
        e.current.displayName = `${e.current.name} (#${e.id.substring(1)})`;
      } else {
        e.current.displayName = e.current.name;
      }
    });
  });
}

export function makeGameTitle(game) {
  return game.players[0]
    ? game.players[1]
      ? `${game.players[0].username} vs. ${game.players[1].username}`
      : `${game.players[0].username} (awaiting opponent)`
    : "(empty)";
}

export function makeTurnAndPhaseDescription(state, nameMap) {
  if (state === undefined || state === null) {
    return null;
  }
  const { turn, phase, activePlayerIndex, playerList } = state;
  const activePlayerName = nameMap[playerList[activePlayerIndex]];
  const displayedTurn = Math.floor(turn / playerList.length) + 1;
  const phaseName = CodexGame.interface.describePhase(phase);
  return `Turn ${displayedTurn} (${activePlayerName}) - ${phaseName}`;
}
