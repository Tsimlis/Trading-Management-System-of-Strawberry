const router = require('express').Router();
const connection = require('../configs/database');
const fs = require('fs');

const generatePayload = require('promptpay-qr') 
const qrcode = require('qrcode') 

router.post('/store/:id', async (req, res) => {

    try {

        let ID = '';
        if (req.body.u_promptPay == null) return res.send('not promptpay');
        //  จัดรูปแบบเลขพร้อมเพย์
        if(req.body.u_promptPay.length <= 10) { ID = req.body.u_promptPay.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); }
        else { ID = req.body.u_promptPay.toString().replace(/(\d)(\d{4})(\d{5})(\d{2})(\d)/, '$1-$2-$3-$4-$5'); }
        // จัดรูปแบบเบอร์โทร
        if(req.body.u_phone) { req.body.u_phone = req.body.u_phone.toString().replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'); }
        
        const mobileNumber = req.body.u_phone 
        const IDCardNumber = ID
        const amount = Number(req.params.id)
        const payload = generatePayload(IDCardNumber || mobileNumber, { amount });
        // console.log(payload)

        // Convert to SVG QR Code
        const options = { type: 'svg', color: { dark: '#000', light: '#fff' } };
        const image = []
        qrcode.toString(payload, options, (err, svg) => {
            if (err) return console.log(err)
            // fs.writeFileSync('qr.svg', svg)
            res.json({ message: 'QR code generated and saved', svg: svg });
        })
    }
    catch (ex) { res.error(ex) }
})








module.exports = router;