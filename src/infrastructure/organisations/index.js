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
  if (!details.invitationId) {
    throw makeBadRequestError('details.invitationId must be supplied');
  }
  if (!details.organisationId) {
    throw makeBadRequestError('details.organisationId must be supplied');
  }
  if (!details.serviceId) {
    throw makeBadRequestError('details.serviceId must be supplied');
  }
  if (details.roleId == undefined || details.roleId < 0) {
    throw makeBadRequestError('details.roleId must be supplied');
  }
};

const addInvitationService = async (invitationServiceDetails, opts, logger) => {
  validateOpts(opts);
  validateDetails(invitationServiceDetails);

  try {
    const { invitationId, organisationId, serviceId, roleId } = invitationServiceDetails;

    const token = await jwtStrategy(opts).getBearerToken();

    await rp({
      method: 'PUT',
      uri: `${opts.url}/organisations/${organisationId}/services/${serviceId}/invitations/${invitationId}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
      body: {
        roleId,
      },
      json: true,
    });
  } catch (e) {
    throw new Error(`Error adding invitation service - ${e.message}`);
  }
};

module.exports = {
  addInvitationService,
};
