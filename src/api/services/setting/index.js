const { OrganizationSetting } = require("../../models/setting");

const createSetting = async (settingBody) => {
  const setting = new OrganizationSetting(settingBody);
  const savedSetting = await setting.save();
  return savedSetting.transform();
};

const getSetting = async (organizationId) => {
  console.log(
    new Date().toLocaleDateString("en", { timeZone: "Asia/Kathmandu" }),
    new Date().toLocaleString("en", { timeZone: "Asia/Kathmandu" }),
    new Date(new Date().toLocaleString("en", { timeZone: "Asia/Kathmandu" }))
  );
  return await OrganizationSetting.findOne({ organization: organizationId });
};

const updateSetting = async (organizationId, settingBody) => {
  const { schedules } = settingBody;
  const settingDoc = await OrganizationSetting.findById(organizationId);
  settingDoc.schedules = schedules;
  await settingDoc.save();
  return settingDoc.transform();
};

module.exports = {
  createSetting,
  getSetting,
  updateSetting,
};
