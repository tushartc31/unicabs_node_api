/*********************************
 * DOLFEEN CAPTAIN TAXI BOOKING MANAGEMENT SYSTEM
 * created by Tushar Patel - TC
 * on 31/12/2022
 *********************************/


const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const swaggerUI = require("swagger-ui-express");
const AppError = require("./utils/appError");
const { createAdminTable, createCustomerTable, createDriverTable, createVehicleTable, createBookingTable } = require("./database/mysqltables");


const adminRouter = require('./api/routers/admin.router');
const customerRouter = require('./api/routers/customer.router');
const driverRouter = require('./api/routers/driver.router');
const vehicleRouter = require('./api/routers/vehicle.router');
const bookingRouter = require('./api/routers/booking.router');
const swaggerDocument = require("./swagger.json");

const app = express();

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

// Tail = require('tail').Tail;

// tail = new Tail("./fileToTail.txt");

// tail.on("line", function(data) {
//   console.log(data);
// });

// it will parse the body data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

//For sql table creation purpose only
app.post("/api/createTables", async (req, res, next) => {
  next = (e) => { console.log(e); return e };
  createAdminTable(req, res, next);
  createCustomerTable(req, res, next);
  createDriverTable(req, res, next);
  createVehicleTable(req, res, next);
  createBookingTable(req, res, next);
  return res.status(201).json({
    success: 1,
    message: "Table create query fire!!!"
  });
});

//ROUTES
app.use("/api/admin", adminRouter);
app.use("/api/customer", customerRouter);
app.use("/api/driver", driverRouter);
app.use("/api/vehicle", vehicleRouter);
app.use("/api/booking", bookingRouter);

///UNKNOWN URL THROW ERRORS
app.all('*', (req, res, next) => {
  throw new AppError(`Requested URL ${req.path} not found!`, 404);
});

///ERROR HANDLER
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.log("Error::==>", err);
  res.status(statusCode).json({
    success: 0,
    message: err.message
  })
});

const port = process.env.APP_PORT || 4000;
app.listen(port, () => {
  app.get('/', function (req, res) {
    res.send('Hello World!')
  })
  console.log("Server up and running on", process.env.APP_PORT);
})