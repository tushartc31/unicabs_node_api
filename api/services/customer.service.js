const pool = require("../../database/mysql");
const {customerTableName,customerFields,bookingTableName,bookingFields} = require("../../constants/db_tables_field")

module.exports = {
    create : (data) =>  {
        return new Promise((resolve, reject) => {
            pool.query(
                `insert into ${customerTableName}(${customerFields.customerId},${customerFields.customerName}, ${customerFields.customerMobile})
                 values(?,?,?)`, 
                 [
                    data.customerId,
                    data.customerName,
                    data.customerMobile
                 ],
                 (error, result) => {
                    if(error){
                      console.log("customer",error);
                        return reject(error);
                    }
                    return resolve(result);
                 }
            );
        })
        
    },

    getCustomerByMobile: (mobile) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${customerTableName} where ${customerFields.customerMobile} = ?`,
            [mobile],
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results[0]);
            }
          );
        })
      },
    
      getCustomerByCustomerId: (customerId) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${customerTableName} where ${customerFields.customerId} = ?`,
            [customerId],
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results[0]);
            }
          );
        })
      },
      
    createCustomerIfNotExistByCustomerMobile: (customer) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `INSERT IGNORE INTO ${customerTableName} SET ?`,{
              [customerFields.customerId] : customer.customerId,
              [customerFields.customerName] : customer.customerName,
              [customerFields.customerMobile] : customer.customerMobile,
              },
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results);
            }
          );
        })
      },
    // getCustomerEvenNotExistByCustomerMobile: (customer) => {
    //     return new Promise((resolve, reject) => {
    //       pool.query(
    //         `INSERT INTO ${customerTableName} (${customerFields.customerName}, ${customerFields.customerMobile}) SELECT * FROM (SELECT ${customer.customerName},${customer.customerMobile}) AS tmp WHERE NOT EXISTS (SELECT ${customerFields.id} FROM ${customerTableName} WHERE ${customerFields.customerMobile} = ?) LIMIT 1`,
    //         [customer.customerMobile],
    //         (error, results, fields) => {
    //           if (error) {
    //             return reject(error);
    //           }
    //           return resolve(results);
    //         }
    //       );
    //     })
    //   },

    
      getCustomerList: (offset,limit, searchQuery) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select ${customerFields.id},${customerFields.customerId}, ${customerFields.customerName}, ${customerFields.customerMobile}, ${customerFields.createdAt} from ${customerTableName} WHERE ${customerFields.customerId} LIKE '%${searchQuery}%' OR ${customerFields.customerName} LIKE '%${searchQuery}%' OR ${customerFields.customerMobile} LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`,
            [limit,offset],
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results);
            }
          );
        });
      },
    
      updateCustomer: (id, data) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `update ${customerTableName} set ${customerFields.customerId} = ?, ${customerFields.customerName} = ? ,${customerFields.customerMobile} = ? where ${customerFields.id} = ?`,
            [
              data.customerId,
              data.customerName,
              data.customerMobile,
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
      
      updateAllBookingCustomer: (mobile) => {
          return new Promise((resolve, reject) => {
              console.log(`QUERY::::: update ${bookingTableName} INNER JOIN ${customerTableName} on ${bookingTableName}.${bookingFields.customerMobile} = ${customerTableName}.${customerFields.customerMobile} set ${bookingTableName}.${bookingFields.customerId} = ${customerTableName}.${customerFields.customerId}, ${bookingTableName}.${bookingFields.customerName} = ${customerTableName}.${customerFields.customerName}, ${bookingTableName}.${bookingFields.customerMobile} = ${customerTableName}.${customerFields.customerMobile} where ${customerTableName}.${bookingFields.customerMobile} = ${mobile}`)
          pool.query(
            `update ${bookingTableName} INNER JOIN ${customerTableName} on ${bookingTableName}.${bookingFields.customerMobile} = ${customerTableName}.${customerFields.customerMobile} set ${bookingTableName}.${bookingFields.customerId} = ${customerTableName}.${customerFields.customerId}, ${bookingTableName}.${bookingFields.customerName} = ${customerTableName}.${customerFields.customerName}, ${bookingTableName}.${bookingFields.customerMobile} = ${customerTableName}.${customerFields.customerMobile} where ${customerTableName}.${bookingFields.customerMobile} = ?`,
            [
              mobile
            ],
            (error, results) => {
              if (error) {
                  console.log(`Error=> => ${error}`);
                return reject(error);
              }
              console.log(`Result => => ${results}`);
              return resolve(results);
            }
          );
        })
      },
    
      deleteCustomer: (id) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `delete from ${customerTableName} where ${customerFields.id} = ?`,
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