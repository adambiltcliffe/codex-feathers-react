import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

import upperFirst from "lodash/upperFirst";

function describeLevelUp(entity, amount) {
  const newLevel = entity.level + amount;
  const suffix =
    newLevel == entity.current.midbandLevel
      ? " (midband)"
      : newLevel == entity.current.maxbandLevel
      ? " (maxband)"
      : "";
  return `To level ${newLevel}${suffix}`;
}

const LevelPrompt = React.memo(props => {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const tree = useMemo(() => CodexGame.interface.legalLevelActionTree(state), [
    state
  ]);
  const heroes = useMemo(() => Object.keys(tree), [tree]);
  if (heroes.length == 0) {
    return null;
  }
  const [currentHero, setCurrentHero] = useState(heroes[0]);
  const [currentAmount, setCurrentAmount] = useState(tree[heroes[0]][0]);
  useEffect(() => {
    if (!tree[currentHero].includes(currentAmount)) {
      setCurrentAmount(tree[currentHero][0]);
    }
  }, [tree, currentHero, currentAmount]);
  const handleChangeHero = useCallback(e => {
    setCurrentHero(e.target.value);
  }, []);
  const handleChangeAmount = useCallback(e => {
    setCurrentAmount(Number.parseInt(e.target.value));
  });
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(
        gameActions.act({
          type: "level",
          hero: currentHero,
          amount: currentAmount
        })
      );
    },
    [currentHero, currentAmount]
  );
  return (
    <>
      <Panel.Block>
        <Container>
          <div>Level up:</div>
          <div className="select">
            <select defaultValue={currentHero} onChange={handleChangeHero}>
              {heroes.map(id => (
                <option key={id} value={id}>
                  {upperFirst(state.entities[id].current.name)}
                </option>
              ))}
            </select>
          </div>
          <div className="select">
            <select defaultValue={currentAmount} onChange={handleChangeAmount}>
              {tree[currentHero].map(amount => (
                <option key={amount} value={amount}>
                  {describeLevelUp(state.entities[currentHero], amount)}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            onClick={handleSubmit}
          >
            Level up
          </button>
        </Container>
      </Panel.Block>
    </>
  );
});

export default LevelPrompt;
