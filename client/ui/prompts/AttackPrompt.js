import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

import upperFirst from "lodash/upperFirst";

function AttackPrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const tree = useMemo(() => CodexGame.interface.legalAttackActionTree(state), [
    state
  ]);
  const attackers = useMemo(() => Object.keys(tree), [tree]);
  if (attackers.length == 0) {
    return null;
  }
  const [currentAttacker, setCurrentAttacker] = useState(attackers[0]);
  const [currentTarget, setCurrentTarget] = useState(tree[attackers[0]]);
  useEffect(() => {
    if (!tree[currentAttacker].includes(currentTarget)) {
      setCurrentTarget(tree[currentAttacker][0]);
    }
  }, [tree, currentAttacker, currentTarget]);
  const handleChangeAttacker = useCallback(e => {
    setCurrentAttacker(e.target.value);
  }, []);
  const handleChangeTarget = useCallback(e => {
    setCurrentTarget(e.target.value);
  });
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(
        gameActions.act({
          type: "attack",
          attacker: currentAttacker,
          target: currentTarget
        })
      );
    },
    [currentAttacker, currentTarget]
  );
  return (
    <>
      <Panel.Block>
        <Container>
          <div>Attack with:</div>
          <div className="select">
            <select
              defaultValue={currentAttacker}
              onChange={handleChangeAttacker}
            >
              {attackers.map(id => (
                <option key={id} value={id}>
                  {state.entities[id].current.name}
                </option>
              ))}
            </select>
          </div>
          <div>against:</div>
          <div className="select">
            <select defaultValue={currentTarget} onChange={handleChangeTarget}>
              {tree[currentAttacker].map(id => (
                <option key={id} value={id}>
                  {state.entities[id].current.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            onClick={handleSubmit}
          >
            Attack
          </button>
        </Container>
      </Panel.Block>
    </>
  );
}

export default AttackPrompt;
