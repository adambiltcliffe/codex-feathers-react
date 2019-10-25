import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

function getCardName(card) {
  return CodexGame.interface.getCardInfo(card).name;
}

function SummonPrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const acts = CodexGame.interface.legalSummonActions(state);
  if (acts.length == 0) {
    return null;
  }
  const [currentHero, setCurrentHero] = useState(acts[0].hero);
  const handleChange = useCallback(e => {
    setCurrentHero(e.target.value);
  }, []);
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(gameActions.act({ type: "summon", hero: currentHero }));
    },
    [currentHero]
  );
  return (
    <>
      <Panel.Block>
        <Container>
          Summon a hero:
          <div className="select">
            <select defaultValue={currentHero} onChange={handleChange}>
              {acts.map(a => (
                <option key={a.hero} value={a.hero}>
                  {getCardName(a.hero)}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            onClick={handleSubmit}
          >
            Summon
          </button>
        </Container>
      </Panel.Block>
    </>
  );
}

export default SummonPrompt;
