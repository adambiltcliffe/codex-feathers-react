// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { callingParams } = require("feathers-hooks-common");
const errors = require("@feathersjs/errors");
const { default: CodexGame } = require("@adam.biltcliffe/codex");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const internalCallParams = {
      ...callingParams()(context),
      provider: undefined
    };
    const game = await context.app
      .service("games")
      .get(context.data.game, internalCallParams);
    if (!game.started) {
      throw new errors.Unprocessable("Game not started.");
    }
    if (game.nextStep != context.data.index) {
      throw new errors.Unprocessable("Incorrect index.");
    }
    if (game.activePlayer != context.params.user._id) {
      throw new errors.Unprocessable("Not the active player in that game.");
    }
    try {
      CodexGame.checkAction(game.currentState, context.data.action);
    } catch (e) {
      throw new errors.Unprocessable(e);
    }
    return context;
  };
};
