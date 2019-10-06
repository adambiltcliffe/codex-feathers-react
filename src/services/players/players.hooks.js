const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");
const {
  alterItems,
  disableMultiItemChange,
  disallow,
  discard,
  iff,
  isProvider,
  keep,
  required,
  validate
} = require("feathers-hooks-common");

const errors = require("@feathersjs/errors");

const disallowIfGameStarted = require("../../hooks/disallow-if-game-started");
const validateRemovePlayer = require("../../hooks/validate-remove-player");
const checkGameExistsAndNotPlaying = require("../../hooks/check-game-exists-and-not-playing");
const startGameIfReady = require("../../hooks/start-game-if-ready");
const updateTimestampOnGame = require("../../hooks/update-timestamp-on-game");

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
      checkGameExistsAndNotPlaying()
    ],
    update: [disallow()],
    patch: [
      disallowIfGameStarted(),
      keep("ready"),
      alterItems((data, context) => {
        data.ready = String(data.ready) == "true";
      })
    ],
    remove: [
      iff(
        isProvider("external"),
        restrictToOwner({ ownerField: "user" }),
        validateRemovePlayer()
      )
    ]
  },

  after: {
    all: [discard("key")],
    find: [],
    get: [],
    create: [updateTimestampOnGame()],
    update: [],
    patch: [updateTimestampOnGame(), startGameIfReady()],
    remove: [updateTimestampOnGame()]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [
      ctx => {
        if (ctx.error.errorType == "uniqueViolated") {
          ctx.error = new errors.Conflict(
            "That seat is already occupied.",
            ctx.error
          );
          return ctx;
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
  }
};
