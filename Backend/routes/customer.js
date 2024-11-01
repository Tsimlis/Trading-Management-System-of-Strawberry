const router = require('express').Router();
const custoService = require('../services/customer');
const { check, query, param } = require('express-validator/check');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const qrcodeDir = path.join(uploadDir, 'qrcode');



//แสดงราคาขายทั้งหมด
router.get('/priceStore', async (req, res) => {
    try { 
        res.json( await custoService.priceStore())
    }
    catch(ex) { res.error(ex)}
})

// บันทึกคำสั่งซื้อ
router.post(`/order`, async (req, res) => {
    let ind = 0;
    try {
        const num = []
        
        // ใช้ for...of เพื่อรองรับ async/await
        for (let index in req.body) {
            ind = index

            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
            if (!fs.existsSync(qrcodeDir)) fs.mkdirSync(qrcodeDir);
            // แปลงข้อมูลรูปภาพ
            req.body[index].imagePay = base64Img
                .imgSync(req.body[index].imagePay, qrcodeDir, `payment-${Date.now()}`)
                .replace(`${qrcodeDir}\\`, ''); 

            num.push(await custoService.saveOrder(req.body[index]))  ;
        }
        res.json({ num })
    }
    catch(ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(qrcodeDir, req.body[ind].imagePay || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex)
    }
})

// ร้านค้าขาย จ่ายเงินคืนให้กับลูกค้า
router.post('/order/:id', async (req, res) => {
    try {
        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(qrcodeDir)) fs.mkdirSync(qrcodeDir);
        // แปลงข้อมูลรูปภาพ
        req.body.or_imageRepay = base64Img
            .imgSync(req.body.or_imageRepay, qrcodeDir, `turn-${Date.now()}`)
            .replace(`${qrcodeDir}\\`, ''); 

        res.json( await custoService.rePay(req.params.id, req.body))
    }
    catch(ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(qrcodeDir, req.body.or_imageRepay || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex)
    }
})


// ดึงข้อมูลรายการขายปลีกทุกร้านมาแสดง
router.get('/retail', async (req, res) => {
    try {
        res.json( await custoService.retail())
    }
    catch(ex) { res.error(ex)}
})

// บันทึกรายการขายปลีกลงตะกร้า
router.post('/basket', async (req, res) => {
    try {
        if (req.body.retail){ 
            const check = await custoService.check(req.body.customer_id, req.body.retail.id)
            check != '' ? res.json( await custoService.editBasket(check[0].bas_id, req.body)) : res.json( await custoService.toBasket( req.body));
        } else { 
            res.json( await custoService.toBasket( req.body));
        }
    }
    catch(ex) { res.error(ex)}
})

//  แก้ไขรายการขายปลีกในตะกร้า
router.put('/basket/:id', [
    param('id').isInt()
], async (req, res) => {
    try {
        res.json( await custoService.editBasket(req.params.id, req.body))
    }
    catch(ex) { res.error(ex)}
})


// แสดงรายการที่บันทึกในตะกร้า
router.get('/basket/:id', [
    param('id').isInt()
], async (req, res) => {
    try {
        res.json( await custoService.showBasket(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

// ทำการลบรายการในตะกร้าสินค้า
router.delete('/basket/:id', [
    param('id').isInt()
], async (req, res) => {
    try {
        res.json( await custoService.deleteBasket(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

// ทำการลบรายการแบบหลาย ๆ ตัวเมื่อสั่งสินค้าชำระเงินเสร็จแล้ว
router.post('/deleteBasket', async (req, res) => {
    try {
        const delet = []
        for(let item of req.body) {
            delet.push( await custoService.deleteBasket(item.bas_id) )
        }
        res.json( delet )
    }
    catch(ex) { res.error(ex)}
})

//แสดงรายการที่สั่งซื้อไป
router.get('/order/:id', async (req, res) => {
    try {
        res.json( await custoService.showOrder(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

//แสดงรายการที่สั่งซื้อ และส่งแล้วเท่านั้น
router.get('/orderSend/:id', async (req, res) => {
    try {
        res.json( await custoService.sendOrder(req.params.id))
    }
    catch(ex) { res.error(ex)}
})


// แก้ไขสถานะการซื้อ เป็น cancer
router.put('/order/:id', [
    param('id').isInt()
], async (req, res) => {
    try {
        res.json( await custoService.canCer(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

// ลบรายการออกจากตาราง order
router.delete('/deleteOrder/:id', [
    param('id').isInt()
], async (req, res) => {
    try {
        res.json( await custoService.deleteOrder(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

// ฟังกชันการปิดการเลือก ในตะกร้า
// แสดงข้อมูลน้ำหนักของร้านขายส่ง
router.post('/checkWeigth', async (req, res) => {
    try {
        const body = req.body;
        const results = [];

        for(const index in body){
            let result = null
            body[index] == null ? result = null : result = await custoService.checkWeigth(body[index]); //ติดปัญหาที่เมื่อลบรายการแต่มีการบันทึกในตะกร้า ระบบจะล่ม
            results[index] = result
        }
        res.json(results);
    }
    catch(ex) { res.error(ex)}
})
router.post('/checkSale', async (req, res) => {
    try {
        const body = req.body;
        const results = [];

        for(const index in body){
            if(body[index] != null) {
                const result = await custoService.checkSale(body[index]);
                results[index] = result
            } else {
                const result = null
                results[index] = result
            }
        }
        res.json(results);
    }
    catch(ex) { res.error(ex)}
})


// ลบน้ำหนักที่คงเหลือของร้าน
router.put('/deductRetail', async (req, res) => {
    try {
        const result = []
        for (let i in req.body) {
            result.push( await custoService.dedRetail(req.body[i]) )
        }
        res.json( result )
    }
    catch(ex) { res.error(ex)}
})
router.put('/deductWhole', async (req, res) => {
    try {
        const result = []
        for (let i in req.body) {
            result.push( await custoService.deductWhole(req.body[i]) )
        }
        res.json( result )
    }
    catch(ex) { res.error(ex)}
})



module.exports = router;