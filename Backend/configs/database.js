const mysql = require('mysql');
const config = require('./index')
const address = {
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'strawberry_db_2',
    charset: 'utf8'
};
// ถ้าเป็น product ให้เข้าเงื่อนไขนี้ database ตัวใช้งานจริง
// if(config.isProduction) {
//     address.host = "mysql",
//     address.database = 'Strawberry_db';
// }
console.log(address)

const connection = mysql.createConnection(address);

module.exports = connection;