import React from "react";
import { Provider } from "react-redux";

import { TestGame } from "@adam.biltcliffe/codex";

import EntityCard from "./EntityCard";
import { Columns } from "react-bulma-components";
import { annotateDisplayNames } from "../util";
import { action } from '@storybook/addon-actions';

const tg = new TestGame();
const [p1id, p2id] = tg.state.playerList;
tg.putHeroInCommandZone(p1id, "river_montoya").playAction({
  type: "summon",
  hero: "river_montoya"
});
const testState = annotateDisplayNames(tg.state);

const store = {
  getState: () => ({
    game: {
      players: [
        {
          user: p1id,
          username: "bob"
        },
        {
          user: p2id,
          username: "alf"
        }
      ]
    }
  }),
  subscribe: () => null,
  dispatch: action("dispatch")
};

export default {
  title: "EntityCard",
  decorators: [
    storyFn => (
      <Provider store={store}>
        <Columns>
          <Columns.Column size="one-fifth">{storyFn()}</Columns.Column>
        </Columns>
      </Provider>
    )
  ]
};

export const base = () => <EntityCard entity={testState.entities["e1"]} />;

export const constructing = () => (
  <EntityCard entity={{ constructing: "tower" }} />
);

export const hero = () => <EntityCard entity={testState.entities["e3"]} />;
