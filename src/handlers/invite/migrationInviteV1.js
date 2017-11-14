const { createInvite } = require('./../../infrastructure/directories');
const { addInvitationService } = require('./../../infrastructure/organisations');

const process = async (config, logger, data) => {
  await createInvite({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  }, config.migrationAdmin.directories);

  for (let i = 0; i < data.services.length; i++) {
    const service = data.services[i];
    await addInvitationService({
      invitationId: 'TODO', // TODO
      organisationId: service.organisationId,
      serviceId: service.serviceId,
      roleId: service.roleId,
    }, config.migrationAdmin.organisations);
  }
};

const getHandler = (config, logger) => {
  return {
    type: 'migationinvite_v1',
    process: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};