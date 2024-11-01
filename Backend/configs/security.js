const crypto = require('crypto');

const security = {
    //นำรหัสไปแปลง
    password_hash(password) {
        return crypto.createHash('sha1').update(password).digest('hex');
    },
    //นำรหัสเข้าระบบมาเช็คกับรหัสในฐานข้อมูลว่าตรงกันหรือไม่
    password_verify(password, password_hash) {
        // return security.password_hash(password) === password_hash;
        return security.Ciphers(password) === password_hash;
    },

    //การเข้ารหัสและถอดรหัส
    //เข้า
    Ciphers(password){
        var mykey = crypto.createCipher('aes-128-cbc', 'mypassword', '');
        var mystr = mykey.update(password, 'utf8', 'hex')
        mystr += mykey.final('hex');
        return mystr
        // return crypto.createCipheriv('aes-128-cbc', 'mypassword').update(password, 'utf8', 'hex').final('hex');
    },
    //ภอด
    Deciphers(repassword){
        var mykey1 = crypto.createDecipher('aes-128-cbc', 'mypassword', '');
        var mystr1 = mykey1.update( repassword, 'hex', 'utf8')
        mystr1 += mykey1.final('utf8');
        return mystr1
        // return crypto.createDecipher('aes-128-cbc', 'mypassword').update(`${mystr}`, 'hex', 'utf8').final('utf8');
    },
    

    // ตรวจสอบการเข้าระบบ
    authenticated(req, res, next) {

        // ใช้สำหรับเปิดสิทธิ์การแก้ไขส่วนของ backend โดยไม่ต้องเข้าระบบบ่อยๆ
        // req.session.userLogin = {
            
        //     // "u_role": "admin",
        // //     // "u_role": "user",
        // //     // "u_role": "farmer",
        // //     // "u_role": "buying",
        //     "u_role": "selling",
            
        //     "u_id": 1,
        //     "u_username": "admin",
        //     "u_fullname": "Administrator",
        //     "u_email": "Adminis@tra.tor",
        //     "u_phone": "1578951256",
        //     "u_lineId": "thosk",
        //     "u_promptPay": "0821860890",
        //     "u_address": "12/1 m.1 t.tongsang",
        //     // "u_image": "",
        //     "u_image": "profile-1718874417689.jpg",
        //     "u_status": "pass",
        //     "u_store": "pass"
        // }

        try {
            if (req.session.userLogin) {
                return next();
            }
            throw new Error('ไม่มีชื่อผู้ใช้งาน');
        }
        catch (ex) {
            res.error(ex, 401);
        }
    },

    // ตรวจสอบสิทธิ์การเข้าหน้าต่างๆ (เป็นฟังกชันที่ route เรียกใช้ตรวจสอบสิทธิ์เข้าถึงข้อมูล)
    isInRoles(roles = []){
        return function(req, res, next){
            try {
                if(roles.indexOf(req.session.userLogin.u_role) >= 0) return next();
                throw new Error('Forbidden');
            }
            catch (ex) {res.status(403).json({message: ex.message})}
        }
    }
};

module.exports = security;