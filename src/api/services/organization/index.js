const { Organization } = require("../../models/organization");

const createOrganization = async (organizationBody) => {
  const newOrganization = new Organization(organizationBody);
  const savedOrganization = await newOrganization.save();
  return savedOrganization.transform();
};

const getOrganizationsOfUser = async (userId) => {
  const organizations = await Organization.find({ user: userId });
  return organizations.map((organization) => organization.transform());
};

const getDefaultOrganizationOfUser = async (userId) => {
  const defaultOrganization = await Organization.findOne({
    user: userId,
    default: true,
  });
  return defaultOrganization?.transform();
};

const updateOrganization = async (orgId, organizationBody) => {
  const organizationDoc = await Organization.findById(orgId);
  organizationDoc.name = organizationBody.name;
  organizationDoc.default = organizationBody.default;
  organizationDoc.setting = organizationBody.setting;
  await organizationDoc.save();
  return organizationDoc.transform();
};

module.exports = {
  createOrganization,
  getOrganizationsOfUser,
  getDefaultOrganizationOfUser,
  updateOrganization,
};
