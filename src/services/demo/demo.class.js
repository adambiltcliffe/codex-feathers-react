const CodexGame = require("@adam.biltcliffe/codex").default;
const fillTemplate = require("es6-dynamic-template");

/* eslint-disable no-unused-vars */
exports.Demo = class Demo {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    let result = "";
    let state = { playerList: ["player1", "player2"] };
    try {
      for (let n = 0; n < 1000; n++) {
        const acts = CodexGame.suggestActions(state);
        if (acts.length == 0) {
          result += state.result
            ? "The game is over."
            : "No available actions.";
          break;
        }
        const act = acts[Math.floor(Math.random() * acts.length)];
        state = CodexGame.playAction(state, act).state;
        state.log.forEach(line => {
          result += `${line}\n`;
        });
        result += "\n";
      }
    } catch (e) {
      result += "An error occurred.";
    }
    return fillTemplate(result, { player1: "Player 1", player2: "Player 2" });
  }
};
