const router = require('express').Router();
const userService = require('../services/userinfo');
const { query, check, param } = require('express-validator/check');
const { isInRoles, Deciphers, Ciphers } = require('../configs/security');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const profileDir = path.join(uploadDir, 'profile');



// แสดงข้อมูล
router.get('/', [
    query('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await userService.find(req.query));
    }
    catch (ex) { res.error(ex); }
});


// แสดงรายชื่อทั้งหมดโดยไม่กำหนดหน้า
router.get('/all', async (req, res) => {
    try {
        res.send( await userService.getAll() )
    }
    catch (ex) { res.error(ex)}
})

// แสดงข้อมูล 1 recorde เพื่อเอาไปแก้ไข
router.get('/:id', async (req, res) => {
    try {
        const user = await userService.findOne({ u_id: req.params.id });
        if (!user) throw new Error('Not found item.');
        user.u_password = Deciphers(user.u_password);
        res.json(user);
    }
    catch (ex) { res.error(ex); }
});

//แก้ไขข้อมูล
router.put('/:id', isInRoles('admin'), [
    param('id').isInt()
], async (req, res) => {
    try {
        req.validate();
        const findItem = await userService.findById(req.params.id)
        if(!findItem) throw new Error('not have id');
        res.json(await userService.onUpdate(findItem.u_id, req.body))
    }
    catch (ex){res.error(ex)}
});

//แก้ไขข้อมูลส่วนตัวจากหน้า setting
router.put('/setting/:id', [
    check('u_username').not().isEmpty(),
    check('u_fullname').not().isEmpty(),
    // check('u_email').not().isEmpty().isEmail(),
    // check('u_promptPay').isInt(),
    check('u_address').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();

        // หาข้อมูลที่จะแก้ไขว่ามีในฐานข้อมูลหรือไม่
        const item = await userService.findOne({ u_id: req.params.id });
        if (!item) throw new Error('Not found item.');
        
        //เช็คว่าถ้ามีรูปภาพก็ให้แปลงแล้วใส่ ถ้าไม่มีก็ผ่าน
        if(req.body.u_image != null) {
            if (req.body.u_image != item.u_image) {
                // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
                if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
                if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir);
                // แปลงข้อมูลรูปภาพ
                req.body.u_image = base64Img.imgSync(req.body.u_image, profileDir, `profile-${Date.now()}`)
                                            .replace(`${profileDir}\\`, '');
            }
        }

        // ถ้ามีการแก้ไขรหัส
        if(req.body.u_password.length > 0){
            req.body.u_password = Ciphers(req.body.u_password)
            // console.log('Edit',req.body.u_password)
        }else{
            req.body.u_password = item.u_password
            // console.log('notEdit',req.body.u_password)
        }
        
        const updateItem = await userService.onUpdate(req.params.id, req.body);

        // มีรูปอยู่แล้ว แต่ต้องการเปลียนให้ลบรูปเดิมที่ uploads ทิ้ง
        if (updateItem.affectedRows > 0) {
            if (item.u_image == null) return //กรณีใส่รูปครั้งแรกให้ผ่าน
            if (req.body.u_image == item.u_image) return // กรณีมีรูปแต่ไม่ได้แก้ไขรูปให้ผ่าน
            const deleteImg = path.join(profileDir, item.u_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        }
        
        res.json(updateItem);
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(profileDir, req.body.u_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});


//ผู้ดูแลทำการอนุมัติสถานะการจอง อนุมัติ/ไม่อนุม้ติ
router.put('/store/:id', isInRoles('admin'), [
    param('id').isInt(),
    check('u_store', 'สามารถใส่ได้เฉพาะ pass กับ pending เท่านั้น').isIn(['pass', 'not', 'pending'])
], async (req, res) => {
    try {
        req.validate();
        res.json(await userService.onUpdateStore(req.params.id, req.body))
    }
    catch (ex){res.error(ex)}
});

// เพิ่มช้อมูล
router.post('/', [
    check('u_username').not().isEmpty(),
    check('u_password').not().isEmpty(),
    check('u_email').not().isEmpty(),
    check('u_address').not().isEmpty(),
    check('u_phone').isInt().not().isEmpty(),
    check('u_role').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        res.json({ message: await userService.onCreate(req.body) });
    }
    catch (ex) {
        res.error(ex);
    }
});

// ลบข้อมูล
router.delete('/:id', async (req, res) => {
    try {
        const item = await userService.findOne({ u_id: req.params.id });
        if (!item) throw new Error('Not found item.');
        const deleteItem = await userService.onDelete(item.u_id);
        res.send(deleteItem);
    }
    catch (ex) { res.error(ex); }
});



module.exports = router;