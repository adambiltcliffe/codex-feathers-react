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

const validateRemovePlayer = require("../../hooks/validate-remove-player");
const checkGameExists = require("../../hooks/check-game-exists");

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      context => {
        console.log(context.params);
      },
      keep("game", "seat"),
      required("game", "seat"),
      alterItems((data, context) => {
        data.user = context.params.user._id;
        data.seat = String(data.seat);
        data.key = `${data.game}/${data.seat}`;
      }),
      validate(data => {
        if (data.seat != "0" && data.seat != "1") {
          return { seat: "Illegal seat number" };
        }
      }),
      checkGameExists()
    ],
    update: [disallow()],
    patch: [disallow()],
    remove: [restrictToOwner({ ownerField: "user" }), validateRemovePlayer()]
  },

  after: {
    all: [discard("key")],
    find: [],
    get: [],
    create: [],
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
