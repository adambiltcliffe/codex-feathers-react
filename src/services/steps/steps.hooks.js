const { authenticate } = require("@feathersjs/authentication").hooks;
const { disallow, iff, isProvider, keep } = require("feathers-hooks-common");

const validateCreateStep = require("../../hooks/validate-create-step");
const generateStepResult = require("../../hooks/generate-step-result");

const updateGameAfterStep = require("../../hooks/update-game-after-step");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      keep("game", "action", "index"),
      iff(isProvider("external"), validateCreateStep()),
      generateStepResult()
    ],
    update: [disallow()],
    patch: [disallow()],
    remove: [disallow()]
  },

  after: {
    all: [
      // sanitise hidden information (from find or get)
    ],
    find: [],
    get: [],
    create: [updateGameAfterStep()],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
