// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const internalCallParams = {
      ...callingParams()(context),
      provider: undefined
    };
    const state = context.params.newState;
    const ap = state.playerList[state.activePlayerIndex];
    await context.app.service("games").patch(
      context.result.game,
      {
        currentState: state,
        activePlayer: ap,
        nextStep: parseInt(context.result.index, 10) + 1
      },
      internalCallParams
    );
    return context;
  };
};
