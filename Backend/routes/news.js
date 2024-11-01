const router = require('express').Router();
const newsService = require('../services/news');
const { check, query } = require('express-validator/check');
const base64Img = require('base64-img');
const fs = require('fs');
const path = require('path');
const uploadDir = path.resolve('uploads');
const newsDir = path.join(uploadDir, 'news');


// แสดงข้อมูลข่าว
router.get('/', [
    query('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await newsService.find(req.query));
    }
    catch (ex) { res.error(ex); }
});

// แสดงข้อมูลราคา
router.get('/price', [
    query('page').not().isEmpty().isInt().toInt()
], async (req, res) => {
    try {
        req.validate();
        res.json(await newsService.findPrice(req.query));
    }
    catch (ex) { res.error(ex); }
});

// เพิ่มข้อมูลข่าว
router.post('/', [
    check('n_title').not().isEmpty(),
    check('n_detail').not().isEmpty(),
    check('n_image').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();
        
        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(newsDir)) fs.mkdirSync(newsDir);

        // แปลงข้อมูลรูปภาพ
        req.body.n_image = base64Img
            .imgSync(req.body.n_image, newsDir, `news-${Date.now()}`)
            .replace(`${newsDir}\\`, '');

        res.json({ message: await newsService.onCreate(req.body) });
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(newsDir, req.body.n_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});

// แสดงข้อมูลแค่ 1 recorse เพื่อเอาไปแก้ไข
router.get('/:id', async (req, res) => {
    try {
        const news = await newsService.findOne({ n_id: req.params.id });
        if (!news) throw new Error('Not found item.');
        news.n_image = base64Img.base64Sync(path.join(newsDir, news.n_image));
        res.json(news);
    }
    catch (ex) { res.error(ex); }
});
// ลบข้อมูล
router.delete('/:id', async (req, res) => {
    try {
        const item = await newsService.findOne({ n_id: req.params.id });
        if (!item) throw new Error('Not found item.');
        const deleteItem = await newsService.onDelete(item.n_id);
        const deleteImg = path.join(newsDir, item.n_image);
        if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        res.send(deleteItem);
    }
    catch (ex) { res.error(ex); }
});
// แก้ไขข้อมูล
router.put('/:id', [
    check('n_title').not().isEmpty(),
    check('n_image').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();

        // หาข้อมูลที่จะแก้ไข
        const item = await newsService.findOne({ n_id: req.params.id });
        if (!item) throw new Error('Not found item.');

        // ตรวจสอบ Folder หากไม่มีก็ทำการสร้าง
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
        if (!fs.existsSync(newsDir)) fs.mkdirSync(newsDir);

        // แปลงข้อมูลรูปภาพ
        req.body.n_image = base64Img
            .imgSync(req.body.n_image, newsDir, `news-${Date.now()}`)
            .replace(`${newsDir}\\`, '');
        console.log(req.body.n_image)
        const updateItem = await newsService.onUpdate(req.params.id, req.body);

        // ตรวจสอบว่าแก้ไขข้อมูลได้หรือไม่
        if (updateItem.affectedRows > 0) {
            const deleteImg = path.join(newsDir, item.n_image);
            if (fs.existsSync(deleteImg)) fs.unlink(deleteImg, () => null);
        }

        res.json(updateItem);
    }
    catch (ex) {
        // หากว่ามีการ Insert ไม่ผ่านก็ลบทิ้ง
        const delImg = path.join(newsDir, req.body.n_image || '');
        if (fs.existsSync(delImg)) fs.unlink(delImg, () => null);
        res.error(ex);
    }
});







//ส่วนของราคา

//เพิ่มราคา
router.post('/price', [
    check('p_title').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate();
        res.json( await newsService.onCreatePrice(req.body) );
    }
    catch (ex) {res.error(ex)}
});
// แก้ไขราคา
router.put('/price/:id', [
    check('p_title').not().isEmpty()
], async (req, res) => {
    try {
        req.validate();
        // หาข้อมูลที่จะแก้ไข
        const item = await newsService.findOnePrice({ p_id: req.params.id });
        if (!item) throw new Error('Not found item.');

        const updateItem = await newsService.onUpdatePrice(req.params.id, req.body);
        res.json(updateItem);
    }
    catch (ex) {res.error(ex)}
});





module.exports = router;