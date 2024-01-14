const organizationApi = [
  "createOrganization",
  "getUserDefaultOrganization",
  "getOrganizationsOfUser",
  "updateOrganization",
];

const organizationSettingApi = [
  "createOrganizationSetting",
  "getOrganizationSetting",
  "updateOrganizationSetting",
];

const trackApi = ["createTrack", "updateTrack", "getTrackById"];

const timeLogsApi = ["getAllTimeLogs"];

const roleDetails = {
  user: [
    "getUsers",
    ...organizationApi,
    ...organizationSettingApi,
    ...trackApi,
    ...timeLogsApi,
  ],
  admin: [],
};

const roles = Object.keys(roleDetails);

const roleRights = new Map(Object.entries(roleDetails));

module.exports = {
  roles,
  roleRights,
};
