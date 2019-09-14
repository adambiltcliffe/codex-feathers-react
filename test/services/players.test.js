const app = require("../../src/app");

describe("'players' service", () => {
  it("registered the service", () => {
    const service = app.service("players");
    expect(service).toBeTruthy();
  });

  it("starts the game when both players are ready", async () => {
    expect.assertions(2);
    const userInfo1 = {
      username: "a",
      email: "a@example.com",
      password: "a1"
    };
    const userInfo2 = {
      username: "b",
      email: "b@example.com",
      password: "b1"
    };
    const { _id: _id1 } = await app.service("users").create(userInfo1);
    const { _id: _id2 } = await app.service("users").create(userInfo2);
    const params1 = {
      provider: "rest",
      user: { ...userInfo1, _id: _id1 },
      authenticated: true
    };
    const params2 = {
      provider: "rest",
      user: { ...userInfo2, _id: _id2 },
      authenticated: true
    };
    const game = await app
      .service("games")
      .create({ comment: "test" }, params1);
    const p1s = await app
      .service("players")
      .find({ query: { game: game._id }, ...params1 });
    expect(p1s).toHaveLength(1);
    const p2 = await app
      .service("players")
      .create({ game: game._id, seat: "1" }, params2);
    await app.service("players").patch(p1s[0]._id, { ready: true }, params1);
    await app.service("players").patch(p2._id, { ready: true }, params2);
    const gameNow = await app.service("games").get(game._id, params1);
    expect(gameNow.started).toBeTruthy();
  });
});
