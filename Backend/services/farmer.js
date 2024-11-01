const connection = require('../configs/database');
const config = require('../configs');

module.exports = {


    // // อัพเดทการเปลี่ยนสถานะทุกคนก่อนเที่ยงคืน ทุกวัน
    // upDateAll(){
    //     return new Promise((resolve, reject) => {
    //       const queries = [
    //         'UPDATE table1 SET column1 = value1 WHERE condition1',
    //         'UPDATE table2 SET column2 = value2 WHERE condition2',
    //         'UPDATE table3 SET column3 = value3 WHERE condition3'
    //       ];
    
    //       const queryPromises = queries.map((query) => {
    //           return new Promise((resolve, reject) => {
    //               connection.query(query, (error, results) => {
    //                   if (error) return reject(error);
    //                   resolve(results);
    //               });
    //           });
    //       });
    //       return Promise.all(queryPromises);
    //     })
    // },



    // บันทึกน้ำหนักขายให้ร้านซื้อ
    onCreate(value){
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO tb_farmer SET ?', value, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // แสดงร้านที่ขายให้ทั้งหมด
    findShow(id){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_farmer WHERE ? AND DATE(f_created) = CURDATE() ORDER BY f_updated DESC`, id, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },

    // เกษตรกรเสนอให้กับร้านค้าล่าสุด
    findMatch(id){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_farmer WHERE ? AND DATE(f_created) = CURDATE() ORDER BY f_updated DESC`, id, (error, result) => {
                if (error) return reject(error);
                resolve(result[0])
                
            });
        });
    },

    timerSend(value){
        return new Promise((resolve, reject) => {
            const $sql = `UPDATE tb_farmer SET f_order = '${'not'}', f_updated = NOW() WHERE f_id = ?`
            connection.query( $sql, value, (error, result) => {
                if(error) return reject(error);
                resolve(result);
            })
        })
    },

    // แสดงข้อมูลแต่ละร้าน โดยคัดตัวล่าสุด
    find() {
        return new Promise((resolve, reject) => {
          const sql = {
            distinct: 'SELECT DISTINCT b_user_id FROM tb_buying',
            baseQuery: 'SELECT * FROM tb_buying WHERE b_user_id = ? ', //AND DATE(b_created) = CURDATE()
            orderBy: ' ORDER BY b_updated DESC'
          };
      
          const table = [];
      
          // Step 1: Get distinct b_user_id values
          connection.query(sql.distinct, (error, distinctResults) => {
            if (error) return reject(error);
            
            // Step 2: Process each distinct b_user_id
            const promises = distinctResults.map((item) => {
              return new Promise((resolveInner, rejectInner) => {
                connection.query(sql.baseQuery + sql.orderBy, item.b_user_id, (error, results) => {
                  if (error) {
                    rejectInner(error);
                  } else {
                    table.push(results[0]); // Push each result set into the table array
                    resolveInner(); // Resolve the inner promise
                  }
                });
              });
            });
      
            // Step 3: Execute all promises and resolve with table array
            Promise.all(promises).then(() => {
                resolve(table); // Resolve the outer promise with the table array
              })
              .catch((error) => {
                reject(error); // Reject with any error encountered
              });
          });
        });
    },




    // ส่วนของการเสนอราคาให้ร้านค้าเข้ามา
    onPresent(value){
        return new Promise((resolve, reject) => {
            const $query = `INSERT INTO tb_farmer_price 
                            (fp_farmer_id, fp_name, fp_image, fp_detail, fp_price_xxl, fp_price_xl, fp_price_l, fp_price_m, fp_price_s) 
                        VALUES (?,?,?,?,?,?,?,?,?)`;
            connection.query($query, [value.fp_farmer_id, value.fp_name, value.fp_image, value.fp_detail, 
                    JSON.stringify(value.fp_price_xxl), JSON.stringify(value.fp_price_xl), JSON.stringify(value.fp_price_l), 
                    JSON.stringify(value.fp_price_m), JSON.stringify(value.fp_price_s)
                ], (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // แสดงข้อมูลเพื่อให้เกษตรกร เลือกว่าจะขายให้กับใคร  exp: หมดเวลาการเสนอ, nexp: ยังไม่หมดเวลา, pending: ขอการยืนยัน, allowed: ยืนยันขาย, success: มีการขาย/ชำระแล้ว
    priceFarmer(id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_farmer_price WHERE ? AND fp_exp IN ('success','pending','allowed') AND DATE(fp_created) = CURDATE()`, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // เปลี่ยนสถานะร้านที่ไม่ยืนยันเป็น exp ให้ร้านที่ยืนยันสถานะเป็น allowed
    changeEXP(id, value) {
        const EXP = value.map((item) => {
            return new Promise((resolveID, rejectID) => {
                connection.query(`UPDATE tb_farmer_price SET fp_exp = 'exp', fp_updated = NOW() WHERE fp_id = ? `, [item.fp_id], (errorID, resultID) => {
                    if(errorID) return rejectID(errorID);
                    resolveID(resultID)
                })
            });
        });
        Promise.all(EXP)
            .then(() => {
                // หลังจากที่ทุกการอัปเดตใน EXP เสร็จสิ้น, อัปเดตสำหรับ id
                return new Promise((resolve, reject) => {
                    connection.query( `UPDATE tb_farmer_price SET fp_exp = 'allowed', fp_updated = NOW() WHERE ?`, id, (error, result) => {
                            if (error) return reject(error);
                            resolve(result);
                        }
                    );
                });
            }).catch((error) => { console.error('An error occurred:', error) });
    },


}