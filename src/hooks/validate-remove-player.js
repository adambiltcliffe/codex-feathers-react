// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require("@feathersjs/errors");
const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const params = callingParams()(context);
    const current = await context.service.get(context.id, params);
    if (current.seat == "0") {
      throw new errors.BadRequest("Cannot leave a game you are hosting.");
    }
    console.log(Object.keys(context));
    const game = await context.app.service("games").get(current.game, params);
    if (game.started) {
      throw new errors.BadRequest("Game already started.");
    }
    return context;
  };
};
