const app = require("../../src/app");

describe("'steps' service", () => {
  it("registered the service", () => {
    const service = app.service("steps");
    expect(service).toBeTruthy();
  });
});
