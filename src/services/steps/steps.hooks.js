const { authenticate } = require("@feathersjs/authentication").hooks;
const {
  alterItems,
  disallow,
  iff,
  isProvider,
  keep
} = require("feathers-hooks-common");
const pick = require("lodash/pick");

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
      iff(
        isProvider("external"),
        alterItems((item, context) => {
          item.newInfos = pick(item.newInfos, [context.params.user._id]);
        })
      )
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
