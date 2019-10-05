// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require("@feathersjs/errors");
const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const params = callingParams()(context);
    const current = await context.app
      .service("players")
      .get(context.id, params);
    const game = await context.app.service("games").get(current.game, params);
    if (game.started) {
      throw new errors.Unprocessable("Game already started.");
    }
    return context;
  };
};
