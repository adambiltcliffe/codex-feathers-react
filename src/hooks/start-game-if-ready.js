// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { callingParams } = require("feathers-hooks-common");
const { knuthShuffle } = require("knuth-shuffle");
const { constants } = require("@adam.biltcliffe/codex");
const zipObject = require("lodash/zipObject");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const internalCallParams = {
      ...callingParams()(context),
      provider: undefined
    };
    const players = await context.app
      .service("players")
      .find({ query: { game: context.result.game }, ...internalCallParams });
    if (players.length == 2 && players.every(p => p.ready)) {
      const ids = players.map(p => p.user);
      knuthShuffle(ids);
      const specs = [[constants.specs.bashing], [constants.specs.finesse]];
      knuthShuffle(specs);
      const startState = { playerList: ids };
      await context.app
        .service("games")
        .patch(
          context.result.game,
          { started: true, startState, currentState: startState, nextStep: 0 },
          internalCallParams
        );
      const startingAction = {
        type: "start",
        specs: zipObject(ids, specs)
      };
      await context.app
        .service("steps")
        .create(
          { game: context.result.game, action: startingAction, index: 0 },
          internalCallParams
        );
    }
    return context;
  };
};
