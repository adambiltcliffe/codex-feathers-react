const CodexGame = require("@adam.biltcliffe/codex").default;

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
      return result;
    } catch (e) {
      result += "An error occurred.";
      return result;
    }
  }
};
