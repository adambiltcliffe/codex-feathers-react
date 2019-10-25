const errors = require("@feathersjs/errors");
const {
  disallow,
  discardQuery,
  iff,
  isProvider,
  keep,
  required,
  setNow
} = require("feathers-hooks-common");

// Application hooks that run for every service

module.exports = {
  before: {
    all: [
      iff(isProvider("external"), ctx => {
        ctx.params.startTime = Date.now();
      })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      iff(isProvider("external"), ctx => {
        const elapsed = Date.now() - ctx.params.startTime;
        ctx.app.info(`External service call completed in ${elapsed}ms`);
      })
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [
      ctx => {
        if (ctx.error) {
          const error = ctx.error;
          if (error.code === undefined) {
            ctx.app.warn(`Unhandled error in app.error hook: ${error.message}`);
            ctx.app.debug(error.stack);
            const newError = new errors.GeneralError("server error", error);
            ctx.error = newError;
            return ctx;
          }
          if (process.env.NODE_ENV === "production") {
            error.stack = null;
          }
          error.hook = null;
          return ctx;
        }
      }
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
