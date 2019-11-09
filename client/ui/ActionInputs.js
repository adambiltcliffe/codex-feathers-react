import CodexGame from "@adam.biltcliffe/codex";

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { gameActions } from "../features/game/slice";

import { Box, Panel } from "react-bulma-components";

import QueuePrompt from "./prompts/QueuePrompt";
import ChoicePrompt from "./prompts/ChoicePrompt";
import DebugActionInput from "./DebugActionInput";
import ActivatePrompt from "./prompts/ActivatePrompt";
import AttackPrompt from "./prompts/AttackPrompt";
import BuildPrompt from "./prompts/BuildPrompt";
import EndTurnPrompt from "./prompts/EndTurnPrompt";
import LevelPrompt from "./prompts/LevelPrompt";
import PlayPrompt from "./prompts/PlayPrompt";
import SummonPrompt from "./prompts/SummonPrompt";
import WorkerPrompt from "./prompts/WorkerPrompt";

const ActionInputs = React.memo(props => {
  const { state } = props;
  const debug = useSelector(s => s.debug);
  if (debug) {
    return <DebugActionInput state={state} />;
  }
  const rat = CodexGame.interface.requiredActionType(state);
  if (rat == "queue") {
    return <QueuePrompt state={state} />;
  } else if (rat == "choice") {
    return <ChoicePrompt state={state} />;
  }
  return (
    <Panel>
      <WorkerPrompt state={state} />
      <AttackPrompt state={state} />
      <ActivatePrompt state={state} />
      <PlayPrompt state={state} />
      <SummonPrompt state={state} />
      <LevelPrompt state={state} />
      <BuildPrompt state={state} />
      <EndTurnPrompt state={state} />
    </Panel>
  );
});

export default ActionInputs;
