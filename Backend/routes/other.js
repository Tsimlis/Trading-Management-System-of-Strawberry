const router = require('express').Router();
const newsService = require('../services/news');
const custoService = require('../services/customer');
const { check, query } = require('express-validator/check');

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


// ดึงข้อมูลรายการขายปลีกทุกร้านมาแสดง
router.get('/retail', async (req, res) => {
    try {
        res.json( await custoService.retail())
    }
    catch(ex) { res.error(ex)}
})

//แสดงราคาขายทั้งหมด
router.get('/priceStore', async (req, res) => {
    try { 
        res.json( await custoService.priceStore())
    }
    catch(ex) { res.error(ex)}
})

module.exports = router;