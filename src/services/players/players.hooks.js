const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");
const {
  alterItems,
  disallow,
  discard,
  keep,
  required,
  validate
} = require("feathers-hooks-common");

const disallowIfGameStarted = require("../../hooks/disallow-if-game-started");
const validateRemovePlayer = require("../../hooks/validate-remove-player");
const checkGameExists = require("../../hooks/check-game-exists");
const startGameIfReady = require("../../hooks/start-game-if-ready");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      keep("game", "seat"),
      required("game", "seat"),
      alterItems((data, context) => {
        data.user = context.params.user._id;
        data.seat = String(data.seat);
        data.key = `${data.game}/${data.seat}`;
        data.ready = false;
      }),
      validate(data => {
        if (data.seat != "0" && data.seat != "1") {
          return { seat: "Illegal seat number" };
        }
      }),
      checkGameExists()
    ],
    update: [disallow()],
    patch: [
      disallowIfGameStarted(),
      keep("ready"),
      alterItems((data, context) => {
        data.ready = String(data.ready) == "true";
      })
    ],
    remove: [restrictToOwner({ ownerField: "user" }), validateRemovePlayer()]
  },

  after: {
    all: [discard("key")],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [startGameIfReady()],
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
