const User = require("../models/UserModel");
const Leave = require("../models/LeaveModel");
const Enums = require("../utils/Enums");

const getAvailableServiceProviders = async (date, service, subService, package) => {
  const service_providers = await User.find({
    role: Enums.USER_ROLES.SERVICE_PROVIDER,
    // service, ==> not filtering on the basis of service/category due to both or combos. Can be done if combo not required.
    // packages: { $elemMatch: { $eq: package } },
    // subServices: {$elemMatch: { $eq: subService }},
    subServices: {$elemMatch: { $eq: package }}, // temp fix
    status: Enums.SERVICE_PROVIDER_STATUS.ACTIVE,
  }).sort("createdAt");

  let leaves = await Leave.find({
    startDate: { $lte: date },
    endDate: { $gte: date },
    status: Enums.LEAVE_STATUS.APPROVED,
  }).distinct("serviceProvider");

  // converting new ObjectId() type to String for easy subtraction
  const service_provider_ids = service_providers.map((record) =>
    record._id.toString()
  );
  leaves = leaves.map((leave) => leave.toString());

  // getting only those service providers who are available on the given date. Subtracting leaves from service_provider_ids i.e. simply doing => (service_provider_ids - leaves)
  return service_provider_ids.filter((item) => !leaves.includes(item)) || [];
};

const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

module.exports = {
  getAvailableServiceProviders,
  generateOTP,
};
