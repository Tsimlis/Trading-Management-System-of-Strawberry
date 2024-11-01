const connection = require('../configs/database');
const config = require('../configs');
const { Ciphers } = require('../configs/security');

module.exports = {

    // แสดงข้อมูลและการแบ่งหน้า
    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: 'SELECT COUNT(*) AS rows FROM tb_users',
                select: 'SELECT * FROM tb_users'
            };

            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSearch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSearch;
                sqls.select += sqlSearch;
            }

            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY u_updated DESC';

            // หาจำนวนแถว
            connection.query(sqls.count, (error, result) => {
                if (error) return reject(error);
                const items = { result: [], rows: result[0].rows, limit: limitPage };

                // แบ่งหน้า page
                sqls.select += ` LIMIT ${connection.escape(startPage)},${limitPage}`;
                connection.query(sqls.select, (error, result) => {
                    if (error) return reject(error);
                    items.result = result;
                    resolve(items);
                });
            });
        });
    },

    findOne(column) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_users WHERE ?', column, (error, result) => {
                if (error) return reject(error);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },

    onCreate(value) {
        return new Promise((resolve, reject) => {
            value.u_password = Ciphers(value.u_password)
            connection.query('INSERT INTO tb_users SET ?', value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },

    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            const $query = `
                UPDATE tb_users SET
                    u_image= ?,
                    u_username = ?,
                    u_password = ?,
                    u_fullname = ?,
                    u_email = ?,
                    u_phone = ?,
                    u_lineId = ?,
                    u_address = ?,
                    u_promptPay = ?,
                    u_updated = NOW()
                WHERE 
                    u_id = ?`;
            connection.query($query, [value.u_image, value.u_username, value.u_password, value.u_fullname, value.u_email,
                value.u_phone, value.u_lineId, value.u_address, value.u_promptPay, id],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
            connection.query(`UPDATE tb_buying SET b_image = ? WHERE b_user_id = ?`, [value.u_image, id])
        });
    },

    //ทำการ update การแก้ไข
    onUpdateStore(id, value){
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE tb_users SET ?, u_updated = NOW() WHERE u_id = ${id}`, value, (error, result) => {
                if(error) return reject(error)
                resolve(result);
            })
        })
    },

    //เช็คว่า id ที่ทำการแก้ไขมีอยู่ในระบบหรือเปล่า หรือลบจากระบบไปแล้ว
    findById(id){
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_users WHERE u_id = ?`, [id], (error, result) => {
                if(error) return reject(error)
                resolve(result.length > 0 ? result[0] : null);
            })
        })
    },

    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM tb_users WHERE u_id=?', [id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },

    getAll() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT COUNT(*) AS count FROM tb_users WHERE u_store = 'pending' AND u_role IN ('buying', 'selling')`, (error, result) => {
                if (error) return reject(error);
                resolve(result[0]);
            });
        });
    },
};