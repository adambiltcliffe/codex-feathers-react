const users = require('./users/users.service.js');
const games = require('./games/games.service.js');
const players = require('./players/players.service.js');
const steps = require('./steps/steps.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(games);
  app.configure(players);
  app.configure(steps);
};
