const connection = require('../configs/database');
const config = require('../configs')

module.exports = {


  // อัพเดทการเปลี่ยนสถานะทุกคนก่อนเที่ยงคืน ทุกวัน
    upDateAll(){
        return new Promise((resolve, reject) => {
          const queries = [
            'UPDATE table1 SET column1 = value1 WHERE condition1',
            'UPDATE table2 SET column2 = value2 WHERE condition2',
            'UPDATE table3 SET column3 = value3 WHERE condition3'
          ];
    
          const queryPromises = queries.map((query) => {
              return new Promise((resolve, reject) => {
                  connection.query(query, (error, results) => {
                      if (error) return reject(error);
                      resolve(results);
                  });
              });
          });
          return Promise.all(queryPromises);
        })
    },
    upDateTotal(value){
        return new Promise((resolve, reject) => {
          const sql = `INSERT INTO tb_buying_total 
                        (t_buy_id, t_buy_name, t_xxl, t_xl, t_l, t_m, t_s, t_total, t_pay)
                        VALUES (?,?,?,?,?,?,?,?,?)`;
          
          const column = [value.t_buy_id, value.t_buy_name, JSON.stringify(value.t_xxl), JSON.stringify(value.t_xl), JSON.stringify(value.t_l), 
                          JSON.stringify(value.t_m), JSON.stringify(value.t_s), JSON.stringify(value.t_total), JSON.stringify(value.t_pay) ]

          connection.query( sql , column, (error, results) => {
              if (error) return reject(error);
              resolve(results);
          });
        })
    },



    // สร้างข้อมูลเสนอราคาใหม่
    onCreate(value) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO tb_buying SET ?', value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },

    

    findId(column){
        return new Promise((resolve, reject) => {
            const sql = {one:'SELECT * FROM tb_buying WHERE ?'}
            // เรียงลำดับข้อมูล
            sql.one += ' ORDER BY b_updated DESC';
            
            connection.query(sql.one, column, (error, result) => {
                if(error) return reject(error);
                resolve(result.length > 0 ? result[0] : null);
            })
        })
    },



    // ส่วนของการดึงข้อมูล เกษตรกร
    findFarmer(id) {
      return new Promise((resolve, reject) => {
        const sql = {
          distinct: 'SELECT DISTINCT f_farmer_id FROM tb_farmer',
          baseQuery: 'SELECT * FROM tb_farmer WHERE f_buying_id = ? AND f_farmer_id = ? AND DATE(f_created) = CURDATE()',
          orderBy: ' ORDER BY f_updated DESC'
        };
        const table = [];
        connection.query(sql.distinct, (error, distinctResults) => {
          if (error) return reject(error);
          
          
          const promises = distinctResults.map((item) => {
            return new Promise((resolveInner, rejectInner) => {
              connection.query(sql.baseQuery + sql.orderBy, [id, item.f_farmer_id], (error, results) => {
                if (error) {
                  rejectInner(error);
                } else {
                  if(results.length > 0) table.unshift(results[0]);
                  resolveInner();
                }
              });
            });
          });
          Promise.all(promises).then(() => { resolve(table) }).catch((error) => { reject(error)});
        });
      });
    },
    
    
    orderStatus(id, status){
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE tb_farmer SET f_order = '${status}', f_updated = NOW() WHERE f_id = ${id}`, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },


    // ข้อมูลราคาเสนอเกษตรกร
    priceFarmer(){
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM tb_farmer_price WHERE fp_exp != 'exp' AND DATE(fp_created) = CURDATE() ORDER BY fp_created DESC`, (error, result) => {
          if(error) return reject(error);
          resolve(result);
        })
      })
    },

    expFarmer(id, user){
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE tb_farmer_price SET fp_updated = NOW(), fp_exp= '${'pending'}', fp_buy_id=?, fp_buy_name=? WHERE fp_id = ?`, [user.fp_buy_id, user.fp_buy_name, id], (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      } )
    },


    // เปลี่ยนสถานะ fp_exp เป็น success และทำการบันทึกจำนวนเงิน
    onPay(id, pay){
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE tb_farmer_price SET fp_updated = NOW(), fp_exp = 'success', fp_pay = '${pay.fp_pay}', 
                          fp_imagePay = '${pay.fp_imagePay}' WHERE fp_id = ? `, id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },


    // แสดงข้อมุลเกษตรกรที่ขายแล้ว
    onFarmer(id){
      return new Promise((resolve, reject) => {
        const sql = ` SELECT * FROM tb_farmer 
                      WHERE f_buying_id = ? AND ((f_order = 'success' OR f_order = 'allowed' ) AND DATE(f_created) = CURDATE() ) `
        connection.query(sql, id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },


    // รวมน้ำหนักรับซื้อแยกขนาด
    sumWeigth(id){
      return new Promise((resolve, reject) => {
        const sqlSum = `SELECT 
                          SUM(f_weigth_xxl) AS total_xxl,
                          SUM(f_weigth_xl) AS total_xl,
                          SUM(f_weigth_l) AS total_l,
                          SUM(f_weigth_m) AS total_m,
                          SUM(f_weigth_s) AS total_s
                        FROM 
                            tb_farmer
                        WHERE 
                            f_buying_id = ? AND f_order = 'success' AND DATE(f_created) = CURDATE() ;`
        connection.query(sqlSum , id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },


    // แสดงข้อมุลเกษตรกรที่ร้านค้าชำระเงินแล้ว
    calculate(id){
      return new Promise((resolve, reject) => {
        const sql = ` SELECT * FROM tb_farmer 
                      WHERE f_buying_id = ? AND f_order = 'success' AND DATE(f_created) = CURDATE() `
        connection.query(sql, id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },

    // แสดงข้อมุลเกษตรกรเสนอราคา ร้านรับซื้อชำระแล้ว
    farmerPost(id){
      return new Promise((resolve, reject) => {
        const sql = ` SELECT * FROM tb_farmer_price 
                      WHERE fp_buy_id = ? AND fp_exp = 'success' AND DATE(fp_created) = CURDATE() `
        connection.query(sql, id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },


    // เปลี่ยนสถานะเมื่อชำระ และใส่จำนวนเงิน
    payOrder(id, value){ 
      return new Promise((resolve, reject) => {
        connection.query(`UPDATE tb_farmer SET f_order = 'success', f_pay = ?, f_imagePay = ?, f_updated = NOW() WHERE f_id = ?`, [value.f_pay, value.f_imagePay, id], (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },

    // แสดงข้อมูลที่มีการ่รับซื้อทั้งหมดของร้านดังกล่าว
    allTable(id){
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM tb_farmer WHERE f_buying_id = ? AND f_order = 'success' `, id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },

    // แสดงข้อมูลที่มีการ่รับซื้อเพิ่มเติม ใน 1 สัปดาห์
    postTable(id){
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM tb_farmer_price WHERE fp_buy_id = ? AND fp_exp = 'success' AND YEARWEEK(fp_created) = YEARWEEK(NOW())`, id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },


    // แสดงข้อมูลรวมทั้งหมดของร้านดังกล่าว
    totalTable(id){
      return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM tb_buying_total WHERE t_buy_id = ? AND YEARWEEK(t_created) = YEARWEEK(NOW())`, id, (error, result) => {
          if(error) return reject(error);
          resolve(result)
        })
      })
    },

};