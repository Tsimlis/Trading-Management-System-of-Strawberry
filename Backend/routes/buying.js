const router = require('express').Router();
const buyService = require('../services/buying');
const { query, check, param } = require('express-validator/check');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const buyDir = path.join(uploadDir, 'buying');
const schedule = require('node-schedule');


// เก็บข้อมูลรอเวลา
let storedUser = [];

// ตั้งเวลาทำงานทุกวันก่อนเที่ยงคืน
const rule = new schedule.RecurrenceRule();
rule.hour = 23; // 23 = 11 PM
rule.minute = 59; // 59 นาที
rule.second = 0; // 0 วินาที
schedule.scheduleJob(rule, () => {
    try {
        // buyService.upDateAll();

        storedUser.map((item) => {
            buyService.upDateTotal(item[1]);
            storedUser.shift()
        })
        
    }
    catch(ex) {console.log(ex)}
});


// เพิ่มรายการรวมยอดรับซื้อทั้งหมดที่สรุปแล้ว เอาไปเก็บไว้เพื่อรอส่งเมื่อถึงเวลาที่ตั้งไว้
router.post(`/totalBuy/:id`, [
    check('t_buy_id').isInt(),
    check('t_buy_name').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();
        // const index = storedUser.findIndex(item => item[0] === req.params.id);
        // if (index !== -1) {
        //     storedUser[index][1] = req.body;
        // } else {
        //     storedUser.push([req.params.id , req.body]);
        // }

        // res.json( await storedUser)

        res.json( await buyService.upDateTotal(req.body))
    }
    catch (ex) { res.error(ex) }
});



// เพิ่มข้อมูล
router.post('/', [
    check('b_user_id').isInt(),
    check('b_name').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();
        res.json({ message: await buyService.onCreate(req.body) });
    }
    catch (ex) { res.error(ex) }
});


// แสดงข้อมูลเกษตรกรที่เสนอราคาพิเศษ
router.get('/', async (req, res) => {
    try {
        res.json(await buyService.priceFarmer())
    }
    catch (ex) { res.error(ex)}
});


// แสดงข้อมูลของร้านซื้อ 1 ร้านเพื่อเอาไปแสดงราคา
router.get('/:id', async (req, res) => {
    try {
        const buy = await buyService.findId({ b_user_id: req.params.id });
        if (!buy) throw new Error('Not found item.');
        // buy.b_image = base64Img.base64Sync(path.join(profileDir, buy.b_image));
        res.json(buy);
    }
    catch (ex) { res.error(ex) }
});

//ดึงข้อมูลเกษตรกรที่เสนอขายให้กับ user ร้านซื้อนั้นๆ 
router.get('/weigth/:id', async (req, res) => {
    try {
        const buy = await buyService.findFarmer(req.params.id );
        if (!buy) throw new Error('Not found item.');
        res.json(buy);
    }
    catch (ex) { res.error(ex) }
});


// ร้านซื้อเสนอราคา //เปลี่ยนสถานะ order เมื่อ farmer ยืนยันการซื้อ
router.put('/:id', async (req, res) => {
    try {
        res.json({message: await buyService.orderStatus(req.params.id, req.body) })
    }
    catch(ex){ res.error(ex)}
});

// เกษตรกรเสนอราคา // เปลียนสถานะ f_exp ยืนยันซื้อการเสนอราคาของเกษตร
router.put('/farmer/:id', [
    query('fp_id').not().isInt()
], async (req, res) => {
    try {
        req.validate();
        res.json( await buyService.expFarmer(req.params.id, req.body))
    }
    catch (ex) { res.error(ex)}
})


// ชำระด้วยเงินสด และ Qrcode
router.put('/pay/:id', async (req, res) => {
    try {
        
        if(req.body.fp_imagePay != '') {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
             if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
             if (!fs.existsSync(buyDir)) fs.mkdirSync(buyDir);
             // แปลงข้อมูลรูปภาพ
             req.body.fp_imagePay = base64Img
                 .imgSync(req.body.fp_imagePay, buyDir, `buyPay-${Date.now()}`)
                 .replace(`${buyDir}\\`, ''); 
         }

        res.json( await buyService.onPay(req.params.id, req.body))
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(buyDir, req.body.fp_imagePay || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex)
    }
})

// แสดงขอ้มูลเกษตรกรที่ขายผลผลิตให้กับร้านที่เปิดเข้ามา
router.get('/farmer/:id', async (req, res) => {
    try {
        res.json( await buyService.onFarmer(req.params.id))
    }
    catch (ex) { res.error(ex)}
})

// แสดงข้อมูลน้ำหนักที่รับซื้อ แยกตามขนาด
router.get('/sumWeigth/:id', async (req, res) => {
    try {
        res.json( await buyService.sumWeigth(req.params.id))
    }
    catch(ex) {res.error(ex)}
})

// ดึงข้อมูลเกษตรกรที่ชำระเงินแล้วมาคำนวน
router.get('/calculate/:id', async (req, res) => {
    try {
        res.json( await buyService.calculate(req.params.id))
    }
    catch (ex) { res.error(ex)}
})

// ดึงข้อมูลเกษตรกร post ผลผลิต แล้วร้านรับซื้อ
router.get('/farmerPost/:id', async (req, res) => {
    try {
        res.json( await buyService.farmerPost(req.params.id))
    }
    catch (ex) { res.error(ex)}
})


// ช่องทางชำระเงินสด ของเกษตรกรที่ขายตามราคาร้านซื้อ 
router.put(`/payOrder/:id`, async (req, res) => {
    try {
        if (req.body.f_imagePay) {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
            if (!fs.existsSync(buyDir)) fs.mkdirSync(buyDir);
            // แปลงข้อมูลรูปภาพ
            req.body.f_imagePay = base64Img.imgSync(req.body.f_imagePay, buyDir, `buyPay-${Date.now()}`)
                .replace(`${buyDir}\\`, ''); 
        }
        
        res.json( await buyService.payOrder(req.params.id, req.body))
    }
    catch(ex) { 
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(buyDir, req.body.f_imagePay || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex)
    }
})

// แสดงข้อมูลการรับซื้อทั้งหมด ที่ชำระแล้ว
router.get(`/successAll/:id`, async (req, res) => {
    try {
        res.json( await buyService.allTable(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

// แสดงข้อมูลการรับซื้อเพิ่มเติมที่ชำระแล้ว ใน 1 สัปดาห์
router.get(`/postAll/:id`, async (req, res) => {
    try {
        res.json( await buyService.postTable(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

// แสดงข้อมูลการรับซื้อเพิ่มเติมที่ชำระแล้ว ใน 1 สัปดาห์
router.get(`/weekTotal/:id`, async (req, res) => {
    try {
        res.json( await buyService.totalTable(req.params.id))
    }
    catch(ex) { res.error(ex)}
})

module.exports = router;