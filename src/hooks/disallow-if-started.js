// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require("@feathersjs/errors");
const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const current = await context.service.get(
      context.id,
      callingParams()(context)
    );
    if (current.started) {
      throw new errors.BadRequest("Game already started.");
    }
    return context;
  };
};
