// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require("@feathersjs/errors");
const { callingParams } = require("feathers-hooks-common");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    let game = null;
    try {
      game = await context.app
        .service("games")
        .get(context.data.game, callingParams()(context));
    } catch (e) {
      throw new errors.Unprocessable("Game doesn't exist.");
    }
    Object.entries(game.players).forEach(([k, player]) => {
      if (context.params.user._id == player.user) {
        throw new errors.Unprocessable("You've already joined that game.");
      }
    });
    return context;
  };
};
