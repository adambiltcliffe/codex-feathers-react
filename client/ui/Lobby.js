import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";

import { lobbyActions } from "../features/lobby/slice";
import { getAllGames } from "../features/lobby/selectors";

function Lobby(props) {
  const dispatch = useDispatch();
  const games = useSelector(getAllGames);
  useEffect(() => {
    dispatch(lobbyActions.openLobby());
    return () => {
      dispatch(lobbyActions.closeLobby());
    };
  }, []);
  const gameRows = games
    ? games.map(g => <div key={g._id}>{JSON.stringify(g)}</div>)
    : null;
  return (
    <>
      <div>This is the lobby.</div>
      {gameRows}
    </>
  );
}

export default Lobby;
