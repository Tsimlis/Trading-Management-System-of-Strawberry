const router = require('express').Router();
const socketService = require('../services/socket')



// ส่งข้อมูลกลับไปให้ frontend
// router.get('/events', (req, res) => {
//     res.setHeader('Content-Type', 'text/event-stream');
//     res.setHeader('Cache-Control', 'no-cache');
//     res.setHeader('Connection', 'keep-alive');

//     // ฟังก์ชันส่งข้อความไปยังไคลเอนต์
//     const sendEvent = (message) => {
//         res.write(`data: ${message}\n\n`);
//     };

//     // ส่งข้อความไปยังไคลเอนต์ทุกๆ 5 วินาที
//     const intervalId = setInterval(() => {
//         sendEvent(JSON.stringify({ message: 'Hello from server', timestamp: new Date() }));
//     }, 5000);

//     // ตรวจสอบการเชื่อมต่อหาย
//     req.on('close', () => {
//         clearInterval(intervalId);
//         res.end();
//     });
// });




// เขียน ทำการบันทึกข้อความของ admin
router.post('/send', async (req, res) => {
    try {
        if(!req.body.id || req.body.id == '') {
            res.json( socketService.saveNew(req.body))
        } else {
            res.json( await socketService.edit(req.body)) 
        }
    }
    catch (ex) { res.error(ex)}
})

// แสดงข้อความทั้งหมดของ admin, user 
router.get('/admin/:id', async (req, res) => {
    try {
        res.json( await socketService.admin(req.params.id))
    }
    catch (ex) { res.error(ex)}
})

// แสดงข้อความของผู้ใช้ กับคู่สนทนา 2 คน
router.post('/message/:id', async (req, res) => {
    try {
        res.send( await socketService.user(req.params.id, req.body))
    }
    catch (ex) { res.error(ex)}
})

// ลบข้อความที่กำหนด
router.put('/deleteItem/:id', async (req, res) => {
    try {
        req.body == '' ? req.body = {} : '';
        res.send( await socketService.deleteItem(req.params.id, req.body))
    }
    catch (ex) { res.error(ex)}
})

// เมื่อเปิดข้อความให้ cout เป็น 0
router.put('/cout/:id', async (req, res) => {
    try {
        res.send( await socketService.cout(req.params.id, req.body))
    }
    catch (ex) { res.error(ex)}
})

// ลบทั้งการสนทนาทั้งสองฝั่ง
router.delete('/Delete/:id', async (req, res) => {
    try {
        res.send( await socketService.Delete(req.params.id))
    }
    catch (ex) { res.error(ex)}
})





module.exports = router;