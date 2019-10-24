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

export default function GameBoard(props) {
  const { state } = props;
  const entities = Object.values(state.entities).concat(
    state.constructing.map(c => ({ constructing: c, id: c }))
  );
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
