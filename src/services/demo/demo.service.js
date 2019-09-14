// Initializes the `demo` service on path `/demo`
const { Demo } = require("./demo.class");
const hooks = require("./demo.hooks");

module.exports = function(app) {
  const paginate = app.get("paginate");

  const options = {
    paginate
  };

  const middleware = (req, res) => {
    res.format({
      "text/plain": function() {
        res.end(res.data);
      }
    });
  };

  // Initialize our service with any options it requires
  app.use("/demo", new Demo(options, app), middleware);

  // Get our initialized service so that we can register hooks
  const service = app.service("demo");

  service.hooks(hooks);
};
