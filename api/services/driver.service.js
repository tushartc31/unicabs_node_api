const pool = require("../../database/mysql");
const {driverTableName,driverFields} = require("../../constants/db_tables_field")

module.exports = {
    create : (data) =>  {
        return new Promise((resolve, reject) => {
            pool.query(
                `insert into ${driverTableName}(${driverFields.driverId},${driverFields.driverName}, ${driverFields.driverMobile})
                 values(?,?,?)`, 
                 [
                    data.driverId,
                    data.driverName,
                    data.driverMobile
                 ],
                 (error, result) => {
                    if(error){
                      console.log("driver",error);
                        return reject(error);
                    }
                    return resolve(result);
                 }
            );
        })
        
    },

    getDriverByMobile: (mobile) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${driverTableName} where ${driverFields.driverMobile} = ?`,
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
    
      getDriverByDriverId: (driverId) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${driverTableName} where ${driverFields.driverId} = ?`,
            [driverId],
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results[0]);
            }
          );
        })
      },
    
      createDriverIfNotExistByDriverMobile: (driver) => {
         return new Promise((resolve, reject) => {
           pool.query(
             `INSERT IGNORE INTO ${driverTableName} SET ?`,{
              [driverFields.driverId] : driver.driverId,
              [driverFields.driverName] : driver.driverName,
              [driverFields.driverMobile] : driver.driverMobile,
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

      getDriverList: (offset,limit, searchQuery) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select ${driverFields.id},${driverFields.driverId}, ${driverFields.driverName},${driverFields.driverMobile}, ${driverFields.createdAt} from ${driverTableName} WHERE ${driverFields.driverId} LIKE '%${searchQuery}%' OR ${driverFields.driverName} LIKE '%${searchQuery}%' OR ${driverFields.driverMobile} LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`,
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
    
      updateDriver: (id, data) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `update ${driverTableName} set ${driverFields.driverId}=?, ${driverFields.driverName}=?, ${driverFields.driverMobile}=? where ${driverFields.id} = ?`,
            [
              data.driverId,
              data.driverName,
              data.driverMobile,
              id,
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
    
      deleteDriver: (id) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `delete from ${driverTableName} where ${driverFields.id} = ?`,
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