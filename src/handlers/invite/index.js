const v1 = require('./migrationInviteV1');

const register = (config, logger) => [
  v1.getHandler(config, logger),
];

module.exports = {
  register,
};
