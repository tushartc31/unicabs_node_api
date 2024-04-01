const pool = require("../../database/mysql");
const { bookingTableName, bookingFields } = require("../../constants/db_tables_field");
const { date } = require("joi");

module.exports = {
    generateBookingID: () => {
        const query = `SELECT MAX(${bookingFields.bookingId}) AS maxID FROM ${bookingTableName}`;
        return new Promise((resolve, reject) => {
            pool.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    let maxID = results[0].maxID;
                    let newID;
                    if (maxID) {
                        const currentNumber = Number(maxID.substring(4)); // Extract number part
                        const nextNumber = currentNumber + 1;
                        if (nextNumber <= 999999) {
                            const paddedNumber = String(nextNumber).padStart(6, '0'); // Pad with zeros
                            newID = `FEEN${paddedNumber}`;
                        } else {
                            reject(new Error('Maximum limit reached for booking IDs.'));
                        }
                    } else {
                        newID = 'FEEN000001';
                    }
                    resolve(newID);
                }
            });
        });
    },
    create: (data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `insert into ${bookingTableName}
                (
                  ${bookingFields.bookingId}, 
                  ${bookingFields.bookingDate},
                  ${bookingFields.pickup},
                  ${bookingFields.drop}, 
                  ${bookingFields.tripType}, 
                  ${bookingFields.customerId}, 
                  ${bookingFields.customerName}, 
                  ${bookingFields.customerMobile}, 
                  ${bookingFields.carType}, 
                  ${bookingFields.vehicleId}, 
                  ${bookingFields.vehicleNumber},
                  ${bookingFields.vehicleName},
                  ${bookingFields.vehicleType},
                  ${bookingFields.vendorName}, 
                  ${bookingFields.vendorMobile}, 
                  ${bookingFields.bookingPrice}, 
                  ${bookingFields.vendorPrice}, 
                  ${bookingFields.commissionPrice}, 
                  ${bookingFields.driverId}, 
                  ${bookingFields.driverName}, 
                  ${bookingFields.driverMobile}, 
                  ${bookingFields.note}, 
                  ${bookingFields.creatorId}, 
                  ${bookingFields.creatorName}
                )
                 values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    data.bookingId,
                    data.bookingDate,
                    data.pickup,
                    data.drop,
                    data.tripType,
                    data.customerId,
                    data.customerName,
                    data.customerMobile,
                    data.carType,
                    data.vehicleId,
                    data.vehicleNumber,
                    data.vehicleName,
                    data.vehicleType,
                    data.vendorName,
                    data.vendorMobile,
                    data.bookingPrice,
                    data.vendorPrice,
                    data.commissionPrice,
                    data.driverId,
                    data.driverName,
                    data.driverMobile,
                    data.note,
                    data.creatorId,
                    data.creatorName
                ],
                (error, result) => {
                    if (error) {
                        console.log("create booking", error);
                        return reject(error);
                    }
                    return resolve(result);
                }
            );
        })

    },

    getBookingTotalCommissionByMonthYear: (month, year) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT SUM(${bookingFields.commissionPrice}) as totalCommission FROM ${bookingTableName} WHERE MONTH(${bookingFields.bookingDate}) = ? and YEAR(${bookingFields.bookingDate}) = ?`,
                [month, year],
                (error, results, fields) => {
                    if (error) {
                        console.log("date range errr", error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

    getBookingTotalBookingPriceByMonthYear: (month, year) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT SUM(${bookingFields.bookingPrice}) as totalBookingPrice FROM ${bookingTableName} WHERE MONTH(${bookingFields.bookingDate}) = ? and YEAR(${bookingFields.bookingDate}) = ?`,
                [month, year],
                (error, results, fields) => {
                    if (error) {
                        console.log("date range errr", error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

    getBookingTotalBookingCountByMonthYear: (month, year) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT COUNT(DISTINCT ${bookingFields.id}) as totalBookingCount FROM ${bookingTableName} WHERE MONTH(${bookingFields.bookingDate}) = ? and YEAR(${bookingFields.bookingDate}) = ?`,
                [month, year],
                (error, results, fields) => {
                    if (error) {
                        console.log("date range errr", error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

    getBookingsByDateRange: (date1, date2, offset, limit, searchQuery, searchBy = 1) => {
        date2 =`${date1} 23:59:59`;
        date1 +=` 00:00:00`;
        //searchBy = 1 - bookingId, 2 - customerId, 3 - all mobile wise
        
        // const fields = [bookingFields.bookingId, bookingFields.customerId, bookingFields.customerMobile, bookingFields.vendorMobile, bookingFields.driverMobile];
        // let concatString = 'CONCAT(';
        // if (searchBy == 1) {
        //     concatString += fields[0];
        // } else if (searchBy == 2) {
        //     concatString += fields[1];
        // } else if (searchBy == 3) {
        //     concatString += fields.slice(2).join(',');
        // }
        // concatString += ')';
        let searchSqlQuery;
        if(searchQuery){
        if(searchBy == 1) {
            searchSqlQuery = `${bookingFields.bookingId} = 'FEEN${searchQuery.replaceAll(`'`, ``)}'`;
        } else if (searchBy ==2) {
            searchSqlQuery = `${bookingFields.customerId} = ${searchQuery}`;
        } else if (searchBy == 3) {
            searchSqlQuery = `CONCAT(${bookingFields.customerMobile}, ${bookingFields.vendorMobile}, ${bookingFields.driverMobile}) LIKE '%${searchQuery}%'`;
        }
        }else{
            searchSqlQuery = `${bookingFields.bookingDate} between '${date1}' and '${date2}'`;
        }
        console.log(`SEARCH QUERY::: select * from ${bookingTableName} WHERE ${searchSqlQuery} ORDER BY ${bookingFields.bookingDate} DESC LIMIT ${limit} OFFSET ${offset}`);
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from ${bookingTableName} WHERE ${searchSqlQuery} ORDER BY ${bookingFields.bookingDate} DESC LIMIT ? OFFSET ?`,
                [limit, offset],
                (error, results, fields) => {
                    if (error) {
                         console.log(`date range errr ::::: ${error}`);
                        return reject(error);
                    }
                    console.log(`RESULT::: ${results}`);
                    return resolve(results);
                }
            );
        })
    },

    getBookingsByDateRangeTemp: (date1, date2, offset, limit, searchQuery, searchBy = 1) => {
        date2=`${date1} 23:59:59`;
        date1+=` 00:00:00`;
        //searchBy = 1 - bookingId, 2 - customerId, 3 - all mobile wise
        
        // const fields = [bookingFields.bookingId, bookingFields.customerId, bookingFields.customerMobile, bookingFields.vendorMobile, bookingFields.driverMobile];
        // let concatString = 'CONCAT(';
        // if (searchBy == 1) {
        //     concatString += fields[0];
        // } else if (searchBy == 2) {
        //     concatString += fields[1];
        // } else if (searchBy == 3) {
        //     concatString += fields.slice(2).join(',');
        // }
        // concatString += ')';
        console.log(`getBookingsByDateRangeTemp`);
        let searchSqlQuery = `${bookingFields.bookingDate} between ? and ?`;
        if(searchQuery){
        if(searchBy == 1) {
            searchSqlQuery += `OR ${bookingFields.bookingId} = 'FEEN${searchQuery}'`;
        } else if (searchBy ==2) {
            searchSqlQuery += `OR ${bookingFields.customerId} = ${searchQuery}`;
        } else if (searchBy == 3) {
            searchSqlQuery += `OR  CONCAT(${bookingFields.customerMobile}, ${bookingFields.vendorMobile}, ${bookingFields.driverMobile}) LIKE '%${searchQuery}%'`;
        }
        }
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from ${bookingTableName} WHERE ${searchSqlQuery} ORDER BY ${bookingFields.bookingDate} DESC LIMIT ? OFFSET ?`,
                [date1, date2, limit, offset],
                (error, results, fields) => {
                    if (error) {
                        console.log(`date range errr ::::: ${error}`);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

    //   getBookingsByDateRange: (date1, date2, offset, limit, searchQuery) => {
    //     console.log(`date1 ${date1} date2 ${date2}`);
    //     return new Promise((resolve, reject) => {
    //       pool.query(
    //         `select * from ${bookingTableName} WHERE ${bookingFields.bookingDate} between ? and ? OR ${bookingFields.bookingDate} LIKE '%${searchQuery}%' OR ${bookingFields.pickup} LIKE '%${searchQuery}%' OR ${bookingFields.drop} LIKE '%${searchQuery}%' OR ${bookingFields.tripType} LIKE '%${searchQuery}%' OR
    //         ${bookingFields.customerName} LIKE '%${searchQuery}%' OR ${bookingFields.customerMobile} LIKE '%${searchQuery}%' OR ${bookingFields.carType} LIKE '%${searchQuery}%' OR ${bookingFields.vehicleNumber} LIKE '%${searchQuery}%' OR ${bookingFields.vehicleName} LIKE '%${searchQuery}%' OR ${bookingFields.vehicleType} LIKE '%${searchQuery}%' OR ${bookingFields.driverName} LIKE '%${searchQuery}%' OR ${bookingFields.driverMobile} LIKE '%${searchQuery}%' OR ${bookingFields.vendorName} LIKE '%${searchQuery}%' OR ${bookingFields.vendorMobile} LIKE '%${searchQuery}%' OR ${bookingFields.bookingPrice} LIKE '%${searchQuery}%' OR ${bookingFields.vendorPrice} LIKE '%${searchQuery}%' OR ${bookingFields.commissionPrice} LIKE '%${searchQuery}%' OR ${bookingFields.note} LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`,
    //         [date1, date2, limit, offset],
    //         (error, results, fields) => {
    //           if (error) {
    //             console.log("date range errr", error);
    //             return reject(error);
    //           }
    //           return resolve(results);
    //         }
    //       );
    //     })
    //   },


    getBookingByBookingId: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `select * from ${bookingTableName} where ${bookingFields.id} = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results[0]);
                }
            );
        })
    },

    getBookingList: (offset, limit) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `select 
            ${bookingFields.id}, 
            ${bookingFields.bookingId}, 
            ${bookingFields.bookingDate}, 
            ${bookingFields.pickup},
            ${bookingFields.drop}, 
            ${bookingFields.tripType}, 
            ${bookingFields.customerId}, 
            ${bookingFields.customerName}, 
            ${bookingFields.customerMobile}, 
            ${bookingFields.carType}, 
            ${bookingFields.vehicleId}, 
            ${bookingFields.vehicleNumber}, 
            ${bookingFields.vehicleType}, 
            ${bookingFields.vendorName}, 
            ${bookingFields.bookingPrice}, 
            ${bookingFields.vendorPrice}, 
            ${bookingFields.commissionPrice}, 
            ${bookingFields.driverId}, 
            ${bookingFields.driverName}, 
            ${bookingFields.driverMobile}, 
            ${bookingFields.note}, 
            ${bookingFields.creatorId}, 
            ${bookingFields.creatorName}, 
            ${bookingFields.createdAt} 
            from ${bookingTableName} LIMIT ? OFFSET ?`,
                [limit, offset],
                (error, results, fields) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },

    updateBooking: (id, data) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `update ${bookingTableName} set 
            ${bookingFields.bookingDate}=?, 
            ${bookingFields.pickup}=?,
            ${bookingFields.drop}=?, 
            ${bookingFields.tripType}=?, 
            ${bookingFields.customerId}=?, 
            ${bookingFields.customerName}=?, 
            ${bookingFields.customerMobile}=?, 
            ${bookingFields.carType}=?, 
            ${bookingFields.vehicleId}=?, 
            ${bookingFields.vehicleNumber}=?,
            ${bookingFields.vehicleType}=?,
            ${bookingFields.vendorName}=?, 
            ${bookingFields.vendorMobile}=?, 
            ${bookingFields.bookingPrice}=?, 
            ${bookingFields.vendorPrice}=?, 
            ${bookingFields.commissionPrice}=?, 
            ${bookingFields.driverId}=?, 
            ${bookingFields.driverName}=?, 
            ${bookingFields.driverMobile}=?, 
            ${bookingFields.note}=?, 
            ${bookingFields.creatorId}=?, 
            ${bookingFields.creatorName}=? 
        where ${bookingFields.id} = ?`,
                [
                    data.bookingDate,
                    data.pickup,
                    data.drop,
                    data.tripType,
                    data.customerId,
                    data.customerName,
                    data.customerMobile,
                    data.carType,
                    data.vehicleId,
                    data.vehicleNumber,
                    data.vehicleType,
                    data.vendorName,
                    data.vendorMobile,
                    data.bookingPrice,
                    data.vendorPrice,
                    data.commissionPrice,
                    data.driverId,
                    data.driverName,
                    data.driverMobile,
                    data.note,
                    data.creatorId,
                    data.creatorName,
                    id
                ],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },

    deleteBooking: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `delete from ${bookingTableName} where ${bookingFields.id} = ?`,
                [id],
                (error, results) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        })
    },
};