const v1 = require('./migrationInviteV1');

const register = (config, logger) => {
  return [
    v1.getHandler(config, logger),
  ];
};

module.exports = {
  register,
};