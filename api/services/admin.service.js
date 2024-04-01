const pool = require("../../database/mysql");
const {adminTableName,adminFields} = require("../../constants/db_tables_field")
const moment = require('moment');

module.exports = {
    create : (data) =>  {
        return new Promise((resolve, reject) => {
            pool.query(
                `insert ignore into ${adminTableName} SET ?`, 
                { 
                  [adminFields.userName] : data.userName,
                  [adminFields.email] :  data.email,
                  [adminFields.mobile] :  data.mobile, 
                  [adminFields.password] :  data.password, 
                  [adminFields.userRole] :  data.userRole
                },
                 (error, result) => {
                    if(error){
                      console.log("admin",error);
                        return reject(error);
                    }
                    return resolve(result);
                 }
            );
        })
        
    },

    getAdminByMobile: (mobile) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${adminTableName} where ${adminFields.mobile} = ?`,
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
    
      getAdminByAdminId: (id) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select * from ${adminTableName} where ${adminFields.id} = ?`,
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
    
      getAdminList: () => {
        return new Promise((resolve, reject) => {
          pool.query(
            `select ${adminFields.id}, ${adminFields.userName}, ${adminFields.email}, ${adminFields.mobile}, ${adminFields.userRole}, ${adminFields.createdAt} from ${adminTableName}`,
            [],
            (error, results, fields) => {
              if (error) {
                return reject(error);
              }
              return resolve(results);
            }
          );
        });
      },
    
      updateAdmin: (id, data) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `update ${adminTableName} set ${adminFields.userName}=?, ${adminFields.email}=?, ${adminFields.password}=?, ${adminFields.mobile}=?, ${adminFields.userRole}=? where ${adminFields.id} = ?`,
            [
              data.userName,
              data.email,
              data.password,
              data.mobile,
              data.userRole,
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
    
      deleteAdmin: (id) => {
        return new Promise((resolve, reject) => {
          pool.query(
            `delete from ${adminTableName} where ${adminFields.id} = ?`,
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