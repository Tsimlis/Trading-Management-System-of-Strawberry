const connection = require('../configs/database');
const config = require('../configs')
const table = 'tb_news'

module.exports = {

    find(value) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: 'SELECT COUNT(*) AS rows FROM tb_news',
                select: 'SELECT * FROM tb_news'
            };

            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSerch;
                sqls.select += sqlSerch;
            }

            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY n_updated DESC';

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
    onCreate(value) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO tb_news SET ?', value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    findOne(column) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM tb_news WHERE ?', column, (error, result) => {
                if (error) return reject(error);
                resolve(result.length > 0 ? result[0] : null);
            });
        });
    },
    onDelete(id) {
        return new Promise((resolve, reject) => {
            connection.query('DELETE FROM tb_news WHERE n_id=?', [id], (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onUpdate(id, value) {
        return new Promise((resolve, reject) => {
            const $query = `
                UPDATE tb_news SET
                    n_title = ?,
                    n_detail = ?,
                    n_profile = ?,
                    n_image = ?,
                    n_updated = NOW()
                WHERE 
                    n_id = ?`;
            connection.query($query, [value.n_title, value.n_detail, value.n_profile, value.n_image, id],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
        });
    },








    // ส่วนของราคา
    // บันทึกราคา
    onCreatePrice(value) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO tb_news_price SET ?', value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
        });
    },
    onUpdatePrice(id, value){
        return new Promise((resolve, reject) => {
            const $query = `
                UPDATE tb_news_price SET
                    p_xxl = ?,
                    p_xl = ?,
                    p_l = ?,
                    p_m = ?,
                    p_s = ?,
                    p_updated = NOW()
                WHERE 
                    p_id = ?`;
            connection.query($query, [value.p_xxl, value.p_xl, value.p_l, value.p_m, value.p_s, id],
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                });
        })
    },
    findPrice(value) {
        return new Promise((resolve, reject) => {
            const limitPage = config.limitPage;
            const startPage = ((value.page || 1) - 1) * limitPage;
            const sqls = {
                count: 'SELECT COUNT(*) AS rows FROM tb_news_price',
                select: 'SELECT * FROM tb_news_price'
            };

            if (value.search_key && value.search_text) {
                const key = value.search_key;
                const txt = value.search_text;
                const sqlSerch = ` WHERE ${connection.escapeId(key)} LIKE ${connection.escape(`%${txt}%`)}`;
                sqls.count += sqlSerch;
                sqls.select += sqlSerch;
            }

            // เรียงลำดับข้อมูล
            sqls.select += ' ORDER BY p_updated DESC';

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

}