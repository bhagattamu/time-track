const httpStatus = require("http-status");
const organizationService = require("../../services/organization");
const {
  validateOrganizationData,
} = require("../../validations/organization.validation");

const createOrganization = async (req, res) => {
  const organization = req.body;

  const { error } = validateOrganizationData(organization);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }
  const createdOrganization = await organizationService.createOrganization(
    organization
  );
  return res.status(httpStatus.CREATED).json(createdOrganization);
};

const getUserDefaultOrganization = async (req, res) => {
  const userId = req.user.id;
  const organization = await organizationService.getDefaultOrganizationOfUser(
    userId
  );
  return res.status(httpStatus.OK).json(organization);
};

const getOrganizationsOfUser = async (req, res) => {
  const userId = req.params.id;

  const organizations = await organizationService.getOrganizationsOfUser(
    userId
  );
  return res.status(httpStatus.OK).json(organizations);
};

const updateOrganization = async (req, res) => {
  const organization = req.body;
  const orgId = req.params.id;

  const { error } = validateOrganizationData(organization);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(error.details[0].message);
  }
  const updatedOrganization = await organizationService.updateOrganization(
    orgId,
    organization
  );
  return res.status(httpStatus.OK).json(updatedOrganization);
};

module.exports = {
  createOrganization,
  getUserDefaultOrganization,
  getOrganizationsOfUser,
  updateOrganization,
};
