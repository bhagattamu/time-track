const httpStatus = require("http-status");
const organizationSettingService = require("../../services/setting");
const {
  validateOrganizationSettingData,
} = require("../../validations/setting.validation");

const createSetting = async (req, res) => {
  const organizationSettingBody = req.body;
  const { error } = validateOrganizationSettingData(organizationSettingBody);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }
  const createdOrganizationSetting =
    await organizationSettingService.createSetting(organizationSettingBody);
  return res.status(httpStatus.CREATED).json(createdOrganizationSetting);
};

const updateOrganizationSetting = async (req, res) => {
  const organizationSetting = req.body;
  const orgId = req.params.orgId;

  const { error } = validateOrganizationSettingData(organizationSetting);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }
  const updatedOrganizationSetting =
    await organizationSettingService.updateSetting(orgId, organizationSetting);
  return res.status(httpStatus.OK).json(updatedOrganizationSetting);
};

const getOrganizationSetting = async (req, res) => {
  const orgId = req.params.orgId;
  console.log({ params: req.params, orgId });
  const organizationSetting = await organizationSettingService.getSetting(
    orgId
  );
  return res.status(httpStatus.OK).json(organizationSetting);
};

module.exports = {
  createSetting,
  updateOrganizationSetting,
  getOrganizationSetting,
};
