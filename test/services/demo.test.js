const app = require('../../src/app');

describe('\'demo\' service', () => {
  it('registered the service', () => {
    const service = app.service('demo');
    expect(service).toBeTruthy();
  });
});
