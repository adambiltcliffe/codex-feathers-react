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
    await context.app
      .service("games")
      .patch(context.result.game, { updatedAt: Date.now() }, internalCallParams)
      .catch(err => {
        // swallow 404s here because its possible the game was just deleted
        if (err.code != 404) {
          throw err;
        }
      });
    return context;
  };
};
