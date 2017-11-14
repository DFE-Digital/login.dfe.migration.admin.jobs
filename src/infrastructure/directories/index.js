const validateOpts = (opts) => {

};

const createInvite = async (userDetails, opts) => {
  validateOpts(opts);

  const { email, firstName, lastName } = userDetails;
  // TODO: validate
};

module.exports = {
  createInvite,
};
