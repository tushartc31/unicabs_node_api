// AdminTable
module.exports = {
    adminTableName: "admin_user",
    customerTableName: "customers",
    driverTableName: "driver",
    vehicleTableName: "vehicle",
    bookingTableName: "booking",
    adminFields: {
         id : 'id',
         userName : 'userName',
         email : 'email',
         password : 'password',
         mobile : 'mobile',
         userRole : 'userRole',
         createdAt : 'createdAt'
    },
    customerFields: {
         id : 'id',
         customerId : 'customerId',
         customerName : 'customerName',
         customerMobile: 'customerMobile',
         createdAt : 'createdAt'
    },
    driverFields: {
        id : 'id',
        driverId:'driverId',
        driverName : 'driverName',
        driverMobile : 'driverMobile',
        createdAt : 'createdAt'
    },
    vehicleFields: {
        id : 'id',
        vehicleId : 'vehicleId',
        vehicleType : 'vehicleType',
        vehicleName : 'vehicleName',
        vehicleNumber : 'vehicleNumber',
        createdAt : 'createdAt'
    },
    bookingFields: {
        id : 'id',
        bookingId : 'bookingId',
        bookingDate : 'bookingDate',
        pickup : 'pickupPoint',
        drop : 'dropPoint',
        tripType : 'tripType',
        customerId  : 'customerId',
        customerName  : 'customerName',
        customerMobile  : 'customerMobile',
        carType : 'carType',
        vehicleId : 'vehicleId',
        vehicleNumber : 'vehicleNumber',
        vehicleName : 'vehicleName',
        vehicleType : 'vehicleType',
        vendorName : 'vendorName',
        vendorMobile : 'vendorMobile',
        bookingPrice : 'bookingPrice',
        vendorPrice : 'vendorPrice',
        commissionPrice : 'commissionPrice',
        driverId : 'driverId',
        driverName : 'driverName',
        driverMobile : 'driverMobile',
        note : 'note',
        creatorId : 'creatorId',
        creatorName : 'creatorName',
        createdAt : 'createdAt'
    }
}