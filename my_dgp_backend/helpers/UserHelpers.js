const User = require("../models/UserModel");
const Leave = require("../models/LeaveModel");
const Enums = require("../utils/Enums");

const getAvailableServiceProviders = async (date, service, subService, package,coordinates) => {
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

  // Calculate distance and filter service providers based on distance
  const filteredServiceProviders = service_providers.filter(provider => {
    const minDistance = 0;
    const maxDistance = 20; // max 20km
    const providerCoordinates = provider.lastActiveLocation;

    // Check if provider coordinates are available
    const distance = providerCoordinates 
      ? calculateDistance(coordinates, { lat: providerCoordinates.latitude, lng: providerCoordinates.longitude }) 
      : 2; // Default distance of 2 km if no coordinates

    return distance >= minDistance && distance <= maxDistance; // filter by min and max distance
  });

  // getting only those service providers who are available on the given date. Subtracting leaves from service_provider_ids i.e. simply doing => (service_provider_ids - leaves)
   return service_provider_ids.filter((item) => !leaves.includes(item) && filteredServiceProviders.map(p => p._id.toString()).includes(item)) || [];
};

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (coords1, coords2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180);
  const dLon = (coords2.lng - coords1.lng) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1.lat * (Math.PI / 180)) * Math.cos(coords2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const generateOTP = () => Math.floor(1000 + Math.random() * 9000);

module.exports = {
  getAvailableServiceProviders,
  generateOTP,
};
