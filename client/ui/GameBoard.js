import React from "react";
import {
  Box,
  Columns,
  Content,
  Notification,
  Panel
} from "react-bulma-components";
import EntityCard from "./EntityCard";

import chunk from "lodash/chunk";
import groupBy from "lodash/groupBy";

function PlayerGameBoardArea(props) {
  const { entities } = props;
  const rows = chunk(entities, 5);
  return (
    <>
      {rows.map(row => (
        <Columns key={row.map(e => e.id).join(",")}>
          {row.map(e => (
            <Columns.Column size="one-fifth" key={e.id}>
              <EntityCard entity={e} />
            </Columns.Column>
          ))}
        </Columns>
      ))}
    </>
  );
}

function PlayerGameBoard(props) {
  return <PlayerGameBoardArea entities={props.entities} />;
}

export default function GameBoard(props) {
  const { state } = props;
  const entities = Object.values(state.entities).concat(
    state.constructing.map(c => ({
      constructing: c,
      id: c,
      current: { controller: state.playerList[state.activePlayerIndex] }
    }))
  );
  const playerBoards = groupBy(entities, "current.controller");
  return (
    <>
      {Object.entries(playerBoards).map(([p, e]) => (
        <PlayerGameBoard key={p} entities={e} />
      ))}
    </>
  );
}
