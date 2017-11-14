const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');

const makeBadRequestError = (message) => {
  const error = new Error(message);
  error.type = 'E_BADREQUEST';
  return error;
};
const validateOpts = (opts) => {
  if (!opts.url) {
    throw makeBadRequestError('opts.url must be supplied');
  }
  if (!opts.auth) {
    throw makeBadRequestError('opts.auth must be supplied');
  }
};
const validateDetails = (details) => {
  if (!details.email) {
    throw makeBadRequestError('userDetails.email must be supplied');
  }
  if (!details.firstName) {
    throw makeBadRequestError('userDetails.firstName must be supplied');
  }
  if (!details.lastName) {
    throw makeBadRequestError('userDetails.lastName must be supplied');
  }
};

const createInvite = async (userDetails, opts, logger) => {
  validateOpts(opts);
  validateDetails(userDetails);

  try {
    const { email, firstName, lastName } = userDetails;

    const token = await jwtStrategy(opts).getBearerToken();

    const invitation = await rp({
      method: 'POST',
      uri: `${opts.url}/invitations`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        email,
        firstName,
        lastName,
      },
      json: true,
    });

    return invitation.id;
  } catch (e) {
    throw new Error(`Error creating invitation - ${e.message}`);
  }
};

module.exports = {
  createInvite,
};
