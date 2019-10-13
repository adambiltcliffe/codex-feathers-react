const { authenticate } = require("@feathersjs/authentication").hooks;
const { protect } = require("@feathersjs/authentication-local").hooks;
const { restrictToOwner } = require("feathers-authentication-hooks");
const {
  alterItems,
  disallow,
  fastJoin,
  iff,
  isProvider,
  keep,
  paramsFromClient,
  setNow
} = require("feathers-hooks-common");

const keyBy = require("lodash/keyBy");

const cascadeRemoveGame = require("../../hooks/cascade-remove-game");
const disallowIfStarted = require("../../hooks/disallow-if-started");
const addHostToNewGame = require("../../hooks/add-host-to-new-game");

const { newInfoForUser } = require("../../util");

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

const stepDetailResolvers = {
  joins: {
    steps: {
      resolver: () => async (record, context) => {
        record.steps = keyBy(
          await context.app
            .service("steps")
            .find({ query: { game: record._id } }),
          "index"
        );
        Object.values(record.steps).forEach(s => {
          s.newInfo = newInfoForUser(s.newInfos, context.params.user._id);
          delete s.newInfos;
        });
      }
    }
  }
};

module.exports = {
  before: {
    all: [authenticate("jwt"), paramsFromClient("includeSteps")],
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
    remove: [restrictToOwner({ ownerField: "host" }), disallowIfStarted()]
  },

  after: {
    all: [fastJoin(resolvers), protect("currentState")],
    find: [],
    get: [iff(ctx => ctx.params.includeSteps, fastJoin(stepDetailResolvers))],
    create: [addHostToNewGame()],
    update: [],
    patch: [],
    remove: [cascadeRemoveGame()]
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
