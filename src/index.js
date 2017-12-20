const { union } = require('lodash');
const invite = require('./handlers/invite');

const validateConfig = (config) => {
  if (!config) {
    throw new Error('Must supply config');
  }

  if (!config.migrationAdmin) {
    throw new Error('Must supply migrationAdmin config');
  }

  if (!config.migrationAdmin.directories) {
    throw new Error('Must supply migrationAdmin.directories config');
  }

  if (!config.migrationAdmin.organisations) {
    throw new Error('Must supply migrationAdmin.organisations config');
  }
};

const register = (config, logger) => {
  validateConfig(config);

  const inviteHandlers = invite.register(config, logger);

  return union(inviteHandlers);
};

module.exports = {
  register,
};
