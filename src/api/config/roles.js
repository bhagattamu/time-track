const organizationApi = [
  "createOrganization",
  "getUserDefaultOrganization",
  "getOrganizationsOfUser",
  "updateOrganization",
];

const roleDetails = {
  user: ["getUsers", ...organizationApi],
  admin: [],
};

const roles = Object.keys(roleDetails);

const roleRights = new Map(Object.entries(roleDetails));

module.exports = {
  roles,
  roleRights,
};
