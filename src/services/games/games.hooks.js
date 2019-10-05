const { authenticate } = require("@feathersjs/authentication").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");
const {
  alterItems,
  disallow,
  discard,
  fastJoin,
  iff,
  isProvider,
  keep,
  setNow
} = require("feathers-hooks-common");

const keyBy = require("lodash/keyBy");

const disallowIfStarted = require("../../hooks/disallow-if-started");
const addHostToNewGame = require("../../hooks/add-host-to-new-game");

const resolvers = {
  joins: {
    players: {
      resolver: () => async (record, context) => {
        record.players = keyBy(
          await context.app
            .service("players")
            .find({ query: { game: record._id } }),
          "seat"
        );
        return record.players;
      },
      joins: {
        usernames: () => async (records, context) => {
          await Promise.all(
            Object.values(records).map(async r => {
              r.username = (await context.app
                .service("users")
                .get(r.user)).username;
            })
          );
        }
      }
    }
  }
};

module.exports = {
  before: {
    all: [authenticate("jwt")],
    find: [],
    get: [],
    create: [
      keep("comment"),
      setNow("createdAt"),
      setNow("updatedAt"),
      alterItems((item, context) => {
        item.host = context.params.user._id;
        item.started = false;
      })
    ],
    update: [disallow()],
    patch: [
      setNow("updatedAt"),
      iff(
        isProvider("external"),
        restrictToOwner({ ownerField: "host" }),
        keep("comment"),
        disallowIfStarted()
      )
    ],
    remove: [disallow()]
  },

  after: {
    all: [
      iff(isProvider("external"), discard("currentState")),
      fastJoin(resolvers)
    ],
    find: [],
    get: [],
    create: [addHostToNewGame()],
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
