import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gameActions } from "../../features/game/slice";
import { actionIsPending } from "../../features/game/selectors";

import { Container, Panel } from "react-bulma-components";

import CodexGame from "@adam.biltcliffe/codex";

function getCardName(card) {
  return CodexGame.interface.getCardInfo(card).name;
}

function PlayPrompt(props) {
  const { state } = props;
  const dispatch = useDispatch();
  const pending = useSelector(actionIsPending);
  const acts = CodexGame.interface.legalPlayActions(state);
  if (acts.length == 0) {
    return null;
  }
  const [currentCard, setCurrentCard] = useState(acts[0].card);
  const handleChange = useCallback(e => {
    setCurrentCard(e.target.value);
  }, []);
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      dispatch(gameActions.act({ type: "play", card: currentCard }));
    },
    [currentCard]
  );
  return (
    <>
      <Panel.Block>
        <Container>
          Play a card from your hand:
          <div className="select">
            <select defaultValue={currentCard} onChange={handleChange}>
              {acts.map(a => (
                <option key={a.card} value={a.card}>
                  {getCardName(a.card)}
                </option>
              ))}
            </select>
          </div>
          <button
            className={pending ? "button is-loading" : "button"}
            onClick={handleSubmit}
          >
            Play card
          </button>
        </Container>
      </Panel.Block>
    </>
  );
}

export default PlayPrompt;
