// const isProduction = process.env.ENV === 'production'; //เรียกแล้วไม่เข้าเลยต้องกำหนดเองไปก่อน และเรียกตาราง database แยกไม่ได้ใช้ตัวเดียวกันก่อน
const isProduction = false; //ถ้าทำ production ให้เป็น true

module.exports = {
    limitPage: 10,
    isProduction: isProduction,
    // strict: isProduction
    // publicPath: process.env.NODE_ENV === 'production'
};