jest.mock('./../../src/handlers/invite');
const { register } = require('./../../src');

describe('when registering handlers', () => {
  let config;
  let logger;
  let inviteRegister;

  beforeEach(() => {
    config = {
      migrationAdmin: {
        directories: {},
        organisations: {},
      },
    };

    logger = jest.fn();

    inviteRegister = jest.fn().mockReturnValue([{
      type: 'invite_test_handler',
      processor: jest.fn(),
    }]);
    require('./../../src/handlers/invite').register = inviteRegister;
  });

  it('then it should return an array of handlers', () => {
    const actual = register(config, logger);

    expect(actual).toBeInstanceOf(Array);
  });

  it('then it should register invite handlers', () => {
    const actual = register(config, logger);

    expect(inviteRegister.mock.calls).toHaveLength(1);
    expect(inviteRegister.mock.calls[0][0]).toBe(config);
    expect(inviteRegister.mock.calls[0][1]).toBe(logger);
    expect(actual.find(h => h.type === 'invite_test_handler')).toBeTruthy();
  });

  it('then it should throw an error if config not provided', () => {
    config = undefined;

    try {
      register(config, logger);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('Must supply config');
    }
  });

  it('then it should throw an error if config.migrationAdmin not provided', () => {
    config.migrationAdmin = undefined;

    try {
      register(config, logger);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('Must supply migrationAdmin config');
    }
  });

  it('then it should throw an error if config.migrationAdmin.directories not provided', () => {
    config.migrationAdmin.directories = undefined;

    try {
      register(config, logger);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('Must supply migrationAdmin.directories config');
    }
  });

  it('then it should throw an error if config.migrationAdmin.organisations not provided', () => {
    config.migrationAdmin.organisations = undefined;

    try {
      register(config, logger);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('Must supply migrationAdmin.organisations config');
    }
  });
});