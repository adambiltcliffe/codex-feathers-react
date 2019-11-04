import React from "react";
import { Provider } from "react-redux";

import { TestGame } from "@adam.biltcliffe/codex";

import ActionInputs from "./ActionInputs";
import { Columns } from "react-bulma-components";
import { annotateDisplayNames } from "../util";
import { action } from "@storybook/addon-actions";

const tg = new TestGame();
const [p1id, p2id] = tg.state.playerList;
const testState1 = annotateDisplayNames(tg.state);

tg.setGold(p1id, 10)
  .putHeroInCommandZone(p1id, "jaina_stormborne")
  .insertEntities(p1id, [
    "troq_bashar",
    "iron_man",
    "eggship",
    "merfolk_prospector"
  ])
  .insertEntities(p2id, ["tenderfoot", "leaping_lizard"])
  .playActions([{ type: "endTurn" }, { type: "endTurn" }]);
const testState2 = annotateDisplayNames(tg.state);

const store = {
  getState: () => ({ game: { current: { pendingAction: false } } }),
  subscribe: () => null,
  dispatch: action("dispatch")
};

export default {
  title: "ActionInputs",
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

export const startOfGame = () => <ActionInputs state={testState1} />;

export const withEntities = () => <ActionInputs state={testState2} />;

// Single-target choice prompt

const tgst = new TestGame();
tgst
  .insertFixture(p2id, "tech2")
  .putCardsInHand(p1id, ["brick_thief"])
  .playAction({ type: "play", card: "brick_thief" });
const testStateSingleTarget = annotateDisplayNames(tgst.state);

export const singleTargetChoice = () => (
  <ActionInputs state={testStateSingleTarget} />
);

// Modal choice prompt

const tgmod = new TestGame();
tgmod.insertEntity(p1id, "river_montoya");
const [tgmodRiver] = tgmod.insertedEntityIds;
tgmod
  .modifyEntity(tgmodRiver, { controlledSince: -1, maxedSince: -1, level: 5 })
  .putCardsInHand(p1id, ["appel_stomp"])
  .playAction({ type: "play", card: "appel_stomp" });
const testStateModal = annotateDisplayNames(tgmod.state);

export const modalChoice = () => <ActionInputs state={testStateModal} />;
