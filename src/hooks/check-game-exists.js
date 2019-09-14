// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require("@feathersjs/errors");
const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    try {
      await context.app
        .service("games")
        .get(context.data.game, callingParams()(context));
      return context;
    } catch (e) {
      throw new errors.BadRequest("Game doesn't exist.");
    }
  };
};
