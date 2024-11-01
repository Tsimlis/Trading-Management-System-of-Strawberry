const connection = require('../configs/database');
const config = require('../configs');


module.exports = {

    // ดึงข้อมูลราคาขายส่ง
    priceStore(){
        return new Promise((resolveId, rejectId) => {
            const sql = {
                store: `SELECT DISTINCT w_sale_id FROM tb_selling_wholesale  ORDER BY RAND()`, // WHERE DATE(w_created) = CURDATE()
                select: `SELECT * FROM tb_selling_wholesale WHERE ? ORDER BY w_updated DESC ` // AND DATE(w_created) = CURDATE() 
            };
            connection.query(sql.store, (errorId, resultId) => {
                if(errorId) return rejectId(errorId);
                const id = resultId

                const table = id.map((item) => {
                    return new Promise((resolve, reject) => {
                        connection.query(sql.select, item, (error, result) => {
                            if(error) return reject(error);
                            resolve(result[0])
                        })
                    })
                    
                });
                Promise.all(table).then(resultAll => resolveId(resultAll)).catch(error => rejectId(error))
            });
        })
    },

    //  บันทึกรายการสั่งซื้อ
    saveOrder(value){
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tb_order 
                            (or_customer_id, or_customer_name, or_sale_id, or_sale_name, or_free, or_total, or_pay, or_list, or_imagePay) 
                        VALUES (?,?,?,?,?,?,?,?,?)`;
            const column = [value.customer_id, value.customer_name, value.sale_id, value.sale_name, value.sale_free, 
                            value.sale_total, value.sale_pay, JSON.stringify(value.sale_list), value.imagePay]
            connection.query(sql, column, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    //เพิ่มรูปจ่ายเงินคืน
    rePay(id, value){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE tb_order SET or_imageRepay = ?, or_Repay = ?, or_updated = NOW() WHERE or_id = ${id}`;
            connection.query(sql, [value.or_imageRepay, value.or_Repay], (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },


    //แสดงข้อมูลตารางลงขายปลีกทั้งหมด
    retail(){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_selling_retail  ORDER BY RAND()`; // WHERE DATE(r_created) = CURDATE()
            connection.query(sql, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // บันทึกรายการขายปลีกลงตะกร้าสินค้า
    toBasket( value){
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO tb_basket (bas_customer_id, bas_customer_name, bas_sale_id, bas_sale_name, bas_free, bas_retail, bas_whole)
                            VALUES (?,?,?,?,?,?,?)`;
            const column = [value.bas_customer_id, value.bas_customer_name, value.bas_sale_id, value.bas_sale_name, 
                            value.bas_free, JSON.stringify(value.bas_retail), JSON.stringify(value.bas_whole)]
            connection.query(sql, column, (error, result) => {
                if(error) reject(error);
                resolve(result)
            })
        })
    },
    check(customer, id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_basket WHERE  JSON_EXTRACT(bas_retail, '$.id') = ${id} AND bas_customer_id = ${customer}`;
            connection.query(sql, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ดึงรายการในตะกร้า จาก id ผู้ซื้อ
    showBasket(id){
        return new Promise((resolveAll, rejectAll) => {
            const sql = `SELECT * FROM tb_basket 
                        WHERE bas_customer_id = ${id}
                        ORDER BY bas_updated DESC`;
            connection.query(sql, (errorAll, resultAll) => {
                if (errorAll) return rejectAll(errorAll);
                resolveAll(resultAll);
            });
        });    
    },

    // แก้ไขรายการขายปลีกในตะกร้า แบบ ตัวเดียว
    editBasket(id, value){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE tb_basket SET bas_retail = ?, bas_whole = ? WHERE bas_id = ?`;
            connection.query(sql, [JSON.stringify(value.bas_retail), JSON.stringify(value.bas_whole), id], (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },


    // ลบรายการในตะกร้า
    deleteBasket(id) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM tb_basket WHERE bas_id = ?`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },


    // ดึงข้อมูลตารางคำสั่งซื้อ
    showOrder(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_order WHERE or_customer_id = ? ORDER BY or_created ASC`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ดึงข้อมูลตารางคำสั่งซื้อที่ส่งแล้ว
    sendOrder(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_order WHERE or_customer_id = ? AND or_status = 'send' ORDER BY or_send ASC`;
            connection.query(sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },


    // ยกเลิกคำสั่งซื้อ ด้วยการเปลี่ยนสุถานะเป็น  Cancer
    canCer(id){
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE tb_order SET or_status = 'cancer', or_updated = NOW() WHERE or_id = ?`, id, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },

    // ลบข้อมูลออกจากตาราง
    deleteOrder(id){
        return new Promise((resolve, reject) => {
            connection.query(`DELETE FROM tb_order WHERE or_id = ?`, id, (error, result) => {
                if(error) reject(error);
                resolve(result)
            })
        })
    },

    // เช็คน้ำหนักคงเหลือของร้าน
    checkWeigth(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT r_stock FROM tb_selling_retail WHERE r_id = ? `; 
            connection.query( sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result[0])
            })
        })
    },
    checkSale(id){
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM tb_whole_weigth WHERE sw_sale_id = ? `; 
            connection.query( sql, id, (error, result) => {
                if(error) return reject(error);
                resolve(result[0])
            })
        })
    },

    // น้ำหนักที่ซื้อลบกับน้ำหนักที่คงเหลือของร้าน
    dedRetail(value){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE tb_selling_retail SET 
                            r_stock = r_stock - ${value.weigth * value.multiply},
                            r_updated = NOW()
                        WHERE r_id = ${value.id}`;
            connection.query(sql, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    },
    deductWhole(value){
        return new Promise((resolve, reject) => {
            const sql = `UPDATE tb_whole_weigth SET 
                            sw_xxl = sw_xxl - ? , 
                            sw_xl = sw_xl - ? , 
                            sw_l = sw_l - ? , 
                            sw_m = sw_m - ? , 
                            sw_s = sw_s - ? , 
                            sw_mix = sw_mix - ? , 
                            sw_drying = sw_drying - ? , 
                            sw_juice = sw_juice - ? ,
                            sw_updated = NOW()
                        WHERE sw_sale_id = ?`;

            const values = [
                value.xxl.weigth , 
                value.xl.weigth , 
                value.l.weigth , 
                value.m.weigth , 
                value.s.weigth , 
                value.mix.weigth , 
                value.drying.weigth , 
                value.juice.weigth , 
                value.id
            ];
            connection.query(sql, values, (error, result) => {
                if(error) return reject(error);
                resolve(result)
            })
        })
    }



}