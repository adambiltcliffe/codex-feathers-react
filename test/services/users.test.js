const app = require("../../src/app");

describe("'users' service", () => {
  const userInfo = {
    email: "test@example.com",
    password: "examplepassword"
  };

  beforeAll(async () => {
    try {
      await app.service("users").create(userInfo);
    } catch (error) {
      // Do nothing, it just means the user already exists and can be tested
    }
  });

  it("registered the service", () => {
    const service = app.service("users");
    expect(service).toBeTruthy();
  });

  it("doesn't leak the password", async () => {
    expect.assertions(2);
    const service = app.service("users");
    const params = {
      provider: "rest",
      authenticated: true
    };
    const pages = await service.find({
      query: { email: userInfo.email },
      ...params
    });
    expect(pages.data).toHaveLength(1);
    expect(pages.data[0].password).toBeUndefined();
  }, 15000);

  it("only allows modifications to the authenticated user", async () => {
    expect.assertions(2);
    const newUserInfo = { email: "another@example.com", password: "dragon" };
    const { _id } = await app.service("users").create(newUserInfo);
    const params = {
      provider: "rest",
      user: { _id: "test" },
      authenticated: true
    };
    await expect(
      app.service("users").patch(_id, { password: "tricky" }, params)
    ).rejects.toThrow();
    const params2 = {
      provider: "rest",
      user: { ...newUserInfo, _id },
      authenticated: true
    };
    await expect(
      app.service("users").patch(_id, { password: "tricky" }, params2)
    ).resolves.not.toThrow();
  });
});
