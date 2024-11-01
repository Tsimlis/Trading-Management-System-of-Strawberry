const router = require('express').Router();
const { authenticated, isInRoles } = require('../configs/security');

// Account route
router.use('/account', require('./account'));

// News route
router.use('/news', authenticated, require('./news'));
// info route
// router.use('/userinfo', authenticated, isInRoles(['admin']), require('./userinfo'));  // จำกัดประเภทผู้ใช้เข้าถึง api
router.use('/userinfo', authenticated,  require('./userinfo'));
// buyig route
router.use('/buying', authenticated, require('./buying'));
// farmer route
router.use('/farmer', authenticated, require('./farmer'));
// selling route
router.use('/selling', authenticated, require('./selling'));
// customer route
router.use('/customer', authenticated, require('./customer'));
// socket.io route
router.use('/socket', authenticated, require('./socket'));
// qrcode route
router.use('/qrcode', authenticated, require('./qrCode'));
// scraping route
router.use('/scraping', authenticated, require('./scraping'));
// other route
router.use('/other', require('./other'));



module.exports = router;