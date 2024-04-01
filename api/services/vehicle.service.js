const pool = require("../../database/mysql");
const {vehicleTableName,vehicleFields} = require("../../constants/db_tables_field")

module.exports = {
    create : (data) =>  {
        return new Promise((resolve, reject) => {
            pool.query(
                `insert into ${vehicleTableName}(${vehicleFields.vehicleId}, ${vehicleFields.vehicleType}, ${vehicleFields.vehicleName}, ${vehicleFields.vehicleNumber})
                 values(?,?,?,?)`, 
                 [
                    data.vehicleId,
                    data.vehicleType,
                    data.vehicleName,
                    data.vehicleNumber
                 ],
                 (error, result) => {
                    if(error){
                      console.log("vehicle",error);
                        return reject(error);
                    }
                    return resolve(result);
                 }
            );
        })
        
    },

    createVehicleIfNotExistByVehicleNumber: (vehicle) => {
      return new Promise((resolve, reject) => {
        pool.query(
          `INSERT IGNORE INTO ${vehicleTableName} SET ?`,{
           [vehicleFields.vehicleId] : vehicle.vehicleId,
           [vehicleFields.vehicleType] : vehicle.vehicleType,
           [vehicleFields.vehicleName] : vehicle.vehicleName,
           [vehicleFields.vehicleNumber] : vehicle.vehicleNumber,
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

    getVehicleByNumber: (vehicleNumber) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${vehicleTableName} where ${vehicleFields.vehicleNumber} = ?`,
            [vehicleNumber],
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results[0]);
            }
          );
        })
      },
    
      getVehicleByVehicleId: (vehicleId) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${vehicleTableName} where ${vehicleFields.vehicleId} = ?`,
            [vehicleId],
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results[0]);
            }
          );
        })
      },
    
      getVehicleList: (offset, limit, searchQuery) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select ${vehicleFields.id},${vehicleFields.vehicleId}, ${vehicleFields.vehicleType}, ${vehicleFields.vehicleName}, ${vehicleFields.vehicleNumber}, ${vehicleFields.createdAt} from ${vehicleTableName} WHERE ${vehicleFields.vehicleId} LIKE '%${searchQuery}%' OR ${vehicleFields.vehicleType} LIKE '%${searchQuery}%' OR ${vehicleFields.vehicleName} LIKE '%${searchQuery}%' OR ${vehicleFields.vehicleNumber} LIKE '%${searchQuery}%' LIMIT ? OFFSET ?`,
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
    
      updateVehicle: (id, data) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `update ${vehicleTableName} set ${vehicleFields.vehicleId}=?, ${vehicleFields.vehicleType}=?, ${vehicleFields.vehicleName}=?, ${vehicleFields.vehicleNumber}=? where ${vehicleFields.id} = ?`,
            [
              data.vehicleId,
              data.vehicleType,
              data.vehicleName,
              data.vehicleNumber,
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
    
      deleteVehicle: (id) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `delete from ${vehicleTableName} where ${vehicleFields.id} = ?`,
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