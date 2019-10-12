export const getAllGames = s => s.lobby.games;
export const getErrors = s => s.lobby.errors;

export const getSelectedGame = s => {
  return s.lobby.games ? s.lobby.games[s.lobby.selected] : undefined;
};
