import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

import { produce } from "immer";

function realNull(value) {
  return value == "null" ? null : value;
}

const EndTurnPrompt = React.memo(props => {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const possiblePatrollers = useMemo(
    () => CodexGame.interface.legalPatrollers(state),
    [state]
  );
  const [currentAction, setCurrentAction] = useState({
    type: "endTurn",
    patrollers: [null, null, null, null, null]
  });
  // If we want to hide patrollers from appearing in more than one slot,
  // do it here
  const handleChangeSquadLeader = useCallback(
    e => {
      setCurrentAction(
        produce(currentAction, draft => {
          draft.patrollers[0] = realNull(e.target.value);
        })
      );
    },
    [currentAction]
  );
  const handleChangeElite = useCallback(
    e => {
      setCurrentAction(
        produce(currentAction, draft => {
          draft.patrollers[1] = realNull(e.target.value);
        })
      );
    },
    [currentAction]
  );
  const handleChangeScavenger = useCallback(
    e => {
      setCurrentAction(
        produce(currentAction, draft => {
          draft.patrollers[2] = realNull(e.target.value);
        })
      );
    },
    [currentAction]
  );
  const handleChangeTechnician = useCallback(
    e => {
      setCurrentAction(
        produce(currentAction, draft => {
          draft.patrollers[3] = realNull(e.target.value);
        })
      );
    },
    [currentAction]
  );
  const handleChangeLookout = useCallback(
    e => {
      setCurrentAction(
        produce(currentAction, draft => {
          draft.patrollers[4] = realNull(e.target.value);
        })
      );
    },
    [currentAction]
  );
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(gameActions.act(currentAction));
    },
    [currentAction]
  );
  const isLegal = useMemo(
    () => CodexGame.interface.isLegalAction(state, currentAction),
    [state, currentAction]
  );
  return (
    <>
      <Panel.Block>
        <Container>
          <div>Patrollers:</div>
          <div className="select">
            <select
              defaultValue={currentAction.patrollers[0]}
              onChange={handleChangeSquadLeader}
            >
              <option key={"null"} value={"null"}>
                No Squad Leader
              </option>
              {possiblePatrollers.map(id => (
                <option key={id} value={id}>
                  Squad Leader: {state.entities[id].current.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <select
              defaultValue={currentAction.patrollers[1]}
              onChange={handleChangeElite}
            >
              <option key={"null"} value={"null"}>
                No Elite
              </option>
              {possiblePatrollers.map(id => (
                <option key={id} value={id}>
                  Elite: {state.entities[id].current.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <select
              defaultValue={currentAction.patrollers[2]}
              onChange={handleChangeScavenger}
            >
              <option key={"null"} value={"null"}>
                No Scavenger
              </option>
              {possiblePatrollers.map(id => (
                <option key={id} value={id}>
                  Scavenger: {state.entities[id].current.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <select
              defaultValue={currentAction.patrollers[3]}
              onChange={handleChangeTechnician}
            >
              <option key={"null"} value={"null"}>
                No Technician
              </option>
              {possiblePatrollers.map(id => (
                <option key={id} value={id}>
                  Technician: {state.entities[id].current.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <select
              defaultValue={currentAction.patrollers[4]}
              onChange={handleChangeLookout}
            >
              <option key={"null"} value={"null"}>
                No Lookout
              </option>
              {possiblePatrollers.map(id => (
                <option key={id} value={id}>
                  Lookout: {state.entities[id].current.displayName}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            disabled={!isLegal}
            onClick={handleSubmit}
          >
            End Turn
          </button>
        </Container>
      </Panel.Block>
    </>
  );
});

export default EndTurnPrompt;
