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
  return `Turn ${displayedTurn} (${activePlayerName}) - phase ${phase}`;
}
