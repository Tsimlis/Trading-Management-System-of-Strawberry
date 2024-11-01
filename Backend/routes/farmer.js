const router = require('express').Router();
const farService = require('../services/farmer');
const { check, query, param } = require('express-validator/check');
const schedule = require('node-schedule');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const farmerDir = path.join(uploadDir, 'farmer');



// // ตั้งเวลาทำงานทุกวันก่อนเที่ยงคืน
// const rule = new schedule.RecurrenceRule();
// rule.hour = 23; // 23 = 11 PM
// rule.minute = 59; // 59 นาที
// rule.second = 0; // 0 วินาที
// schedule.scheduleJob(rule, () => {
//     try {
//         farService.upDateAll();
//     }
//     catch(ex) {console.log(ex)}
// });





// ดึงข้อมูลร้านรับซื้อทั้งหมดที่เป็นตัวล่าสุด
router.get('/', async (req, res) => {
    try {
        res.json(await farService.find());
    }
    catch (ex) { res.error(ex) }
});



// บันทึกเสนอขายผลผลิต
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
router.post('/', [
    check('f_buying_id').not().isEmpty(),
    check('f_farmer_id').not().isEmpty(),
    check('f_name').not().isEmpty(),
    check('f_detail').exists(),
    check('f_image').exists(),
], async (req, res) => {
    try {
        req.validate();

        if(req.body.f_image != '') {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
             if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
             if (!fs.existsSync(farmerDir)) fs.mkdirSync(farmerDir);
             // แปลงข้อมูลรูปภาพ
             req.body.f_image = base64Img
                 .imgSync(req.body.f_image, farmerDir, `farmer-${Date.now()}`)
                 .replace(`${farmerDir}\\`, ''); 
         }

        const createResult = await farService.onCreate(req.body);
        res.json(createResult);

        const id = createResult.insertId;
        // 1 hour
        await delay(1*60*60000);///////////////////////// 1 วิ = 1000 ms/////////////////////////หน่วงเวลาแสดงการเสนอขายผลผลิตให้ร้านรับซื้อ//////////////

        // เรียกใช้ router.put หลังจาก delay เสร็จสิ้น
        const updateResult = await farService.timerSend(id);
        // console.log('Update result:', updateResult);
    } catch (ex) { 
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(farmerDir, req.body.f_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.status(500).json({ error: ex.message }) 
    }
});




// แสดงประวัติการขาย
router.get('/all/:id', async (req, res) => {
    try{
        res.json(await farService.findShow({f_farmer_id: req.params.id}))
    }
    catch(ex){ res.error(ex)}
})


// แสดงเมื่อทำรายการเสนอขายผลผลิตแล้ว จะแสดง 3 ชั่วโมง
router.get('/:id', async (req, res) => {
    try{
        res.json(await farService.findMatch({f_farmer_id: req.params.id}))
    }
    catch(ex){ res.error(ex)}
})




// ส่วนของการเสนอราคาให้ร้านค้าเข้ามา
// บันทึกเสนอราคาผลผลิต
router.post('/present', [
    check('fp_farmer_id').not().isEmpty(),
    check('fp_name').not().isEmpty(),
    check('fp_image').exists(),
], async (req, res) => {
    try{
        req.validate();

        if(req.body.fp_image != '') {
            // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
             if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
             if (!fs.existsSync(farmerDir)) fs.mkdirSync(farmerDir);
             // แปลงข้อมูลรูปภาพ
             req.body.fp_image = base64Img
                 .imgSync(req.body.fp_image, farmerDir, `farPresent-${Date.now()}`)
                 .replace(`${farmerDir}\\`, ''); 
         }
        res.json(await farService.onPresent(req.body) );
    }
    catch(ex){ 
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(farmerDir, req.body.fp_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex)
    }
})

//แสดงข้อมูลตารางร้านค้าที่สนใจราคาเสนอของเกษตรกร
router.get('/buy/:id', async (req, res) => {
    try {
        res.json( await farService.priceFarmer({fp_farmer_id: req.params.id}))
    }
    catch (ex) { res.error(ex)}
})

// เมื่อทำการบันทึกขายให้กับร้านที่ตกลงใจ จะทำการเปลี่ยนสถานะ fp_exp
router.put('/buy/:id', async (req, res) => {
    try {
        res.json( await farService.changeEXP( {fp_id: req.params.id}, req.body));
    }
    catch (ex) { res.error(ex)}
})

module.exports = router;






//  ฟังกชันสำรองที่ทำไว้ #1

// ตั้งเวลาในการปิด คำเสนอขายผลผลิต ตามหน้า frontend กำหนด
// router.put('/:id', [
//     param('id').isInt()
// ], async (req, res) => {
//     const person = []
//     person.push(req.params.id)
//     console.log(person)
//     try{
//         person.map((item) => { 
//             console.log('item', item)
//             setTimeout(async () => {
//             try { 
//                 const data = await farService.timerSend(item);
//                 person.shift(item)
//                 console.log('data', data)
//                 res.json( data )
//              } 
//             catch (ex) { res.error('Error sending data:', ex)}
//             }, [req.body]);
//         })
//     }
//     catch(ex){ res.error(ex)}
// });


// ฟังก์ชันที่ทำไว้ #2

// บันทึกเสนอขายผลผลิต
// router.post('/', [
//     check('f_buying_id').not().isEmpty(),
//     check('f_farmer_id').not().isEmpty(),
//     check('f_name').not().isEmpty(),
//     check('f_detail').exists(),
//     check('f_image').exists(),
// ], async (req, res) => {
//     try{
//         req.validate();
//         res.json(await farService.onCreate(req.body) );
//     }
//     catch(ex){ res.error(ex)}
// })
// // ส่งคู่กัน เพราะจะหน่วงเวลาเพื่อกำหนดระยะเวลาแสดงข้อมุล
// const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
// // แก้สถานะการแสดง
// router.put('/:id', [
//     param('id').isInt()
// ], async (req, res) => {
//     const person = [];
//     person.push(req.params.id);

//     res.setHeader('Content-Type', 'application/json');

//     try {
//         person.forEach(async (item) => {
//             // console.log(item)
//             await delay(req.body); // หน่วงเวลา 30 วินาที (30000 มิลลิวินาที)
//             try {
//                 res.json( await farService.timerSend(item)); // ส่งข้อมูลแต่ละรายการกลับไปที่ client
//             } catch (ex) { res.json({ error: 'Error sending data: ' + ex.message }) }
//         });
//         // ตรวจสอบว่าเมื่อไหร่ทุก item ดำเนินการเสร็จสิ้น
//         const interval = setInterval(() => {
//             if (person.length === 0) {
//                 clearInterval(interval);
//                 res.end(); // ปิดการตอบสนองเมื่อทุก item เสร็จสิ้น
//             }
//         }, 1000);

//     } catch (ex) {res.status(500).json({ error: ex.message }) }
// });