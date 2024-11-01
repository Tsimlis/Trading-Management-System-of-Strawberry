const router = require('express').Router();
const sellingService = require('../services/selling');
const { check, query, param } = require('express-validator/check');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const wholeDir = path.join(uploadDir, 'whole');
const retailDir = path.join(uploadDir, 'retail');
const schedule = require('node-schedule');


// เก็บข้อมูลรอเวลา
let storedUser = [];

// ตั้งเวลาทำงานทุกวันก่อนเที่ยงคืน
const rule = new schedule.RecurrenceRule();
rule.hour = 23; // 23 = 11 PM
rule.minute = 59; // 59 นาที
rule.second = 0; // 0 วินาที
schedule.scheduleJob(rule, (req, res) => {
    try {
        // ดึงค่าล่าสุด ทำการแทนค่าให้ถูก
        const list = sellingService.showTotal()
        // ทำการบันทึก
        sellingService.upDateTotal(list);
        
    }
    catch(ex) {res.error(ex)}
});
// เพิ่มรายการรวมยอดขายทั้งหมดที่สรุปแล้ว เอาไปเก็บไว้เพื่อรอส่งเมื่อถึงเวลาที่ตั้งไว้
router.post(`/saveTotal`, [
    check('t_sale_id').isInt(),
    check('t_sale_name').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();
        const check = await sellingService.listToday(req.body.t_sale_id)
        check != '' ? res.json( await sellingService.deleteWeek(check, req.body)) : '';
        res.json( await sellingService.upDateTotal(req.body));
    }
    catch (ex) { res.error(ex) }
});



// บันทึกข้อมูลราคาขายส่ง
router.post(`/wholesale`, [
    check('w_sale_id').isInt(),
    check('w_sale_name').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        
        if(req.body.w_image != '') {
           // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
            if (!fs.existsSync(wholeDir)) fs.mkdirSync(wholeDir);
            // แปลงข้อมูลรูปภาพ
            req.body.w_image = base64Img
                .imgSync(req.body.w_image, wholeDir, `wholesale-${Date.now()}`)
                .replace(`${wholeDir}\\`, ''); 
        }
        res.json( await sellingService.Save(req.body))
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(wholeDir, req.body.w_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

// แสดงราคาขายส่งที่ประกาศ
router.get(`/priceWhole/:id`, async (req, res) => {
    param('id').not().isInt()
    try {
        res.json( await sellingService.priceWhole(req.params.id))
    }
    catch (ex) { res.error(ex)}
})

// บันทึกจำนวนน้ำหนักลงขาย ส่วนของขายส่ง
router.post('/weigthWhole', [
    check('sw_sale_id').isInt(),
    check('sw_sale_name').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        res.json( await sellingService.weigthWhole(req.body))
    }
    catch (ex) { res.error(ex)}
})

// แสดงข้อมูลจำนวนน้ำหนัก ขายส่ง
router.get('/weigthWhole/:id', [
    param('id').not().isInt()
], async (req, res) => {
    try {
        res.json( await sellingService.showWeigth(req.params.id))
    }
    catch (ex) { res.error(ex)}
})

//  บันทึกรายการขายปลีก
router.post(`/retail`, [
    check('r_sale_id').isInt(),
    check('r_sale_name').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();

        if(req.body.r_image != '') {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
             if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
             if (!fs.existsSync(retailDir)) fs.mkdirSync(retailDir);
             // แปลงข้อมูลรูปภาพ
             req.body.r_image = base64Img
                 .imgSync(req.body.r_image, retailDir, `retail-${Date.now()}`)
                 .replace(`${retailDir}\\`, ''); 
         }

        res.json( await sellingService.saveRetail(req.body))
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(retailDir, req.body.r_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex)
    }
})

// ดึงข้อมูลสิ้นค้าที่ลงขายปลีก
router.get(`/retail/:id`,[
    param('id').isInt()
], async (req, res) => {
    try {

        res.json( await sellingService.showRetail(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

//  ดึงรายการขายส่งที่ต้องการแก้ไขมา 1 รายการ
router.get('/retailItem/:id', [
    param('id').isInt()
], async (req, res) => {
    try {
        const item = await sellingService.retailItem(req.params.id)
        if (!item) throw new Error('Not found item.');
        if(item.r_image != '') item.r_image = base64Img.base64Sync(path.join(retailDir, item.r_image));
        res.json( item )
    }
    catch(ex) { res.error(ex)}
})

// ลบรายการสินค้าขายปลีกของร้าน
router.post(`/retail/:id`, [
    param('id').isInt()
], async (req, res) => {
    try {
        const deleteItem = await sellingService.deleteItem(req.params.id);
        if(isNaN(req.body.r_image)){
            const deleteImg = path.join(retailDir, req.body.r_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        }
        res.send(deleteItem);
    }
    catch(ex) { res.error(ex)}
})

// แก้ไขรายการสินค้าขายส่ง 1 รายการ
router.put(`/retail/:id`, [
    param('id').isInt(),
    check('r_sale_id').not().isEmpty(),
    check('r_look').not().isEmpty(),
    check('r_weigth').isInt(),
    check('r_price').isInt(),
    check('r_free').isInt(),
], async (req, res) => {
    try {
        req.validate();
        res.json( await sellingService.editRetail(req.params.id, req.body))
    }
    catch(ex) { res.error(ex)}
})

// ทำการเปลี่ยนสถานะเมื่อมีการส่งสินค้าแล้ว
router.put('/orderStatus/:id', [
    param('id').isInt()
], async (req, res) => {
    try {
        res.json( await sellingService.orderStatus(req.params.id, req.body))
    }
    catch(ex) { res.error(ex)}
})

//แสดงรายการที่ลูกค้ามาสั่งซื้อของแต่ละร้าน
router.post('/storeOrder/:id', async (req, res) => {
    try {
        const sta = Object.keys(req.body)[0]
        res.json( await sellingService.storeOrder(req.params.id, sta))
    }
    catch(ex) { res.error(ex)}
})

//แสดงรายการที่สั่งซื้อสำเร็จ
router.get('/orderDay/:id', async (req, res) => {
    try {
        res.json( await sellingService.orderDay(req.params.id) )
    }
    catch(ex) { res.error(ex)}
})

//แสดงรายการที่ส่งสินค้าแล้ว
router.get('/sendAll/:id', async (req, res) => {
    try {
        res.json( await sellingService.sendAll(req.params.id) )
    }
    catch(ex) { res.error(ex)}
})

//แสดงรายการที่ยังไม่ส่ง
router.get('/sendNot/:id', async (req, res) => {
    try {
        res.json( await sellingService.sendNot(req.params.id) )
    }
    catch(ex) { res.error(ex)}
})

//แสดงรายการที่สั่งซื้อสำเร็จ ทั้งหมด ประวัติ
router.get('/successALL/:id', async (req, res) => {
    try {
        res.json( await sellingService.successAll(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

// แสดงข้อมูลการขายที่ชำระแล้ว ใน 1 สัปดาห์
router.get(`/weekTotal/:id`, async (req, res) => {
    try {
        res.json( await sellingService.totalTable(req.params.id))
    }
    catch(ex) { res.error(ex)}
})


module.exports = router;