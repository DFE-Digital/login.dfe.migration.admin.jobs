jest.mock('request-promise');
jest.mock('login.dfe.jwt-strategies', () => {
  return jest.fn().mockImplementation(() => {
    return {
      getBearerToken: jest.fn().mockReturnValue('token'),
    };
  })
});

let details;
let opts;

const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');
const organisations = require('./../../../src/infrastructure/organisations');

describe('when adding a service to an invitation', () => {
  beforeEach(() => {
    rp.mockReset();

    opts = {
      url: 'https://orgs.test',
      auth: {
        type: ''
      }
    };

    details = {
      invitationId: 'some-id',
      organisationId: 'org1',
      serviceId: 'svc1',
      roleId: 0,
    };
  });

  it('then it should call organisations api with correct url and verb', async () => {
    await organisations.addInvitationService(details, opts);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('PUT');
    expect(rp.mock.calls[0][0].uri).toBe('https://orgs.test/organisations/org1/services/svc1/invitations/some-id');
  });

  it('then it should call organisations api with token', async () => {
    await organisations.addInvitationService(details, opts);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');

    expect(jwtStrategy.mock.calls.length).toBe(1);
    expect(jwtStrategy.mock.calls[0][0]).toBe(opts);
  });

  it('then it should call organisations api role id in body', async () => {
    await organisations.addInvitationService(details, opts);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].body.roleId).toBe(details.roleId);
  });

  it('then it should throw an error if the api call fails', async () => {
    rp.mockImplementation(() => {
      const e = new Error('some error');
      e.statusCode = 500;
      throw e;
    });

    try {
      await organisations.addInvitationService(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('Error adding invitation service - some error');
    }
  });

  it('then it should throw an error if the opts is missing url', async () => {
    opts.url = '';

    try {
      await organisations.addInvitationService(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('opts.url must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the opts is missing auth', async () => {
    opts.auth = null;

    try {
      await organisations.addInvitationService(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('opts.auth must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the invitationServiceDetails is missing invitationId', async () => {
    details.invitationId = '';

    try {
      await organisations.addInvitationService(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('details.invitationId must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the invitationServiceDetails is missing organisationId', async () => {
    details.organisationId = '';

    try {
      await organisations.addInvitationService(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('details.organisationId must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the invitationServiceDetails is missing serviceId', async () => {
    details.serviceId = '';

    try {
      await organisations.addInvitationService(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('details.serviceId must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the invitationServiceDetails is missing roleId', async () => {
    details.roleId = undefined;

    try {
      await organisations.addInvitationService(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('details.roleId must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });
});