const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require('dotenv').config()
const errorMiddleware = require("./middleware/error");
const connectDatabase = require("./config/database.js")
const path = require("path");

const UserRoutes = require('./routes/UserRoutes')
const AddressRoutes = require("./routes/AddressRoutes")
const BookingRoutes = require("./routes/BookingRoutes")
const ServiceRoutes = require("./routes/ServiceRoutes")
const BookingRequestRoutes = require('./routes/BookingRequestRoutes')
const LeaveRoutes = require('./routes/LeaveRoutes.js')
const RedeemRoutes = require('./routes/RedeemRoutes.js')
const RedeemRequestRoutes = require('./routes/RedeemRequestRoutes.js')
const SubServiceRoutes = require('./routes/SubServiceRoutes.js')
const PackageRoutes = require('./routes/PackageRoutes.js')
const PriceRoutes = require('./routes/PriceRoutes.js')
const CouponRoutes = require('./routes/CouponRoutes')

app.use(morgan("combined"));

// Was getting - (Entity too large) error while uploading heavy images from Frontend. Below 2 lines are the fix for that. Sequence of lines matter, so in future keep the sequence same if needed.
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.use(express.json());
app.use(cors());

if(process.env.NODE_ENV !== 'PRODUCTION') {
  require('dotenv').config({ path: "my_dgp_backend/.env" })
}

const server = app.listen(process.env.PORT, ()=>{
  console.log(`Server is running on PORT ${process.env.PORT}`)
})
connectDatabase()

// Handling Uncaught Exception
process.on("uncaughtException", err => {
  console.log(`Shutting down the server due to uncaughtException`)

  process.exit(1)
})

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
  console.log('Error - ', err.message)
  console.log(`Shutting down the server due to unhandledRejection`)

  server.close(() => {
    process.exit(1)
  })
})

app.get("/ping", (req, res) => {
  res.status(200).json({
    message:"Server is running."
  })
})

app.use("/api/v1", UserRoutes)
app.use("/api/v1", AddressRoutes)
app.use("/api/v1", BookingRoutes)
app.use('/api/v1', ServiceRoutes)
app.use('/api/v1', BookingRequestRoutes)
app.use('/api/v1', LeaveRoutes)
app.use('/api/v1', RedeemRoutes)
app.use('/api/v1', RedeemRequestRoutes)
app.use('/api/v1', PackageRoutes)
app.use('/api/v1', SubServiceRoutes)
app.use('/api/v1', PriceRoutes)
app.use('/api/v1', CouponRoutes)

// This is the static frontend file. Whenever any change in frontend is made, u need to generate build file & then run server again.
// IMPORTANT - make sure that this static frontend route is after all the backend routes otherwise all API calls will fail.
app.use(express.static(path.join(__dirname, "../my_dgp_web/build")));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "../my_dgp_web/build/index.html")
  );
});

// middleware for errors
app.use(errorMiddleware);

module.exports = app;
