const connection = require('../configs/database');
const { password_hash, password_verify, Ciphers, Deciphers } = require('../configs/security');
const table = 'tb_users';

module.exports = {

    onRegister(value) {
        return new Promise((resolve, reject) => {
            // value.u_password = password_hash(value.u_password); // การเข้ารหัสตัวเดิม ซึ่งไม่มีถอดกลับ
            value.u_password = Ciphers(value.u_password); // ตัวเข้ารหัสใช้จริง
            // value.u_password = Deciphers(value.u_password); // ทดสอบถอดรหัสกลับ
            connection.query('INSERT INTO tb_users SET ?', value, (error, result) => {
                if (error) return reject(error);
                resolve(result);
                
            });
        });
    },
    // เช็กชื่อซ้ำกัน
    checkData(value) {
        return new Promise((resolve, reject) => {
            
            connection.query( `SELECT * FROM tb_users WHERE u_username = '${value.u_username}'`, (error, result) => {
                if(error) return reject(error)
                if (result != '') resolve('ใส่ชื่อเข้าระบบใหม่')
            })
            
            connection.query( `SELECT * FROM tb_users WHERE u_fullname = '${value.u_fullname}'`, (error, result) => {
                if(error) return reject(error)
                result != '' ? resolve('มีชื่อผู้ใช้งานนี้แล้ว') : resolve('');
            })

        })
    },

    onLogin(value) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM tb_users WHERE u_username = ? AND u_store = 'pass'`, [value.u_username], (error, result) => {
                if (error) return reject(error);
                if (result.length > 0) {
                    const userLogin = result[0];
                    if (password_verify(value.u_password, userLogin.u_password)) {
                        delete userLogin.u_password;
                        delete userLogin.u_created;
                        delete userLogin.u_updated;
                        return resolve(userLogin);
                    }
                }
                reject(new Error('Invalid username or password'));
            });
        });
    }
};

// เมื่อเป็น product แล้ว จะสร้างชื่ออัตโนมัติเพื่อให้แอดมินสามารถเข้าไปได้ โดยไม่ต้องลงทะเบียน
// Auto generate admin when user exists
connection.query(`SELECT * FROM ${table} WHERE u_username = 'admin'`, (error, result) => {
    if (error) return;
    if (result.length > 0) return;
    const generateAdmin = {
        u_username: 'admin',
        u_password: Ciphers('admin'),
        u_firstname: 'Administrator',
        u_lastname: 'Administrator',
        u_role: 'admin'
    };
    connection.query(`INSERT INTO ${table} SET ?`, generateAdmin, (error, result) => {
        if (error) return;
        console.log('เพิ่ม admin สำเร็จ', result);
    });
});