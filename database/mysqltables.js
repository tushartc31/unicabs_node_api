const createTableIfNotExist = require("../middlewear/createtable");
const { adminTableName, customerTableName, driverTableName, vehicleTableName, bookingTableName, adminFields, customerFields, driverFields, vehicleFields, bookingFields} = require("../constants/db_tables_field");
module.exports = {
    createAdminTable: async (req, res, next) => {
        try {
            await createTableIfNotExist(adminTableName, `
            ${adminFields.id} INT AUTO_INCREMENT PRIMARY KEY, 
            ${adminFields.userName} VARCHAR(255),
            ${adminFields.email} VARCHAR(255),
            ${adminFields.mobile} VARCHAR(255) UNIQUE,
            ${adminFields.password} VARCHAR(255),
            ${adminFields.userRole} VARCHAR(255),
            ${adminFields.createdAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            next();
        } catch (e) {
            next(e)
        }
    },
    createCustomerTable: async (req, res, next) => {
        try {
            await createTableIfNotExist(customerTableName, `
            ${customerFields.id} INT AUTO_INCREMENT PRIMARY KEY, 
            ${customerFields.customerId} VARCHAR(255), 
            ${customerFields.customerMobile} VARCHAR(255) UNIQUE,
            ${customerFields.customerName} VARCHAR(255),
            ${customerFields.createdAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            next();
        } catch (e) {
            next(e)
        }
    },
    createDriverTable: async (req, res, next) => {
        try {
            await createTableIfNotExist(driverTableName, `
            ${driverFields.id} INT AUTO_INCREMENT PRIMARY KEY, 
            ${driverFields.driverId} VARCHAR(255), 
            ${driverFields.driverMobile} VARCHAR(255) UNIQUE,
            ${driverFields.driverName} VARCHAR(255),
            ${driverFields.createdAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            next();
        } catch (e) {
            next(e)
        }
    },
    createVehicleTable: async (req, res, next) => {
        try {
            await createTableIfNotExist(vehicleTableName, `
            ${vehicleFields.id} INT AUTO_INCREMENT PRIMARY KEY,
            ${vehicleFields.vehicleId} VARCHAR(255),  
            ${vehicleFields.vehicleType} VARCHAR(255),
            ${vehicleFields.vehicleNumber} VARCHAR(255) UNIQUE,
            ${vehicleFields.vehicleName} VARCHAR(255),
            ${vehicleFields.createdAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            next();
        } catch (e) {
            next(e)
        }
    },
    createBookingTable: async (req, res, next) => {
        try {
            await createTableIfNotExist(bookingTableName, `
            ${bookingFields.id} INT AUTO_INCREMENT PRIMARY KEY,
            ${bookingFields.bookingId} VARCHAR(255), 
            ${bookingFields.bookingDate} DATETIME, 
            ${bookingFields.pickup} VARCHAR(255),
            ${bookingFields.drop} VARCHAR(255), 
            ${bookingFields.tripType} VARCHAR(255), 
            ${bookingFields.customerId} VARCHAR(255), 
            ${bookingFields.customerName} VARCHAR(255), 
            ${bookingFields.customerMobile} VARCHAR(255), 
            ${bookingFields.carType} VARCHAR(255),
            ${bookingFields.vehicleId} VARCHAR(255), 
            ${bookingFields.vehicleNumber} VARCHAR(255), 
            ${bookingFields.vehicleName} VARCHAR(255), 
            ${bookingFields.vehicleType} VARCHAR(255),
            ${bookingFields.vendorName} VARCHAR(255), 
            ${bookingFields.vendorMobile} VARCHAR(255), 
            ${bookingFields.bookingPrice} DOUBLE, 
            ${bookingFields.vendorPrice} DOUBLE, 
            ${bookingFields.commissionPrice} DOUBLE, 
            ${bookingFields.driverId} VARCHAR(255), 
            ${bookingFields.driverName} VARCHAR(255), 
            ${bookingFields.driverMobile} VARCHAR(255), 
            ${bookingFields.note} VARCHAR(255), 
            ${bookingFields.creatorId} VARCHAR(255), 
            ${bookingFields.creatorName} VARCHAR(255),
            ${bookingFields.createdAt} TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            `);
            next();
        } catch (e) {
            next(e)
        }
    },
}
