const { createInvite } = require('./../../infrastructure/directories');
const { addInvitationService } = require('./../../infrastructure/organisations');

const process = async (config, logger, data) => {
  const invitationId = await createInvite({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    oldCredentials: {
      username: data.oldCredentials.username,
      password: data.oldCredentials.password,
      salt: data.oldCredentials.salt,
    }
  }, config.migrationAdmin.directories, logger);
  logger.info(`invitationId = ${invitationId}`);

  for (let i = 0; i < data.services.length; i++) {
    const service = data.services[i];
    await addInvitationService({
      invitationId,
      organisationId: service.organisationId,
      serviceId: service.serviceId,
      roleId: service.roleId,
    }, config.migrationAdmin.organisations, logger);
  }
};

const getHandler = (config, logger) => {
  return {
    type: 'migrationinvite_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};