// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const clone = require("lodash/clone");

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return context => {
    if (Array.isArray(context.result)) {
      context.dispatch = context.result.map(clone);
    } else if (context.result.data && context.method === "find") {
      context.dispatch = {
        ...context.result,
        data: clone(context.result.data)
      };
    } else {
      context.dispatch = clone(context.result);
    }
    return context;
  };
};
