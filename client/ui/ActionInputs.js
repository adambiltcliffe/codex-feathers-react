import CodexGame from "@adam.biltcliffe/codex";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { gameActions } from "../features/game/slice";

import { Box, Panel } from "react-bulma-components";

import ChoicePrompt from "./prompts/ChoicePrompt";
import DebugActionInput from "./DebugActionInput";
import ActivatePrompt from "./prompts/ActivatePrompt";
import AttackPrompt from "./prompts/AttackPrompt";
import BuildPrompt from "./prompts/BuildPrompt";
import PlayPrompt from "./prompts/PlayPrompt";
import SummonPrompt from "./prompts/SummonPrompt";
import WorkerPrompt from "./prompts/WorkerPrompt";

// eventually this should be replaced with a helper in CodexGame.interface
function requiredActionType(state) {
  if (state.newTriggers && state.newTriggers.length > 0) {
    return "queue";
  }
  if (state.currentTrigger) {
    return "choice";
  }
  return null;
}

const ActionInputs = React.memo(props => {
  const { state } = props;
  const debug = useSelector(s => s.debug);
  if (debug) {
    return <DebugActionInput state={state} />;
  }
  const rat = requiredActionType(state);
  if (rat) {
    return <ChoicePrompt state={state} />;
  }
  return (
    <Panel>
      <WorkerPrompt state={state} />
      <AttackPrompt state={state} />
      <ActivatePrompt state={state} />
      <PlayPrompt state={state} />
      <SummonPrompt state={state} />
      <Panel.Block>Level up a hero</Panel.Block>
      <BuildPrompt state={state} />
      <Panel.Block>End your turn</Panel.Block>
    </Panel>
  );
});

export default ActionInputs;
