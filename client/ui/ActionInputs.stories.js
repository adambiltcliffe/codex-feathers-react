import React from "react";
import { Provider } from "react-redux";

import { TestGame } from "@adam.biltcliffe/codex";

import ActionInputs from "./ActionInputs";
import { Columns } from "react-bulma-components";
import { annotateDisplayNames } from "../util";
import { action } from "@storybook/addon-actions";
import ErrorBoundary from "./ErrorBoundary";

import { constants } from "@adam.biltcliffe/codex";

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
        <ErrorBoundary>
          <Columns>
            <Columns.Column size="one-fifth">{storyFn()}</Columns.Column>
          </Columns>
        </ErrorBoundary>
      </Provider>
    )
  ]
};

export const startOfGame = () => <ActionInputs state={testState1} />;

export const withEntities = () => <ActionInputs state={testState2} />;

// Queue prompt

const tgq = new TestGame();
tgq
  .insertEntities(p2id, [
    "helpful_turtle",
    "helpful_turtle",
    "starcrossed_starlet"
  ])
  .playAction({ type: "endTurn" });
const testStateQueue = annotateDisplayNames(tgq.state);

export const queueNewTriggers = () => <ActionInputs state={testStateQueue} />;

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

// Multiple-target choice prompt

const tgmt = new TestGame();
tgmt
  .insertEntities(p1id, [
    "river_montoya",
    "tenderfoot",
    "older_brother",
    "fruit_ninja"
  ])
  .putCardsInHand(p1id, ["two_step"])
  .playAction({ type: "play", card: "two_step" });
const testStateMultiTarget = annotateDisplayNames(tgmt.state);

export const multiTargetChoice = () => (
  <ActionInputs state={testStateMultiTarget} />
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

// Obliterate prompt

const tgob1 = new TestGame()
  .insertEntity(p1id, "pirate_gunship")
  .insertEntities(p2id, [
    "tenderfoot",
    "older_brother",
    "brick_thief",
    "eggship"
  ]);
const [pg1] = tgob1.insertedEntityIds;
tgob1.playAction({
  type: "attack",
  attacker: pg1,
  target: tgob1.findBaseId(p2id)
});
const testStateObliterate1 = annotateDisplayNames(tgob1.state);

export const obliterateUnforced = () => (
  <ActionInputs state={testStateObliterate1} />
);

const tgob2 = new TestGame()
  .insertEntity(p1id, "pirate_gunship")
  .insertEntities(p2id, [
    "iron_man",
    "tenderfoot",
    "sneaky_pig",
    "revolver_ocelot"
  ]);
const [pg2] = tgob2.insertedEntityIds;
tgob2.playAction({
  type: "attack",
  attacker: pg2,
  target: tgob2.findBaseId(p2id)
});
const testStateObliterate2 = annotateDisplayNames(tgob2.state);

export const obliterateForced = () => (
  <ActionInputs state={testStateObliterate2} />
);

// Codex choice prompt

const tgc = new TestGame();
tgc.setCodexBySpec(p1id, constants.specs.finesse);
tgc.playActions([{ type: "endTurn" }, { type: "endTurn" }]);
const testStateCodex = annotateDisplayNames(tgc.state);

export const codexChoice = () => <ActionInputs state={testStateCodex} />;
