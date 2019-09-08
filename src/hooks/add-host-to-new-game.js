// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    const params = callingParams()(context);
    await context.app
      .service("players")
      .create({ game: context.result._id, seat: "0" }, params);
    return context;
  };
};
