const { generateBookingID, create, getBookingList, getBookingByBookingId, getBookingsByDateRange, updateBooking, deleteBooking, getBookingTotalCommissionByMonthYear, getBookingTotalBookingPriceByMonthYear, getBookingTotalBookingCountByMonthYear,getBookingsByDateRangeTemp} = require("../services/booking.service")
const { getDriverByDriverId, getDriverByMobile, createDriverIfNotExistByDriverMobile } = require("../services/driver.service")
const { getCustomerByCustomerId, getCustomerByMobile, createCustomerIfNotExistByCustomerMobile } = require("../services/customer.service")
const { getVehicleByVehicleId, getVehicleByNumber, createVehicleIfNotExistByVehicleNumber } = require("../services/vehicle.service")
const AppError = require('../../utils/appError');

function checkNull(value) {
    return value == null ? "" : value;
    // `value == null` is the same as `value === undefined || value === null`
}
function isNullOrUndefine(value) {
    return value == null;
    // `value == null` is the same as `value === undefined || value === null`
}
async function checkBookingDetailsAndFillOut(body) {
    try {
        const [driver, customer, vehicle] = await Promise.all([getDriverByMobile(body.driverMobile), getCustomerByMobile(body.customerMobile), getVehicleByNumber(body.vehicleNumber)]);
        if (!customer) {
            if (body.customerName && body.customerMobile) {
                body.customerId = checkNull(body.customerId);
                var result = await createCustomerIfNotExistByCustomerMobile({
                    customerId: body.customerId,
                    customerName: body.customerName,
                    customerMobile: body.customerMobile
                });
            }
        }
        body.customerId = checkNull(isNullOrUndefine(customer) ? body.customerId : customer?.customerId);
        body.customerName = checkNull(isNullOrUndefine(customer) ? body.customerName : customer?.customerName);
        body.customerMobile = checkNull(isNullOrUndefine(customer) ? body.customerMobile : customer?.customerMobile);

        if (!driver) {
            if (body.driverName && body.driverMobile) {
                body.driverId = checkNull(body.driverId);
                await createDriverIfNotExistByDriverMobile({
                    driverId: body.driverId,
                    driverName: body.driverName,
                    driverMobile: body.driverMobile
                });
            }
        }
        body.driverId = checkNull(isNullOrUndefine(driver) ? body.driverId : driver?.driverId);
        body.driverName = checkNull(isNullOrUndefine(driver) ? body.driverName : driver?.driverName);
        body.driverMobile = checkNull(isNullOrUndefine(driver) ? body.driverMobile : driver?.driverMobile);
        if (!vehicle) {
            if (body.vehicleName && body.vehicleType && body.vehicleNumber) {
                body.vehicleId = checkNull(body.vehicleId);
                await createVehicleIfNotExistByVehicleNumber({
                    vehicleId: body.vehicleId,
                    vehicleName: body.vehicleName,
                    vehicleType: body.vehicleType,
                    vehicleNumber: body.vehicleNumber
                });
            }
        }
        body.vehicleId = checkNull(isNullOrUndefine(vehicle) ? body.vehicleId : vehicle?.vehicleId);
        body.vehicleType = checkNull(isNullOrUndefine(vehicle) ? body.vehicleType : vehicle?.vehicleType);
        body.vehicleNumber = checkNull(isNullOrUndefine(vehicle) ? body.vehicleNumber : vehicle?.vehicleNumber);
        body.vehicleName = checkNull(isNullOrUndefine(vehicle) ? body.vehicleName : vehicle?.vehicleName);
        // if(!driver || !customer || !vehicle){
        //     return res.status(200).json({
        //         success: !driver ? -1 : !customer ? -2 : !vehicle ? -3 : 0,//-1 for driver not found,-2 for customer not found,-3 for vehicle not found
        //         message: `Sorry!,Booking not created, cause ${ !driver ? "Driver "+body.driverId : !customer ? "Customer "+body.customerId : !vehicle ? "Vehicle "+body.vehicleId : 0} not found`,
        //         // customerId: result?.insertId ?? ""
        //     });
        // }
    }
    catch (e) {
        console.Error("checkBookingDetailsAndFillOut === error ===", e);
    }
    return body;
}
module.exports = {

    createBooking: async (req, res, next) => {
        try {
            const body = await checkBookingDetailsAndFillOut(req.body);
            const bookingId = await generateBookingID();
            body.bookingId = bookingId;
            const result = await create(body);
            if (!result.affectedRows) {
                throw new Error('Failed! Create Booking');
            }
            return res.status(200).json({
                success: 1,
                message: "Booking created successfully",
                bookingId: bookingId ?? ""
            });
        } catch (e) {
            next(e);
        }
    },

    getBookingByBookingId: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await getBookingByBookingId(id);
            if (!result) {
                throw new AppError('Booking Record not found!', 404);
            }
            return res.json({
                success: 1,
                booking: result,
            });
        } catch (e) {
            next(e);
        }
    },

    getBookingsByDateRange: async (req, res, next) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            let limit = parseInt(req.query.limit);
            if (!limit) {
                limit = 5
            }
            let offset = parseInt(req.query.offset);
            if (!offset) {
                offset = 0
            }
            let searchQuery = req.query.searchQuery;
            if (!searchQuery) {
                searchQuery = null
            }
            let searchBy = req.query.searchBy;
            if (!searchBy) {
                //searchBy = 1 - bookingId, 2 - customerId, 3 - all mobile wise
                searchBy = 1
            }
            const result = await getBookingsByDateRange(startDate, endDate, offset, limit, searchQuery, searchBy);
            if (!result) {
                throw new AppError('Booking Record not found!', 404);
            }
            return res.json({
                success: 1,
                count: result.length,
                bookingList: result,
            });
        } catch (e) {
            next(e);
        }
    },
    
    getBookingsByDateRangeTemp: async (req, res, next) => {
        try {
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            let limit = parseInt(req.query.limit);
            if (!limit) {
                limit = 5
            }
            let offset = parseInt(req.query.offset);
            if (!offset) {
                offset = 0
            }
            let searchQuery = req.query.searchQuery;
            if (!searchQuery) {
                searchQuery = null
            }
            let searchBy = req.query.searchBy;
            if (!searchBy) {
                //searchBy = 1 - bookingId, 2 - customerId, 3 - all mobile wise
                searchBy = 1
            }
            const result = await getBookingsByDateRangeTemp(startDate, endDate, offset, limit, searchQuery, searchBy);
            if (!result) {
                throw new AppError('Booking Record not found! getBookingsByDateRangeTemp', 404);
            }
            return res.json({
                success: 1,
                count: result.length,
                bookingList: result,
            });
        } catch (e) {
            next(e);
        }
    },
    getBookingTotalCommissionByMonthYear: async (req, res, next) => {
        try {
            const month = req.query.month;
            const year = req.query.year;
            const result = await getBookingTotalCommissionByMonthYear(month,year);
            if (!result) {
                throw new AppError('Total Booking Commission not getting!', 404);
            }
            return res.json({
                success: 1,
                totalCommission: result[0]?.totalCommission
            });
        } catch (e) {
            next(e);
        }
    },
    
    getBookingTotalBookingCountByMonthYear: async (req, res, next) => {
        try {
            const month = req.query.month;
            const year = req.query.year;
            const result = await getBookingTotalBookingCountByMonthYear(month,year);
            if (!result) {
                throw new AppError('Total Booking Count not getting!', 404);
            }
            return res.json({
                success: 1,
                totalBookingCount: result[0]?.totalBookingCount
            });
        } catch (e) {
            next(e);
        }
    },
    
    getBookingTotalBookingPriceByMonthYear: async (req, res, next) => {
        try {
            const month = req.query.month;
            const year = req.query.year;
            const result = await getBookingTotalBookingPriceByMonthYear(month,year);
            if (!result) {
                throw new AppError('Total Booking Price not getting!', 404);
            }
            return res.json({
                success: 1,
                totalBookingPrice: result[0]?.totalBookingPrice
            });
        } catch (e) {
            next(e);
        }
    },

    getBookingList: async (req, res, next) => {
        try {
            let limit = parseInt(req.query.limit);
            if (!limit) {
                limit = 5
            }
            let offset = parseInt(req.query.offset);
            if (!offset) {
                offset = 0
            }
            const result = await getBookingList(offset, limit);
            return res.json({
                success: 1,
                count: result.length,
                bookingList: result,
            });
        } catch (e) {
            next(e);
        }
    },

    updateBooking: async (req, res, next) => {
        try {
            const id = req.params.id;
            const body = await checkBookingDetailsAndFillOut(req.body);
            const result = await updateBooking(id, body);
            if (!result.affectedRows) {
                throw new Error(`Failed to update booking record!`);
            }
            return res.json({
                success: 1,
                message: "booking updated successfully",
            });
        } catch (e) {
            next(e);
        }
    },

    deleteBooking: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await deleteBooking(id);
            if (!result.affectedRows) {
                throw new Error(`Failed to delete booking record!`);
            }
            return res.json({
                success: 1,
                message: "booking deleted successfully",
            });
        } catch (e) {
            next(e);
        }
    },
}