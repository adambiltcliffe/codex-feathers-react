const { callingParams } = require("feathers-hooks-common");

module.exports = (options = {}) => {
  return async context => {
    const internalCallParams = {
      ...callingParams()(context),
      provider: undefined
    };
    // delete all player with game==context.result._id
    const toDelete = await context.app.service("players").find({
      ...internalCallParams,
      query: { game: context.result._id }
    });
    await Promise.all(
      toDelete.map(async r => {
        await context.app.service("players").remove(r._id, internalCallParams);
      })
    );
    return context;
  };
};
