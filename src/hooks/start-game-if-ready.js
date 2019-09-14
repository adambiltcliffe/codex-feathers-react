// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const params = callingParams()(context);
    const players = await context.app
      .service("players")
      .find({ query: { game: context.result.game }, ...params });
    if (players.length == 2 && players.every(p => p.ready)) {
      await context.app.service("games").patch(
        context.result.game,
        { started: true },
        // must be an internal call or will get rejected
        { ...params, provider: undefined }
      );
    }
    return context;
  };
};
