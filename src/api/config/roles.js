const roleDetails = {
  user: ["getUsers"],
  admin: [],
};

const roles = Object.keys(roleDetails);

const roleRights = new Map(Object.entries(roleDetails));

module.exports = {
  roles,
  roleRights,
};
