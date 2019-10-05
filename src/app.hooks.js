const errors = require("@feathersjs/errors");

// Application hooks that run for every service

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
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
