jest.mock('./../../../src/infrastructure/directories', () => {
  return {
    createInvite: jest.fn(),
  };
});
jest.mock('./../../../src/infrastructure/organisations', () => {
  return {
    addInvitationService: jest.fn(),
  };
});

const config = {
  migrationAdmin: {
    directories: {
      url: 'https://directories.domain.test/'
    },
    organisations: {
      url: 'https://organisations.domain.test/'
    },
  }
};
const logger = {
  info: jest.fn(),
};
const jobData = {
  email: 'user.one@unit.test',
  firstName: 'User',
  lastName: 'One',
  oldCredentials: {
    username: 'olduser',
    password: 'some-hashed-password',
    salt: 'the-users-salt',
    tokenSerialNumber: '78564321',
  },
  services: [
    {
      organisationId: 'org1',
      serviceId: 'svc1',
      roleId: 0,
    },
    {
      organisationId: 'org1',
      serviceId: 'svc2',
      roleId: 100000,
    },
  ]
};

const directories = require('./../../../src/infrastructure/directories');
const organisations = require('./../../../src/infrastructure/organisations');
const { getHandler } = require('./../../../src/handlers/invite/migrationInviteV1');
const handler = getHandler(config, logger);

describe('when handling a migrationinvite_v1 job', () => {
  beforeEach(() => {
    directories.createInvite.mockReset();
    organisations.addInvitationService.mockReset();
  });

  it('then it should return a migrationinvite_v1 hander', () => {
    expect(handler.type).toBe('migrationinvite_v1');
    expect(handler.processor).not.toBeNull();
  });

  it('then it should create the invitation', async () => {
    await handler.processor(jobData);

    expect(directories.createInvite.mock.calls.length).toBe(1);
    expect(directories.createInvite.mock.calls[0][0]).toMatchObject({
      email: jobData.email,
      firstName: jobData.firstName,
      lastName: jobData.lastName,
    });
    expect(directories.createInvite.mock.calls[0][1]).toBe(config.migrationAdmin.directories);
  });

  it('then it should add each service to the invitation', async () => {
    directories.createInvite.mockReturnValue('invite-id');

    await handler.processor(jobData);

    expect(organisations.addInvitationService.mock.calls.length).toBe(2);

    expect(organisations.addInvitationService.mock.calls[0][0]).toMatchObject({
      invitationId: 'invite-id',
      organisationId: 'org1',
      serviceId: 'svc1',
      roleId: 0,
    });
    expect(organisations.addInvitationService.mock.calls[0][1]).toBe(config.migrationAdmin.organisations);

    expect(organisations.addInvitationService.mock.calls[1][0]).toMatchObject({
      invitationId: 'invite-id',
      organisationId: 'org1',
      serviceId: 'svc2',
      roleId: 100000,
    });
    expect(organisations.addInvitationService.mock.calls[1][1]).toBe(config.migrationAdmin.organisations);
  });

  it('then it should store old credentials in invitation', async () => {
    await handler.processor(jobData);

    expect(directories.createInvite.mock.calls.length).toBe(1);
    expect(directories.createInvite.mock.calls[0][0]).toMatchObject({
      oldCredentials: {
        username: jobData.oldCredentials.username,
        password: jobData.oldCredentials.password,
        salt: jobData.oldCredentials.salt,
        tokenSerialNumber: jobData.oldCredentials.tokenSerialNumber,
      },
    });
  })
});