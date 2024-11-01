const router = require('express').Router();
const { check } = require('express-validator/check');
const { onRegister, onLogin, checkData } = require('../services/account');
const { authenticated } = require('../configs/security');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const CardDir = path.join(uploadDir, 'card');


// หน้าลงทะเบียน
router.post('/register', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty(),
    check('u_fullname').not().isEmpty(),
    check('u_address').not().isEmpty(),
    check('u_phone').isInt().not().isEmpty(),
    check('u_role').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();

        // เช็กว่าผู้ลงทะเบียนมีซ้ำกับฐานข้อมูลหรือไม่
        let chec = "";
        chec = await checkData(req.body);
        if (chec != '') return res.send(chec) 

        //เช็คว่าถ้ามีรูปภาพก็ให้แปลงแล้วใส่ ถ้าไม่มีก็ผ่าน
        if(req.body.u_card != "") {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
            if (!fs.existsSync(CardDir)) fs.mkdirSync(CardDir);
            // แปลงข้อมูลรูปภาพ
            req.body.u_card = base64Img.imgSync(req.body.u_card, CardDir, `card-${Date.now()}`)
                                        .replace(`${CardDir}\\`, '');
        }
        
        res.json(await onRegister(req.body));
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(CardDir, req.body.u_card || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

// เข้าสู่ระบบ
router.post('/login', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        const userLogin = await onLogin(req.body);
        req.session.userLogin = userLogin;
        res.json(userLogin);
    }
    catch (ex) {
        res.error(ex);
    }
});

// ตรวจสอบ user login
router.post('/getUserLogin', authenticated, (req, res) => {
    try {
        res.json( req.session.userLogin );
    }
    catch (ex) { res.error(ex, 401); }
});

// ออกจากระบบ
router.post('/logout', (req, res) => {
    try {
        delete req.session.userLogin;
        res.json({ message: 'Logout' });
    }
    catch (ex) {
        res.error(ex);
    }
});

module.exports = router;