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
const directories = require('./../../../src/infrastructure/directories');

describe('when creating an invitation', () => {
  beforeEach(() => {
    rp.mockReset().mockReturnValue({ id: 'invite-id' });

    opts = {
      url: 'https://dirs.test',
      auth: {
        type: ''
      }
    };

    details = {
      email: 'user.one@unit.tests',
      firstName: 'User',
      lastName: 'One',
    };
  });

  it('then it should return the invitation id', async () => {
    const actual = await directories.createInvite(details, opts);

    expect(actual).toBe('invite-id');
  });

  it('then it should call organisations api with correct url and verb', async () => {
    await directories.createInvite(details, opts);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].method).toBe('POST');
    expect(rp.mock.calls[0][0].uri).toBe('https://dirs.test/invitations');
  });

  it('then it should call organisations api with token', async () => {
    await directories.createInvite(details, opts);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].headers.authorization).toBe('Bearer token');

    expect(jwtStrategy.mock.calls.length).toBe(1);
    expect(jwtStrategy.mock.calls[0][0]).toBe(opts);
  });

  it('then it should call organisations api user details in body', async () => {
    await directories.createInvite(details, opts);

    expect(rp.mock.calls.length).toBe(1);
    expect(rp.mock.calls[0][0].body).toMatchObject({
      email: details.email,
      firstName: details.firstName,
      lastName: details.lastName,
    });
  });

  it('then it should throw an error if the api call fails', async () => {
    rp.mockImplementation(() => {
      const e = new Error('some error');
      e.statusCode = 500;
      throw e;
    });

    try {
      await directories.createInvite(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('Error creating invitation - some error');
    }
  });

  it('then it should throw an error if the opts is missing url', async () => {
    opts.url = '';

    try {
      await directories.createInvite(details, opts);
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
      await directories.createInvite(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('opts.auth must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the userDetails is missing email', async () => {
    details.email = '';

    try {
      await directories.createInvite(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('userDetails.email must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the userDetails is missing firstName', async () => {
    details.firstName = '';

    try {
      await directories.createInvite(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('userDetails.firstName must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });

  it('then it should throw an error if the userDetails is missing lastName', async () => {
    details.lastName = '';

    try {
      await directories.createInvite(details, opts);
      throw new Error('No error thrown')
    }
    catch (e) {
      expect(e.message).toBe('userDetails.lastName must be supplied');
      expect(e.type).toBe('E_BADREQUEST');
    }
  });
});
