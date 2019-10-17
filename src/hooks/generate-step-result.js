// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { callingParams } = require("feathers-hooks-common");
const CodexGame = require("@adam.biltcliffe/codex").default;

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
    const { state, newInfos } = CodexGame.playAction(
      game.currentState,
      context.data.action
    );
    context.params.newState = state;
    context.data.newInfos = newInfos;
    return context;
  };
};
