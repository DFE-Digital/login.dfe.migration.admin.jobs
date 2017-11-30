const { union } = require('lodash');
const invite = require('./handlers/invite');

const register = (config, logger) => {
  const inviteHandlers = invite.register(config, logger);

  return union(inviteHandlers);
};

module.exports = {
  register,
};
