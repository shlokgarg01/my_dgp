const Service = require('../models/ServiceModel')
const SubService = require('../models/SubServiceModel')
const catchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require('../utils/errorHandler');

// create a service
exports.createService = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  const service = await Service.create({
    name
  });

  res.status(200).json({
    success: true,
    service
  })
})

// edit a service
exports.updateService = catchAsyncErrors(async (req, res, next) => {
  let service = await Service.findById(req.params.id)
  if (!service) {
    return next(new ErrorHandler("Service Not Found", 404))
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
    service
  })
})

// delete a service
exports.deleteService = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.params.id)
  if (!service) {
    return next(new ErrorHandler("Service Not Found", 404))
  }

  await Service.deleteOne()
  res.status(200).json({
    success: true,
    message: "Service Deleted SUccessfully"
  })
})

// get a service by Id
exports.getServiceDetails = catchAsyncErrors(async (req, res, next) => {
  const service = await Service.findById(req.params.id)
  if (!service) {
    return next(new ErrorHandler("Service Not Found", 404))
  }

  res.status(200).json({
    success: true,
    service
  })
})

// get all services
exports.getAllServices = catchAsyncErrors(async (req, res, next) => {
  let services = await Service.find();

  services = services.map(service => ({
    ...service.toObject(),
    label: service.name,
    value: service._id
  }));

  // adding sub services to service
  const servicesArray = [];
  for (const service of services) {
    let subServices = await SubService.find({ service: service._id });

    // Sort subServices by name, placing "Others" last
    subServices.sort((a, b) => {
      if (a.name === 'Others') return 1;
      if (b.name === 'Others') return -1;
      return a.name.localeCompare(b.name);
    });

    const newObj = { ...service, subServices };
    servicesArray.push(newObj);
  }

  res.status(200).json({
    success: true,
    services: servicesArray
  });
});