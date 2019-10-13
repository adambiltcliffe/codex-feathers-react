const { authenticate } = require("@feathersjs/authentication").hooks;
const { protect } = require("@feathersjs/authentication-local").hooks;
const {
  alterItems,
  disallow,
  iff,
  isProvider,
  keep
} = require("feathers-hooks-common");

const validateCreateStep = require("../../hooks/validate-create-step");
const generateStepResult = require("../../hooks/generate-step-result");
const updateGameAfterStep = require("../../hooks/update-game-after-step");
const updateTimestampOnGame = require("../../hooks/update-timestamp-on-game");

const { newInfoForUser } = require("../../util");

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
          item.newInfo = newInfoForUser(item.newInfos, context.params.user._id);
        })
      ),
      protect("newInfos")
    ],
    find: [],
    get: [],
    create: [updateTimestampOnGame(), updateGameAfterStep()],
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
