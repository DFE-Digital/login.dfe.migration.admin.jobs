const rp = require('request-promise');
const jwtStrategy = require('login.dfe.jwt-strategies');

const addInvitationService = async (invitationServiceDetails, opts) => {
  try {
    const { invitationId, organisationId, serviceId, roleId } = invitationServiceDetails;

    const token = await jwtStrategy(opts).getBearerToken();

    await rp({
      method: 'PUT',
      uri: `${opts.url}/${organisationId}/services/${serviceId}/invitations/${invitationId}`,
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
