const licenseChecker = require('license-checker');

const ciNotification = require('./ciNotifications');
const parseLicensesFactory = require('./parseLicenses');

const checkLicenses = ({ whitelistedLicenses, blacklistedLicenses, projectPath, ciManager }) => {
  const { createWarnNotification, createErrorNotification } = ciNotification(ciManager);

  if (!projectPath) {
    return createErrorNotification('Path is not specified.');
  }

  licenseChecker.init({ start: projectPath }, (err, result) => {
    if (err) {
      return createErrorNotification(err);
    }

    const licenses = Object.values(result);

    if (licenses.length <= 0) {
      return createWarnNotification('There are no licenses to check');
    }

    const parse = parseLicensesFactory({
      whitelistedLicenses,
      blacklistedLicenses,
      createWarnNotification,
      createErrorNotification });

    parse(licenses);
  });
};

module.exports = checkLicenses;
