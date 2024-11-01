const connection = require('../configs/database');
const config = require('../configs');


module.exports = {

    // ทำการบันทึกประวัติการซื้อเมื่อถึงเวลาที่ตั้งไว้
    upDateTotal(value){
          return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tb_selling_total 
                          (t_sale_id, t_sale_name, t_xxl, t_xl, t_l, t_m, t_s, t_mix, t_drying, t_juice, t_total, t_free, t_pay)
                          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            
            const column = [value.t_sale_id, value.t_sale_name, JSON.stringify(value.t_xxl), JSON.stringify(value.t_xl), JSON.stringify(value.t_l), 
                            JSON.stringify(value.t_m), JSON.stringify(value.t_s), JSON.stringify(value.t_mix), JSON.stringify(value.t_drying),
                            JSON.stringify(value.t_juice), JSON.stringify(value.t_total), value.t_free, JSON.stringify(value.t_pay) ]
  
            connection.query( sql , column, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
          })
    },
    listToday(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT t_id FROM tb_selling_total WHERE t_sale_id = ? AND DATE(t_created) = CURDATE() ORDER BY t_updated DESC`  // GROUP BY DATE(t_created)
          connection.query(sql, id, (error, result) => {
            if(error) return reject(error);
            resolve(result)
          })
        })
      },
      deleteWeek(id, value){
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM tb_selling_total WHERE ? `;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
      },


    // บันทึกราคาขายส่ง
    Save(value) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO tb_selling_wholesale SET ?`, value, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    //แสดงข้อมูลราคาขายส่ง
    priceWhole(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_selling_wholesale 
                        WHERE w_sale_id = ?  ORDER BY w_updated DESC;` // AND DATE(w_created) = CURDATE()
            connection.query( sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result[0])
            })
        })
    },

    // บันทึกจำนวนน้ำหนักขายส่ง
    weigthWhole(value){
        return new Promise((resolve, reject) => {
            const select = `SELECT * FROM tb_whole_weigth WHERE sw_sale_id = ${value.sw_sale_id}`
            const sqlIN = `INSERT INTO tb_whole_weigth SET ? `;
            const sql = `UPDATE tb_whole_weigth SET 
                            sw_xxl = sw_xxl + ?,
                            sw_xl = sw_xl + ?,
                            sw_l = sw_l + ?,
                            sw_m = sw_m + ?,
                            sw_s = sw_s + ?,
                            sw_mix = sw_mix + ?,
                            sw_drying = sw_drying + ?,
                            sw_juice = sw_juice + ?,
                            sw_updated = NOW()
                        WHERE sw_sale_id = ?`;
            
            const val = [value.sw_xxl, value.sw_xl, value.sw_l, value.sw_m, value.sw_s, value.sw_mix, value.sw_drying, value.sw_juice, value.sw_sale_id]
            
            connection.query(select, (errorS, resultS) => { 
                if(errorS) return reject(errorS)

                if (resultS == '') {
                    connection.query( sqlIN, value, (error, result) => {
                        if(error) return reject(error);
                        resolve(result)
                    })
                } else {
                    connection.query( sql, val, (error, result) => {
                        if(error) return reject(error);
                        resolve(result)
                    })
                }
            })
            
            
        })
    },

    //แสดงข้อมูลน้ำหนักลงขาย ขายส่ง
    showWeigth(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_whole_weigth 
                        WHERE sw_sale_id = ? ORDER BY sw_updated DESC`; //  AND DATE(sw_created) = CURDATE()
            connection.query( sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result[0])
            })
        })
    },

    // บันทึกรายการนำเสนอขายปลีก
    saveRetail(value) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tb_selling_retail SET ?`;
            connection.query(sql, value, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ดึงข้อมูลสินค้าขายปลีกของร้านนั้นๆ
    showRetail(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_selling_retail WHERE r_sale_id = ? ORDER BY r_updated DESC`; //  AND DATE(r_created) = CURDATE()
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ทำการแก้ไขรายการสินค้าขายปลีก 1 รายการ
    retailItem(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_selling_retail WHERE r_id = ?`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result[0])
            })
        })
    },

    // ลบรายการสินค้าขายปลีก
    deleteItem(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM tb_selling_retail WHERE r_id = ?`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // แก้ไขรายการสิ้นค้าขายปลีก 1 รายการ
    editRetail(id, value){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE tb_selling_retail SET r_image = ?, r_look = ?, r_weigth = ?, r_price = ?, r_free = ?, r_updated = NOW() WHERE r_id = ? `;
            connection.query(sql, [value.r_image, value.r_look, value.r_weigth, value.r_price, value.r_free, id], (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ทำการเปลี่ยนสุุถานะตาราง order เมื่อร้านส่งสินค้า
    orderStatus(id, value){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE tb_order SET or_tracking = '${value.tracking || ''}', 
                            or_courier = '${value.courier || ''}', 
                            or_status = '${value.status}',
                            or_send = NOW(),
                            or_updated = NOW() 
                        WHERE or_id = ${id}`;
            connection.query(sql, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    
    // ดึงข้อมูลตารางคำสั่งซื้อ
    storeOrder(id, value){
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM tb_order WHERE or_sale_id = ?';
            if (value) sql += ' AND or_status = ?'
            connection.query(sql, [id, value], (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },
    
    
    // ดึงข้อมูลตารางคำสั่งซื้อ
    orderDay(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_order WHERE or_sale_id = ? AND or_status IN ('send','success') AND DATE(or_updated) = CURDATE() ORDER BY or_receive DESC`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ดึงข้อมูลที่ส่งแล้ว
    sendAll(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_order WHERE or_sale_id = ? AND or_status = 'send' ORDER BY or_receive DESC`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ดึงข้อมูลที่รอการจัดส่ง
    sendNot(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_order WHERE or_sale_id = ? AND or_status = 'order' ORDER BY or_receive DESC`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ดึงข้อมูลตารางคำสั่งซื้อที่เป็นประวัติสำเร็จทั้งหมด
    successAll(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_order WHERE or_sale_id = ? AND or_status IN ('success','send') ORDER BY or_receive ASC `;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // แสดงข้อมูลสรุปยอดทั้งหมดของร้าน
    totalTable(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_selling_total WHERE t_sale_id = ? AND YEARWEEK(t_updated) = YEARWEEK(NOW()) `  // GROUP BY DATE(t_created)
          connection.query(sql, id, (error, result) => {
            if(error) return reject(error);
            resolve(result)
          })
        })
      },



}